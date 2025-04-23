import { IApiResponse } from '@/lib/interfaces';
import { AuthSession } from 'aws-amplify/auth';
import { NextResponse } from 'next/server';

type TCookieOptions = {
  path?: string;
  domain?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  expires?: Date;
};

type TCookie = {
  name: string;
  value: string;
  options: TCookieOptions;
  // {
  //   httpOnly: boolean;
  //   secure: boolean;
  //   path: string;
  //   sameSite: string;
  // }
};

/**
 * Successful response with cookies set optional
 */
export function successResponse<T>(
  data: T,
  message = 'Operation successful',
  statusCode = 200,
  cookies?: TCookie[],
  // cookies?: { name: string; value: string; options?: TCookie }[],
) {
  console.log('obj api response: ', data);
  const response = NextResponse.json<IApiResponse<T>>(
    {
      success: true,
      message,
      internalData: data,
      statusCode,
    },
    { status: statusCode },
  );

  if (cookies && cookies.length) {
    cookies.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });
  }

  return response;
}

/**
 * Error response without cookies set
 */
export function errorResponse(
  message = 'Something went wrong',
  statusCode = 500,
) {
  return NextResponse.json<IApiResponse<null>>(
    {
      success: false,
      message,
      internalData: null,
      statusCode,
    },
    { status: statusCode },
  );
}

/**
 * Setting cookies on backend
 */
export const settingCookies = (session: AuthSession) => {
  const cookies: TCookie[] = [];
  const idToken = session.tokens?.idToken?.toString();
  const accessToken = session.tokens?.accessToken.toString();

  if (idToken) {
    cookies.push({
      name: 'token',
      value: idToken,
      options: {
        httpOnly: true,
        secure: true,
        path: '/',
        sameSite: 'lax',
      },
    });
  }

  if (accessToken) {
    cookies.push({
      name: 'accessToken',
      value: accessToken,
      options: {
        httpOnly: true,
        secure: true,
        path: '/',
        sameSite: 'lax',
      },
    });
  }
  return cookies;
};
