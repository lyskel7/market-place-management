import { EXTERNAL_BASE_URL } from '@/lib/constants/backend';
import { IBooleanResponse } from '@/lib/interfaces';
import axios, { AxiosResponse } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  try {
    const requestData = await req.json();
    console.log('requestdata', requestData);
    const response: AxiosResponse<IBooleanResponse<never>> = await axios.patch(
      `${EXTERNAL_BASE_URL}/update`,
      requestData,
    );
    return NextResponse.json(response.data);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(`Error updating category: ${error.message}`);
    }
    return NextResponse.json(`Error unknow: ${error}`);
  }
}
