import useResponsive from '@/lib/hooks/useResponsive';
import { unifiedPasswordSchema } from '@/lib/schemas';
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
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export type TFormValues = {
  oldPassword?: string;
  newPassword: string;
  confirmedPassword: string;
};

type TProps = {
  onSubmit: (data: TFormValues) => Promise<void>;
  title: string;
  description: string;
  isLoading: boolean;
  isChangeFirsTime: boolean; //True for changing password, false for stablishing initial password
  onCancel?: () => void;
};

const PasswordComp = (props: TProps) => {
  const {
    onSubmit,
    onCancel,
    title,
    description,
    isLoading,
    isChangeFirsTime,
  } = props;
  const { isMobile } = useResponsive();
  const [visibility, setVisibility] = useState<{ [key: string]: boolean }>({
    oldPassword: false,
    newPassword: false,
    confirmedPassword: false,
  });
  console.log('PasswordComp - isChangeFirsTime prop:', isChangeFirsTime);

  const {
    register,
    handleSubmit,
    reset,
    // setValue,
    formState: { errors, isSubmitting },
  } = useForm<TFormValues>({
    resolver: joiResolver(unifiedPasswordSchema, {
      abortEarly: false, // Set abortEarly to false to get all errors at once
      context: { isChangeFirsTime }, // Pass the isChangeMode prop to the schema context
    }),
    defaultValues: {
      ...(isChangeFirsTime ? {} : { oldPassword: '' }),
      newPassword: '',
      confirmedPassword: '',
    },
  });

  const handlePasswordVisibility = (fieldId: string) => {
    console.log('fieldId: ', fieldId);
    setVisibility((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  // useEffect(() => {
  //   console.log('Form Errors:', errors);
  // }, [errors]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        width={isMobile ? '98%' : 1}
        height={'100vh'}
        display={'flex'}
        justifyContent={isChangeFirsTime ? 'center' : 'flex-start'}
        alignItems={isChangeFirsTime ? 'center' : 'flex-start'}
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
            {title}
            {/* Changing password */}
          </Typography>
          <Typography variant="caption">
            {description}
            {/* Please, type your old password and the new password twice to confirm */}
          </Typography>
          {!isChangeFirsTime && (
            <TextField
              id="oldPassword"
              label="Contraseña Actual" // Puedes hacerlo configurable con props si quieres
              type={visibility['oldPassword'] ? 'text' : 'password'}
              fullWidth
              size="small"
              margin="normal"
              error={Boolean(errors.oldPassword)}
              {...register('oldPassword')} // Registra con el nombre correcto
              disabled={isLoading || isSubmitting} // Usa ambos flags si aplica
              helperText={errors.oldPassword?.message}
              slotProps={{
                input: {
                  endAdornment: (
                    <IconButton
                      aria-label="Toggle old password visibility"
                      edge="end"
                      onClick={() => handlePasswordVisibility('oldPassword')}
                    >
                      {visibility['oldPassword'] ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  ),
                },
              }}
            />
          )}
          <TextField
            id="newPassword"
            label="New password"
            type={visibility['newPassword'] ? 'text' : 'password'}
            fullWidth
            size="small"
            margin="normal"
            error={Boolean(errors.newPassword)}
            disabled={isSubmitting}
            {...register('newPassword')}
            helperText={errors.newPassword?.message}
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    aria-label="Toggle new password visibility"
                    onClick={() => handlePasswordVisibility('newPassword')}
                    disabled={isSubmitting}
                    edge="end"
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
            label="Confirmed password"
            type={visibility['confirmedPassword'] ? 'text' : 'password'}
            fullWidth
            size="small"
            margin="normal"
            error={Boolean(errors.confirmedPassword)}
            {...register('confirmedPassword')}
            disabled={isSubmitting}
            helperText={errors.confirmedPassword?.message}
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    aria-label="Toogle confirmed password visibility"
                    onClick={() =>
                      handlePasswordVisibility('confirmedPassword')
                    }
                    edge="end"
                    disabled={isSubmitting}
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
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Change it!'}
            </Button>
            {!isChangeFirsTime && (
              <Button
                type="button"
                variant="contained"
                color="warning"
                fullWidth
                disabled={isSubmitting}
                onClick={() => {
                  reset();
                  if (onCancel) onCancel();
                }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </form>
  );
};

export default PasswordComp;
