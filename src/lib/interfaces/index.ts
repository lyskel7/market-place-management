import * as MuiIcons from '@mui/icons-material';
import { ETypes } from '../enums';
import type { AuthSession, SignInOutput } from 'aws-amplify/auth';

export interface ISingleTable {
  pk: string;
  sk: string;
  created: Date | string;
  updated: Date | string;
  hidden: boolean;
}

export interface ICategory extends ISingleTable {
  itemName: string;
  itemDesc: string;
  subItemsCount: number;
  attributes: Array<string> | object | undefined;
  variations: Array<string> | object | undefined;
  icon: keyof typeof MuiIcons;
}

export interface IProfile extends ISingleTable {
  firstname: string;
  lastname: string;
  mobile: string;
  address: string;
}

export type IPaginatedResult<T> = {
  items: T[];
  lastEvaluatedKey: Record<string, string> | undefined;
};

export interface IBooleanResponse<T> {
  success: boolean;
  error?: string;
  result: T;
}

export interface IPageParams {
  pk: string;
  limit: number;
  sk?: string;
  lastEvaluatedKey?: Record<string, string>;
}

export interface ICreateItemParam {
  item: Partial<ICategory>;
  etype: ETypes;
}

export interface ICategoryCounter {
  pk: string;
  count: number;
}

export interface IURLDeleteParams {
  pk: string;
  sk: string;
}

export interface IUser {
  email: string;
  password: string;
}

export interface IApiResponse<T = unknown> {
  success: boolean;
  message: string;
  statusCode: number;
  internalData: T | null;
  error?: string;
}

export type IApiResponseAuthData = {
  signInOutput: SignInOutput;
  session: AuthSession | null;
};

// profile and passwords
export type TPasswordFormValues = {
  newPassword: string;
  confirmedPassword: string;
  oldPassword?: string;
};
