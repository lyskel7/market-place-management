'use client';
import { ReactNode } from 'react';
import { configureAmplify } from './amplify';

try {
  console.log('Attempting synchronous Amplify configuration...');
  configureAmplify();
  console.log('Synchronous Amplify configuration completed.');
} catch (error) {
  console.error('Failed synchronous Amplify configuration:', error);
}

export default function AmplifyClientInitializer({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
