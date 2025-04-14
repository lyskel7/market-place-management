import { urlParamsFromObject } from '@/utils';
import {
  ICategoryCounter,
  IPageParams,
  IPaginatedResult,
  IURLDeleteParams,
} from '../interfaces';
import AxiosWrapper from '../wrappers/AxiosWrapper';
import { ETypes } from '../enums';

export const getItems = async <T>(
  urlParams: IPageParams,
): Promise<IPaginatedResult<T>> => {
  const parsedUrl = urlParamsFromObject(urlParams);
  const resp = await AxiosWrapper.getInstance().get<IPaginatedResult<T>>(
    `/items?${parsedUrl}`,
  );
  return resp.data;
};

export const getTotalsByType = async (
  etype: ETypes,
): Promise<ICategoryCounter> => {
  const resp = await AxiosWrapper.getInstance().get<ICategoryCounter>(
    `/totals?pk=${etype}`,
  );
  console.log('responmse: ', resp.data);
  return resp.data;
};

export const createItem = async <T>(createItemParam: T): Promise<boolean> => {
  return await AxiosWrapper.getInstance().post<T>(
    '/items/create',
    createItemParam,
  );
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
