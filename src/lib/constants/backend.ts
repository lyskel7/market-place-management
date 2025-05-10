import { Env, Versions } from '../enums';

export const STAGE: string = process.env.STAGE || Env.dev;
export const AWS_API_VERSION = process.env.AWS_API_VERSION || Versions.v1;
export const EXTERNAL_BASE_URL = process.env.EXTERNAL_BASE_URL;
export const INTERNAL_BASE_URL = process.env.NEXT_PUBLIC_INTERNAL_BASE_URL;
export const MARKET_BUCKET = process.env.NEXT_PUBLIC_MARKET_BUCKET;
