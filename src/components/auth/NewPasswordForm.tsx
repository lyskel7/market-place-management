'use client';
// import { setNewPassword } from '@/lib/apis/amplifyDB';
import { confirmSignIn, SignInOutput } from 'aws-amplify/auth';
import useResponsive from '@/lib/hooks/useResponsive';
import { confirmPasswordSchema } from '@/lib/schemas';
import { joiResolver } from '@hookform/resolvers/joi';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type FormValues = {
  newPassword: string;
  confirmedPassword: string;
};

type TProps = {
  cognitoUser: string;
  cognitoUserForPasswordChange: SignInOutput | null;
  onPasswordChanged: () => void;
  onCancel: () => void;
};

const NewPasswordForm = (props: TProps) => {
  const {
    cognitoUser,
    cognitoUserForPasswordChange,
    onPasswordChanged,
    onCancel,
  } = props;
  const router = useRouter();
  const [visibility, setVisibility] = useState<{ [key: string]: boolean }>({
    newPassword: false,
    confirmedPassword: false,
  });
  const { isMobile } = useResponsive();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: joiResolver(confirmPasswordSchema),
  });

  const handleOnSubmit = handleSubmit(async (data) => {
    try {
      if (!cognitoUser || !cognitoUserForPasswordChange) {
        toast.error('Error with user. Please try again.');
        router.push('/auth/signin');
        return;
      }

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
    } catch (err) {
      toast.error((err as Error).message || 'Error updating password');
    }
  });

  const handlePasswordVisibility = (fieldId: string) => {
    setVisibility((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  return (
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
            Change password
          </Typography>
          <Typography variant="caption">
            Change your passowrd to continue
          </Typography>
          <TextField
            id="newPassword"
            label="New password"
            type={visibility['newPassword'] ? 'text' : 'password'}
            fullWidth
            size="small"
            margin="normal"
            error={Boolean(errors.newPassword)}
            {...register('newPassword')}
            helperText={
              errors.newPassword && Boolean(errors.newPassword)
                ? errors.newPassword?.message?.toString()
                : null
            }
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    aria-label="Toggle new password visibility"
                    onClick={() => handlePasswordVisibility('newPassword')}
                  >
                    {visibility['newPassword'] ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </IconButton>
                ),
              },
            }}
          />
          <TextField
            id="confirmedPassword"
            label="Confirm password"
            type={visibility['confirmedPassword'] ? 'text' : 'password'}
            size="small"
            fullWidth
            error={Boolean(errors.confirmedPassword)}
            {...register('confirmedPassword')}
            margin="normal"
            helperText={
              errors.confirmedPassword && Boolean(errors.confirmedPassword)
                ? errors.confirmedPassword?.message?.toString()
                : null
            }
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    aria-label="Toggle confirmed password visibility"
                    onClick={() =>
                      handlePasswordVisibility('confirmedPassword')
                    }
                  >
                    {visibility['confirmedPassword'] ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </IconButton>
                ),
              },
            }}
          />
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            width={1}
            gap={2}
          >
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
            <Button
              type="button"
              variant="contained"
              color="warning"
              fullWidth
              disabled={isSubmitting}
              onClick={() => {
                reset();
                onCancel();
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </form>
  );
};

export default NewPasswordForm;
