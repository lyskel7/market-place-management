// 'use client';
// import useSubcategoriesFetcher from '@/lib/hooks/useSubcategoriesFetcher';
// import { useUpdatedCategoryStore } from '@/lib/stores';
// import { CircularProgress, List, Stack, Typography } from '@mui/material';
// import { useShallow } from 'zustand/react/shallow';
// import SubcategoryComp from './SubcategoryComp';

// const SubcategoriesComp = () => {
//   // const [subcategories, setSubcategories] = useState<ICategory[]>([]);
//   // const [loading, setLoading] = useState(false);
//   const { selectedCategory } = useUpdatedCategoryStore(
//     useShallow((state) => ({
//       selectedCategory: state.selectedCategory,
//     })),
//   );

//   const categoryId = selectedCategory?.PK || null;

//   const { data, error, isLoading } = useSubcategoriesFetcher(categoryId);

//   if (isLoading) {
//     return <CircularProgress />;
//   }

//   if (error) {
//     return <p>Error al cargar subcategorías: {error.message}</p>;
//   }

//   if (!data || data.length === 0) {
//     return <p>No hay subcategorías disponibles para esta categoría.</p>;
//   }

//   return (
//     <Stack gap={2}>
//       <Typography variant="body2">{`Total: ${data.length}`}</Typography>
//       <List sx={{ width: 1 }}>
//         {data?.map((subc) => (
//           <SubcategoryComp
//             key={subc.PK}
//             subcategory={subc}
//           />
//         ))}
//       </List>
//     </Stack>
//   );
// };

// export default SubcategoriesComp;
