'use client';
import { fetchAuthSession } from 'aws-amplify/auth';
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
      console.log('session after fetchsession: ', session);
      if (accessToken) {
        const idTokenPayload = session.tokens?.idToken?.payload;
        console.log('accessToken: ', accessToken?.payload);
        console.log('idtoken: ', idTokenPayload);
        setAuthenticated(true);
        setUserInfo({
          email: idTokenPayload?.email as string,
          name: idTokenPayload?.name as string,
          groups: (idTokenPayload?.['cognito:groups'] as string[]) ?? null,
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
  }, [setAuthenticated, setUserInfo, setLoading]);
  return hydrate;
};
