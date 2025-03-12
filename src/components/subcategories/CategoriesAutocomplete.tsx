'use client';
import { ICategory } from '@/lib/interfaces';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
// import { SyntheticEvent, useEffect, useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
import { extractIdFromDynamoDBKey } from '@/utils';
import { useUpdatedCategoryStore } from '@/lib/stores';
import { useShallow } from 'zustand/react/shallow';
import useResponsive from '@/lib/hooks/useResponsive';

type TCategoriesAutocompleteProps = {
  categories: ICategory[];
};

const CategoriesAutocomplete = ({
  categories,
}: TCategoriesAutocompleteProps) => {
  const router = useRouter();
  // const searchParams = useSearchParams();
  // const categoryIdFromUrl = searchParams.get('categoryId');
  const { isMobile } = useResponsive();
  // const [selectedCategory, setSelectedCategory] = useState(
  //   categories.find(
  //     (cat) => extractIdFromDynamoDBKey(cat.PK) === categoryIdFromUrl,
  //   ) || null,
  // );
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null,
  );

  const { onSelect } = useUpdatedCategoryStore(
    useShallow((state) => ({
      // selectedCategory: state.selectedCategory,
      onSelect: state.onSelect,
    })),
  );

  const orderedCategories = categories?.sort((a, b) =>
    a.category.localeCompare(b.category),
  );

  const handleChangeCategoryValue = (
    event: SyntheticEvent,
    newValue: ICategory | null,
  ) => {
    setSelectedCategory(newValue);
    if (newValue) {
      onSelect(newValue);
      console.log('new desde category: ', newValue);
      const id = extractIdFromDynamoDBKey(newValue.PK);
      router.replace(`?categoryId=${id}`, { scroll: false });
    } else {
      router.replace('/subcategories');
    }
  };

  // useEffect(() => {
  //   if (categoryIdFromUrl) {
  //     const foundCategory = categories.find(
  //       (cat) => extractIdFromDynamoDBKey(cat.PK) === categoryIdFromUrl,
  //     );
  //     setSelectedCategory(foundCategory || null);
  //     if (foundCategory) {
  //       onSelect(foundCategory);
  //     }
  //   }
  // }, [categoryIdFromUrl, categories, onSelect]);

  return (
    <Autocomplete
      id="autocomplete-categories"
      options={orderedCategories}
      getOptionLabel={(option) => option.category}
      value={selectedCategory}
      onChange={handleChangeCategoryValue}
      isOptionEqualToValue={(option, value) => option.PK === value?.PK}
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
