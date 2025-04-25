'use client';
import { updatePassword, type UpdatePasswordInput } from 'aws-amplify/auth';
import { useState } from 'react';
import { toast } from 'react-toastify';
import PasswordComp from '../profile/PasswordComp';
import { TPasswordFormValues } from '@/lib/interfaces';

const PasswordChangeComp = () => {
  const [isLoading, setIsLoading] = useState(false);

  const performPasswordChange = async (data: TPasswordFormValues) => {
    const { oldPassword, newPassword } = data;
    try {
      if (!oldPassword || !newPassword) {
        toast.error('Empties fields. Please fill out this form.');
        return;
      }
      setIsLoading(true);
      const input: UpdatePasswordInput = {
        oldPassword: data.oldPassword || '',
        newPassword: data.newPassword,
      };
      await updatePassword(input);
      toast.success('Password updated successfully.');
    } catch (err) {
      toast.error((err as Error).message || 'Error updating password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PasswordComp
      onSubmit={performPasswordChange}
      title=""
      description="Change your password. Type a new one"
      isLoading={isLoading}
      isChangeFirsTime={false}
    />
  );
};

export default PasswordChangeComp;
