'use client';
import { confirmSignIn, SignInOutput } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import PasswordComp from '../profile/PasswordComp';
import { TPasswordFormValues } from '@/lib/interfaces';

type TProps = {
  cognitoUser: string;
  cognitoUserForPasswordChange: SignInOutput | null;
  onPasswordChanged: () => void;
  onCancel: () => void;
};

const NewPasswordForm = (props: TProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    cognitoUser,
    cognitoUserForPasswordChange,
    onPasswordChanged,
    onCancel,
  } = props;
  const router = useRouter();

  const performPasswordChange = async (data: TPasswordFormValues) => {
    try {
      if (!cognitoUser || !cognitoUserForPasswordChange) {
        toast.error('Error with user. Please try again.');
        router.push('/auth/signin');
        return;
      }
      setIsLoading(true);
      await confirmSignIn({
        challengeResponse: data.newPassword,
        options: {
          userAttributes: { name: cognitoUser },
        },
      });
      toast.success(
        'Password updated successfully. Please, enter with new credentials',
      );
      onPasswordChanged();
      setIsLoading(false);
    } catch (err) {
      toast.error((err as Error).message || 'Error updating password');
    }
  };

  return (
    <PasswordComp
      onSubmit={performPasswordChange}
      title="Change password"
      description="Change your password to continue"
      isLoading={isLoading}
      isChangeFirsTime={true}
      onCancel={onCancel}
    />
  );
};

export default NewPasswordForm;
