import CategoriesComp from '@/components/categories/CategoriesComp';
import CategoryForm from '@/components/categories/CategoryForm';
import { Stack } from '@mui/material';
import { ETypes } from '@/lib/enums';

const CategoryPage = () => {
  return (
    <Stack gap={2}>
      <CategoryForm etype={ETypes.CATEGORY} />
      <CategoriesComp
        key={'categoryId'}
        etype={ETypes.CATEGORY}
      />
    </Stack>
  );
};

export default CategoryPage;
