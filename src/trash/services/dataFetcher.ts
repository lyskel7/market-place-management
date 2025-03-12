// import { extractIdFromDynamoDBKey } from '@/utils';
import { getItems } from '../../lib/apis/db';
import { ETypes, ICategory, IPaginatedResult } from '../../lib/interfaces';

export async function categoriesFetcher(): Promise<
  IPaginatedResult<ICategory>
> {
  return await getItems(ETypes.CATEGORY);
}
