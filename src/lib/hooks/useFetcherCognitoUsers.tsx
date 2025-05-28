import { useQuery } from '@tanstack/react-query';
import { getUsers, SchemaType } from '../apis/amplifyDB';

type TotalsQueryKey = [string];

const useFetcherCognitoUsers = () => {
  const { data, isError, error, isLoading, refetch } = useQuery<
    SchemaType[],
    Error,
    SchemaType[],
    TotalsQueryKey
  >({
    queryKey: ['cognito_users'],
    queryFn: async () => {
      const response = await getUsers();
      console.log('internalData: ', response);
      if (!response) {
        throw new Error('Failed to fetch data: internalData is null');
      }
      return response;
    },
    staleTime: 120000,
  });

  return {
    data: data || [],
    isLoading,
    isError,
    error,
    refetch,
  };
};

export default useFetcherCognitoUsers;
