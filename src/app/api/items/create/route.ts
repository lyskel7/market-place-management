import { EXTERNAL_BASE_URL } from '@/lib/constants/backend';
import { IBooleanResponse } from '@/lib/interfaces';
import axios, { AxiosResponse } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const requestData = await req.json();

    const response: AxiosResponse<IBooleanResponse<never>> = await axios.post(
      `${EXTERNAL_BASE_URL}/create`,
      requestData,
    );

    return NextResponse.json(response.data);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(`Error inserting element: ${error.message}`);
    }
    return NextResponse.json(`Error unknow: ${error}`);
  }
}

// export async function POST(
//   req: Request,
//   {
//     params,
//   }: {
//     params: Promise<{ slug: string }>;
//   },
// ) {
//   try {
//     const firstElement = (await params).slug;
//     console.log('first: ', firstElement);
//     const pathSegment = firstElement || '';
//     const requestData = await req.json();

//     console.log('pathSegment: ', pathSegment);
//     console.log('requestData: ', requestData);
//     const response: AxiosResponse<IBooleanResponse> = await axios.post(
//       `${EXTERNAL_BASE_URL}/items/create/${pathSegment}`,
//       requestData,
//     );

//     return NextResponse.json(response.data);
//     // return NextResponse.json(null);
//   } catch (error) {
//     if (error instanceof Error) {
//       return NextResponse.json(`Error inserting element: ${error.message}`);
//     }
//     return NextResponse.json(`Error unknow: ${error}`);
//   }
// }
