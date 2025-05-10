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

type TFormValues = {
  username: string;
};

const ProfileInfoComp = () => {
  const { userInfo, setUserInfo } = useAuthStore();
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

  // --- Función para obtener la URL fresca ---
  // const fetchAndSetFreshAvatarUrl = async () => {
  //   // Asegúrate de tener la información necesaria (identityId o al menos saber que el usuario está logueado)
  //   // El identityId NO está directamente en userInfo por defecto, pero la llamada a getUrl lo usará implícitamente si el usuario está autenticado
  //   if (!userInfo) {
  //     // O una mejor comprobación de autenticación
  //     console.log('Usuario no autenticado, no se busca avatar.');
  //     setAvatarUrl(null); // Sin avatar si no hay usuario
  //     return;
  //   }

  //   setIsLoadingAvatar(true);
  //   setAvatarUrl(null); // Limpiar URL anterior mientras carga
  //   console.log('Fetching fresh avatar URL...');

  //   try {
  //     const getUrlInput: GetUrlWithPathInput = {
  //       // Path relativo DENTRO del nivel de acceso privado
  //       path: ({ identityId }) => `private/${identityId}/avatar`,
  //       options: {
  //         expiresIn: URL_EXPIRES_IN_SECONDS, // Genera una URL válida por 1 hora
  //         validateObjectExistence: false, // IMPORTANTE: Ponlo en false o maneja el error si el avatar podría no existir aún
  //       },
  //     };
  //     const result = await getUrl(getUrlInput);
  //     console.log('Fresh avatar URL fetched:', result.url.toString());
  //     setAvatarUrl(result.url.toString());
  //   } catch (error) {
  //     console.error('Error fetching avatar URL:', error);
  //     // Podría ser que el objeto no existe (si validateObjectExistence=true)
  //     // O un problema de permisos si algo cambió.
  //     setAvatarUrl(null); // No mostrar imagen si hay error
  //     // Puedes mostrar un avatar por defecto aquí
  //   } finally {
  //     setIsLoadingAvatar(false);
  //   }
  // };

  // --- useEffect para cargar la URL al montar o cuando userInfo cambie ---
  // useEffect(() => {
  //   fetchAndSetFreshAvatarUrl();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [userInfo]); // Ejecutar cuando userInfo esté disponible/cambie

  // const handleAvatarUpdate = async (newS3Url: string) => {
  // try {
  //   console.log('Forcing token refresh...');
  //   await fetchAuthSession({ forceRefresh: true });
  //   console.log('Tokens refreshed.');
  // } catch (refreshError) {
  //   console.error('Error refreshing session:', refreshError);
  // }
  // toast.success('Avatar uploaded!');
  // Podrías forzar la regeneración de la URL en el estado local aquí
  // fetchAndSetFreshAvatarUrl();
  // console.log('New avatar URL received:', newS3Url);

  // // --- PASO IMPORTANTE: Actualiza el atributo del usuario en Cognito ---
  // // Cognito necesita saber la nueva URL si la usas para el atributo 'picture'.
  // // Si *no* guardas la URL en un atributo de Cognito, puedes omitir esta parte
  // // y solo actualizar tu store local o base de datos externa.

  // try {
  //   if (!userInfo) {
  //     toast.error('User info not found');
  //     return;
  //   }

  //   const input: UpdateUserAttributeInput = {
  //     userAttribute: {
  //       attributeKey: 'picture', // O el nombre de tu atributo custom para la URL
  //       value: newS3Url,
  //     },
  //   };
  //   await updateUserAttribute(input);
  //   console.log('Cognito user attribute "picture" updated.');

  //   // Actualiza también el store local para reflejar el cambio inmediatamente
  //   setUserInfo({
  //     ...userInfo,
  //     picture: newS3Url, // Asume que 'picture' es donde guardas la URL en tu store
  //   });
  //   // --- Fuerza el refresco de los tokens ---
  //   console.log('Forcing token refresh after avatar update...');
  //   await fetchAuthSession({ forceRefresh: true });
  //   console.log('Tokens refreshed successfully after avatar update.');

  //   toast.success('Avatar URL saved to profile.');
  // } catch (error) {
  //   console.error('Error updating user attribute "picture":', error);
  //   toast.error('Could not save the new avatar URL to your profile.');
  //   // Considera qué hacer si la subida a S3 funcionó pero la actualización
  //   // del atributo de Cognito falla. ¿Intentar de nuevo? ¿Informar al usuario?
  // }
  // };

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
          <AvatarUploaderComp
          // onUploadSuccess={handleAvatarUpdate}
          // currentAvatarUrl={userInfo?.picture || ''}
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
