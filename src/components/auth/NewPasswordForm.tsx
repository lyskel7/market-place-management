'use client';
import { TPasswordFormValues } from '@/lib/interfaces';
import { confirmSignIn } from 'aws-amplify/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import PasswordComp from '../profile/PasswordComp';
import { useAuthStore } from '@/lib/stores/authStore';
import { useShallow } from 'zustand/react/shallow';
import ImageLoaderApp from './ImageLoaderApp';

const NewPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const { openClosing } = useAuthStore(
    useShallow((state) => ({
      openClosing: state.openClosing,
    })),
  );

  const performPasswordChange = async (data: TPasswordFormValues) => {
    try {
      if (!email) {
        toast.error('Error with user. Please try again.');
        push('/auth/signin');
        return;
      }
      setIsLoading(true);
      await confirmSignIn({
        challengeResponse: data.newPassword,
        options: {
          userAttributes: { name: email },
        },
      });
      document.cookie = 'authenticatedCognito=1; path=/; SameSite=Lax';
      useAuthStore.setState({
        openClosing: 'opening',
      });
      setIsLoading(false);
      toast.success(
        'Password updated successfully. Please, enter with new credentials',
      );
      push('/');
      setIsLoading(false);
    } catch (err) {
      toast.error((err as Error).message || 'Error updating password');
      setIsLoading(false);
    }
  };

  if (openClosing === 'opening') {
    return <ImageLoaderApp imageStock="opening" />;
  }

  return (
    <PasswordComp
      key={'new-password-form'}
      onSubmit={performPasswordChange}
      title="Change password"
      description="Change your password to continue"
      isLoading={isLoading}
      isChangeFirstTime={true}
    />
  );
};

export default NewPasswordForm;
