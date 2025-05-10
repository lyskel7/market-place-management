import { defineAuth } from '@aws-amplify/backend';
import { getUsers } from '../functions/getUsersFunctions/resource';
import { createUsers } from '../functions/createUsersFunctions/resource';
import { updateUsers } from '../functions/updateUsersFunctions/resource';
import { deleteUsers } from '../functions/deleteUsersFunctions/resource';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true, // Habilita inicio de sesión/registro con correo y contraseña

    // phone: true, // Podrías habilitar teléfono también
    // externalProviders: { // Si quieres login con Google, Facebook, etc.
    //   google: { // ...configuración de Google... },
    //   callbackUrls: ['http://localhost:3000/'], // URLs a donde redirigir
    //   logoutUrls: ['http://localhost:3000/']
    // }
  },
  // (Opcional) Define atributos de usuario personalizados
  userAttributes: {
    profilePicture: { mutable: true, required: false },
    fullname: { mutable: true, required: false },
    //   preferredUsername: { required: false }
    // (Opcional) Configura verificación de cuenta, MFA, etc.
    // accountRecovery: 'EMAIL_ONLY',
    // multifactor: {
    //  mode: 'OPTIONAL',
    //  totp: true, // Habilita apps de autenticación como Google Authenticator
  },
  groups: ['ADMINS', 'EDITORS', 'VIEWERS'],
  access: (allow) => [
    allow.resource(getUsers).to(['listUsers']),
    allow
      .resource(createUsers)
      .to(['createUser', 'listUsers', 'addUserToGroup']),
    allow
      .resource(updateUsers)
      .to([
        'listUsers',
        'disableUser',
        'enableUser',
        'removeUserFromGroup',
        'updateUserAttributes',
        'getUser',
      ]),
    allow
      .resource(deleteUsers)
      .to(['listGroupsForUser', 'removeUserFromGroup', 'deleteUser']),
  ],
});
