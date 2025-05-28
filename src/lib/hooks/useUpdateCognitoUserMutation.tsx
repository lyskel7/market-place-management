import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TProfileValues } from '../interfaces';
import { SchemaType, updateUser } from '../apis/amplifyDB';
import { toast } from 'react-toastify';

interface IUpdateUserContext {
  previousUsers?: SchemaType[];
  userId?: string; // To identify the optimistic item in the cache and maybe revert it
}

const useUpdateUserOptimisticMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<SchemaType, Error, TProfileValues, IUpdateUserContext>({
    mutationFn: updateUser,
    onMutate: async (input: TProfileValues) => {
      const { id } = input;
      console.log('data on mutations: ', input);
      // Cancel any outgoing re-obtain (so that they do not overwrite our optimistic update).
      await queryClient.cancelQueries({ queryKey: ['cognito_users'] });

      // Saving previous state
      const previousUsers = queryClient.getQueryData<SchemaType[]>([
        'cognito_users',
      ]);

      queryClient.setQueryData<SchemaType[]>(['cognito-users'], (oldData) =>
        oldData
          ? oldData.map((user) =>
              user.id === input.id ? { ...user, ...input } : user,
            )
          : [],
      );

      // Returning a context object with the snapshot
      return { previousUsers, id };
    },
    onError: (err, input, context) => {
      // Reverting to the previous state if the mutation fails
      if (context?.previousUsers) {
        queryClient.setQueryData<SchemaType[]>(
          ['cognito_users'],
          context.previousUsers,
        );
      }
      console.error(
        `Error (optimistic) to updating user ${input.email} from the hook:`,
        err,
      );
      toast.error(`Error updating user ${input.email}: ${err}.`);
    },
    onSuccess: (updatedUserFromApi, input, context) => {
      // `createdUserFromApi` is the user returned by `createUserApi` (with real ID)
      console.log(
        `User ${updatedUserFromApi.email} updated successfully on backend.`,
      );

      //Optional: Update the optimistic item with the real data from the server (especially the ID)
      // This is useful if the server generates fields that you didn't have in the optimistic update.
      queryClient.setQueryData<SchemaType[]>(['cognito-users'], (oldData) =>
        oldData?.map((user) =>
          user.id === context.userId ? updatedUserFromApi : user,
        ),
      );
      toast.success(`User ${input.email} was updated successfully .`);
    },
    onSettled: (data, error, input) => {
      // Always refetch after error or success to ensure consistency
      // data: deleteUser result
      // error: error if there was
      // input: 'email' through mutate
      // context: onMutate return

      console.log(
        `onSettled: Mutation of update for ${input.email} completed. Invalidating 'cognito_users'.`,
      );
      // Here re-sync with the server.
      queryClient.invalidateQueries({ queryKey: ['cognito_users'] });

      if (!error && data) {
        console.log(
          `User ${input.email} updated (settled) successfully from the hook.`,
        );
      } else {
        console.log(`Mutation of update for ${input.email} failed (settled).`);
      }
    },
  });
};

export default useUpdateUserOptimisticMutation;
