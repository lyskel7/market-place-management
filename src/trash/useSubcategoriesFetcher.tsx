// import { useQuery } from '@tanstack/react-query';
// import { ETypes, ICategory } from '../interfaces';
// import { extractIdFromDynamoDBKey } from '@/utils';
// import { getItems } from '../apis/db';

// const useSubcategoriesFetcher = (categoryId: string | null) => {
//   const { data, isLoading, error } = useQuery<ICategory[], Error>({
//     queryKey: ['subcategories', categoryId],
//     queryFn: async ({ queryKey }) => {
//       const [, categoryId] = queryKey;

//       if (!categoryId) {
//         return [];
//       }

//       const cleanCategryId = extractIdFromDynamoDBKey(categoryId as string);
//       return await getItems(ETypes.SUBCATEGORY, cleanCategryId);
//     },
//     enabled: !!categoryId,
//   });

//   return { data, isLoading, error };
// };

// export default useSubcategoriesFetcher;
