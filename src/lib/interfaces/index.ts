import * as MuiIcons from '@mui/icons-material';
import { ETypes } from '../enums';

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

export interface IBooleanResponse {
  success: boolean;
  error?: string;
}

export interface IPageParams {
  pk: string;
  limit: number;
  sk?: string;
  lastEvaluatedKey?: Record<string, string>;
}

export interface ICreateItemParam {
  item: Partial<ICategory>;
  // first: boolean;
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

// export type TPageParams = {
//   type: ETypes;
//   limit: number;
//   lastEvaluatedKey: Record<string, string> | undefined;
// };
