'use client';
import { TUser } from '@/API';
import useResponsive from '@/lib/hooks/useResponsive';
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
import ConfirmationDialog from '../common/Snackbar';

type TProps = {
  user: TUser;
};

const UserComp = ({ user }: TProps) => {
  const { email, name, enabled } = user;
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const { isMobile } = useResponsive();
  const [open, setOpen] = useState(false);
  // const [checked, setChecked] = useState(hidden);
  const [checked, setChecked] = useState(enabled ?? true);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleOnChangeChecked = async ({
    target: { checked },
  }: ChangeEvent<HTMLInputElement>) => {
    setChecked(checked);
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
        message="Are you sure to remove the category?"
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
                  id={`switch-hidden-${user.status}`}
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
