'use client';
import { profileInfoSchema } from '@/lib/schemas';
import { useAuthStore } from '@/lib/stores/authStore';
import { joiResolver } from '@hookform/resolvers/joi';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
} from '@mui/material';
import {
  type UpdateUserAttributeInput,
  fetchUserAttributes,
  updateUserAttribute,
} from 'aws-amplify/auth';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type TFormValues = {
  username: string;
};

const ProfileInfoComp = () => {
  const { userInfo, setUserInfo } = useAuthStore();
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
        <Box
          display={'flex'}
          justifyContent={'flex-start'}
          alignItems={'flex-start'}
          gap={2}
        >
          <IconButton onClick={() => console.log('userinfo: ', userInfo)}>
            <Avatar
              alt="yo"
              src="https://www.w3schools.com/howto/img_avatar.png"
            />
          </IconButton>
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
        </Box>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          gap={2}
          sx={{ alignSelf: 'flex-end' }}
        >
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Update'}
          </Button>
          <Button
            type="button"
            variant="outlined"
            disabled={isSubmitting}
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
