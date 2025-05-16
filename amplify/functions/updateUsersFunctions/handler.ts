import {
  AdminDisableUserCommand,
  AdminEnableUserCommand,
  AdminEnableUserCommandInput,
  AdminGetUserCommand,
  AdminUpdateUserAttributesCommand,
  AdminUpdateUserAttributesCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import { AppSyncResolverHandler } from 'aws-lambda';
import { cognitoClient, UserOutputType, userPoolId } from '../shared/types';
import {
  addingUserToGroup,
  removeUserFromAllCognitoGroups,
} from '../shared/manageGroups';
import { handleLambdaError } from '../shared/manageErrors';

type TInput = {
  email: string;
  name: string;
  groupName: string;
  profilePicture: string;
  enabled: boolean;
};

export const handler: AppSyncResolverHandler<TInput, UserOutputType> = async (
  event,
) => {
  console.log(`Received event: ${JSON.stringify(event)}`);

  const {
    email: username,
    groupName,
    enabled,
    ...updateData
  } = event.arguments;

  if (!username) {
    console.error(
      'Validation Error: Username (email) is required in the input.',
    );
    throw new Error('Username (email) is required to update user attributes.');
  }

  try {
    const attributesToUpdate = [];
    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined) {
        const attributeName = key;
        // Mapping names GraphQL to Cognito names if differents, for instance
        // if (key === 'custom_department') {
        //   attributeName = 'custom:department;

        attributesToUpdate.push({
          Name: attributeName,
          Value: value === null ? '' : String(value), // Cognito expects strings. Send empty string to delete optionally.
        });
      }
    }

    if (attributesToUpdate.length) {
      console.log(
        `Attempting to update attributes for user: ${username} in pool: ${userPoolId}`,
      );

      const updateParams: AdminUpdateUserAttributesCommandInput = {
        UserPoolId: userPoolId,
        Username: username,
        UserAttributes: attributesToUpdate,
      };
      //   console.log(`No attributes provided to update for user: ${username}`);
      //   // Decide whether to return error or user unchanged.
      //   // Returning error is clearer for the client.
      //   // throw new Error('No attributes provided for update.');
      const updateCommand = new AdminUpdateUserAttributesCommand(updateParams);
      await cognitoClient.send(updateCommand);
      console.log(`Successfully submitted update for user: ${username}`);
    }

    const enableDisableUserCommnandInput: AdminEnableUserCommandInput = {
      Username: username,
      UserPoolId: userPoolId,
    };

    if (enabled != null) {
      const action = enabled
        ? new AdminEnableUserCommand(enableDisableUserCommnandInput)
        : new AdminDisableUserCommand(enableDisableUserCommnandInput);
      await cognitoClient.send(action);
      console.log(
        `Successfully ${enabled ? 'enabled' : 'disabled'} user: ${username}`,
      );
    }

    //Changing groups user if proceed

    if (groupName) {
      await removeUserFromAllCognitoGroups(username);

      addingUserToGroup({
        Username: username,
        GroupName: groupName,
        UserPoolId: userPoolId,
      });
      console.info(`User ${username} added to group ${groupName}`);
    }

    // --- Return updated user (Recommended) ---
    const getUserParams = {
      UserPoolId: userPoolId,
      Username: username,
    };
    const getUserCommand = new AdminGetUserCommand(getUserParams);
    const userData = await cognitoClient.send(getUserCommand);
    console.log('Fetched user data:', userData);

    // Mapping the response to match your GraphQL 'User' type
    const userAttributes = userData.UserAttributes || [];

    const findAttr = (name: string) =>
      userAttributes.find((attr) => attr.Name === name)?.Value;

    // Build the response object that matches your GraphQL 'User' type
    const responseUser = {
      id: findAttr('sub'), // 'sub' is the unique identifier for the user
      name: findAttr('name'),
      email: findAttr('email'),
      picture: findAttr('picture'),
      // phone_number: findAttr('phone_number'),
      // email_verified: findAttr('email_verified') === 'true',
      // phone_number_verified: findAttr('phone_number_verified') === 'true',
    };

    return responseUser;
  } catch (error) {
    handleLambdaError(error as Error, 'Updating user');
    throw new Error(
      'Control should not reach here if handleLambdaError throws.',
    );
  }
};
