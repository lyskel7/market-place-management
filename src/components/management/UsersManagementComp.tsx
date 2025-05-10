'use client';
<<<<<<< HEAD
import type { CreateUserInput } from '@/API';
import { adminCreateUserWithGroup } from '@/graphql/mutations';
import { ROLES } from '@/lib/constants/frontend';
import useResponsive from '@/lib/hooks/useResponsive';
=======
import { ROLES } from '@/lib/constants/frontend';
import { ERoles } from '@/lib/enums';
import useCreateUserOptimisticMutation from '@/lib/hooks/useCreateCognitoUserMutation';
import useResponsive from '@/lib/hooks/useResponsive';
import { TProfileFormValues } from '@/lib/interfaces';
>>>>>>> feature/amplify
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
<<<<<<< HEAD
import { generateClient } from 'aws-amplify/api';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
=======
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Schema } from '../../../amplify/data/resource';
>>>>>>> feature/amplify

type TFormValues = {
  email: string;
  username: string;
  rol: string;
};

<<<<<<< HEAD
const client = generateClient();

const UsersManagementComp = () => {
  const { isMobile } = useResponsive();
=======
export type SchemaType = Schema['UsersResponse']['type'];

const UsersManagementComp = () => {
  const { isMobile } = useResponsive();
  const createUserMutation = useCreateUserOptimisticMutation();
>>>>>>> feature/amplify
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TFormValues>({
    resolver: joiResolver(userManagementSchema),
    defaultValues: {
      email: '',
      username: '',
      rol: '',
    },
  });

  const handleOnSubmit = handleSubmit(async (data) => {
<<<<<<< HEAD
    try {
      console.log('Submitting data:', data);

      // Mapping form data to GraphQL input
      const input: CreateUserInput = {
        email: data.email,
        name: data.username,
        groupName: data.rol.toLowerCase(),
      };

      // Calling GraphQL mutation
      const result = await client.graphql({
        query: adminCreateUserWithGroup,
        variables: { input },
      });
      console.log('GraphQL Result:', result);

      if (result.errors && result.errors.length > 0) {
        console.error('GraphQL Errors:', result.errors);
        throw new Error(`GraphQL errors occurred: ${result.errors.join(', ')}`);
      }

      const payload = result.data?.adminCreateUserWithGroup;
      console.log('Payload:', payload);

      if (payload) {
        toast.success(`User ${payload.name} created successfully!`);
        reset();
      } else {
        const errorMessage = 'Failed to create user. Unknown reason.';
        throw new Error(errorMessage);
      }
    } catch (error: unknown) {
      console.error('Error calling adminCreateUserWithGroup mutation:', error);
      // const gqlError = error?.errors?.[0]?.message; // Trying getting GraphQL error message
      const gqlError = error;
      const errorMessage = gqlError || 'An unexpected error occurred.';
      toast.error(errorMessage as string);
    }
=======
    // Mapping form data to GraphQL input
    const input: TProfileFormValues = {
      email: data.email,
      name: data.username,
      groupName: data.rol || ERoles.VIEWERS,
      profilePicture: 'false',
    };

    // Calling GraphQL mutation
    createUserMutation.mutate(input);
>>>>>>> feature/amplify
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('Form Validation Errors: ', errors);
    }
  }, [errors]);

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
        <TextField
          id="email"
          label="Email"
          type="email"
          fullWidth
          error={Boolean(errors.email)}
          variant="outlined"
          size="small"
          {...register('email')}
          helperText={
            errors.email && Boolean(errors.email)
              ? errors.email?.message?.toString()
              : null
          }
        />
        <TextField
          id="username"
          label="User name"
          type="text"
          fullWidth
          error={Boolean(errors.username)}
          variant="outlined"
          size="small"
          {...register('username')}
          helperText={
            errors.username && Boolean(errors.username)
              ? errors.username?.message?.toString()
              : null
          }
        />
        <Controller
          name="rol"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              id="autocomplete-rol"
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
                  label="Rol"
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
            {isSubmitting ? <CircularProgress size={24} /> : 'Create'}
          </Button>
          <Button
            type="button"
            variant="outlined"
            disabled={isSubmitting}
            fullWidth={isMobile}
            onClick={() => reset()}
          >
            {'Reset'}
          </Button>
        </Box>
      </Stack>
    </form>
  );
};

export default UsersManagementComp;
