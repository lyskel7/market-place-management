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
  // const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  // const [isLoadingAvatar, setIsLoadingAvatar] = useState<boolean>(false);
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
  // console.log('the picture: ', userInfo?.picture);
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

  // // --- Función para obtener la URL fresca ---
  // const fetchAndSetFreshAvatarUrl = async () => {
  //   if (!userInfo) {
  //     //No user, no avatar
  //     setAvatarUrl(null);
  //     return;
  //   }

  //   setIsLoadingAvatar(true);
  //   setAvatarUrl(null); // Cleaning previous URL while loading
  //   console.log('Fetching fresh avatar URL...');

  //   try {
  //     const getUrlInput: GetUrlWithPathInput = {
  //       path: ({ identityId }) => `private/${identityId}/avatar`,
  //       options: {
  //         expiresIn: URL_EXPIRES_IN_SECONDS, // Generate valid URL for 1 hour
  //         validateObjectExistence: false,
  //       },
  //     };
  //     const result = await getUrl(getUrlInput);
  //     console.info('Fresh avatar URL fetched:', result.url.toString());
  //     setAvatarUrl(result.url.toString());
  //   } catch (error) {
  //     console.error('Error fetching avatar URL:', error);
  //     setAvatarUrl(null); // If error do not show image
  //     // Show default avatar
  //   } finally {
  //     setIsLoadingAvatar(false);
  //   }
  // };

  // // --- useEffect para cargar la URL al montar o cuando userInfo cambie ---
  // useEffect(() => {
  //   fetchAndSetFreshAvatarUrl();
  // }, [userInfo]);

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
