import { defineFunction } from '@aws-amplify/backend';

export const deleteUsers = defineFunction({
  name: 'deleteUsersFunction',
  entry: './handler.ts',
});
