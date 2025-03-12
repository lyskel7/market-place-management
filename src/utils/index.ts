export const extractIdFromDynamoDBKey = (dynamodbKey: string): string => {
  return dynamodbKey.split('#')[1];
};

export const urlParamsFromObject = (obj: object): string => {
  const cleanParams = new URLSearchParams();
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleanParams.append(key, value);
    }
  }
  return cleanParams.toString();
};
