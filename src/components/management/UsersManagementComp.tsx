'use client';
import { ROLES } from '@/lib/constants/frontend';
import { ERoles } from '@/lib/enums';
import useCreateUserOptimisticMutation from '@/lib/hooks/useCreateCognitoUserMutation';
import useResponsive from '@/lib/hooks/useResponsive';
import { TProfileValues } from '@/lib/interfaces';
import { userManagementSchema } from '@/lib/schemas';
import { joiResolver } from '@hookform/resolvers/joi';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
} from '@mui/material';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Schema } from '../../../amplify/data/resource';
import { useAuthStore } from '@/lib/stores/authStore';
import useUpdateUserOptimisticMutation from '@/lib/hooks/useUpdateCognitoUserMutation';

type TFormValues = {
  email: string;
  username: string;
  role: string;
};

export type SchemaType = Schema['UsersResponse']['type'];

const UsersManagementComp = () => {
  const { isMobile } = useResponsive();
  const createUserMutation = useCreateUserOptimisticMutation();
  const updateUserMutation = useUpdateUserOptimisticMutation();
  const userForEdit = useAuthStore((state) => state.userForEdit);
  const setUserForEdit = useAuthStore((state) => state.setUserForEdit);
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TFormValues>({
    resolver: joiResolver(userManagementSchema),
    defaultValues: {
      email: '',
      username: '',
      role: '',
    },
  });

  const handleReset = () => {
    setUserForEdit(null);
    reset();
  };

  const handleOnSubmit = handleSubmit(async (data) => {
    // Mapping form data to GraphQL input
    const input: TProfileValues = {
      email: data.email,
      name: data.username,
      profilePicture: 'false',
    };

    // Calling GraphQL mutation
    if (userForEdit) {
      updateUserMutation.mutate({
        ...(userForEdit.groupName !== data.role
          ? { groupName: data.role }
          : {}),
        ...input,
      });
    } else {
      createUserMutation.mutate({
        groupName: data.role || ERoles.VIEWERS,
        ...input,
      });
    }

    reset();
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('Form Validation Errors: ', errors);
    }
  }, [errors]);

  useEffect(() => {
    setValue('username', (userForEdit?.name as string) || '');
    setValue('email', (userForEdit?.email as string) || '');
    setValue('role', (userForEdit?.groupName as string) || '');
  }, [setValue, userForEdit]);

  return (
    <form
      onSubmit={handleOnSubmit}
      noValidate
    >
      <Stack
        justifyContent={'center'}
        alignItems={'center'}
        gap={2}
      >
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              id="email"
              label="Email"
              type="email"
              fullWidth
              error={Boolean(errors.email)}
              variant="outlined"
              size="small"
              value={value}
              onChange={(event) => {
                onChange(event.target.value);
              }}
              helperText={
                errors.email && Boolean(errors.email)
                  ? errors.email?.message?.toString()
                  : null
              }
            />
          )}
        />

        <Controller
          name="username"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              id="username"
              label="User name"
              type="text"
              fullWidth
              error={Boolean(errors.username)}
              variant="outlined"
              size="small"
              value={value}
              onChange={(event) => {
                onChange(event.target.value);
              }}
              helperText={
                errors.username && Boolean(errors.username)
                  ? errors.username?.message?.toString()
                  : null
              }
            />
          )}
        />

        <Controller
          name="role"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              id="autocomplete-role"
              fullWidth
              size="small"
              options={ROLES}
              getOptionLabel={(option) => option}
              isOptionEqualToValue={(option, value) => option === value}
              value={value}
              onChange={(event, newValue) => {
                onChange(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Role"
                />
              )}
            />
          )}
        />
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
            {isSubmitting ? (
              <CircularProgress size={24} />
            ) : userForEdit ? (
              'Edit'
            ) : (
              'Create'
            )}
          </Button>
          <Button
            type="button"
            variant="outlined"
            disabled={isSubmitting}
            fullWidth={isMobile}
            onClick={handleReset}
          >
            {'Reset'}
          </Button>
        </Box>
      </Stack>
    </form>
  );
};

export default UsersManagementComp;
