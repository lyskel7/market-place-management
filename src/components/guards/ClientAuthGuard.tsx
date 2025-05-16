'use client';
// import { allNavigationPages, pagePermissions } from '@/lib/config/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { usePathname } from 'next/navigation';
import { isValidElement, ReactNode, useEffect } from 'react';
import SplashScreen from '../common/loaders/SplashScreen';

const ClientAuthGuard = ({ children }: { children: ReactNode }) => {
  // const router = useRouter();
  // const userInfo = useAuthStore((state) => state.userInfo);
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const userId = useAuthStore((state) => state.userInfo?.id);

  // const { userInfo, isAuthenticated, isHydrating } = useAuthStore(
  //   useShallow((state) => ({
  //     userInfo: state.userInfo,
  //     isAuthenticated: state.isAuthenticated,
  //     isHydrating: state.isHydrating,
  //   })),
  // );
  const pathname = usePathname();
  // const [isRouteAuthorized, setIsRouteAuthorized] = useState(false);

  // useEffect(() => {
  //   // console.log(
  //   //   `ClientAuthGuard EFFECT: isHydrating=${isHydrating}, isAuthenticated=${isAuthenticated}, pathname=${pathname}`,
  //   // );

  //   // 1. Resolving authentication
  //   if (isHydrating) {
  //     console.log('ClientAuthGuard: Store is loading, authorization pending.');
  //     // setIsRouteAuthorized(false);
  //     return;
  //   }

  // // 2. Handling unauthenticated users take redirecting to login
  // if (!isAuthenticated) {
  //   if (!pathname.startsWith('/auth')) {
  //     console.log(
  //       'ClientAuthGuard: Not authenticated, redirecting to signin.',
  //     );
  //     router.replace('/auth/signin');
  //     // setIsRouteAuthorized(false);
  //   } else {
  //     // On auth route, allow (login/registro)
  //     console.log(
  //       'ClientAuthGuard: Not authenticated, on auth path, allowing access.',
  //     );
  //     // setIsRouteAuthorized(true);
  //   }
  //   return;
  // }

  // // 3. Handling autehnticated users
  // if (pathname.startsWith('/auth') || pathname === '/') {
  //   console.log(
  //     'ClientAuthGuard: Authenticated, on auth/root path, redirecting to dashboard.',
  //   );
  //   router.replace('/dashboard');
  //   // Unauthorized this route because it's will be redirect
  //   // setIsRouteAuthorized(false);
  //   return;
  // }

  // // 4. If user authenticated and path is dashboard - Verifying by roles
  // if (pathname.startsWith('/dashboard')) {
  //   const role = userInfo?.groups?.[0];
  //   console.info('role: ', role);

  //   if (role && pagePermissions[role]) {
  //     const hasAccess = pagePermissions[role].some((permission) => {
  //       const path = allNavigationPages.find(
  //         (page) => page.id === permission.toLowerCase(),
  //       )?.path;
  //       return path === pathname;
  //     });

  //     if (hasAccess) {
  //       console.log(`ClientAuthGuard: Role access to ${pathname} GRANTED.`);
  //       // setIsRouteAuthorized(true);
  //     } else {
  //       console.warn(
  //         `ClientAuthGuard: Role '${role}' access to ${pathname} DENIED. Redirecting to /dashboard.`,
  //       );
  //       // router.replace('/dashboard');
  //       // setIsRouteAuthorized(false);
  //     }
  //     return;
  //   }
  // }

  // // 5. Authenticated user on any other path (e.g., /settings, /profile, or /page-that-does-not-exist)
  // console.log(
  //   `ClientAuthGuard: Authenticated, path ${pathname} is not auth/root/dashboard. Assuming authorized by guard,
  //   letting Next.js handle page existence.`,
  // );
  // setIsRouteAuthorized(true);
  // }, [isAuthenticated, isHydrating, pathname, router, userInfo?.groups]);
  // }, [isHydrating]);

  useEffect(() => {
    if (isHydrating) {
      console.log(
        'ClientAuthGuard EFFECT: Store is hydrating, authorization pending.',
      );
    } else {
      console.log(
        `ClientAuthGuard EFFECT: Hydration complete. isAuthenticated: ${!!userId}, pathname: ${pathname}`,
      );

      // --- Inicio: Depuración de Children ---
      if (isValidElement(children)) {
        // Si children es un solo elemento React
        const childElement = children as React.ReactElement<
          unknown,
          string | React.JSXElementConstructor<unknown>
        >;
        let displayName = 'UnknownComponent';

        if (typeof childElement.type === 'function') {
          // Para componentes de función o clase
          displayName =
            (childElement.type as unknown as string) || 'AnonymousComponent';
        } else if (typeof childElement.type === 'string') {
          // Para elementos DOM como 'div', 'span'
          displayName = childElement.type;
        }
        // Nota: Para componentes envueltos en HOCs (como React.memo, connect),
        // .type podría ser el HOC, y necesitarías acceder a .type.WrappedComponent o similar,
        // lo cual se vuelve más complejo y menos fiable.

        console.log(
          `ClientAuthGuard CHILDREN DEBUG: Pathname: ${pathname}, Child type (approx): ${displayName}`,
          // 'Props of child:', childElement.props // Podrías loguear props, ¡pero puede ser muy verboso!
          // 'Full child element:', childElement // ¡Muy verboso!
        );
      } else if (Array.isArray(children)) {
        console.log(
          `ClientAuthGuard CHILDREN DEBUG: Pathname: ${pathname}, Children is an array of ${children.length} items.`,
        );
        // Podrías iterar y loguear información de cada elemento si es necesario
      } else {
        console.log(
          `ClientAuthGuard CHILDREN DEBUG: Pathname: ${pathname}, Children is not a single React element (type: ${typeof children}).`,
        );
      }
      // --- Fin: Depuración de Children ---
    }
  }, [isHydrating, pathname, children, userId]); // ¡AÑADE children A LAS DEPENDENCIAS DEL useEffect SI QUIERES LOGUEARLO CUANDO CAMBIE!

  // const willRedirectToLogin =
  //   !isHydrating && !isAuthenticated && !pathname.startsWith('/auth');
  // const willRedirectToDashboard =
  //   !isHydrating &&
  //   isAuthenticated &&
  //   (pathname.startsWith('/auth') || pathname === '/');

  // const showSplashScreen =
  //   isHydrating || (!isAuthenticated && !pathname.startsWith('/auth'));
  const showSplashScreen = isHydrating;

  // Mostramos el SplashScreen si:
  // 1. El store está cargando (hidratando/verificando sesión).
  // 2. O si una redirección es necesaria basada en el estado actual (previene mostrar el contenido viejo brevemente).
  // if (isHydrating || willRedirectToLogin || willRedirectToDashboard) {
  //   console.log(
  //     `ClientAuthGuard RENDER: Needs redirect or loading. Showing SplashScreen. (isHydrating: ${isHydrating}, needsRedirectToLogin: ${willRedirectToLogin}, needsRedirectToDashboard: ${willRedirectToDashboard})`,
  //   );
  //   return <SplashScreen />;
  // }

  if (showSplashScreen) {
    // console.log(
    //   `ClientAuthGuard RENDER: SplashScreen (isLoadingAuth: ${isHydrating}, isRouteAuthorized: ${isRouteAuthorized})`,
    // );
    return <SplashScreen />;
  }
  console.log(
    `ClientAuthGuard RENDER: Children (isHydrating: ${isHydrating}, isAuthenticated: ${!!userId}, pathname: ${pathname})`,
  );
  return <>{children}</>;
};

export default ClientAuthGuard;
