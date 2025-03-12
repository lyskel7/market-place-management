import { useInfiniteQuery } from '@tanstack/react-query';
import { getItems } from '../apis/db';
import { SCAN_LIMIT } from '../constants/frontend';
import { ETypes } from '../enums';
import { IPageParams } from '../interfaces';
import { useShallow } from 'zustand/react/shallow';
import { useCategoryStore } from '../stores';

const initialPageParam: IPageParams = {
  type: ETypes.CATEGORY,
  limit: SCAN_LIMIT,
  lastEvaluatedKey: undefined,
};

const useCategoriesFetcher = () => {
  const { setCategories } = useCategoryStore(
    useShallow((state) => ({
      setCategories: state.setCategories,
    })),
  );

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
    queryKey: ['categories'],
    queryFn: async ({ pageParam = initialPageParam }) => {
      console.log('getparams: ', pageParam);
      const result = await getItems(pageParam);
      setCategories(result.items);
      return result;
    },
    getNextPageParam: (lastPage) => {
      console.log('latpage: ', lastPage);
      //lastPage es el resultado de fetchProducts, debe contener un lastEvaluatedKey
      if (!lastPage || !lastPage.lastEvaluatedKey) {
        return undefined; // No hay más páginas
      }
      return {
        type: ETypes.CATEGORY,
        limit: SCAN_LIMIT,
        ...(lastPage.lastEvaluatedKey
          ? { lastEvaluatedKey: lastPage.lastEvaluatedKey }
          : {}),
      }; // Devuelve lastEvaluatedKey para la siguiente página
    },
    retry: false,
    initialPageParam: initialPageParam,
    staleTime: 300000, // 5 minutes
  });

  return {
    items: data?.pages[0].items.sort((a, b) =>
      a.category.localeCompare(b.category),
    ),
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    isError,
    refetch,
  };
};

export default useCategoriesFetcher;
