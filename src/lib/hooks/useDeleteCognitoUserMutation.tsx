import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser, IInputForDeleteUser, SchemaType } from '../apis/amplifyDB';
import { toast } from 'react-toastify';

export const useDeleteUserOptimisticMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onMutate: async (input: IInputForDeleteUser) => {
      const { email } = input;
      // Cancel any outgoing re-obtain (so that they do not overwrite our optimistic update).
      await queryClient.cancelQueries({ queryKey: ['cognito_users'] });

      // Saving previous state
      const previousUsers = queryClient.getQueryData(['cognito_users']);

      // Updating the cache optimistically
      queryClient.setQueryData(['cognito_users'], (oldData: SchemaType[]) =>
        oldData ? oldData.filter((user) => user.email !== email) : [],
      );

      // Returning a context object with the snapshot
      return { previousUsers, email };
    },
    onError: (err, input, context) => {
      // Reverting to the previous state if the mutation fails
      if (context?.previousUsers) {
        queryClient.setQueryData(['cognito_users'], context.previousUsers);
      }
      console.error(
        `Error (optimistic) to deleting user ${input.email} from the hook:`,
        err,
      );
      toast.error(`Error deleting user ${input.email}: ${err}`);
    },
    onSuccess: (data, input) => {
      console.log(`Usuario ${input.email} was deleted successfully.`);
      toast.success(`User ${input.email} was deleted successfully .`);
    },
    onSettled: (data, error, input) => {
      // Always refetch after error or success to ensure consistency
      // data: deleteUser result
      // error: error if there was
      // input: 'email' through mutate
      // context: onMutate return

      console.log(
        `onSettled: Mutation for ${input.email} completed. Invalidating 'cognito_users'.`,
      );
      // Here re-sync with the server.
      queryClient.invalidateQueries({ queryKey: ['cognito_users'] });

      if (!error) {
        console.log(
          `User ${input.email} deleted (settled) successfully from the hook.`,
        );
      } else {
        console.log(`Mutation for ${input.email} failed (settled).`);
      }
    },
  });
};
