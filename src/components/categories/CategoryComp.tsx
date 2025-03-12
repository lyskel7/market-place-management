'use client';
import { deleteItems, updateItem } from '@/lib/apis/db';
import { ETypes } from '@/lib/enums';
import useResponsive from '@/lib/hooks/useResponsive';
import {
  ICategory,
  IPaginatedResult,
  IURLDeleteParams,
} from '@/lib/interfaces';
import { useCategoryStore } from '@/lib/stores';
import { extractIdFromDynamoDBKey } from '@/utils';
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
import { InfiniteData, QueryObserverResult } from '@tanstack/react-query';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';
import MuiIconRender from '../common/MuiIconRender';
import ConfirmationDialog from '../common/Snackbar';

type TProps = {
  category: ICategory;
  ref: ((node: HTMLLIElement | null) => void) | null;
  onRefetch: () => Promise<
    QueryObserverResult<
      InfiniteData<IPaginatedResult<ICategory>, unknown>,
      Error
    >
  >;
};

const CategoryComp = (props: TProps) => {
  const { category, ref, onRefetch } = props;
  const {
    PK,
    SK,
    category: category_name,
    category_desc,
    icon,
    hidden,
  } = category;
  const { isMobile } = useResponsive();
  const [checked, setChecked] = useState(hidden);
  const [open, setOpen] = useState(false);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const editCategory = useCategoryStore(useShallow((state) => state.onEdit));

  const handleClick = () => {
    setOpen(!open);
  };

  const handleOnChangeChecked = async ({
    target: { checked },
  }: ChangeEvent<HTMLInputElement>) => {
    setChecked(checked);
    try {
      const updatedCategory: Partial<ICategory> = {
        PK,
        SK,
        hidden: checked,
      };
      await updateItem(updatedCategory);
      onRefetch();
    } catch (error) {
      console.debug('Category could not be updated', error);
      toast.error(`Category could not be updated`);
    }
  };

  const handleDelete = async () => {
    try {
      const urlDeleteParam: IURLDeleteParams = {
        type: ETypes.CATEGORY,
        pk: extractIdFromDynamoDBKey(PK),
      };

      await deleteItems(urlDeleteParam);
      toast.success('Category removed');
      onRefetch();
    } catch (error) {
      console.debug('Error while deleting: ', error);
      toast.error('Error while deleting. Try later');
    }
  };

  const handleConfirmDelete = () => {
    setOpenConfirmationDialog(true);
  };

  const handleSetUpdateCategory = () => {
    editCategory(category);
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
        key={PK}
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
                  id={`switch-hidden-${PK}`}
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
        <ListItemAvatar>
          <Avatar>
            <MuiIconRender iconName={icon} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={category_name}
          secondary={category_desc}
        />
      </ListItem>
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
    </>
  );
};

export default CategoryComp;
