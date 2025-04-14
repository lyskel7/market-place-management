'use client';
import { ICategory, IPageParams } from '@/lib/interfaces';
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

const CategoriesAutocomplete = ({ etype }: { etype: ETypes }) => {
  const queryClient = useQueryClient();
  const { isMobile } = useResponsive();
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null,
  );

  const initialPageParam: IPageParams = {
    pk: ETypes.CATEGORY,
    limit: SCAN_LIMIT,
    lastEvaluatedKey: undefined,
  };

  const { items } = useFetcher<ICategory>({
    initialPageParam,
    queryKey: ['categories_selector'],
    enabled: true,
  });

  const { setCatAutocomplete, setSelSubc } = useCategoryStore(
    useShallow((state) => ({
      setCatAutocomplete: state.setCatAutocomplete,
      setSelSubc: state.setSelSubc,
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
    setCatAutocomplete(newValue);
    queryClient.removeQueries({ queryKey: [etype] });
    queryClient.refetchQueries({ queryKey: [etype] });
  };

  useEffect(() => {
    if (!selectedCategory) setCatAutocomplete(null);
    setSelSubc(null);
  }, [selectedCategory, setCatAutocomplete, setSelSubc]);

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
