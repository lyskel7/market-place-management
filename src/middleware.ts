import { fetchAuthSession } from 'aws-amplify/auth/server';
import { NextRequest, NextResponse } from 'next/server';
import { runWithAmplifyServerContext } from '@/utils/amplifyServerUtils';
import { allNavigationPages, pagePermissions } from './lib/config/navigation';

const AUTH_PATHS_FOR_UNAUTHENTICATED = [
  '/auth/signin',
  '/auth/forgot-password',
  // '/auth/signup', // Add if signup
];

const AUTH_RELATED_PATHS = [
  // Routes where user can be authenticated
  '/auth/change-password',
  '/auth/unauthorized',
];

const ROOT_PATH_POST_LOGIN = '/';

const closeAppAndCleaningAuthCookie = (request: NextRequest) => {
  const redirectResponse = NextResponse.redirect(
    new URL(AUTH_PATHS_FOR_UNAUTHENTICATED[0], request.url),
  );

  const allCookiesFromRequest = request.cookies.getAll();
  if (allCookiesFromRequest.length > 0) {
    console.log(
      'Middleware: Cookies found in request to be cleared:',
      allCookiesFromRequest.map((c) => c.name),
    );
  } else {
    console.log(
      'Middleware: No cookies found in the current request to clear.',
    );
  }

  allCookiesFromRequest.forEach((cookie) => {
    redirectResponse.cookies.delete({
      name: cookie.name,
    });
  });

  return redirectResponse;
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next(); //Preparing response to continue

  if (
    request.cookies.getAll().length === 0 &&
    pathname !== ROOT_PATH_POST_LOGIN
  ) {
    return response; // No cookies, continue as normal
  }

  const isAuthenticatedCognitoCookie = request.cookies.get(
    'authenticatedCognito',
  );

  // 1. If cookie present with value 0 close app
  if (
    !isAuthenticatedCognitoCookie ||
    isAuthenticatedCognitoCookie?.value === '0'
  ) {
    return closeAppAndCleaningAuthCookie(request);
  }

  // 2. If cookie present with value 1, user is probably registered in Cognito
  const isRegisteredCognito = isAuthenticatedCognitoCookie?.value === '1';

  const startingAuth = AUTH_RELATED_PATHS.some((path) =>
    pathname.startsWith(path),
  );

  //Showing for logs
  console.log(
    `Middleware: Path: ${pathname}, Cookie 'authenticatedCognito' found: ${isRegisteredCognito}`,
  );

  // 3. Checking path before auth
  if (
    !isRegisteredCognito &&
    !AUTH_PATHS_FOR_UNAUTHENTICATED.includes(pathname) &&
    !startingAuth
  ) {
    return closeAppAndCleaningAuthCookie(request);
  }

  // 4. Checking after auth
  if (isRegisteredCognito) {
    // Checking auth using Amplify on the server
    const sessionTokens = await runWithAmplifyServerContext({
      nextServerContext: { request, response }, // It's important through response to Amplify can set cookies if tokens are refreshed
      operation: async (contextSpec) => {
        try {
          const session = await fetchAuthSession(contextSpec);
          return session.tokens;
        } catch (error) {
          // If fetchAuthSession fail (i.e.: there aren't valid tokens or they are expired), consider not auth
          console.error(
            'Middleware auth check error (expected if no session):',
            error,
          );
          return undefined;
        }
      },
    });

    const isAuthenticatedAmplify = !!(
      sessionTokens?.accessToken && sessionTokens?.idToken
    );

    console.log(
      `🌀 Middleware: Path: ${pathname}, Authenticated: ${isAuthenticatedAmplify}`,
    );

    if (!isAuthenticatedAmplify) {
      console.warn(
        "Middleware: 'authenticatedCognito' cookie present, but Amplify fetchAuthSession failed. Redirecting to signin.",
      );

      return closeAppAndCleaningAuthCookie(request);
    }

    // Checking roles
    const idTokenPayload = sessionTokens?.idToken?.payload;
    const groups = (idTokenPayload?.['cognito:groups'] as string[]) ?? [];
    const userPrimaryRole = groups[0];

    if (!userPrimaryRole) {
      console.warn(
        `🔴 Middleware: Authenticated user has no role (cognito:groups). Redirecting to signin for safety.`,
      );
      return closeAppAndCleaningAuthCookie(request);
    }

    console.log(
      `👤 Middleware: User role: ${userPrimaryRole}, Path: ${pathname}`,
    );

    const permissionsForRole = pagePermissions[userPrimaryRole];
    if (!permissionsForRole) {
      console.warn(
        `🔴 Middleware: No permissions defined for role: ${userPrimaryRole}. Redirecting to /auth/signin.`,
      );

      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    const hasAccess = permissionsForRole.some((pageId) => {
      const navigationPage = allNavigationPages.find(
        (nPage) => nPage.id.toUpperCase() === pageId.toUpperCase(),
      );
      if (!navigationPage) return false;

      return navigationPage.children.includes(pathname);
    });

    // Checking if not permission but route existing
    const existRoute = allNavigationPages.some((nPage) =>
      nPage.children.includes(pathname),
    );

    if (!hasAccess && existRoute) {
      console.log(
        `🟡 Middleware: Role ${userPrimaryRole} does not have access to ${pathname}. Redirecting to /auth/unauthorized.`,
      );
      return NextResponse.redirect(new URL('/auth/unauthorized', request.url));
    }

    console.log(
      `🟢 Middleware: Role ${userPrimaryRole} has access to ${pathname}. Allowing.`,
    );
  }

  return response;
}

export const config = {
  // matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], //Matcher default
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - También excluir archivos con extensiones comunes de assets (png, jpg, jpeg, gif, svg, webp, ico, pdf, etc.)
     * - También excluir fuentes (woff, woff2, ttf, eot)
     * - También excluir manifiestos, etc.
     */
    '/((?!api|_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|xml|txt|pdf|woff|woff2|ttf|eot)$).*)',
  ],
};
