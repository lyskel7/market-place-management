import { EXTERNAL_BASE_URL } from '@/lib/constants/backend';
import { ICategory } from '@/lib/interfaces';
import axios, { AxiosResponse } from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const requestData = await req.json();
    const response: AxiosResponse<AxiosResponse<ICategory | null>> =
      await axios.post(`${EXTERNAL_BASE_URL}/create`, requestData);
    return NextResponse.json(response.data);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(`Error inserting category: ${error.message}`);
    }
    return NextResponse.json(`Error unknow: ${error}`);
  }
}
