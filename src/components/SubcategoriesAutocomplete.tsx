'use client';
import { SCAN_LIMIT } from '@/lib/constants/frontend';
import { ETypes } from '@/lib/enums';
import useFetcher from '@/lib/hooks/useFetcher';
import useResponsive from '@/lib/hooks/useResponsive';
import { ICategory, IPageParams } from '@/lib/interfaces';
import { useCategoryStore } from '@/lib/stores';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

const SubcategoriesAutocomplete = () => {
  const { isMobile } = useResponsive();
  const [selectedSubcLocal, setSelectedSubcLocal] =
    useState<Partial<ICategory> | null>(null);
  const { catAutocomplete, selSubc, setSelSubc } = useCategoryStore(
    useShallow((state) => ({
      catAutocomplete: state.catAutocomplete,
      selSubc: state.selSubc,
      setSelSubc: state.setSelSubc,
    })),
  );

  const subcategoryQueryKey = [
    ETypes.VARIATIONS,
    catAutocomplete?.sk || 'not_selected',
  ];

  const initialPageParam: IPageParams = {
    pk: ETypes.SUBCATEGORY,
    limit: SCAN_LIMIT,
    lastEvaluatedKey: undefined,
    sk: catAutocomplete?.sk,
  };

  const { items } = useFetcher({
    initialPageParam,
    queryKey: subcategoryQueryKey,
    enabled: !!catAutocomplete,
  });

  const orderedSubc = (items as ICategory[])?.sort((a, b) =>
    a.itemName.localeCompare(b.itemName),
  );

  const handleChangeSubcategoryValue = (
    event: SyntheticEvent,
    newValue: Partial<ICategory> | null,
  ) => {
    setSelectedSubcLocal(newValue);
    setSelSubc(newValue);
  };

  useEffect(() => {
    if (selSubc && items && items.length > 0) {
      const updatedVersionInQuery = items.find(
        (item) => (item as ICategory).sk === selSubc.sk,
      );

      if (updatedVersionInQuery) {
        console.log(
          'Actualizando selSubc en Zustand desde SubcategoriesAutocomplete por cambio en query',
        );
        setSelSubc(updatedVersionInQuery);
      }
    }

    if (!catAutocomplete && selSubc) {
      setSelectedSubcLocal(null);
      setSelSubc(null);
    }
  }, [items, selSubc, setSelSubc, catAutocomplete]);

  useEffect(() => {
    setSelectedSubcLocal(null);
  }, [catAutocomplete]);

  // Efecto para sincronizar el valor local si cambia en Zustand (menos común, pero por completitud)
  useEffect(() => {
    if (selSubc?.sk !== selectedSubcLocal?.sk) {
      setSelectedSubcLocal(selSubc);
    }
  }, [selSubc, selectedSubcLocal?.sk]);

  return (
    <Autocomplete
      id="autocomplete-subcategories"
      options={orderedSubc || []}
      getOptionLabel={(option) => option.itemName || ''}
      value={selectedSubcLocal}
      onChange={handleChangeSubcategoryValue}
      isOptionEqualToValue={(option, value) => option.pk === value?.pk}
      sx={{ width: isMobile ? '100%' : '400px' }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Subcategories"
        />
      )}
    />
  );
};

export default SubcategoriesAutocomplete;
