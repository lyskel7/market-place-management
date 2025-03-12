// 'use client';
// // import { createItem } from '@/lib/apis/db';
// import { ETypes, ICategory } from '@/lib/interfaces';
// import { useRouter } from 'next/navigation';
// // import { subcategoriesFetcher } from '@/lib/services/dataFetcher';
// import useResponsive from '@/lib/hooks/useResponsive';
// import { customeSchema } from '@/lib/schemas';
// import { useUpdatedCategoryStore } from '@/lib/stores';
// import { joiResolver } from '@hookform/resolvers/joi';
// import AddIcon from '@mui/icons-material/Add';
// import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
// import {
//   Box,
//   Button,
//   InputAdornment,
//   Stack,
//   TextField,
//   Typography,
// } from '@mui/material';
// import { useForm } from 'react-hook-form';
// import { toast } from 'react-toastify';
// import { useShallow } from 'zustand/react/shallow';
// // import { createItem } from '@/lib/apis/db';
// import { v4 } from 'uuid';
// import useSubcategoriesFetcher from '@/lib/hooks/useSubcategoriesFetcher';

// const SubcategoryForm = () => {
//   const { isMobile } = useResponsive();
//   const { selectedCategory, onSelect } = useUpdatedCategoryStore(
//     useShallow((state) => ({
//       selectedCategory: state.selectedCategory,
//       onSelect: state.onSelect,
//     })),
//   );
//   const categoryId = selectedCategory?.PK || null;
//   const { data: subcategories } = useSubcategoriesFetcher(categoryId);

//   const router = useRouter();
//   const {
//     register,
//     handleSubmit,
//     reset,
//     watch,
//     formState: { errors },
//   } = useForm({ resolver: joiResolver(customeSchema('subcategory')) });

//   const subcategoryWatcher = watch('subcategory', '');
//   const subcategoryDescWatcher = watch('subcategory_desc', '');

//   const handleFormReset = () => {
//     reset();
//     onSelect(null);
//   };

//   const existSubcategory = (): boolean => {
//     return (
//       subcategories.some(
//         (sc) =>
//           sc.subcategory.toLowerCase() === subcategoryWatcher.toLowerCase(),
//       ) || false
//     );
//   };

//   const handleOnSubmit = handleSubmit(async (data) => {
//     const { subcategory } = data;

//     if (existSubcategory() && subcategory !== selectedCategory?.subcategory) {
//       toast.error(
//         `Subcategory name '${subcategory}' already in use on category ${selectedCategory?.category}`,
//       );
//       return;
//     }

//     try {
//       const nowDate = new Date().toISOString();

//       const newSubcategory: Partial<ICategory> = {
//         ...selectedCategory,
//         SK: `subcategory#${v4()}`,
//         subcategory: subcategoryWatcher,
//         subcategory_desc: subcategoryDescWatcher,
//         type: ETypes.SUBCATEGORY,
//         updated: nowDate,
//         created: nowDate,
//         // ...(!updateCategory ? categoryBase : {}),
//         hidden: false,
//       };

//       // if (updateCategory) {
//       //   await updateItem(newCategory);
//       // } else {
//       //   await createItem(newCategory);
//       // }

//       if (!selectedCategory?.PK) {
//         toast.error('Select a category to insert the subcategory');
//         return;
//       }

//       // await createItem(newSubcategory);
//       toast.success(
//         // `Category ${updateCategory ? 'updated' : 'inserted'} successfully`,
//         'Subcategory created successfully ' + newSubcategory,
//       );
//       handleFormReset();
//       router.refresh();
//     } catch (error) {
//       console.debug(
//         // `Category could not be ${updateCategory ? 'updated' : 'inserted'}`,
//         `Subcategory could not be created`,
//         error,
//       );
//       toast.error(
//         // `Category could not be ${updateCategory ? 'updated' : 'inserted'}`,
//         `Subcategory could not be created`,
//       );
//     }
//   });

//   // useEffect(() => {
//   //   reset({
//   //     category: updateCategory ? updateCategory?.category : '',
//   //     category_desc: updateCategory ? updateCategory?.category_desc : '',
//   //   });
//   // }, [updateCategory, reset]);

//   return (
//     <form onSubmit={handleOnSubmit}>
//       <Stack
//         gap={1}
//         width={isMobile ? '100%' : '400px'}
//       >
//         <Box
//           display={'flex'}
//           justifyContent={'flex-start'}
//           alignItems={'center'}
//         >
//           <TextField
//             fullWidth
//             error={Boolean(errors.subcategory)}
//             id="subcategory"
//             placeholder="Type the subcategory"
//             variant="outlined"
//             size="small"
//             {...register('subcategory')}
//             slotProps={{
//               input: {
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     {`${(subcategoryWatcher as string).length}/30`}
//                   </InputAdornment>
//                 ),
//               },
//               htmlInput: {
//                 maxLength: 30,
//               },
//             }}
//             helperText={
//               errors.subcategory && Boolean(errors.subcategory)
//                 ? errors.subcategory?.message?.toString()
//                 : null
//             }
//           />
//         </Box>

//         <Box
//           display={'flex'}
//           justifyContent={'flex-start'}
//           alignItems={'center'}
//         >
//           <TextField
//             fullWidth
//             multiline
//             rows={4}
//             error={Boolean(errors.subcategory_desc)}
//             id="subcategory_desc"
//             placeholder="Description"
//             variant="outlined"
//             size="small"
//             {...register('subcategory_desc')}
//             slotProps={{
//               input: {
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <Typography ml={2}>
//                       {`${(subcategoryDescWatcher as string).length}/50`}
//                     </Typography>
//                   </InputAdornment>
//                 ),
//               },
//               htmlInput: {
//                 maxLength: 50,
//               },
//             }}
//             helperText={
//               errors.subcategory_desc && Boolean(errors.subcategory_desc)
//                 ? errors.subcategory_desc?.message?.toString()
//                 : null
//             }
//           />
//         </Box>

//         <Stack
//           direction={'row'}
//           justifyContent={'flex-end'}
//           mr={5}
//         >
//           <Button
//             startIcon={<AddIcon />}
//             type="submit"
//           >
//             {true ? 'Add' : 'Update'}
//           </Button>
//           <Button
//             startIcon={<CleaningServicesIcon />}
//             onClick={handleFormReset}
//             type="reset"
//           >
//             Clean
//           </Button>
//         </Stack>
//       </Stack>
//     </form>
//   );
// };

// export default SubcategoryForm;
