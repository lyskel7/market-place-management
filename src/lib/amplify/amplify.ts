'use client';
import { Amplify } from 'aws-amplify';
import output from '../../../amplify_outputs.json';

let isConfigured = false;

export const configureAmplify = () => {
  if (!isConfigured) {
    Amplify.configure(output);
    isConfigured = true;
  }
};
