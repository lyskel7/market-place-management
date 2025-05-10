import type { AppSyncResolverHandler } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  ListUsersCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import { Schema } from '../../data/resource';

const cognitoClient = new CognitoIdentityProviderClient({});
const userPoolId = process.env.AMPLIFY_AUTH_USERPOOL_ID;
type UserOutputType = Schema['UsersResponse']['type'];

export const handler: AppSyncResolverHandler<null, UserOutputType[]> = async (
  event,
) => {
  // Ajusta el tipo de Handler según cómo vas a invocar esta función.
  // Si es un resolver de AppSync: import type { AppSyncResolverHandler } from 'aws-lambda';
  // export const handler: AppSyncResolverHandler<any, UserOutput[]> = async (event) => { ... }
  // Si es genérica o llamada desde API Gateway, Handler está bien.
  console.log(`EVENT: ${JSON.stringify(event)}`);

  if (!userPoolId) {
    console.error(
      'FATAL: User Pool ID environment variable is not configured!',
    );
    throw new Error('Server configuration error: Missing User Pool ID.');
  }

  console.log(`Listing users for User Pool ID: ${userPoolId}`);

  try {
    const input: ListUsersCommandInput = {
      UserPoolId: userPoolId,
      // Here add filters or pagination based on event.arguments if AppSync resolver
      // Limit: event.arguments?.limit,
      // PaginationToken: event.arguments?.nextToken,
    };
    const command = new ListUsersCommand(input);
    const response = await cognitoClient.send(command);

    const users: UserOutputType[] = response.Users
      ? response.Users.map((user) => {
          const attributes = user.Attributes ?? [];
          const getAttr = (name: string): string | undefined =>
            attributes.find((attr) => attr.Name === name)?.Value ?? undefined;
          return {
            id: getAttr('sub'),
            name: getAttr('name'),
            email: getAttr('email'),
            enabled: user.Enabled ?? undefined,
            status: user.UserStatus,
            createdAt: user.UserCreateDate?.toISOString() ?? undefined,
            modifiedAt: user.UserLastModifiedDate?.toISOString() ?? undefined,
          };
        })
      : [];

    console.log(`Successfully listed ${users.length} users.`);
    console.log(`Successfully listed ${JSON.stringify(users, null, 2)}`);

    // If AppSync, return the users array directly.
    // If API Gateway, return an object with statusCode, body, etc.
    return users;
  } catch (error) {
    console.error('Error listing users from Cognito:', error);
    throw new Error(`Failed to list users: ${error as string}`);
  }
};
