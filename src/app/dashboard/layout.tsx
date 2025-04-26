'use client';
import { Authentication, type Session } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { NextAppProvider } from '@toolpad/core/nextjs';
import { PageContainer } from '@toolpad/core/PageContainer';
import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { useRouter } from 'next/navigation';
import { signOut } from 'aws-amplify/auth';
import {
  Backdrop,
  Box,
  CircularProgress,
  Typography,
  useTheme,
} from '@mui/material';
import { BRANDING, NAVIGATION } from '@/lib/constants/navigation-dashboard';

const Layout = (props: { children: React.ReactNode }) => {
  const { userInfo, isAuthenticated, clearAuth } = useAuthStore();
  const [session, setSession] = useState<Session | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    if (isAuthenticated && userInfo) {
      console.log('Dashboard Layout: Auth state updated, setting session.');
      setSession({
        user: {
          name: userInfo.name || 'No name provided',
          email: userInfo.email || 'No email provided',
          image: userInfo.picture,
        },
      });
    } else {
      console.log('Dashboard Layout: Auth state updated, clearing session.');
      setSession(null);
    }
  }, [isAuthenticated, userInfo]);

  const authentication: Authentication = useMemo(() => {
    return {
      signIn: () => {
        setSession(null);
      },
      signOut: async () => {
        setIsSigningOut(true);
        try {
          await signOut();
          clearAuth();
          router.push('/auth/signin');
        } catch (error) {
          console.error('Error during sign out:', error);
          setIsSigningOut(false);
        }
      },
    };
  }, [clearAuth, router]);

  return (
    <NextAppProvider
      navigation={NAVIGATION}
      branding={BRANDING}
      theme={theme}
      session={session}
      authentication={authentication}
    >
      <DashboardLayout>
        <PageContainer>{props.children}</PageContainer>
      </DashboardLayout>
      <Backdrop
        open={isSigningOut}
        sx={{
          backgroundColor: theme.palette.background.paper,
          color:
            theme.palette.mode === 'dark' ? '#fff' : theme.palette.primary.main,
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
      </Backdrop>
    </NextAppProvider>
  );
};

export default Layout;
