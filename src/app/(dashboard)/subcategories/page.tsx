// 'use client';
import CategoriesComp from '@/components/categories/CategoriesComp';
import CategoryForm from '@/components/categories/CategoryForm';
import CategoriesAutocomplete from '@/components/categories/CategoriesAutocomplete';
import { Stack } from '@mui/material';
import { ETypes } from '@/lib/enums';
// import { useEffect } from 'react';
// import { useShallow } from 'zustand/react/shallow';
// import { useCategoryStore } from '@/lib/stores';
// import { useQueryClient } from '@tanstack/react-query';

const SubcategoriesPage = () => {
  // const queryClient = useQueryClient();
  // const { setType } = useCategoryStore(
  //   useShallow((state) => ({
  //     setType: state.setType,
  //   })),
  // );

  // useEffect(() => {
  //   setType(ETypes.SUBCATEGORY);
  //   // queryClient.invalidateQueries({ queryKey: ['categories'] });
  //   // queryClient.refetchQueries({ queryKey: ['categories'] });
  // }, [setType]);

  return (
    <Stack gap={2}>
      <CategoriesAutocomplete />
      <CategoryForm etype={ETypes.SUBCATEGORY} />
      <CategoriesComp
        key={'subcategoryId'}
        etype={ETypes.SUBCATEGORY}
      />
    </Stack>
  );
};

export default SubcategoriesPage;
