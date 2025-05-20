'use client';
import { useEffect, useState } from 'react';
import { SignInPage } from '@toolpad/core/SignInPage';
import type { AuthProvider } from '@toolpad/core';
import { useRouter } from 'next/navigation';
import handleSignInClient from './action';
import { AppProvider } from '@toolpad/core/AppProvider';
import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { useAuthStore } from '@/lib/stores/authStore';

const providers: AuthProvider[] = [
  {
    id: 'credentials',
    name: 'Email and Password',
  },
];

function subtitle(error: string) {
  if (!error) return;
  return (
    <Alert
      sx={{ mb: 2, px: 1, py: 0.25, width: '100%' }}
      severity="warning"
    >
      {error}
    </Alert>
  );
}

function customPasswordField() {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <FormControl
      sx={{ my: 2 }}
      fullWidth
      variant="outlined"
    >
      <InputLabel
        size="small"
        htmlFor="outlined-adornment-password"
      >
        Password
      </InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={showPassword ? 'text' : 'password'}
        name="password"
        size="small"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              edge="end"
              size="small"
            >
              {showPassword ? (
                <VisibilityOff fontSize="inherit" />
              ) : (
                <Visibility fontSize="inherit" />
              )}
            </IconButton>
          </InputAdornment>
        }
        label="Password"
      />
    </FormControl>
  );
}

const CustomSignInPage = () => {
  const { push } = useRouter();
  const theme = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isAuthGlobal = useAuthStore((state) => state.isAuth);

  const toolpadCompatibleSignIn: (
    provider: AuthProvider,
    formData: FormData,
  ) => void = async (
    provider: AuthProvider,
    formData: FormData,
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await handleSignInClient(provider, formData, {
        onSuccess: () => {
          push('/');
        },
        onNewPasswordRequired: () => {
          setIsLoading(false);
          push('/auth/change-password');
        },
        onError: (message: string) => {
          setIsLoading(false);
          setError(message);
          // throw new Error(message);
        },
      });
    } catch (err: any) {
      setIsLoading(false);
      if (!error) setError(err.message || 'An unexpected error occurred.');
      throw err;
    }
  };

  useEffect(() => {
    if (isAuthGlobal && isLoading) {
      // Si estábamos en estado de carga (isLoadingPage=true) porque hicimos submit,
      // y ahora el estado global isAuth es true (gracias al Hub y hydrate),
      // significa que el proceso de autenticación global se completó.
      // El AuthGuard debería estar manejando la redirección.
      // Podemos quitar el estado de carga de *esta* página.
      // Si el AuthGuard no redirige inmediatamente, el usuario podría ver brevemente
      // el botón sin loader antes de que la navegación ocurra, lo cual es aceptable.
      console.log(
        'SignInPage useEffect: Global auth is true and page was loading. Resetting page loading state.',
      );
      setIsLoading(false);
    }
  }, [isAuthGlobal, isLoading]);

  return (
    <AppProvider theme={theme}>
      <SignInPage
        providers={providers}
        signIn={toolpadCompatibleSignIn}
        slots={{
          subtitle: () => subtitle(error ?? ''),
          passwordField: customPasswordField,
        }}
        slotProps={{
          form: { noValidate: true },
          submitButton: {
            loading: isLoading,
          },
        }}
      />
    </AppProvider>
  );
};

export default CustomSignInPage;
