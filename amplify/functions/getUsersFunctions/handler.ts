import {
  ListUsersCommand,
  ListUsersCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import type { AppSyncResolverHandler } from 'aws-lambda';
import { cognitoClient, UserOutputType, userPoolId } from '../shared/types';
import { handleLambdaError } from '../shared/manageErrors';
import { gettinUserGroups } from '../shared/manageGroups';

export const handler: AppSyncResolverHandler<null, UserOutputType[]> = async (
  event,
) => {
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
      ? await Promise.all(
          response.Users.map(async (user) => {
            const attributes = user.Attributes ?? [];
            const getAttr = (name: string): string | undefined =>
              attributes.find((attr) => attr.Name === name)?.Value ?? undefined;
            const groups = await gettinUserGroups(user.Username || '');
            const userResult: UserOutputType = {
              id: getAttr('sub'),
              name: getAttr('name'),
              email: getAttr('email'),
              enabled: user.Enabled ?? undefined,
              status: user.UserStatus,
              groupName: groups[0],
              createdAt: user.UserCreateDate?.toISOString() ?? undefined,
              modifiedAt: user.UserLastModifiedDate?.toISOString() ?? undefined,
            };
            return userResult;
          }),
        )
      : [];

    console.log(`Successfully listed ${users.length} users.`);
    console.log(`Successfully listed ${JSON.stringify(users, null, 2)}`);

    // If AppSync, return the users array directly.
    // If API Gateway, return an object with statusCode, body, etc.
    return users;
  } catch (error) {
    handleLambdaError(error as Error, 'Getting user');
    throw new Error(
      'Control should not reach here if handleLambdaError throws.',
    );
  }
};
