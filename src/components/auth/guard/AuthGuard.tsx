'use client';
import { ReactNode, useEffect } from 'react';
import { Hub } from 'aws-amplify/utils';
import { useAuthStore } from '@/lib/stores/authStore';
import { useShallow } from 'zustand/react/shallow';
import { useHydrateAuth } from '@/lib/hooks/useHydrateAuth';
import { usePathname, useRouter } from 'next/navigation';

// const PUBLIC_PATHS = ['/otro-publico'];
const AUTH_PATHS = ['/auth/signin', '/auth/signup', '/auth/forgot-password']; // etc.
const ROOT_PATH_POST_LOGIN = '/';

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const { push } = useRouter();
  const { isAuth, userInfo, isHydrating, clearAuth } = useAuthStore(
    useShallow((state) => ({
      isAuth: state.isAuth,
      isHydrating: state.isHydrating,
      userInfo: state.userInfo,
      clearAuth: state.clearAuth,
    })),
  );

  const hydrate = useHydrateAuth();

  useEffect(() => {
    console.info(
      '🍺AuthGuard: Component mounted, attempting initial hydration.',
    );
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const hubListenerCancel = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
        case 'tokenRefresh':
          hydrate();
          console.info(
            '🍺AuthGuard Hub: Auth event indicating active session. Re-hydrating.',
          );
          break;
        case 'signedOut':
          clearAuth();
          console.info('🍺AuthGuard Hub: Signed out. Clearing auth state.');
          break;
      }
    });

    return () => {
      console.info('🍺AuthGuard: Cleaning up Hub listener.');
      hubListenerCancel();
    };
  }, [hydrate, clearAuth]);

  // useEffect(() => {
  //   if (isHydrating) {
  //     console.info(
  //       '🍺AuthGuard Effect (Redirection): Still hydrating, waiting...',
  //     );
  //     return; // Don't doing anything until finish hydrating
  //   }

  //   console.info(
  //     `🍺AuthGuard Effect (Redirection): Post-hydration. isAuth: ${isAuth}, pathname: ${pathname}`,
  //   );

  //   const isAuthPath = AUTH_PATHS.some((p) => pathname.startsWith(p));

  // if (!isAuth) {
  //   // if (!isAuthPath) {
  //   //   console.info(
  //   //     `🍺AuthGuard Effect (Redirection): Not authenticated and not on auth/public path. Redirecting to ${AUTH_PATHS[0]}.`,
  //   //   );
  //   //   push(AUTH_PATHS[0]); // Redirecting signin page
  //   // }
  //   // } else {
  //   //   // Está en una ruta de autenticación o pública, permitir
  //   //   console.info(
  //   //     'AuthGuard Effect (Redirection): Not authenticated but on auth/public path. Allowing.',
  //   //   );
  //   // }
  // } else {
  // if (isAuthPath) {
  //   console.info(
  //     `🍺AuthGuard Effect (Redirection): Authenticated but on auth path. Redirecting to ${ROOT_PATH_POST_LOGIN}.`,
  //   );
  //   push(ROOT_PATH_POST_LOGIN); // Redirecting after login to dashboard
  // } else {
  //   // Authenticated, on an allowed route, then redirecting auth role-based
  //   console.info(
  //     `🍺AuthGuard Effect (Redirection): Authenticated. Path ${pathname} allowed.`,
  //   );
  //   // Ejemplo de lógica de roles (simplificado):
  //   // const userRole = userInfo?.groups?.[0];
  //   // if (pathname.startsWith('/admin') && userRole !== 'admin') {
  //   //   push('/access-denied'); // O a la página principal
  //   // }
  // }
  // }
  // }, [isAuth, isHydrating, pathname, push, userInfo]);

  // 4. Renderizado condicional
  // if (isAuth && isHydrating) {
  //   console.info('🍺AuthGuard Render: Hydrating...');
  //   return <div>Cargando Sesión de Usuario...</div>;
  // }

  console.info(
    `🍺AuthGuard Render: Hydration complete. isAuth: ${isAuth}. Rendering children for ${pathname}.`,
  );
  return <>{children}</>;
};

// 'use client';
// import { ReactNode, useEffect } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import { Hub } from 'aws-amplify/utils';
// import { useAuthStore } from '@/lib/stores/authStore';
// import { useShallow } from 'zustand/react/shallow';
// import { useHydrateAuth } from '@/lib/hooks/useHydrateAuth';

// const AuthGuard = ({ children }: { children: ReactNode }) => {
//   const { push } = useRouter();
//   const pathname = usePathname();
//   const { isAuth, isHydrating, setIsHydrating, clearAuth } = useAuthStore(
//     useShallow((state) => ({
//       isAuth: state.isAuth,
//       isHydrating: state.isHydrating,
//       userInfo: state.userInfo,
//       setIsHydrating: state.setIsHydrating,
//       clearAuth: state.clearAuth,
//     })),
//   );

//   const hydrate = useHydrateAuth();

//   useEffect(() => {
//     console.log('AuthGuard: Attempting initial hydration.');
//     hydrate();
//   }, [hydrate]);

//   useEffect(() => {
//     console.log(
//       `AuthGuard Logic: isHydrating=${isHydrating}, isAuth=${isAuth}, pathname=${pathname}`,
//     );
//     // 1. Resolving authentication
//     if (isHydrating) {
//       console.log('AuthGuard: Still hydrating, waiting...');
//       return;
//     }

//     // 2. Handling unauthenticated users take redirecting to login
//     if (!isAuth) {
//       if (!pathname.startsWith('/auth')) {
//         console.log(
//           'ClientAuthGuard: Not authenticated, redirecting to signin.',
//         );
//         push('/auth/signin');
//       } else {
//         console.log(
//           'AuthGuard: Not authenticated, but on an /auth path. Allowing.',
//         );
//       }
//       return;
//     }

