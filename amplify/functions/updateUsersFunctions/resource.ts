import { defineFunction } from '@aws-amplify/backend';

export const updateUsers = defineFunction({
  name: 'updateUsersFunction',
  entry: './handler.ts',
});
