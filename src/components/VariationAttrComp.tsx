'use client';
import CategoriesAutocomplete from '@/components/CategoriesAutocomplete';
import SubcategoriesAutocomplete from '@/components/SubcategoriesAutocomplete';
import { ETypes, EVarAttr } from '@/lib/enums';
import useResponsive from '@/lib/hooks/useResponsive';
import { useCategoryStore } from '@/lib/stores';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, List, ListItem, ListItemText, Stack } from '@mui/material';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import VariationInput from './VariationInput';
import useUpdateVarAttr from '@/lib/hooks/useUpdateVarAttr';
import { ICategory } from '@/lib/interfaces';

const VariationAttrComp = ({ varOrAttr }: { varOrAttr: EVarAttr }) => {
  const { isMobile } = useResponsive();

  const { category, subcategory, setSelSubc } = useCategoryStore(
    useShallow((state) => ({
      category: state.catAutocomplete,
      subcategory: state.selSubc,
      setSelSubc: state.setSelSubc,
    })),
  );
  const { mutate } = useUpdateVarAttr(category);

  const handleRemoveVarOrAtt = (valueVarOrAtt: string) => {
    let newValue: string[] = [];

    if (Array.isArray(subcategory?.[varOrAttr])) {
      newValue = subcategory?.[varOrAttr].filter((v) => v !== valueVarOrAtt);
    }

    const itemsToUpdate: Partial<ICategory> = {
      pk: ETypes.SUBCATEGORY,
      sk: subcategory?.sk,
      [varOrAttr]: newValue,
    };
    mutate(itemsToUpdate);
  };

  const items: string[] = Array.isArray(subcategory?.[varOrAttr])
    ? subcategory?.[varOrAttr]
    : [];

  useEffect(() => {
    return () => {
      setSelSubc(null);
    };
  }, [setSelSubc]);

  return (
    <Stack
      gap={2}
      sx={{ width: isMobile ? '100%' : '400px' }}
    >
      <CategoriesAutocomplete
        key={ETypes.VARIATIONS}
        etype={ETypes.VARIATIONS}
      />
      <SubcategoriesAutocomplete />
      <VariationInput varOrAttr={varOrAttr} />

      <List sx={{ width: 1 }}>
        {items.map((item, index) => (
          <ListItem
            key={item + index}
            secondaryAction={
              <IconButton onClick={() => handleRemoveVarOrAtt(item)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Stack>
  );
};

export default VariationAttrComp;
