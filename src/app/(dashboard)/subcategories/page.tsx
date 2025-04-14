import CategoriesComp from '@/components/CategoriesComp';
import CategoryForm from '@/components/CategoryForm';
import CategoriesAutocomplete from '@/components/CategoriesAutocomplete';
import { Stack } from '@mui/material';
import { ETypes } from '@/lib/enums';

const SubcategoriesPage = () => {
  return (
    <Stack gap={2}>
      <CategoriesAutocomplete
        key={ETypes.SUBCATEGORY}
        etype={ETypes.SUBCATEGORY}
      />
      <CategoryForm etype={ETypes.SUBCATEGORY} />
      <CategoriesComp
        key={'subcategoryId'}
        etype={ETypes.SUBCATEGORY}
      />
    </Stack>
  );
};

export default SubcategoriesPage;
