import { useCallback } from 'react';
import { ETypes, ICategory } from '../lib/interfaces';
import AxiosWrapper from '../lib/wrappers/AxiosWrapper';

const useDBApi = () => {
  const getItems = useCallback(async (type: ETypes): Promise<ICategory[]> => {
    const resp = await AxiosWrapper.getInstance().get<ICategory[]>(
      `/get-items/${type}`,
    );
    return resp.data;
  }, []);

  const createItem = async <T>(item: T): Promise<boolean> => {
    return await AxiosWrapper.getInstance().post<T>('/', item);
  };

  const updateItem = async <T>(item: T): Promise<boolean> => {
    console.log('obj: ', JSON.stringify(item, null, 2));
    return await AxiosWrapper.getInstance().post<T>('/', item);
  };

  const deleteItems = async (
    type: ETypes,
    pk: string,
    sk?: string,
  ): Promise<boolean> => {
    const skey = sk ? `/${sk}` : '';
    return await AxiosWrapper.getInstance().delete<string>(
      `/delete-items/${type}/${pk}${skey}`,
    );
  };

  return {
    getItems,
    createItem,
    updateItem,
    deleteItems,
  };
};

export default useDBApi;
