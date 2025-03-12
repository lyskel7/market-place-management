import * as MuiIcons from '@mui/icons-material';
import { ETypes } from '../enums';

export interface ISingleTable {
  PK: string;
  SK: string;
  type: ETypes;
  created: Date | string;
  updated: Date | string;
  hidden: boolean;
}

export interface ICategory extends ISingleTable {
  category: string;
  category_desc: string;
  subcategory: string;
  subcategory_desc: string;
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
  itemsCount: number;
};

export interface IBooleanResponse {
  success: boolean;
  error?: string;
}

export interface IPageParams {
  type: ETypes;
  limit: number;
  lastEvaluatedKey?: Record<string, string>;
  pk?: string;
}

export interface IURLDeleteParams {
  type: ETypes;
  pk: string;
  sk?: string;
}

// export type TPageParams = {
//   type: ETypes;
//   limit: number;
//   lastEvaluatedKey: Record<string, string> | undefined;
// };
