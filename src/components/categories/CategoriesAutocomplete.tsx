'use client';
import { ICategory } from '@/lib/interfaces';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCategoryStore } from '@/lib/stores';
import useResponsive from '@/lib/hooks/useResponsive';
import { ETypes } from '@/lib/enums';
import { SCAN_LIMIT } from '@/lib/constants/frontend';
import useFetcher from '@/lib/hooks/useFetcher';
import { useQueryClient } from '@tanstack/react-query';

const CategoriesAutocomplete = () => {
  const queryClient = useQueryClient();
  const { isMobile } = useResponsive();
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null,
  );

  const { items } = useFetcher(
    {
      pk: ETypes.CATEGORY,
      limit: SCAN_LIMIT,
      lastEvaluatedKey: undefined,
    },
    'categories_selector',
    true,
  );

  const { onSelAutocomplete } = useCategoryStore(
    useShallow((state) => ({
      onSelAutocomplete: state.onSelAutocomplete,
    })),
  );

  const orderedCategories = items?.sort((a, b) =>
    a.itemName.localeCompare(b.itemName),
  );

  const handleChangeCategoryValue = (
    event: SyntheticEvent,
    newValue: ICategory | null,
  ) => {
    setSelectedCategory(newValue);
    onSelAutocomplete(newValue);
    queryClient.removeQueries({ queryKey: [ETypes.SUBCATEGORY] });
    queryClient.refetchQueries({ queryKey: [ETypes.SUBCATEGORY] });
  };

  useEffect(() => {
    if (!selectedCategory) onSelAutocomplete(null);
  }, [selectedCategory, onSelAutocomplete]);

  return (
    <Autocomplete
      id="autocomplete-categories"
      options={orderedCategories || []}
      getOptionLabel={(option) => option.itemName}
      value={selectedCategory}
      onChange={handleChangeCategoryValue}
      isOptionEqualToValue={(option, value) => option.pk === value?.pk}
      sx={{ width: isMobile ? '100%' : '400px' }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Categories"
        />
      )}
    />
  );
};

export default CategoriesAutocomplete;
