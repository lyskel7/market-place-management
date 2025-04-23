import { urlParamsFromObject } from '@/utils/general';
import type {
  IApiResponse,
  ICategoryCounter,
  IPageParams,
  IPaginatedResult,
  IURLDeleteParams,
} from '../interfaces';
import AxiosWrapper from '../wrappers/AxiosWrapper';

export const getItems = async <T>(
  urlParams: IPageParams,
): Promise<IApiResponse<IPaginatedResult<T>>> => {
  const parsedUrl = urlParamsFromObject(urlParams);
  const resp = await AxiosWrapper.getInstance().get<IPaginatedResult<T>>(
    `/items?${parsedUrl}`,
  );
  return resp;
};

export const getTotals = async (): Promise<
  IApiResponse<ICategoryCounter[]>
> => {
  const resp =
    await AxiosWrapper.getInstance().get<ICategoryCounter[]>('/totals');
  console.log('responmse: ', resp);
  return resp;
};

export const createItem = async <T>(
  createItemParam: T,
): Promise<IApiResponse> => {
  const resp = await AxiosWrapper.getInstance().post<T>(
    '/items/create',
    createItemParam,
  );
  return resp;
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
