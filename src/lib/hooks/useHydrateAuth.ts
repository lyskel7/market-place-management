'use client';
import { IUserInfo, useAuthStore } from '@/lib/stores/authStore';
import {
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
} from 'aws-amplify/auth';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';

export const useHydrateAuth = () => {
  const { setIsAuth, setUserInfo, setIsHydrating, clearAuth } = useAuthStore(
    useShallow((state) => ({
      setIsAuth: state.setIsAuth,
      setUserInfo: state.setUserInfo,
      setIsHydrating: state.setIsHydrating,
      clearAuth: state.clearAuth,
    })),
  );

  const hydrate = useCallback(async () => {
    console.log('useHydrateAuth: HYDRATE FUNCTION CALLED (client-side)');
    setIsHydrating(true);
    try {
      const session = await fetchAuthSession();
      console.log('token: ', session.tokens);
      if (session.tokens) {
        setIsAuth(true);
        const userAttributes = await fetchUserAttributes();
        const idTokenPayload = session.tokens?.idToken?.payload;
        let userId: string | undefined;
        try {
          const cognitoUser = await getCurrentUser();
          userId = cognitoUser.userId;
        } catch (err) {
          console.warn(
            "useHydrateAuth: No current user found via getCurrentUser, 'sub' might be missing.",
            err,
          );
        }
        const populatedUserInfo: IUserInfo = {
          id: userId || userAttributes.sub,
          email: userAttributes.email,
          name: userAttributes.name || userAttributes.email,
          groups: (idTokenPayload?.['cognito:groups'] as string[]) ?? null,
          picture: userAttributes.picture ?? 'false',
        };
        console.log(
          '👌useHydrateAuth client: User authenticated, setting user info:',
          populatedUserInfo,
        );
        setUserInfo(populatedUserInfo);
      } else {
        console.log(
          '❌useHydrateAuth client: No active session, user is not authenticated.',
        );
        setUserInfo(null);
        setIsAuth(false);
      }
    } catch (err) {
      toast.error(`Error during hydration: ${err}`);
      clearAuth();
    } finally {
      setIsHydrating(false);
      console.log('💯useHydrateAuth client: Hydration process finished.');
    }
  }, [setIsHydrating, setUserInfo]);

  return hydrate;
};
