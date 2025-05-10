import {
  AdminDisableUserCommand,
  AdminEnableUserCommand,
  AdminGetUserCommand,
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { AppSyncResolverHandler } from 'aws-lambda';
import { Schema } from '../../data/resource';

const cognitoClient = new CognitoIdentityProviderClient({});
const userPoolId = process.env.AMPLIFY_AUTH_USERPOOL_ID;
type UserOutputType = Schema['UsersResponse']['type'];
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
  console.log('Group: ', groupName);
  if (!userPoolId) {
    console.error(
      'FATAL: User Pool ID environment variable is not configured!',
    );
    throw new Error('Server configuration error: User Pool ID missing.');
  }

  if (!username) {
    console.error(
      'Validation Error: Username (email) is required in the input.',
    );
    throw new Error('Username (email) is required to update user attributes.');
  }

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

  if (attributesToUpdate.length === 0) {
    console.log(`No attributes provided to update for user: ${username}`);
    // Decide whether to return error or user unchanged.
    // Returning error is clearer for the client.
    throw new Error('No attributes provided for update.');
  }

  console.log(
    `Attempting to update attributes for user: ${username} in pool: ${userPoolId}`,
  );
  console.log(`Attributes to update: ${JSON.stringify(attributesToUpdate)}`);

  const updateParams = {
    UserPoolId: userPoolId,
    Username: username,
    // UserAttributes: attributesToUpdate,
  };

  try {
    const updateCommand = new AdminUpdateUserAttributesCommand({
      ...updateParams,
      UserAttributes: attributesToUpdate,
    });
    await cognitoClient.send(updateCommand);
    console.log(`Successfully submitted update for user: ${username}`);

    if (enabled !== undefined) {
      const action = enabled
        ? new AdminEnableUserCommand(updateParams)
        : new AdminDisableUserCommand(updateParams);
      await cognitoClient.send(action);
      console.log(
        `Successfully ${enabled ? 'enabled' : 'disabled'} user: ${username}`,
      );
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
    throw new Error(`Failed to update user attributes: ${error as string}`);
    // handleLambdaError(
    //   error,
    //   `Updating user attributes for ${username} in Cognito`,
    // );
    // console.error(`Error updating/fetching user ${username}:`, error);
    // // Puedes mejorar el manejo de errores específicos de Cognito
    // if (error.name === 'UserNotFoundException') {
    //   throw new Error(`User '${username}' not found.`);
    // }
    // if (error.name === 'AliasExistsException') {
    //   throw new Error(
    //     `Cannot update attribute: The value provided (e.g., email or phone) is already associated with another user.`,
    //   );
    // }
    // // Lanza un error genérico o uno más específico para AppSync
    // throw new Error(`Failed to update user. ${error.name}: ${error.message}`);
  }
};

//Extracting the input arguments from the GraphQl mutation event
//   const { email, name, groupName, profilePicture } = event.arguments;
//   const username = email;
//   console.info(
//     `Creating user with email: ${email}, name: ${name}, group: ${groupName}`,
//   );

//   if (!userPoolId) {
//     console.error(
//       'FATAL: User Pool ID environment variable is not configured!',
//     );
//     throw new Error('Server configuration error: User Pool ID missing.');
//   }
//   console.info(`Checking user`);

//   if (!email || !name || !groupName) {
//     console.error('Validation Error: Missing required input fields.');
//     throw new Error('Missing required fields: email, name, or groupName.');
//   }

//   const allowedGroups = ['ADMINS', 'EDITORS', 'VIEWERS'];

//   if (!allowedGroups.includes(groupName.toUpperCase())) {
//     console.error(
//       `Validation Error: Invalid group name provided: ${groupName}`,
//     );
//     throw new Error(
//       `Invalid group specified. Allowed groups are: ${allowedGroups.join(', ')}.`,
//     );
//   }

//   console.log(`Processing request for User Pool ID: ${userPoolId}`);
//   console.log(
//     `Attempting operation for user: ${username} in group: ${groupName}`,
//   );

//   try {
//     // --- 0. Check if user already exists ---
//     try {
//       const listUsersParams = {
//         UserPoolId: userPoolId,
//         Filter: `email = "${email}"`,
//         Limit: 1,
//       };
//       const listUsersCommand = new ListUsersCommand(listUsersParams);
//       const existingUsers = await cognitoClient.send(listUsersCommand);
//       if (existingUsers.Users && existingUsers.Users.length > 0) {
//         console.warn(`User with email ${email} already exists.`);
//         throw new Error(
//           `User with email ${email} already exists. Please use a different email.`,
//         );
//       }
//     } catch (error) {
//       console.error('Error checking for existing user:', error);
//       throw new Error(`Error checking for existing user: ${error}`);
//     }

//     // --- 1. Creating the user ---
//     console.log(`Executing AdminCreateUser for username: ${username}`);
//     const createUserParams = {
//       UserPoolId: userPoolId,
//       Username: username,
//       UserAttributes: [
//         { Name: 'email', Value: email },
//         { Name: 'name', Value: name },
//         { Name: 'picture', Value: profilePicture }, // Optional: Add a profile picture URL
//         // It can be useful to add other attributes like:
//         // { Name: 'phone_number', Value: '+34123456789' }, // Format E.164 Standard attributes
//         { Name: 'email_verified', Value: 'true' }, // Mark email as verified since we are creating by admin
//       ],
//       // Options for the user creation:
//       MessageAction: 'SUPPRESS' as MessageActionType, // Do not send welcome email with temporary password
//       TemporaryPassword: 'SomeS3cureP@ssw0rd!', // Defining a secure temporary password
//       DesiredDeliveryMediums: ['EMAIL'] as DeliveryMediumType[], // If you do not use SUPPRESS, specify how to send the message
//     };

//     const createUserCommand = new AdminCreateUserCommand(createUserParams);
//     const createdUserResponse = await cognitoClient.send(createUserCommand);
//     console.log(
//       'Create User Function successful:',
//       JSON.stringify(createdUserResponse),
//     ); // Loggin the response (containing the User object)

//     if (!createdUserResponse.User) {
//       throw new Error('Cognito did not return user data after creation.');
//     }

//     // Getting 'sub' (real unique identifier) if you need it for something else
//     const userSub = createdUserResponse.User?.Attributes?.find(
//       (attr) => attr.Name === 'sub',
//     )?.Value;
//     console.log(`User created with sub: ${userSub}`);

//     // --- 2. Add user to specific group ---
//     console.log(
//       `Executing AdminAddUserToGroup for user ${username} into group ${groupName}`,
//     );
//     const addUserToGroupParams = {
//       UserPoolId: userPoolId,
//       Username: username,
//       GroupName: groupName.toUpperCase(),
//     };

//     const addUserToGroupCommand = new AdminAddUserToGroupCommand(
//       addUserToGroupParams,
//     );

//     const addedUserToGroup = await cognitoClient.send(addUserToGroupCommand);
//     console.log(`Successfully added user ${username} to group ${groupName}`);

//     if (!addedUserToGroup) {
//       throw new Error('User do not added to group.');
//     }

//     // Mapea la respuesta de Cognito al tipo User de GraphQL
//     const userAttributes = createdUserResponse.User.Attributes || [];

//     const findAttr = (name: string) =>
//       userAttributes.find((attr) => attr.Name === name)?.Value;

//     const responseUser = {
//       id: findAttr('sub'),
//       email: findAttr('email'),
//       name: findAttr('name'),
//       enabled: createdUserResponse.User.Enabled,
//       status: createdUserResponse.User.UserStatus,
//       createdAt: createdUserResponse.User.UserCreateDate?.toISOString(),
//       modifiedAt: createdUserResponse.User.UserLastModifiedDate?.toISOString(),
//     };

//     return responseUser;
//   } catch (error) {
//     console.error('Error creating users in Cognito:', error);
//     throw new Error(`Failed to create users: ${error as string}`);
//     // handleLambdaError(error, 'Creating user in Cognito');
//     // console.error('Error during Lambda execution:', error);
//     // if (error.name === 'UsernameExistsException') {
//     //   throw new Error(
//     //     `User with email ${email} already exists. Please use a different email.`,
//     //   );
//     // }
//     // if (error.name === 'InvalidParameterException') {
//     //   throw new Error(
//     //     `Invalid parameter provided: ${error.message}. Please check your input.`,
//     //   );
//     // }
//     // if (error.name === 'NotAuthorizedException') {
//     //   throw new Error(
//     //     `You are not authorized to perform this action. Please check your permissions.`,
//     //   );
//     // }
//     // if (error.name === 'ResourceNotFoundException') {
//     //   throw new Error(`User Pool not found. Please check your configuration.`);
//     // }
//     // // Generic error handling for client
//     // throw new Error(
//     //   `Failed to process request. Please check logs. Error type: ${error.name}`,
//     // );
//   }
// };
