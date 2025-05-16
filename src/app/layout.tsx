'use client';
import ReactQueryProviders from '@/lib/provider/reactqueryProvider';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ReactNode, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { useHydrateAuth } from '@/lib/hooks/useHydrateAuth';
import { ThemeProvider } from '@mui/material';
import theme from '@/styles/theme';
import AmplifyClientInitializer from '@/lib/amplify/AmplifyClientInitializer';
import ClientAuthGuard from '@/components/guards/ClientAuthGuard';

export default function RootLayout({ children }: { children: ReactNode }) {
  const hydrateAuth = useHydrateAuth();

  useEffect(() => {
    hydrateAuth();
    console.log('hydratando desde root');
  }, [hydrateAuth]);

  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <AmplifyClientInitializer>
          <ThemeProvider theme={theme}>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
              <ReactQueryProviders>
                <ClientAuthGuard>{children}</ClientAuthGuard>
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                />
              </ReactQueryProviders>
            </AppRouterCacheProvider>
          </ThemeProvider>
        </AmplifyClientInitializer>
      </body>
    </html>
  );
}
