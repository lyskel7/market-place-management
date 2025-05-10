import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { getUsers } from '../functions/getUsersFunctions/resource';
import { createUsers } from '../functions/createUsersFunctions/resource';
import { updateUsers } from '../functions/updateUsersFunctions/resource';
import { deleteUsers } from '../functions/deleteUsersFunctions/resource';

const schema = a.schema({
  UsersResponse: a.customType({
    id: a.string(),
    email: a.string(),
    name: a.string(),
    profilePicture: a.string(),
    enabled: a.boolean(),
    status: a.string(),
    createdAt: a.string(),
    modifiedAt: a.string(),
  }),
  getUsers: a
    .query()
    .returns(a.ref('UsersResponse').array())
    .authorization((allow) => [allow.groups(['ADMINS', 'EDITORS', 'VIEWERS'])])
    .handler(a.handler.function(getUsers)),
  createUsers: a
    .mutation()
    .arguments({
      email: a.string().required(),
      name: a.string().required(),
      groupName: a.string(),
      profilePicture: a.string(),
    })
    .returns(a.ref('UsersResponse'))
    .authorization((allow) => [allow.groups(['ADMINS'])])
    .handler(a.handler.function(createUsers)),
  updateUsers: a
    .mutation()
    .arguments({
      email: a.string().required(),
      name: a.string(),
      groupName: a.string(),
      enabled: a.boolean(),
    })
    .returns(a.ref('UsersResponse'))
    .authorization((allow) => [allow.groups(['ADMINS'])])
    .handler(a.handler.function(updateUsers)),
  deleteUsers: a
    .mutation()
    .arguments({
      email: a.string().required(),
      name: a.string(),
    })
    .returns(a.boolean())
    .authorization((allow) => [allow.groups(['ADMINS'])])
    .handler(a.handler.function(deleteUsers)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
