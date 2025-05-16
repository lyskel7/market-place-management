'use client';
import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
import { useAuthStore } from '@/lib/stores/authStore';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

export const useHydrateAuth = () => {
  const { push } = useRouter();
  const setIsHydrating = useAuthStore((state) => state.setIsHydrating);
  const setUserInfo = useAuthStore((state) => state.setUserInfo);
  // const clearAuth = useAuthStore((state) => state.clearAuth);

  const hydrate = useCallback(async () => {
    console.log('useHydrateAuth: HYDRATE FUNCTION CALLED');
    setIsHydrating(true);
    console.log('useHydrateAuth: checking session before fetch');
    try {
      const session = await fetchAuthSession();
      console.log('useHydrateAuth: session after fetchAuthSession:', session);
      const accessToken = session.tokens?.accessToken;
      const idTokenPayload = session.tokens?.idToken?.payload;
      console.log('session after fetchsession: ', session);
      if (accessToken && idTokenPayload) {
        console.log('accessToken: ', accessToken?.payload);
        console.log('idtoken: ', idTokenPayload);
        const userAttr = await fetchUserAttributes();
        console.log(
          'useHydrateAuth: Calling setIsAuthenticated(true) and setUserInfo',
        );
        setUserInfo({
          id: idTokenPayload?.sub as string,
          email: idTokenPayload?.email as string,
          name: idTokenPayload?.name as string,
          // groups: (idTokenPayload?.['cognito:groups'] as string[]) ?? null,
          picture: userAttr?.picture || 'false',
        });
        console.log('👌hydrato');
      } else {
        console.log(
          'useHydrateAuth: No access token or ID token payload, calling clearAuth',
        );
        setUserInfo(null);
      }
    } catch (err) {
      console.error('Error fetching auth session', err);
      console.log('useHydrateAuth: Error occurred, calling clearAuth');
      setUserInfo(null);
      push('/errors');
    } finally {
      setIsHydrating(false);
    }
  }, [setIsHydrating, setUserInfo, push]);
  return hydrate;
};
