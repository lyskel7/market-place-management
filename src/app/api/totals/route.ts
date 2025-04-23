import { EXTERNAL_BASE_URL } from '@/lib/constants/backend';
import { ICategoryCounter } from '@/lib/interfaces';
import { errorResponse, successResponse } from '@/utils/apiResponses';
import axios, { AxiosError, AxiosResponse } from 'axios';

export async function GET() {
  let errorMessage: string;
  let statusCode = 500; //default error
  try {
    const response: AxiosResponse<ICategoryCounter[]> = await axios.get(
      `${EXTERNAL_BASE_URL}/totals`,
    );
    return successResponse(response.data, 'Totals fetched successfully', 200);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      errorMessage = `${axiosError.message}`;
      if (axiosError.response) {
        statusCode = axiosError.response.status;
        errorMessage += ` (Status: ${statusCode})`;
      } else if (axiosError.request) {
        errorMessage += ' No response received';
      } else {
        errorMessage += ' Error setting up the request';
      }
    } else if (error instanceof Error) {
      errorMessage = ` Error getting totals: ${error.message}`;
    } else {
      errorMessage = `Unknown error: ${error}`;
    }
    return errorResponse(errorMessage, statusCode);
  }
}
