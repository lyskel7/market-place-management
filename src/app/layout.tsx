'use client';
import ReactQueryProviders from '@/lib/provider/reactqueryProvider';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ReactNode, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { useHydrateAuth } from '@/lib/hooks/useHydrateAuth';
import { configureAmplify } from '@/lib/amplify/amplify';
import { ClientAuthGuard } from '@/components/ClientAuthGuard';
import { ThemeProvider } from '@mui/material';
import theme from '@/styles/theme';

export default function RootLayout(props: { children: ReactNode }) {
  const hydrateAuth = useHydrateAuth();

  useEffect(() => {
    configureAmplify();
  }, []);

  useEffect(() => {
    console.log('hydratando desde root');
    hydrateAuth();
  }, [hydrateAuth]);

  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider theme={theme}>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ReactQueryProviders>
              <ClientAuthGuard>{props.children}</ClientAuthGuard>
              <ToastContainer
                position="top-right"
                autoClose={3000}
              />
            </ReactQueryProviders>
          </AppRouterCacheProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
