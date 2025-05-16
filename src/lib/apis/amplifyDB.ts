import { generateClient } from '@aws-amplify/api';
import { Schema } from '../../../amplify/data/resource';
import { TProfileValues } from '../interfaces';

const client = generateClient<Schema>({
  authMode: 'userPool',
});

export type SchemaType = Schema['UsersResponse']['type'];
export interface IInputForDeleteUser {
  email: string;
  name: string;
}

export const createUser = async (
  input: TProfileValues,
): Promise<SchemaType> => {
  try {
    console.log('GraphQL on mutation:', input);
    const result = await client.mutations.createUsers(input);
    console.log('GraphQL Result on mutation:', result);

    if (result.errors && result.errors.length > 0) {
      console.error('GraphQL Errors:', result.errors);
      throw new Error(`GraphQL errors occurred: ${result.errors.join(', ')}`);
    }

    const payload = result.data;
    console.log('Payload:', payload);

    if (payload) {
      return payload as SchemaType;
    } else {
      const errorMessage = 'Failed creating user. Unknown reason.';
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.debug('User could not be created', error);
    throw new Error(`User could not be created: ${error}`);
  }
};

export const updateUser = async (
  input: TProfileValues,
): Promise<SchemaType> => {
  try {
    console.log('GraphQL on mutation:', input);
    const result = await client.mutations.updateUsers(input);
    console.log('GraphQL Result on mutation:', result);

    if (result.errors && result.errors.length > 0) {
      console.error('GraphQL Errors:', result.errors);
      throw new Error(`GraphQL errors occurred: ${result.errors.join(', ')}`);
    }

    const payload = result.data;
    console.log('Payload:', payload);

    if (payload) {
      return payload as SchemaType;
    } else {
      const errorMessage = 'Failed updating user. Unknown reason.';
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.debug('User could not be updated', error);
    throw new Error(`User could not be updated: ${error}`);
  }
};

export const getUsers = async () => {
  try {
    console.log('Fetching users...');
    // Await GraphQL call
    const result = await client.queries.getUsers();

    console.log('GraphQL Result:', result); // Full log response for debugging

    // Checking errors first!
    if (result.errors) {
      console.error('GraphQL Errors:', result.errors);
      throw new Error(`Error fetching users: ${result.errors[0].message}`);
    } else if (result.data?.length) {
      console.log('Users Data:', result.data);
      return result.data as SchemaType[];
    } else {
      console.log('No users data found, but no errors.');
    }
  } catch (err) {
    // Capturing network errors or unhandled exceptions
    console.error('Failed to load users:', err || 'Unknown error');
    throw new Error(`Failed to load users: ${err || 'Unknown error'}`);
  }
};

export const deleteUser = async (
  input: IInputForDeleteUser,
): Promise<boolean> => {
  try {
    console.log('GraphQL on mutation:', input);
    const result = await client.mutations.deleteUsers(input);
    console.log('GraphQL Result on mutation:', result);

    if (result.errors && result.errors.length > 0) {
      console.error('GraphQL Errors:', result.errors);
      throw new Error(`GraphQL errors occurred: ${result.errors.join(', ')}`);
    }

    const payload = result.data;
    console.log('Payload:', payload);

    if (payload) {
      return true;
    } else {
      const errorMessage = 'Failed deleting user. Unknown reason.';
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.debug('User could not be deleted', error);
    throw new Error(`User could not be deleted: ${error}`);
  }
};
