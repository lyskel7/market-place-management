'use client';
import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { useShallow } from 'zustand/react/shallow';
import { useHydrateAuth } from '@/lib/hooks/useHydrateAuth';
import { usePathname } from 'next/navigation';
import ImageLoaderApp from '../ImageLoaderApp';

const AUTH_PATHS = ['/auth/signin', '/auth/change-password']; // '/auth/signup', '/auth/forgot-password', etc.
const ROOT_PATH_POST_LOGIN = '/';

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const { isAuth, openClosing } = useAuthStore(
    useShallow((state) => ({
      isAuth: state.isAuth,
      isHydrating: state.isHydrating,
      userInfo: state.userInfo,
      openClosing: state.openClosing,
    })),
  );

  const hydrate = useHydrateAuth();

  useEffect(() => {
    console.info(
      '🍺AuthGuard: Component mounted, attempting initial hydration.',
    );
    const performHydration = async () => {
      await hydrate();
      console.log('🚁Performing hydration');
      if (useAuthStore.getState().openClosing) {
        useAuthStore.setState({ openClosing: 'none' });
      }
    };
    if (pathname !== '/auth/signin') performHydration();
  }, [hydrate]);

  // useEffect(() => {
  //   const hubListenerCancel = Hub.listen('auth', ({ payload }) => {
  //     switch (payload.event) {
  //       case 'signedIn':
  //       case 'tokenRefresh':
  //         hydrate();
  //         console.info(
  //           '🍺AuthGuard Hub: Auth event indicating active session. Re-hydrating.',
  //         );
  //         break;
  //       case 'signedOut':
  //         clearAuth();
  //         console.info('🍺AuthGuard Hub: Signed out. Clearing auth state.');
  //         break;
  //     }
  //   });

  //   return () => {
  //     console.info('🍺AuthGuard: Cleaning up Hub listener.');
  //     hubListenerCancel();
  //   };
  // }, [hydrate, clearAuth]);

  console.info(
    `🍺AuthGuard Render: Hydration complete. isAuth: ${isAuth}. Rendering children for ${pathname}.`,
  );

  if (
    openClosing === 'closing' &&
    !isAuth &&
    pathname === ROOT_PATH_POST_LOGIN
  ) {
    console.info('🍺AuthGuard Render: Closing app state detected.');
    return <ImageLoaderApp imageStock="leaving" />;
  }

  if (
    openClosing === 'opening' &&
    AUTH_PATHS.some((path) => pathname.startsWith(path))
  ) {
    console.info('🍺AuthGuard Render: Opening app state detected.');
    return <ImageLoaderApp imageStock="opening" />;
  }

  return <>{children}</>;
};

export default AuthGuard;
