'use client';
import useResponsive from '@/lib/hooks/useResponsive';
import { joiResolver } from '@hookform/resolvers/joi';
import AddIcon from '@mui/icons-material/Add';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
import { useForm } from 'react-hook-form';
// import { categorySchema } from '@/lib/schemas';
// import useCategoriesFetcher from '@/lib/hooks/useCategoriesFetcher';
import { ICategory } from '@/lib/interfaces';
import { customeSchema } from '@/lib/schemas';
import { useCategoryStore } from '@/lib/stores';
import * as MuiIcons from '@mui/icons-material';
// import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { v4 } from 'uuid';
import { useShallow } from 'zustand/react/shallow';
import MuiIconDialog from '../common/MuiIconDialog';
import MuiIconRender from '../common/MuiIconRender';
import { ETypes } from '@/lib/enums';
import { createItem, updateItem } from '@/lib/apis/db';

const CategoryForm = () => {
  const { isMobile } = useResponsive();
  const { editedCategory, categories, sRefetch, onEdit } = useCategoryStore(
    useShallow((state) => ({
      editedCategory: state.editedCategory,
      categories: state.categories,
      sRefetch: state.sRefetch,
      onEdit: state.onEdit,
    })),
  );
  const [openIcons, setOpenIcons] = useState(false);
  const [selectedIcon, setSelectedIcon] =
    useState<keyof typeof MuiIcons>('Apps');
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ resolver: joiResolver(customeSchema('category')) });

  const handleFormReset = () => {
    reset();
    setSelectedIcon('Apps');
    onEdit(null);
  };

  const handleOpenIcons = () => {
    setOpenIcons(true);
  };

  const handleIconSelection = (iconName: keyof typeof MuiIcons) => {
    setSelectedIcon(iconName);
  };

  const handleExistCategory = (category: string): boolean => {
    if (!categories?.length) return false;
    return categories.some(
      (cat) => cat.category.toLowerCase() === category.toLowerCase(),
    );
  };

  const handleOnSubmit = handleSubmit(async (data) => {
    const { category, category_desc } = data;

    const existCategory = handleExistCategory(category);
    if (existCategory && category !== editedCategory?.category) {
      toast.error(`Category name '${category}' already in use`);
      return;
    }

    try {
      const nowDate = new Date().toISOString();

      const categoryBase: Partial<ICategory> = {
        type: ETypes.CATEGORY,
        subcategory_desc: '',
        attributes: [],
        variations: [],
        created: nowDate,
      };

      const newCategory: Partial<ICategory> = {
        ...(!editedCategory ? categoryBase : {}),
        PK: editedCategory?.PK || `category#${v4()}`,
        SK: 'subcategory#',
        category: category,
        category_desc: category_desc,
        updated: nowDate,
        hidden: editedCategory?.hidden || false,
        icon: selectedIcon,
      };

      if (editedCategory) {
        await updateItem(newCategory);
        console.log('update');
      } else {
        await createItem(newCategory, true);
      }

      toast.success(
        `Category ${editedCategory ? 'updated' : 'created'} successfully`,
      );
      handleFormReset();
      sRefetch();
    } catch (error) {
      console.debug(
        `Category could not be ${editedCategory ? 'updated' : 'created'}`,
        error,
      );
      toast.error(
        `Category could not be ${editedCategory ? 'updated' : 'inserted'}`,
      );
    }
  });

  useEffect(() => {
    if (editedCategory) {
      setValue('category', editedCategory.category);
      setValue('category_desc', editedCategory.category_desc);
      setSelectedIcon(editedCategory.icon || 'Apps');
    } else {
      setValue('category', '');
      setValue('category_desc', '');
      setSelectedIcon('Apps');
    }
  }, [editedCategory, setValue, setSelectedIcon]);

  return (
    <form onSubmit={handleOnSubmit}>
      <Stack
        gap={1}
        width={isMobile ? '100%' : '400px'}
      >
        <MuiIconDialog
          openIcons={openIcons}
          onOpenIcons={setOpenIcons}
          onSelection={handleIconSelection}
        />
        <Box
          display={'flex'}
          justifyContent={'flex-start'}
          alignItems={'center'}
        >
          <TextField
            fullWidth
            error={Boolean(errors.category)}
            id="category"
            placeholder="Type the category"
            variant="outlined"
            size="small"
            {...register('category')}
            slotProps={{
              htmlInput: {
                maxLength: 30,
              },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      id="btn-muirender"
                      onClick={handleOpenIcons}
                    >
                      <MuiIconRender iconName={selectedIcon} />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            helperText={
              errors.category && Boolean(errors.category)
                ? errors.category?.message?.toString()
                : null
            }
          />
        </Box>

        <Box
          display={'flex'}
          justifyContent={'flex-start'}
          alignItems={'center'}
        >
          <TextField
            fullWidth
            multiline
            rows={4}
            error={Boolean(errors.category_desc)}
            id="category_desc"
            placeholder="Description"
            variant="outlined"
            size="small"
            {...register('category_desc')}
            helperText={
              errors.category_desc && Boolean(errors.category_desc)
                ? errors.category_desc?.message?.toString()
                : null
            }
          />
        </Box>

        <Stack
          direction={'row'}
          justifyContent={'flex-end'}
          mr={5}
        >
          <Button
            startIcon={<AddIcon />}
            type="submit"
          >
            {editedCategory ? 'Update' : 'Add'}
          </Button>
          <Button
            startIcon={<CleaningServicesIcon />}
            onClick={handleFormReset}
            type="reset"
          >
            Clean
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default CategoryForm;
