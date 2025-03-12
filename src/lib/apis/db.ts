import { urlParamsFromObject } from '@/utils';
import {
  ICategory,
  IPageParams,
  IPaginatedResult,
  IURLDeleteParams,
} from '../interfaces';
import AxiosWrapper from '../wrappers/AxiosWrapper';

export const getItems = async (
  urlParams: IPageParams,
): Promise<IPaginatedResult<ICategory>> => {
  const parsedUrl = urlParamsFromObject(urlParams);
  const resp = await AxiosWrapper.getInstance().get<
    IPaginatedResult<ICategory>
  >(`/items?${parsedUrl}`);
  return resp.data;
};

export const createItem = async <T>(
  item: T,
  first?: boolean,
): Promise<boolean> => {
  const path = `?first=${first}`;
  return await AxiosWrapper.getInstance().post<T>(`/items/create${path}`, item);
};

export const updateItem = async <T>(item: T): Promise<boolean> => {
  return await AxiosWrapper.getInstance().patch<T>('/items/update', item);
};

export const deleteItems = async (
  urlParams: IURLDeleteParams,
): Promise<boolean> => {
  const parsedUrl = urlParamsFromObject(urlParams);
  return await AxiosWrapper.getInstance().delete<string>(
    `/items/delete?${parsedUrl}`,
  );
};
