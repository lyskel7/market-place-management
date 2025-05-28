'use client';
import ImageLoaderApp from '@/components/auth/ImageLoaderApp';
import { useAuthStore } from '@/lib/stores/authStore';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useTheme } from '@mui/material/styles';
import type { AuthProvider } from '@toolpad/core';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import handleSignInClient from './action';

// function getCookie(name: string): string | null {
//   if (typeof document === 'undefined') {
//     return null; // No estamos en el navegador
//   }
//   const nameEQ = name + '=';
//   const ca = document.cookie.split(';');
//   for (let i = 0; i < ca.length; i++) {
//     let c = ca[i];
//     while (c.charAt(0) === ' ') c = c.substring(1, c.length);
//     if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
//   }
//   return null;
// }

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
  const { openClosing, clearAuth } = useAuthStore(
    useShallow((state) => ({
      openClosing: state.openClosing,
      clearAuth: state.clearAuth,
    })),
  );

  const toolpadCompatibleSignIn: (
    provider: AuthProvider,
    formData: FormData,
  ) => void = async (provider, formData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await handleSignInClient(provider, formData, {
        onSuccess: () => {
          useAuthStore.setState({ openClosing: 'opening' });
          push('/');
        },
        onNewPasswordRequired: () => {
          useAuthStore.setState({ openClosing: 'changing' });
          const params = new URLSearchParams();
          params.set('email', formData.get('email')?.toString() || '');
          setIsLoading(false);
          push(`/auth/change-password?${params}`);
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

  if (openClosing === 'opening') {
    return <ImageLoaderApp imageStock="opening" />;
  }

  if (openClosing === 'changing') {
    return <ImageLoaderApp imageStock="changing" />;
  }

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
