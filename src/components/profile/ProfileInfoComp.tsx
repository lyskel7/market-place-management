'use client';
import useResponsive from '@/lib/hooks/useResponsive';
import { profileInfoSchema } from '@/lib/schemas';
import { useAuthStore } from '@/lib/stores/authStore';
import { joiResolver } from '@hookform/resolvers/joi';
import { Box, Button, CircularProgress, Stack, TextField } from '@mui/material';
import {
  type UpdateUserAttributeInput,
  fetchAuthSession,
  fetchUserAttributes,
  updateUserAttribute,
} from 'aws-amplify/auth';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import AvatarUploaderComp from './AvatarUploaderComp';
import { useShallow } from 'zustand/react/shallow';

type TFormValues = {
  username: string;
};

const ProfileInfoComp = () => {
  const { userInfo, setUserInfo } = useAuthStore(
    useShallow((state) => ({
      userInfo: state.userInfo,
      setUserInfo: state.setUserInfo,
    })),
  );
  const { isMobile } = useResponsive();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TFormValues>({
    resolver: joiResolver(profileInfoSchema),
    defaultValues: {
      username: userInfo?.name || '',
    },
  });
  const handleReset = (username: string) => {
    reset({ username });
  };

  const handleOnSubmit = handleSubmit(async (data) => {
    const { username } = data;
    try {
      if (!userInfo) {
        toast.error('User info not found');
        return;
      }

      const input: UpdateUserAttributeInput = {
        userAttribute: {
          attributeKey: 'name',
          value: username,
        },
      };

      await updateUserAttribute(input);
      const updatedAttributes = await fetchUserAttributes();
      setUserInfo({
        ...userInfo,
        name: updatedAttributes.name,
      });
      handleReset(updatedAttributes.name || '');
      await fetchAuthSession({ forceRefresh: true });
      toast.success('Profile username updated successfully!');
    } catch (error) {
      toast.error(`Error updating profile info : ${error}`);
    }
  });

  // useEffect(() => {
  //   console.log('Form Errors:', errors);
  // }, [errors]);

  return (
    <form
      onSubmit={handleOnSubmit}
      noValidate
    >
      <Stack gap={2}>
        <Stack
          justifyContent={'center'}
          alignItems={'center'}
          gap={2}
        >
          <AvatarUploaderComp />
          <TextField
            id="username"
            label="Username"
            fullWidth
            size="small"
            margin="dense"
            error={Boolean(errors.username)}
            helperText={errors.username?.message}
            {...register('username')}
          />
        </Stack>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          gap={2}
          sx={isMobile ? undefined : { alignSelf: 'flex-end' }}
        >
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            fullWidth={isMobile}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Update'}
          </Button>
          <Button
            type="button"
            variant="outlined"
            disabled={isSubmitting}
            fullWidth={isMobile}
            onClick={() => handleReset(userInfo?.name || '')}
          >
            {'Reset'}
          </Button>
        </Box>
      </Stack>
    </form>
  );
};

export default ProfileInfoComp;