//     if (pathname.startsWith('/auth')) {
//       console.log(
//         'AuthGuard: Authenticated and on /auth path, redirecting to /.',
//       );
//       push('/');
//     } else {
//       // Aquí es donde está autenticado y NO está en una ruta /auth.
//       // Esta es la condición principal para permitir children.
//       // Puedes añadir tu lógica de roles aquí.
//       // Por ahora, asumimos que si está autenticado y no en /auth, tiene permiso.
//       console.log(`AuthGuard: Authenticated, path ${pathname} is allowed.`);
//     }

//     // Aquí puedes añadir tu lógica de autorización por roles si pathname NO es /auth/*
//     // Ejemplo (descomentado y simplificado de tu código original):
//     // const role = userInfo?.groups?.[0];
//     // console.log(`AuthGuard: Authenticated. Current path: ${pathname}, Role: ${role}`);
//     // if (pathname.startsWith('/') && role) { // Asumimos que el dashboard y otras rutas protegidas empiezan con /
//     //   // Aquí iría tu lógica de pagePermissions y allNavigationPages
//     //   // const hasAccess = ... tu lógica ...
//     //   // if (hasAccess) {
//     //   //   console.log(`AuthGuard: Role access to ${pathname} GRANTED.`);
//     //   // } else {
//     //   //   console.warn(`AuthGuard: Role '${role}' access to ${pathname} DENIED. Redirecting to / (o una página de acceso denegado).`);
//     //   //   push('/'); // O a una página de 'acceso denegado'
//     //   // }
//     // }
//     // Si no hay lógica de roles o la ruta es permitida, no hagas nada, permite el acceso.
//     // console.log(
//     //   `AuthGuard: Authenticated, path ${pathname} is allowed or role check passed.`,
//     // );
//     // }
//   }, [isAuth, isHydrating, pathname, push]); // userInfo es dependencia si usas roles

//   // 4. If user authenticated and path is dashboard - Verifying by roles
//   // if (pathname.startsWith('/')) {
//   //   const role = userInfo?.groups?.[0];
//   //   console.info('role: ', role);

//   //   if (role && pagePermissions[role]) {
//   //     const hasAccess = pagePermissions[role].some((permission) => {
//   //       const path = allNavigationPages.find(
//   //         (page) => page.id === permission.toLowerCase(),
//   //       )?.path;
//   //       return path === pathname;
//   //     });

//   //     if (hasAccess) {
//   //       console.log(`ClientAuthGuard: Role access to ${pathname} GRANTED.`);
//   //       // setIsRouteAuthorized(true);
//   //     } else {
//   //       console.warn(
//   //         `ClientAuthGuard: Role '${role}' access to ${pathname} DENIED. Redirecting to /dashboard.`,
//   //       );
//   //       // router.replace('/dashboard');
//   //       // setIsRouteAuthorized(false);
//   //     }
//   //     return;
//   //   }
//   // }

//   // // 5. Authenticated user on any other path (e.g., /settings, /profile, or /page-that-does-not-exist)
//   // console.log(
//   //   `ClientAuthGuard: Authenticated, path ${pathname} is not auth/root/dashboard. Assuming authorized by guard,
//   //   letting Next.js handle page existence.`,
//   // );
//   // setIsRouteAuthorized(true);
//   // }, [isAuthenticated, isHydrating, pathname, router, userInfo?.groups]);
//   // }, [isHydrating]);

//   //Effect for Amplify Hub listener
//   useEffect(() => {
//     const hubListenerCancel = Hub.listen('auth', ({ payload }) => {
//       console.log('Auth event:', payload.event, 'Current path: ', pathname);
//       switch (payload.event) {
//         case 'signedIn':
//           hydrate();
//           console.log('User signed in via Hub, current path:', pathname);
//           console.log('User signed in via Hub, isAuth:', isAuth);
//           console.log(
//             'Hub: signedIn event received. Calling hydrate function.',
//           );
//           break;
//         case 'signedOut':
//           console.log('User signed out via Hub, current path:', pathname);
//           if (!pathname.startsWith('/auth')) {
//             push('/auth/signin');
//           }
//           clearAuth();
//           break;
//       }
//     });

//     return () => {
//       console.log('AuthGuard: Cleaning up Hub listener.');
//       hubListenerCancel();
//     };
//   }, [pathname, hydrate]);

//   if (isHydrating) {
//     console.log('AuthGuard Render: Hydrating...');
//     return <div>Loading User Session... (AuthGuard)</div>;
//   }

//   if (!isAuth && pathname.startsWith('/auth')) {
//     console.log(
//       `AuthGuard Render: Not authenticated, on auth path ${pathname}. Showing children (SignInPage).`,
//     );
//     return <>{children}</>;
//   }

//   if (isAuth && !pathname.startsWith('/auth')) {
//     console.log(
//       `AuthGuard Render: Authenticated, on protected path ${pathname}. Showing children (Dashboard).`,
//     );
//     return <>{children}</>;
//   }

//   // // Casos donde una redirección está pendiente:
//   // // 1. !isAuth y NO está en /auth/* (useEffect lo redirigirá a /auth/signin)
//   // // 2. isAuth y SÍ está en /auth/* (useEffect lo redirigirá a /) <<-- ESTE ES EL CASO POST-LOGIN
//   // console.log(
//   //   `AuthGuard Render: Redirect PENDING for ${pathname} (isAuth: ${isAuth}). Showing Navigation Loader.`,
//   // );
//   // return <div>Loading Navigation... (AuthGuard Loader)</div>; // <--- ESTE LOADER DEBERÍA APARECER
// };

export default AuthGuard;
