import { EXTERNAL_BASE_URL } from '@/lib/constants/backend';
import { ICategory, IPaginatedResult } from '@/lib/interfaces';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  let errorMessage: string;
  let statusCode = 500; //default error
  try {
    const params = req.nextUrl.searchParams;
    console.log('sp: ', params);

    const response: AxiosResponse<IPaginatedResult<ICategory> | null> =
      await axios.get(`${EXTERNAL_BASE_URL}/items?${params.toString()}`);
    return NextResponse.json(response.data);
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
      errorMessage = ` Error getting category: ${error.message}`;
    } else {
      errorMessage = `Unknown error: ${error}`;
    }

    return NextResponse.json(
      { error: errorMessage },
      {
        status: statusCode,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}

// export async function PUT(request: Request) {}
// export async function HEAD(request: Request) {}
// export async function OPTIONS(request: Request) {}
