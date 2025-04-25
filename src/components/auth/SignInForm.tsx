'use client';
import useResponsive from '@/lib/hooks/useResponsive';
import { authSchema } from '@/lib/schemas';
import { joiResolver } from '@hookform/resolvers/joi';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
  Backdrop,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NewPasswordForm from './NewPasswordForm';
import type { SignInOutput } from 'aws-amplify/auth';
import { signIn, signOut } from 'aws-amplify/auth';
import { useHydrateAuth } from '@/lib/hooks/useHydrateAuth';
import { useAuthStore } from '@/lib/stores/authStore';
import { useTheme } from '@mui/material';

type TFormValues = {
  email: string;
  password: string;
};

const SignInForm = () => {
  const [visibility, setVisibility] = useState(false);
  const hydrateAuth = useHydrateAuth();
  const { isLoading } = useAuthStore();
  const [cognitoUserForPasswordChange, setCognitoUserForPasswordChange] =
    useState<SignInOutput | null>(null);
  const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
  const [cognitoUser, setCognitoUser] = useState('');
  const { isMobile } = useResponsive();
  const theme = useTheme();
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TFormValues>({
    resolver: joiResolver(authSchema),
  });

  const handleOnSubmit = handleSubmit(async (data) => {
    const { email, password } = data;
    console.log('Username:', email);
    console.log('password:', password);

    try {
      const output = await signIn({ username: email, password });
      console.log('✅ Login exitoso', output);
      if (output) {
        if (
          output.nextStep &&
          output.nextStep.signInStep ===
            'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED'
        ) {
          setCognitoUserForPasswordChange(output);
          setCognitoUser(email);
          setShowNewPasswordForm(true);
          return;
        }

        if (output.isSignedIn) {
          console.log('Login exitoso, llamando a hydrateAuth...');
          await hydrateAuth();
          return;
        }
      }
    } catch (err) {
      console.error('❌ Error al iniciar sesión', err);
      toast.error((err as Error).message);
      setValue('password', '');
    }
  });

  const handlePasswordVisibility = () => {
    setVisibility((prev) => !prev);
  };

  const isLoadingCombined = isSubmitting || isLoading;

  if (showNewPasswordForm) {
    return (
      <NewPasswordForm
        cognitoUser={cognitoUser}
        cognitoUserForPasswordChange={cognitoUserForPasswordChange}
        onPasswordChanged={async () => {
          setShowNewPasswordForm(false);
          setCognitoUserForPasswordChange(null);
          await signOut();
          reset();
        }}
        onCancel={() => {
          // Come back to login when cancel
          setShowNewPasswordForm(false);
          setCognitoUserForPasswordChange(null);
        }}
      />
    );
  } else {
    return (
      <>
        {isLoading && (
          <Backdrop
            open={isLoading}
            sx={{
              backgroundColor: theme.palette.background.paper,
              color:
                theme.palette.mode === 'dark'
                  ? '#fff'
                  : theme.palette.primary.main,
              zIndex: 9999,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <CircularProgress color="inherit" />
              <Typography
                sx={{ mt: 2 }}
                color="text.primary"
              >
                Signing in...
              </Typography>
            </Box>
          </Backdrop>
        )}
        <form onSubmit={handleOnSubmit}>
          <Box
            width={isMobile ? '98%' : 1}
            height={'100vh'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Box
              display={'flex'}
              flexDirection={'column'}
              width={isMobile ? 1 : 350}
              justifyContent={'center'}
              alignItems={'center'}
              borderRadius={3}
              p={2}
              sx={{
                borderWidth: 'thin',
                borderStyle: 'solid',
              }}
            >
              <Typography
                variant="body1"
                fontSize={'2rem'}
              >
                Sign in
              </Typography>
              <Typography variant="caption">
                Welcome user, please sign in to continue
              </Typography>
              <TextField
                id="email"
                label="Email"
                fullWidth
                size="small"
                margin="normal"
                error={Boolean(errors.email)}
                {...register('email')}
                disabled={isLoadingCombined}
                helperText={
                  errors.email && Boolean(errors.email)
                    ? errors.email?.message?.toString()
                    : null
                }
              />
              <TextField
                id="password"
                label="Password"
                type={visibility ? 'text' : 'password'}
                size="small"
                fullWidth
                error={Boolean(errors.password)}
                {...register('password')}
                margin="normal"
                disabled={isLoadingCombined}
                helperText={
                  errors.password && Boolean(errors.password)
                    ? errors.password?.message?.toString()
                    : null
                }
                slotProps={{
                  input: {
                    endAdornment: (
                      <IconButton
                        aria-label="Toogle password visibility"
                        onClick={handlePasswordVisibility}
                        edge="end"
                        disabled={isLoadingCombined}
                      >
                        {visibility ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    ),
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoadingCombined}
              >
                {isLoadingCombined ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
            </Box>
          </Box>
        </form>
      </>
    );
  }
};

export default SignInForm;
