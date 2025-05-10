'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
// import LinearProgress from '@mui/material/LinearProgress';
import SplashScreen from '../common/loaders/SplashScreen';

export const ClientAuthGuard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    console.log(
      `ClientAuthGuard EFFECT: isLoading=${isLoading}, isAuthenticated=${isAuthenticated}, pathname=${pathname}`,
    );
    if (isLoading) {
      console.log('ClientAuthGuard: Store is loading, returning.');
      return;
    }

    if (!isAuthenticated && !pathname.startsWith('/auth')) {
      console.log('ClientAuthGuard: Not authenticated, redirecting to signin.');
      router.replace('/auth/signin');
    } else if (isAuthenticated) {
      console.log('ClientAuthGuard: Authenticated.');
      if (pathname.startsWith('/auth') || pathname === '/') {
        console.log('ClientAuthGuard: On auth path, redirecting to dashboard.');
        router.replace('/dashboard');
      } else {
        console.log('ClientAuthGuard: On protected path, allowing access.');
      }
    } else {
      console.log(
        'ClientAuthGuard: Not authenticated, on auth path, allowing access.',
      );
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const willRedirectToLogin =
    !isLoading && !isAuthenticated && !pathname.startsWith('/auth');
  const willRedirectToDashboard =
    !isLoading &&
    isAuthenticated &&
    (pathname.startsWith('/auth') || pathname === '/');

  // Mostramos el SplashScreen si:
  // 1. El store está cargando (hidratando/verificando sesión).
  // 2. O si una redirección es necesaria basada en el estado actual (previene mostrar el contenido viejo brevemente).
  if (isLoading || willRedirectToLogin || willRedirectToDashboard) {
    console.log(
      `ClientAuthGuard RENDER: Needs redirect or loading. Showing SplashScreen. (isLoading: ${isLoading}, needsRedirectToLogin: ${willRedirectToLogin}, needsRedirectToDashboard: ${willRedirectToDashboard})`,
    );
    return <SplashScreen />;
  }

  console.log(
    `ClientAuthGuard RENDER: Rendering children (isLoading: ${isLoading}, isAuthenticated: ${isAuthenticated}, pathname: ${pathname})`,
  );
  return <>{children}</>;
};
