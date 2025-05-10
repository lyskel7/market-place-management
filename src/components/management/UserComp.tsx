'use client';
<<<<<<< HEAD
import { TUser } from '@/API';
import useResponsive from '@/lib/hooks/useResponsive';
=======
import useResponsive from '@/lib/hooks/useResponsive';
import { TProfileFormValues } from '@/lib/interfaces';
import { generateClient } from '@aws-amplify/api';
>>>>>>> feature/amplify
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
  Box,
  Button,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Switch,
  Tooltip,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
<<<<<<< HEAD
import ConfirmationDialog from '../common/Snackbar';

type TProps = {
  user: TUser;
=======
import { toast } from 'react-toastify';
import { Schema } from '../../../amplify/data/resource';
import ConfirmationDialog from '../common/ConfirmationDialog';
import { IInputForDeleteUser, SchemaType } from '@/lib/apis/amplifyDB';
import { useDeleteUserOptimisticMutation } from '@/lib/hooks/useDeleteCognitoUserMutation';

const client = generateClient<Schema>({
  authMode: 'userPool',
});

type TProps = {
  user: SchemaType;
  onRefresh: () => unknown;
>>>>>>> feature/amplify
};

const UserComp = ({ user }: TProps) => {
  const { email, name, enabled } = user;
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const { isMobile } = useResponsive();
  const [open, setOpen] = useState(false);
<<<<<<< HEAD
  // const [checked, setChecked] = useState(hidden);
  const [checked, setChecked] = useState(enabled ?? true);
=======
  const [checked, setChecked] = useState(enabled ?? true);
  const deleteMutation = useDeleteUserOptimisticMutation();
>>>>>>> feature/amplify

  const handleClick = () => {
    setOpen(!open);
  };

  const handleOnChangeChecked = async ({
    target: { checked },
  }: ChangeEvent<HTMLInputElement>) => {
    setChecked(checked);
<<<<<<< HEAD
    // try {
    //   const updatedCategory: Partial<ICategory> = {
    //     pk,
    //     sk,
    //     hidden: checked,
    //     updated: new Date().toISOString(),
    //   };
    //   await updateItem(updatedCategory);
    //   await queryClient.refetchQueries({ queryKey: [etype] });
    // } catch (error) {
    //   console.debug('Category could not be updated', error);
    //   toast.error(`Category could not be updated`);
    // }
  };

  const handleDelete = async () => {
    console.log('handleDelete');
    // try {
    //   const urlDeleteParam: IURLDeleteParams = {
    //     pk,
    //     sk,
    //   };

    //   await deleteItems(urlDeleteParam);
    //   toast.success('Category removed');
    //   await queryClient.refetchQueries({ queryKey: [etype] });
    //   await queryClient.invalidateQueries({
    //     queryKey: ['categories_selector'],
    //   });
    // } catch (error) {
    //   console.debug('Error while deleting: ', error);
    //   toast.error('Error while deleting. Try later');
    // }
  };

  const handleConfirmDelete = () => {
    console.log('handleConfirmDelete');
    // setOpenConfirmationDialog(true);
=======
    try {
      // Mapping form data to GraphQL input
      const input: TProfileFormValues = {
        email: email || '',
        name: name || '',
        enabled: checked,
      };

      const result = await client.mutations.updateUsers(input);
      console.log('GraphQL Result:', result);

      if (result.errors && result.errors.length > 0) {
        console.error('GraphQL Errors:', result.errors);
        throw new Error(`GraphQL errors occurred: ${result.errors.join(', ')}`);
      }

      const payload = result.data;
      console.log('Payload:', payload);

      if (payload) {
        toast.success(
          `User ${payload.name} ${checked ? 'enabled' : 'disabled'} successfully!`,
        );
      } else {
        const errorMessage = 'Failed updating user. Unknown reason.';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.debug('User could not be updated', error);
      toast.error(`User could not be updated`);
    }
  };

  const handleDelete = async () => {
    console.log('Deleting user');
    // Mapping form data to GraphQL input
    const input: IInputForDeleteUser = {
      email: email || '',
      name: name || '',
    };

    if (email) deleteMutation.mutate(input);
  };

  const handleConfirmDelete = () => {
    setOpenConfirmationDialog(true);
>>>>>>> feature/amplify
  };

  const handleSetUpdateCategory = () => {
    // setItemForEdit(category);
    // setIsUpdating(true);
  };

  useEffect(() => {
    if (!isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  return (
    <>
      <ConfirmationDialog
        title="Removing"
<<<<<<< HEAD
        message="Are you sure to remove the category?"
=======
        message={`Are you sure to remove the user: ${name}?`}
>>>>>>> feature/amplify
        open={openConfirmationDialog}
        onOpen={setOpenConfirmationDialog}
        onAccept={handleDelete}
      />
      <ListItem
        key={user.id}
        secondaryAction={
          isMobile ? (
            open ? (
              <IconButton onClick={handleClick}>
                <ExpandLess />
              </IconButton>
            ) : (
              <IconButton onClick={handleClick}>
                <ExpandMore />
              </IconButton>
            )
          ) : (
            <Box
              gap={1}
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Tooltip
                title={checked ? 'Enabled' : 'Disabled'}
                placement="left-end"
                arrow
              >
                <Switch
<<<<<<< HEAD
                  id={`switch-hidden-${user.status}`}
=======
                  id={`switch-hidden-${user.enabled}`}
>>>>>>> feature/amplify
                  checked={checked}
                  onChange={handleOnChangeChecked}
                />
              </Tooltip>

              <Tooltip
                title={'Edit'}
                placement="top"
                arrow
              >
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={handleSetUpdateCategory}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>

              <Tooltip
                title={'Delete'}
                placement="top"
                arrow
              >
                <IconButton
                  onClick={handleConfirmDelete}
                  edge="end"
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )
        }
      >
        <ListItemText
          primary={name}
          secondary={email}
        />
      </ListItem>
      {isMobile && (
        <Collapse
          in={open}
          timeout="auto"
          unmountOnExit
        >
          <List
            component="div"
            disablePadding
          >
            <ListItem sx={{ pl: 4 }}>
              <Switch checked={enabled ?? false} />
              <Button startIcon={<EditIcon />}>Edit</Button>
              <Button
                startIcon={<DeleteIcon />}
                onClick={handleConfirmDelete}
              >
                Delete
              </Button>
            </ListItem>
          </List>
        </Collapse>
      )}
    </>
  );
};

export default UserComp;
