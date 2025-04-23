import { Amplify } from 'aws-amplify';
import awsExports from '@/aws-exports';

let isConfigured = false;

export const configureAmplify = () => {
  if (!isConfigured) {
    Amplify.configure({ ...awsExports });
    isConfigured = true;
  }
};
