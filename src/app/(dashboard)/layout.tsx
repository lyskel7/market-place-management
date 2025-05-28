'use client';
import AuthGuard from '@/components/auth/guard/AuthGuard';
import { BRANDING } from '@/lib/config/navigation';
import useAvatarUrl from '@/lib/hooks/useAvatarUrl';
import useNavigationDashboard from '@/lib/hooks/useNavigationDashboard';
import ReactQueryProviders from '@/lib/provider/reactqueryProvider';
import { useAuthStore } from '@/lib/stores/authStore';
import { signOut } from '@aws-amplify/auth';
import { Authentication } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { NextAppProvider } from '@toolpad/core/nextjs';
import { PageContainer } from '@toolpad/core/PageContainer';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useMemo } from 'react';
import { ToastContainer } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';

export default function DashboardPagesLayout(props: { children: ReactNode }) {
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
          document.cookie = 'authenticatedCognito=0; path=/; SameSite=Lax';
          // if (isAuth) {
          await signOut();
          push('/auth/signin');
          // } else {
          //   push('/auth/cleaning');
          // }
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
    <ReactQueryProviders>
      <NextAppProvider
        navigation={NAVIGATION}
        branding={BRANDING}
        session={session}
        authentication={authentication}
      >
        <AuthGuard>
          <DashboardLayout>
            <PageContainer>{props.children}</PageContainer>
          </DashboardLayout>
        </AuthGuard>
      </NextAppProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </ReactQueryProviders>
  );
}
