import { AdminDeleteUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { AppSyncResolverHandler } from 'aws-lambda';
import { cognitoClient, userPoolId } from '../shared/types';
import { handleLambdaError } from '../shared/manageErrors';

type TInput = {
  email: string;
  name: string;
};

export const handler: AppSyncResolverHandler<TInput, boolean> = async (
  event,
): Promise<boolean> => {
  console.log(`Received event: ${JSON.stringify(event)}`);

  //Extracting the input arguments from the GraphQl mutation event
  const { email: usernameToDelete, name } = event.arguments;

  console.info(`Deleting user with email: ${usernameToDelete}, name: ${name}`);

  if (!usernameToDelete || !name) {
    console.error('Validation Error: Missing required input fields.');
    throw new Error('Missing required fields: email, name, or groupName.');
  }

  try {
    console.log(`Attempting to delete user ${usernameToDelete}`);
    await cognitoClient.send(
      new AdminDeleteUserCommand({
        UserPoolId: userPoolId,
        Username: usernameToDelete,
      }),
    );
    console.log(`Successfully deleted user ${usernameToDelete}`);

    return true;
  } catch (error) {
    handleLambdaError(error as Error, 'Deleting user');
    throw new Error(
      'Control should not reach here if handleLambdaError throws.',
    );
  }
};
