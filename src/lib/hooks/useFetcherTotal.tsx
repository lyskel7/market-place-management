import { useQuery } from '@tanstack/react-query';
import { getTotalsByType } from '../apis/db';
import { ETypes } from '../enums';
import { ICategoryCounter } from '../interfaces';

type TotalsQueryKey = [`${ETypes}_totals`, ETypes];

const useFetcherTotal = (eType: ETypes) => {
  const { data, isError, isLoading, refetch } = useQuery<
    ICategoryCounter,
    Error,
    ICategoryCounter,
    TotalsQueryKey
  >({
    queryKey: [`${eType}_totals`, eType],
    queryFn: async ({ queryKey }) => await getTotalsByType(queryKey[1]),
    staleTime: 120000,
  });

  const count = data?.count;

  return {
    count,
    isLoading,
    isError,
    refetch,
  };
};

export default useFetcherTotal;
