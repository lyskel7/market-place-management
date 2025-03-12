'use client';
import CategoriesComp from '@/components/categories/CategoriesComp';
import CategoryForm from '@/components/categories/CategoryForm';
import { Stack } from '@mui/material';

const CategoryPage = () => {
  return (
    <Stack gap={2}>
      <CategoryForm />

      <CategoriesComp />
    </Stack>
  );
};

export default CategoryPage;
