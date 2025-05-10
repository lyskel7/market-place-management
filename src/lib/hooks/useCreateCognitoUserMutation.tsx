import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TProfileFormValues } from '../interfaces';
import { createUser, SchemaType } from '../apis/amplifyDB';
import { toast } from 'react-toastify';

interface ICreateUserContext {
  previousUsers?: SchemaType[];
  optimisticUserId?: string; // To identify the optimistic item in the cache and maybe revert it
}

const useCreateUserOptimisticMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<SchemaType, Error, TProfileFormValues, ICreateUserContext>(
    {
      mutationFn: createUser,
      onMutate: async (input: TProfileFormValues) => {
        const { email } = input;
        // Cancel any outgoing re-obtain (so that they do not overwrite our optimistic update).
        await queryClient.cancelQueries({ queryKey: ['cognito_users'] });

        // Saving previous state
        const previousUsers = queryClient.getQueryData<SchemaType[]>([
          'cognito_users',
        ]);

        // Updating the cache optimistically
        const optimisticUserId = `optimistic-${Date.now()}`;
        const optimisticUser: SchemaType = {
          id: optimisticUserId, // Temp ID
          ...input,
          // Could add a flag like isOptimistic: true if you want to style it differently
        };

        queryClient.setQueryData<SchemaType[]>(['cognito-users'], (oldData) =>
          oldData ? [...oldData, optimisticUser] : [optimisticUser],
        );

        // Returning a context object with the snapshot
        return { previousUsers, email };
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
          `Error (optimistic) to deleting user ${input.email} from the hook:`,
          err,
        );
        toast.error(`Error creating user ${input.email}: ${err}.`);
      },
      onSuccess: (createdUserFromApi, input, context) => {
        // `createdUserFromApi` is the user returned by `createUserApi` (with real ID)
        console.log(
          `Usuario ${createdUserFromApi.email} creado exitosamente en backend.`,
        );

        //Optional: Update the optimistic item with the real data from the server (especially the ID)
        // This is useful if the server generates fields that you didn't have in the optimistic update.
        if (context?.optimisticUserId) {
          queryClient.setQueryData<SchemaType[]>(
            ['cognito-users'],
            (oldData) =>
              oldData?.map((user) =>
                user.id === context.optimisticUserId
                  ? { ...createdUserFromApi, id: createdUserFromApi.id }
                  : user,
              ) || [createdUserFromApi],
          );
        } else {
          // If you don't have an optimistic ID, you can just add the user to the list or invalidate the list.
          queryClient.invalidateQueries({ queryKey: ['cognito-users'] });
        }
        toast.success(`User ${input.email} was created successfully .`);
      },
      onSettled: (data, error, input) => {
        // Always refetch after error or success to ensure consistency
        // data: deleteUser result
        // error: error if there was
        // input: 'email' through mutate
        // context: onMutate return

        console.log(
          `onSettled: Mutation of creation for ${input.email} completed. Invalidating 'cognito_users'.`,
        );
        // Here re-sync with the server.
        queryClient.invalidateQueries({ queryKey: ['cognito_users'] });

        if (!error && data) {
          console.log(
            `User ${input.email} created (settled) successfully from the hook.`,
          );
        } else {
          console.log(
            `Mutation of creation for ${input.email} failed (settled).`,
          );
        }
      },
    },
  );
};

export default useCreateUserOptimisticMutation;
