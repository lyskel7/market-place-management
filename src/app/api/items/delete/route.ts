import { EXTERNAL_BASE_URL } from '@/lib/constants/backend';
import { IBooleanResponse } from '@/lib/interfaces';
import axios, { AxiosResponse } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const response: AxiosResponse<IBooleanResponse> = await axios.delete(
      `${EXTERNAL_BASE_URL}/delete?${params.toString()}`,
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.log('error: ', error);
    if (error instanceof Error) {
      return NextResponse.json({
        error: `Error getting category: ${error.message}`,
      });
    }
    return NextResponse.json({ error: `Error unknow: ${error}` });
  }
}
