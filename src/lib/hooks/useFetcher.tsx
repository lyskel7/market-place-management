// import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getItems } from '../apis/db';
import { SCAN_LIMIT } from '../constants/frontend';
import { IPageParams } from '../interfaces';
// import { useShallow } from 'zustand/react/shallow';
// import { useCategoryStore } from '../stores';

const useFetcher = (
  initialPageParam: IPageParams,
  queryKey: string,
  enabled: boolean,
) => {
  console.log('querykey: ', queryKey);
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: async ({ pageParam = initialPageParam }) => {
      const result = await getItems(pageParam);

      console.log('se ejecuto', pageParam);
      console.log('se ejecuto', result);
      console.log('se ejecuto', queryKey);
      return result;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.lastEvaluatedKey) {
        return undefined; // No more pages
      }
      return {
        pk: initialPageParam.pk,
        sk: initialPageParam.sk,
        limit: SCAN_LIMIT,
        ...(lastPage.lastEvaluatedKey
          ? { lastEvaluatedKey: lastPage.lastEvaluatedKey }
          : {}),
      }; // Return lastEvaluatedKey for next page
    },
    enabled,
    retry: false,
    initialPageParam,
    staleTime: 300000, // 5 minutes
  });

  //Flatting the object and getting just items
  const items = data?.pages.flatMap((page) => page.items) || [];

  const itemsSort = () => {
    return items.sort((a, b) => a.itemName.localeCompare(b.itemName));
  };

  return {
    items: itemsSort(),
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    isError,
    refetch,
  };
};

export default useFetcher;
