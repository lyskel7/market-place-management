'use client';
import { deleteItems, updateItem } from '@/lib/apis/db';
import useResponsive from '@/lib/hooks/useResponsive';
import { ICategory, IURLDeleteParams } from '@/lib/interfaces';
import { useCategoryStore } from '@/lib/stores/categoryStore';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
  Avatar,
  Box,
  Button,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Switch,
  Tooltip,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';
import MuiIconRender from './common/MuiIconRender';
import ConfirmationDialog from './common/Snackbar';
import { ETypes } from '@/lib/enums';
import { useQueryClient } from '@tanstack/react-query';

type TProps = {
  category: ICategory;
  etype: ETypes;
  ref: ((node: HTMLLIElement | null) => void) | null;
};

const CategoryComp = (props: TProps) => {
  const { category, ref, etype } = props;
  const { pk, sk, itemName, itemDesc, icon, hidden } = category;
  const { isMobile } = useResponsive();
  const [checked, setChecked] = useState(hidden);
  const [open, setOpen] = useState(false);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const { setItemForEdit, setIsUpdating } = useCategoryStore(
    useShallow((state) => ({
      setIsUpdating: state.setIsUpdating,
      setItemForEdit: state.setItemForEdit,
    })),
  );
  const queryClient = useQueryClient();

  const handleClick = () => {
    setOpen(!open);
  };

  const handleOnChangeChecked = async ({
    target: { checked },
  }: ChangeEvent<HTMLInputElement>) => {
    setChecked(checked);
    try {
      const updatedCategory: Partial<ICategory> = {
        pk,
        sk,
        hidden: checked,
        updated: new Date().toISOString(),
      };
      await updateItem(updatedCategory);
      await queryClient.refetchQueries({ queryKey: [etype] });
    } catch (error) {
      console.debug('Category could not be updated', error);
      toast.error(`Category could not be updated`);
    }
  };

  const handleDelete = async () => {
    try {
      const urlDeleteParam: IURLDeleteParams = {
        pk,
        sk,
      };

      await deleteItems(urlDeleteParam);
      toast.success('Category removed');
      await queryClient.refetchQueries({ queryKey: [etype] });
      await queryClient.invalidateQueries({
        queryKey: ['categories_selector'],
      });
    } catch (error) {
      console.debug('Error while deleting: ', error);
      toast.error('Error while deleting. Try later');
    }
  };

  const handleConfirmDelete = () => {
    setOpenConfirmationDialog(true);
  };

  const handleSetUpdateCategory = () => {
    setItemForEdit(category);
    setIsUpdating(true);
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
        key={pk}
        ref={ref}
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
                title={hidden ? 'Hidden' : 'Unhidden'}
                placement="left-end"
                arrow
              >
                <Switch
                  id={`switch-hidden-${sk}`}
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
        {pk === ETypes.CATEGORY && (
          <ListItemAvatar>
            <Avatar>
              <MuiIconRender iconName={icon} />
            </Avatar>
          </ListItemAvatar>
        )}
        <ListItemText
          primary={itemName}
          secondary={itemDesc}
          // primary={type === ETypes.CATEGORY ? category_name : subcategory_name}
          // secondary={type === ETypes.CATEGORY ? category_desc : subcategory_desc}
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
              <Switch checked={false} />
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

export default CategoryComp;
