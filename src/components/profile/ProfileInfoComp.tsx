'use client';
import { profileInfoSchema } from '@/lib/schemas';
import { useAuthStore } from '@/lib/stores/authStore';
import { joiResolver } from '@hookform/resolvers/joi';
import { Box, Button, CircularProgress, Stack, TextField } from '@mui/material';
import {
  type UpdateUserAttributeInput,
  fetchUserAttributes,
  fetchAuthSession,
  updateUserAttribute,
} from 'aws-amplify/auth';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import AvatarUploader from '../AvatarUploaderComp';
import useResponsive from '@/lib/hooks/useResponsive';

type TFormValues = {
  username: string;
};

const ProfileInfoComp = () => {
  const { userInfo, setUserInfo } = useAuthStore();
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
  console.log('the picture: ', userInfo?.picture);
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

  const handleAvatarUpdate = async (newS3Url: string) => {
    console.log('New avatar URL received:', newS3Url);

    // --- PASO IMPORTANTE: Actualiza el atributo del usuario en Cognito ---
    // Cognito necesita saber la nueva URL si la usas para el atributo 'picture'.
    // Si *no* guardas la URL en un atributo de Cognito, puedes omitir esta parte
    // y solo actualizar tu store local o base de datos externa.

    try {
      if (!userInfo) {
        toast.error('User info not found');
        return;
      }

      const input: UpdateUserAttributeInput = {
        userAttribute: {
          attributeKey: 'picture', // O el nombre de tu atributo custom para la URL
          value: newS3Url,
        },
      };
      await updateUserAttribute(input);
      console.log('Cognito user attribute "picture" updated.');

      // Actualiza también el store local para reflejar el cambio inmediatamente
      setUserInfo({
        ...userInfo,
        picture: newS3Url, // Asume que 'picture' es donde guardas la URL en tu store
      });
      // --- Fuerza el refresco de los tokens ---
      console.log('Forcing token refresh after avatar update...');
      await fetchAuthSession({ forceRefresh: true });
      console.log('Tokens refreshed successfully after avatar update.');

      toast.success('Avatar URL saved to profile.');
    } catch (error) {
      console.error('Error updating user attribute "picture":', error);
      toast.error('Could not save the new avatar URL to your profile.');
      // Considera qué hacer si la subida a S3 funcionó pero la actualización
      // del atributo de Cognito falla. ¿Intentar de nuevo? ¿Informar al usuario?
    }
  };

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
          {/* <IconButton onClick={() => console.log('userinfo: ', userInfo)}>
            <Avatar
              alt="yo"
              src="https://www.w3schools.com/howto/img_avatar.png"
            />
          </IconButton> */}
          <AvatarUploader
            onUploadSuccess={handleAvatarUpdate}
            currentAvatarUrl={userInfo?.picture || ''}
          />
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
