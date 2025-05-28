import {
  AdminAddUserToGroupCommand,
  AdminAddUserToGroupCommandInput,
  AdminListGroupsForUserCommand,
  AdminListGroupsForUserCommandInput,
  AdminRemoveUserFromGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient, userPoolId } from './types';

/**
 * Adding user to groups
 * @param { AdminAddUserToGroupCommandInput }  - Object with username (email), groupname
 * @returns {Promise<void>}
 */
export const addingUserToGroup = async (
  adminUserInput: AdminAddUserToGroupCommandInput,
) => {
  try {
    const response = await new AdminAddUserToGroupCommand(adminUserInput);
    await cognitoClient.send(response);
    console.info(
      `User ${adminUserInput.Username} added in group ${adminUserInput.GroupName} successfully`,
    );
  } catch (groupError) {
    console.error(groupError);
    throw groupError;
  }
};

/**
 * Getting cognito users groups
 * @param { string } username - User name, in this app it's the email
 * @returns { string[] } Array groups name
 */
export const gettinUserGroups = async (username: string): Promise<string[]> => {
  const listGroupsParams: AdminListGroupsForUserCommandInput = {
    UserPoolId: userPoolId,
    Username: username,
  };

  const { Groups } = await cognitoClient.send(
    new AdminListGroupsForUserCommand(listGroupsParams),
  );

  return (Groups?.map((g) => g.GroupName).filter(Boolean) as string[]) || [];
};

/**
 * Delete a user from all Cognito groups they belong to.
 * @param {string} username - Object containing the user's identifier for Cognito (username) and groupname.
 * @returns {Promise<void>} - A promise that resolves when the user is removed from all groups.
 */
export const removeUserFromAllCognitoGroups = async (
  username: string,
): Promise<void> => {
  try {
    console.log(`Starting group management for user: ${username}`);

    // 1. List all user's groups
    const groupNames = await gettinUserGroups(username);
    // const listGroupsParams: AdminListGroupsForUserCommandInput = {
    //   UserPoolId: userPoolId,
    //   Username: username,
    // };

    // const { Groups } = await cognitoClient.send(
    //   new AdminListGroupsForUserCommand(listGroupsParams),
    // );

    // const groupNames =
    //   (Groups?.map((g) => g.GroupName).filter(Boolean) as string[]) || [];
    // console.log(
    //   `User ${username} belongs to groups: ${groupNames.join(', ') || 'None'}`,
    // );

    // 2. Delete user from each group
    if (groupNames.length > 0) {
      const removalPromises = groupNames.map((itemGroupName) => {
        console.log(
          `Trying to remove user ${username} from group ${itemGroupName}`,
        );
        return cognitoClient
          .send(
            new AdminRemoveUserFromGroupCommand({
              UserPoolId: userPoolId,
              Username: username,
              GroupName: itemGroupName,
            }),
          )
          .then(() => {
            console.log(
              `User ${username} successfully removed from group ${itemGroupName}`,
            );
          })
          .catch((groupError) => {
            console.error(
              `Error al eliminar al usuario ${username} del grupo ${itemGroupName}:`,
              groupError,
            );
            // Decide if an error removing from a group should stop everything or if you continue
            // At this moment, we will rethrow the error to stop the process.
            throw groupError;
          });
      });

      await Promise.all(removalPromises); // Waiting for all removals to complete
      console.log(`All group removal operations for ${username} completed.`);
    } else {
      console.log(
        `User ${username} does not belong to any group, no action required.`,
      );
    }
  } catch (error) {
    console.error(`Error managing groups for user ${username}:`, error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(
        `Unknown error managing groups: ${JSON.stringify(error)}`,
      );
    }
  }
};
