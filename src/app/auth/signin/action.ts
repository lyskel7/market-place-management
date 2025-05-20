'use client';
import { signIn, AuthError } from 'aws-amplify/auth';
import type { AuthProvider } from '@toolpad/core';

export interface IClientSignInResult {
  success: boolean;
  needsNewPassword?: boolean;
  error?: string;
}

const handleSignInClient = async (
  provider: AuthProvider,
  formData: FormData,
  callbacks: {
    onSuccess: () => void;
    onNewPasswordRequired: () => void;
    onError: (message: string) => void;
  },
): Promise<void> => {
  const email = formData.get('email') as string | null;
  const password = formData.get('password') as string | null;

  if (!email || !password) {
    callbacks.onError('Email and password are required.');
    return;
  }

  try {
    const { isSignedIn, nextStep } = await signIn({
      username: email,
      password: password,
    });

    if (isSignedIn) {
      console.info('Login success (client-side).');
      callbacks.onSuccess();
      return;
    }

    if (nextStep) {
      console.log('Next step (client-side):', nextStep.signInStep);
      switch (nextStep.signInStep) {
        case 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED':
          console.warn('New password required (client-side)');
          callbacks.onNewPasswordRequired();
          return;
        // Maneja otros nextSteps si es necesario (MFA, custom challenge, etc.)
        // Por ejemplo:
        // case 'CONFIRM_SIGN_IN_WITH_SMS_MFA_CODE':
        //   callbacks.onError(`MFA code required. Please check your SMS.`);
        //   // Podrías redirigir a una página de MFA o mostrar un campo de input de MFA
        //   // router.push('/auth/mfa');
        //   return;
        default:
          console.error(
            'Unknown next step (client-side):',
            nextStep.signInStep,
          );
          callbacks.onError(
            `An unexpected authentication step was encountered: ${nextStep.signInStep}`,
          );
          return;
      }
    } else {
      console.error(
        'Cognito sign in failed with no clear next step (client-side).',
      );
      callbacks.onError('Login failed. Please try again.');
      return;
    }
  } catch (err: any) {
    // console.error(
    //   'Cognito Sign In Error (client-side):',
    //   err.name,
    //   err.message,
    // );
    let errorMessage = 'An unexpected error occurred during sign in.';
    if (err instanceof AuthError) {
      if (err.name === 'UserNotFoundException') {
        errorMessage = 'User not found.';
      } else if (err.name === 'NotAuthorizedException') {
        errorMessage = 'Incorrect username or password.';
      } else if (err.name === 'UserNotConfirmedException') {
        errorMessage =
          'User account is not confirmed. Please check your email for a confirmation link.';
      } else {
        errorMessage = err.message;
      }
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }
    callbacks.onError(errorMessage);
  }
};

export default handleSignInClient;
