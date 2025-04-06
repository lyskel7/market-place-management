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
import { FieldValues, useForm } from 'react-hook-form';
import { ICategory, ICreateItemParam } from '@/lib/interfaces';
import { customeSchema } from '@/lib/schemas';
import { useCategoryStore } from '@/lib/stores';
import * as MuiIcons from '@mui/icons-material';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { v4 } from 'uuid';
import { useShallow } from 'zustand/react/shallow';
import MuiIconDialog from '../common/MuiIconDialog';
import MuiIconRender from '../common/MuiIconRender';
import { ETypes } from '@/lib/enums';
import { createItem, updateItem } from '@/lib/apis/db';
import { useQueryClient } from '@tanstack/react-query';

const CategoryForm = ({ etype }: { etype: ETypes }) => {
  const { isMobile } = useResponsive();
  const {
    selCat,
    categories,
    selAutocomplete,
    isUpdating,
    setIsUpdating,
    onSelCat,
    onSelAutocomplete,
  } = useCategoryStore(
    useShallow((state) => ({
      selCat: state.selCat,
      selAutocomplete: state.selAutocomplete,
      categories: state.categories,
      isUpdating: state.isUpdating,
      onSelAutocomplete: state.onSelAutocomplete,
      setIsUpdating: state.setIsUpdating,
      onSelCat: state.onSelCat,
      setItemsTotalInDB: state.setItemsTotalInDB,
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
  } = useForm({ resolver: joiResolver(customeSchema(etype)) });

  const queryClient = useQueryClient();

  const handleFormReset = useCallback(() => {
    reset();
    setSelectedIcon('Apps');
    onSelCat(null);
    setIsUpdating(false);
  }, [onSelCat, reset, setIsUpdating]);

  const handleOpenIcons = () => {
    setOpenIcons(true);
  };

  const handleIconSelection = (iconName: keyof typeof MuiIcons) => {
    setSelectedIcon(iconName);
  };

  const handleExistElement = (element: string): boolean => {
    let existElement = false;
    let selectedElement = '';

    if (!categories?.length) return false;

    switch (etype) {
      case ETypes.CATEGORY:
      case ETypes.SUBCATEGORY:
        existElement = categories.some(
          (cat) => cat?.itemName?.toLowerCase() === element.toLowerCase(),
        );
        selectedElement = selCat?.itemName || '';
        break;
      default:
        break;
    }

    const result =
      existElement &&
      ((isUpdating && element !== selectedElement) || !isUpdating);
    return result;
  };

  const conformedCategory = (pData: FieldValues): Partial<ICategory> => {
    const justNow = new Date().toISOString();

    const createSKForCategory = () => {
      if (isUpdating && selCat) {
        return selCat?.sk;
      }

      if (etype === ETypes.SUBCATEGORY && selAutocomplete) {
        return selAutocomplete.sk + '_' + v4();
      }

      return v4();
    };

    const conformed: Partial<ICategory> = {
      pk: etype || selCat?.pk,
      sk: createSKForCategory(),
      itemName: pData.itemName,
      itemDesc: pData.itemDesc,
      ...(isUpdating ? {} : { created: justNow }),
      updated: justNow,
      ...(etype === ETypes.SUBCATEGORY ? {} : { icon: selectedIcon }),
      ...(etype === ETypes.CATEGORY
        ? { subItemsCount: selCat?.subItemsCount || 0 }
        : {}),
      hidden: selCat?.hidden || false,
    };
    console.log('conformed: ', conformed);
    console.log('selcat: ', selCat);
    return conformed;
  };

  const handleOnSubmit = handleSubmit(async (data) => {
    console.log('subumit', data);
    if (etype === ETypes.SUBCATEGORY && !selAutocomplete) {
      toast.warning('Select a category');
      return;
    }

    const elementName = data.itemName;

    const existElement = handleExistElement(elementName);
    if (existElement) {
      toast.error(
        `${etype.charAt(0).toUpperCase()}${etype.slice(1)} name '${elementName}' already in use`,
      );
      return;
    }

    try {
      const conformedItem = conformedCategory(data);
      if (isUpdating) {
        await updateItem(conformedItem);
        console.log('conformedItem: ', conformedItem);

        setIsUpdating(false);
      } else {
        const createItemParam: ICreateItemParam = {
          item: conformedItem,
          first: !categories.length,
          etype,
        };
        await createItem(createItemParam);
        console.log('createItem: ', createItemParam);
      }

      toast.success(
        `${etype.charAt(0).toUpperCase()}${etype.slice(1)} ${selCat ? 'updated' : 'created'} successfully`,
      );
      handleFormReset();
      await queryClient.refetchQueries({ queryKey: [etype] });
      await queryClient.invalidateQueries({
        queryKey: ['categories_selector'],
      });
    } catch (error) {
      console.debug(
        `Category could not be ${selCat ? 'updated' : 'created'}`,
        error,
      );
      toast.error(`Category could not be ${selCat ? 'updated' : 'inserted'}`);
    }
  });

  useEffect(() => {
    if (selCat) {
      setValue('itemName', selCat.itemName);
      setValue('itemDesc', selCat.itemDesc);
      setSelectedIcon(selCat.icon || 'Apps');
    } else {
      setValue('itemName', '');
      setValue('itemDesc', '');
      setSelectedIcon('Apps');
    }
  }, [selCat, setValue, setSelectedIcon, etype]);

  useEffect(() => {
    return () => {
      handleFormReset();
      onSelAutocomplete(null);
    };
  }, [handleFormReset, onSelAutocomplete]);

  // useEffect(() => {
  //   console.log('Form Errors:', errors);
  // }, [errors]);

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
            error={Boolean(errors['itemName'])}
            id={'itemName'}
            placeholder={`Type the ${etype}`}
            variant="outlined"
            size="small"
            {...register('itemName')}
            slotProps={{
              htmlInput: {
                maxLength: 30,
              },
              ...(etype === ETypes.CATEGORY
                ? {
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
                  }
                : {}),
            }}
            helperText={
              errors.itemName && Boolean(errors.itemName)
                ? errors.itemName?.message?.toString()
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
            id="itemDesc"
            fullWidth
            multiline
            rows={4}
            error={Boolean(errors.itemDesc)}
            placeholder="Description"
            variant="outlined"
            size="small"
            {...register('itemDesc')}
            name="itemDesc"
            helperText={
              errors.itemDesc && Boolean(errors.itemDesc)
                ? errors.itemDesc?.message?.toString()
                : null
            }
          />
        </Box>

        <Stack
          direction={'row'}
          justifyContent={'flex-end'}
          mr={5}
          width={1}
        >
          <Button
            startIcon={<AddIcon />}
            type="submit"
          >
            {isUpdating ? 'Update' : 'Add'}
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
