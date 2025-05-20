import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { Schema } from '../../data/resource';

// Initialize the client once and export it
export const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

// Exporting the user pool ID from environment variables
export const userPoolId = process.env.AMPLIFY_AUTH_USERPOOL_ID;

if (!userPoolId) {
  console.warn(
    'ADVERTENCIA: AMPLIFY_AUTH_USERPOOL_ID no está definido en las variables de entorno.',
  );
  throw new Error(
    'Critical configuration: AMPLIFY_AUTH_USERPOOL_ID is not defined.',
  );
}
// Exporting the type for user output
export type UserOutputType = Schema['UsersResponse']['type'];
