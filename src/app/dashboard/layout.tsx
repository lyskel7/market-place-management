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
import useAvatarUrl from '@/lib/hooks/useAvatarUrl';
import { toast } from 'react-toastify';

const Layout = (props: { children: React.ReactNode }) => {
  const { userInfo, clearAuth, avatarUpdateTimestamp } = useAuthStore();
  const [session, setSession] = useState<Session | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const { avatarUrl, error, refreshUrl } = useAvatarUrl();

  useEffect(() => {
    if (error) {
      toast.error(`Failed to load avatar: ${error.message}`);
      setSession(null);
      return;
    }

    setSession({
      user: {
        name: userInfo?.name || 'No name provided',
        email: userInfo?.email || 'No email provided',
        image: avatarUrl || '',
      },
    });
  }, [avatarUrl, error, userInfo]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshUrl(false); // Refresh the URL when the tab is visible and without loading
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refreshUrl]); // refreshUrl is memoized by useCallback

  // Listening to timestamp in store
  useEffect(() => {
    console.log(
      'Avatar timestamp changed in store, refreshing SessionAccount avatar.',
    );
    refreshUrl(false);
  }, [avatarUpdateTimestamp, refreshUrl]);

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
