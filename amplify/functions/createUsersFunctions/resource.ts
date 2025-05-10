import { defineFunction } from '@aws-amplify/backend';

export const createUsers = defineFunction({
  name: 'createUsersFunction',
  entry: './handler.ts',
});
