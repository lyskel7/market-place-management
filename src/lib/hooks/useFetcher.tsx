import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { getItems } from '../apis/db';
import { SCAN_LIMIT } from '../constants/frontend';
import { IPageParams, IPaginatedResult } from '../interfaces';

export type FetchFn<T> = (params: IPageParams) => Promise<IPaginatedResult<T>>;

interface IUseFetcherProps<T> {
  initialPageParam: IPageParams; // Initial params for first page
  queryKey: QueryKey; // QueryKey key type
  fetchFn?: FetchFn<T>; // Specific function to get generic data T
  enabled?: boolean; // Controlling if query run automatically
  staleTime?: number; // Time before data are "stale"
}

function useFetcher<T>({
  initialPageParam,
  queryKey,
  enabled,
}: IUseFetcherProps<T>) {
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
  } = useInfiniteQuery<
    IPaginatedResult<T>, // TQueryFnData: Lo que devuelve tu queryFn
    Error, // TError: Tipo del error
    InfiniteData<IPaginatedResult<T>>, // TData: Tipo de cada página individual en 'data.pages'
    QueryKey, // TQueryKey
    IPageParams // TPageParam: Tipo de pageParam
  >({
    queryKey,
    queryFn: async ({ pageParam = initialPageParam }) => {
      const { internalData } = await getItems<T>(pageParam);

      if (!internalData) {
        throw new Error('Failed to fetch data: internalData is null');
      }

      return internalData;
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
  const items = data?.pages.flatMap((page) => page.items) ?? [];

  // const itemsSort = () => {
  //   return items.sort((a, b) => a.itemName.localeCompare(b.itemName));
  // };

  return {
    items,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    isError,
    refetch,
  };
}

export default useFetcher;
