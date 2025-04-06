// 'use client';
// import { SCAN_LIMIT } from '@/lib/constants/frontend';
// import { ETypes } from '@/lib/enums';
// import useFetcher from '@/lib/hooks/useFetcher';
// import { ICategory } from '@/lib/interfaces';
// import { useCategoryStore } from '@/lib/stores';
// import ReplayIcon from '@mui/icons-material/Replay';
// import {
//   Box,
//   Button,
//   LinearProgress,
//   List,
//   ListItem,
//   ListItemText,
//   Typography,
// } from '@mui/material';
// import { useQueryClient } from '@tanstack/react-query';
// import { useCallback, useEffect, useRef } from 'react';
// import { toast } from 'react-toastify';
// import { useShallow } from 'zustand/react/shallow';
// import CategoryComp from '../categories/CategoryComp';

// const SubcategoriesComp = () => {
//   const { selectedCategory } = useCategoryStore(
//     useShallow((state) => ({
//       selectedCategory: state.selectedCategory,
//     })),
//   );

//   const pk = selectedCategory?.PK || null;

//   const {
//     items,
//     isLoading,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     error,
//     isError,
//     refetch,
//   } = useFetcher(
//     {
//       type: ETypes.SUBCATEGORY,
//       limit: SCAN_LIMIT,
//       ...(pk ? { pk } : {}),
//       lastEvaluatedKey: undefined,
//     },
//     'subcategories',
//   );

//   const { onRefetch } = useCategoryStore(
//     useShallow((state) => ({
//       itemsTotalInDB: state.itemsTotaInDB,
//       onRefetch: state.onRefetch,
//     })),
//   );

//   const queryClient = useQueryClient();

//   const observer = useRef<IntersectionObserver | null>(null);

//   const lastCategoryRef = useCallback(
//     (node: HTMLLIElement | null) => {
//       if (isLoading || isFetchingNextPage) return;

//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver(
//         (entries) => {
//           if (entries[0].isIntersecting && hasNextPage) {
//             fetchNextPage();
//           }
//         },
//         {
//           root: document.querySelector('#scrollableDiv'),
//           rootMargin: '0px',
//           threshold: 1.0,
//         },
//       );

//       if (node) observer.current.observe(node);
//     },
//     [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage],
//   );

//   useEffect(() => {
//     onRefetch(refetch);
//   }, [onRefetch, refetch]);

//   if (isLoading) <LinearProgress />;

//   if (isError) {
//     toast.error(error?.message, {
//       autoClose: false,
//       toastId: 'categoryErrorId',
//     });
//     return;
//   }

//   const subc: ICategory[] = items || [];
//   const handleRefetch = () => {
//     queryClient.removeQueries({ queryKey: ['categories'] }); // Removing cache to get initial params
//     refetch();
//   };

//   return (
//     // <Stack gap={2}>
//     //   <Typography variant="body2">{`Total: ${data.length}`}</Typography>
//     //   <List sx={{ width: 1 }}>
//     //     {data?.map((subc) => (
//     //       <SubcategoryComp
//     //         key={subc.PK}
//     //         subcategory={subc}
//     //       />
//     //     ))}
//     //   </List>
//     // </Stack>
//     <>
//       <Box
//         display={'flex'}
//         justifyContent={'space-between'}
//         alignItems={'center'}
//       >
//         <Typography>Loaded: {items?.length || 0}</Typography>
//         <Button
//           sx={{ alignSelf: 'flex-end' }}
//           onClick={handleRefetch}
//           startIcon={<ReplayIcon />}
//         >
//           Reload
//         </Button>
//       </Box>

//       <List
//         sx={{
//           width: 1,
//           height: 500,
//           id: 'scrollableDiv', //This id is important for intersection in infinite scroll
//           overflow: 'auto',
//         }}
//       >
//         {subc?.map((s, index) => {
//           const isLastElement = subc.length === index + 1;
//           return (
//             <CategoryComp
//               key={s.PK}
//               ref={isLastElement ? lastCategoryRef : null}
//               category={s}
//               onRefetch={refetch}
//             />
//           );
//         })}
//         {isFetchingNextPage && (
//           <ListItem>
//             <ListItemText primary={<LinearProgress />} />
//           </ListItem>
//         )}
//       </List>
//     </>
//   );
// };

// export default SubcategoriesComp;
