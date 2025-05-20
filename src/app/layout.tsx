'use client';
import AmplifyClientInitializer from '@/components/AmplifyClientInitializer';
import AuthGuard from '@/components/auth/guard/AuthGuard';
import { BRANDING } from '@/lib/config/navigation';
import useAvatarUrl from '@/lib/hooks/useAvatarUrl';
import useNavigationDashboard from '@/lib/hooks/useNavigationDashboard';
import ReactQueryProviders from '@/lib/provider/reactqueryProvider';
import { useAuthStore } from '@/lib/stores/authStore';
import theme from '@/styles/theme';
import { signOut } from '@aws-amplify/auth';
import { ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Authentication } from '@toolpad/core/AppProvider';
import { NextAppProvider } from '@toolpad/core/nextjs';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useMemo } from 'react';
import { ToastContainer } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';

export default function RootLayout({ children }: { children: ReactNode }) {
  const NAVIGATION = useNavigationDashboard();
  const { push } = useRouter();
  const { avatarUrl, refreshUrl } = useAvatarUrl();
  const { username, email, avatarUpdate } = useAuthStore(
    useShallow((state) => ({
      username: state.userInfo?.name,
      email: state.userInfo?.email,
      avatarUpdate: state.avatarUpdateTimestamp,
    })),
  );

  const authentication: Authentication = useMemo(() => {
    return {
      signIn: () => {},
      signOut: async () => {
        try {
          await signOut();
          push('/auth/signin');
        } catch (error) {
          console.error('Error during sign out:', error);
        }
      },
    };
  }, []);

  const session = useMemo(() => {
    return {
      user: {
        name: username || '...',
        email: email || '...',
        image: avatarUrl || '',
      },
    };
  }, [username, email, avatarUrl]);

  useEffect(() => {
    refreshUrl(false);
  }, [avatarUpdate]);

  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <AmplifyClientInitializer />
        <ThemeProvider theme={theme}>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ReactQueryProviders>
              <NextAppProvider
                navigation={NAVIGATION}
                branding={BRANDING}
                session={session}
                authentication={authentication}
              >
                <AuthGuard>{children}</AuthGuard>
                {/* <Backdrop
                      open={isSigningOut}
                      sx={{
                        backgroundColor: theme.palette.background.paper,
                        color:
                          theme.palette.mode === 'dark'
                            ? '#fff'
                            : theme.palette.primary.main,
                        zIndex: 9999,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <CircularProgress color="inherit" />
                        <Typography
                          sx={{ mt: 2 }}
                          color="text.primary"
                        >
                          Signing out...
                        </Typography>
                      </Box>
                    </Backdrop> */}
              </NextAppProvider>
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
