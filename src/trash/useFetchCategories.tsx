import { useCallback, useEffect, useState } from 'react';
import { ETypes, ICategory } from '../lib/interfaces';
import useDBApi from './useDBApi';

export type TFetchCategory = {
  categories: ICategory[];
  loading: boolean;
  error: string | null | undefined;
  refetch: VoidFunction;
};

const useFetchCategories = (): TFetchCategory => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>();
  const [trigger, setTrigger] = useState<boolean>(false);
  const { getItems } = useDBApi();

  const fetchCategories = useCallback(async () => {
    try {
      const categories = await getItems(ETypes.CATEGORY);
      const filteredCat = categories.filter((cat) => cat.SK === 'subcategory#');
      setCategories(filteredCat || []);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : null);
    } finally {
      setLoading(false);
    }
  }, [getItems]);

  const refetch = () => {
    setLoading(true);
    setTrigger((prev) => !prev);
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories, trigger]);

  return { categories, loading, error, refetch };
};

export default useFetchCategories;
