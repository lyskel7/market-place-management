import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('mioddle');
  const token = request.cookies.get('accessToken')?.value;
  console.log('token: ', token);
  const role = request.cookies.get('role')?.value;
  console.log('role: ', role);

  // No aplicar autenticación a /auth/*
  if (request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (role !== 'superadmins') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
  // matcher: [
  //   /*
  //    * Aplicar middleware a todas las páginas menos a:
  //    * - recursos estáticos (_next, etc)
  //    * - favicon
  //    */
  //   '/((?!_next/static|_next/image|favicon.ico).*)',
  // ],
};

// import { NextRequest, NextResponse } from 'next/server';

// export function middleware(request: NextRequest) {
//   const isAuthenticated = request..get('token'); // o como manejes auth
//   console.log('ayth: ', isAuthenticated);
//   // Si no está logueado y no está en /signin → lo manda a /signin
//   if (
//     !isAuthenticated &&
//     !request.nextUrl.pathname.startsWith('/auth/signin')
//   ) {
//     return NextResponse.redirect(new URL('/auth/signin', request.url));
//   }

//   // Si está logueado y quiere ir a /signin → lo manda al dashboard
//   if (isAuthenticated && request.nextUrl.pathname.startsWith('/auth/signin')) {
//     return NextResponse.redirect(new URL('/', request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     /*
//      * Aplicar middleware a todas las páginas menos a:
//      * - recursos estáticos (_next, etc)
//      * - favicon
//      */
//     '/((?!_next/static|_next/image|favicon.ico).*)',
//   ],
// };
