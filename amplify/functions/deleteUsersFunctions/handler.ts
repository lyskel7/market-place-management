import {
  AdminDeleteUserCommand,
  AdminListGroupsForUserCommand,
  AdminRemoveUserFromGroupCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { AppSyncResolverHandler } from 'aws-lambda';

const cognitoClient = new CognitoIdentityProviderClient({});
const userPoolId = process.env.AMPLIFY_AUTH_USERPOOL_ID;
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

  if (!userPoolId) {
    console.error(
      'FATAL: User Pool ID environment variable is not configured!',
    );
    throw new Error('Server configuration error: User Pool ID missing.');
  }

  if (!usernameToDelete || !name) {
    console.error('Validation Error: Missing required input fields.');
    throw new Error('Missing required fields: email, name, or groupName.');
  }

  try {
    // 1. List all user's groups
    const listGroupsParams = {
      UserPoolId: userPoolId,
      Username: usernameToDelete,
    };
    const { Groups } = await cognitoClient.send(
      new AdminListGroupsForUserCommand(listGroupsParams),
    );
    console.log(
      `User ${usernameToDelete} belongs to groups:`,
      Groups?.map((g) => g.GroupName),
    );

    // 2. Deleting user from all groups
    if (Groups && Groups.length > 0) {
      for (const group of Groups) {
        if (group.GroupName) {
          console.log(
            `Attempting to remove user ${usernameToDelete} from group ${group.GroupName}`,
          );
          await cognitoClient.send(
            new AdminRemoveUserFromGroupCommand({
              UserPoolId: userPoolId,
              Username: usernameToDelete,
              GroupName: group.GroupName,
            }),
          );
          console.log(
            `Successfully removed user ${usernameToDelete} from group ${group.GroupName}`,
          );
        }
      }
    } else {
      console.log(`User ${usernameToDelete} does not belong to any groups.`);
    }

    // 3. Deleting the user
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
    console.error(
      `Error during user deletion process for ${usernameToDelete}:`,
      error,
    );
    throw new Error(
      `Error during user deletion process for ${usernameToDelete}: ${error}`,
    );
    // handleLambdaError(error, 'Creating user in Cognito');
    // console.error('Error during Lambda execution:', error);
    // if (error.name === 'UsernameExistsException') {
    //   throw new Error(
    //     `User with email ${email} already exists. Please use a different email.`,
    //   );
    // }
    // if (error.name === 'InvalidParameterException') {
    //   throw new Error(
    //     `Invalid parameter provided: ${error.message}. Please check your input.`,
    //   );
    // }
    // if (error.name === 'NotAuthorizedException') {
    //   throw new Error(
    //     `You are not authorized to perform this action. Please check your permissions.`,
    //   );
    // }
    // if (error.name === 'ResourceNotFoundException') {
    //   throw new Error(`User Pool not found. Please check your configuration.`);
    // }
    // // Generic error handling for client
    // throw new Error(
    //   `Failed to process request. Please check logs. Error type: ${error.name}`,
    // );
  }
};
