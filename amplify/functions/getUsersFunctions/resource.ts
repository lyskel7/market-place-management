import { defineFunction } from '@aws-amplify/backend';

export const getUsers = defineFunction({
  name: 'getUsersFunction',
  entry: './handler.ts',
});
