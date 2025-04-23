import { useQuery } from '@tanstack/react-query';
import { getTotals } from '../apis/db';
import { ICategoryCounter } from '../interfaces';

type TotalsQueryKey = [string];

const useFetcherTotal = () => {
  const { data, isError, isLoading, refetch } = useQuery<
    ICategoryCounter[],
    Error,
    ICategoryCounter[],
    TotalsQueryKey
  >({
    queryKey: ['Fetcher_totals'],
    queryFn: async () => {
      const response = await getTotals();
      console.log('internalData: ', response);
      if (!response.internalData) {
        throw new Error('Failed to fetch data: internalData is null');
      }
      // console.log('internalData: ', internalData);
      return response.internalData;
    },
    staleTime: 120000,
  });

  return {
    data: data || [],
    isLoading,
    isError,
    refetch,
  };
};

export default useFetcherTotal;
