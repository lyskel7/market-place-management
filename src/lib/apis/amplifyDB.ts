import type { IApiResponse, IApiResponseAuthData, IUser } from '../interfaces';
import AxiosWrapper from '../wrappers/AxiosWrapper';

export const getUser = async (
  userParams: IUser,
): Promise<IApiResponse<IApiResponseAuthData | null>> => {
  const res = await AxiosWrapper.getInstance().post<
    IUser,
    IApiResponseAuthData
  >('/auth/signin', userParams);
  return res;
};

export const setNewPassword = async (
  username: string,
  newPassword: string,
): Promise<IApiResponse<IApiResponseAuthData | null>> => {
  const res = await AxiosWrapper.getInstance().post<
    { username: string; newPassword: string },
    IApiResponseAuthData
  >('/auth/new-password', { username, newPassword });
  console.log('res: ', res);
  return res;
};
