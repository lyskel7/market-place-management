'use client';
import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
import { useAuthStore } from '@/lib/stores/authStore';
import { useCallback } from 'react';

export const useHydrateAuth = () => {
  const { setAuthenticated, setLoading, setUserInfo } = useAuthStore();

  const hydrate = useCallback(async () => {
    setLoading(true);
    try {
      console.log('chicking before fetchsession');
      const session = await fetchAuthSession();
      const accessToken = session.tokens?.accessToken;
      const idTokenPayload = session.tokens?.idToken?.payload;
      console.log('session after fetchsession: ', session);
      if (accessToken && idTokenPayload) {
        console.log('accessToken: ', accessToken?.payload);
        console.log('idtoken: ', idTokenPayload);
        const userAttr = await fetchUserAttributes();
        setAuthenticated(true);
        setUserInfo({
          email: idTokenPayload?.email as string,
          name: idTokenPayload?.name as string,
          groups: (idTokenPayload?.['cognito:groups'] as string[]) ?? null,
          picture: userAttr?.picture || 'false',
        });
        console.log('👌hydrato');
      } else {
        setAuthenticated(false);
        setUserInfo(null);
      }
    } catch (err) {
      console.error('Error fetching auth session', err);
      setAuthenticated(false);
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setAuthenticated, setUserInfo]);
  return hydrate;
};
