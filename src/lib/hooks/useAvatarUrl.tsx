'use client';
import { getUrl, GetUrlWithPathInput } from 'aws-amplify/storage';
import { URL_EXPIRES_IN_SECONDS } from '../constants/frontend';
import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'react-toastify';

interface IUseAvatarUrlResult {
  avatarUrl: string | null; // Cambiado a null para indicar "no disponible"
  isLoading: boolean;
  error: Error | null;
  refreshUrl: (showLoading?: boolean) => Promise<void>; // Función para refrescar
}

const useAvatarUrl = (): IUseAvatarUrlResult => {
  const userInfo = useAuthStore((state) => state.userInfo);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUrl = useCallback(
    async (showLoading = false) => {
      console.log('user info: ', userInfo);
      if (!userInfo || userInfo.picture === 'false') {
        setAvatarUrl(null);
        setError(null);
        setIsLoading(false);
        return;
      }

      if (showLoading) setIsLoading(true); // Mostrar loading solo si se pide
      setError(null);

      try {
        const inputGet: GetUrlWithPathInput = {
          path: ({ identityId }) => `private/${identityId}/avatar`,
          options: {
            expiresIn: URL_EXPIRES_IN_SECONDS, // Time in seconds for the presigned URL to expire
            validateObjectExistence: true,
          },
        };

        const urlResult = await getUrl(inputGet);
        console.log('Avatar URL fetched:', urlResult.url.toString());
        setAvatarUrl(urlResult.url.toString());
      } catch (err) {
        toast.error(`Error fetching avatar URL: ${(err as Error).message}`);
        // console.error('useAvatarUrl: Error fetching URL:', err);
        setError(err as Error);
        setAvatarUrl(null);
      } finally {
        if (showLoading) setIsLoading(false);
      }
    },
    [userInfo],
  );

  useEffect(() => {
    if (userInfo) {
      fetchUrl(true); // Showing loading when fetching the URL
    } else {
      // Cleaning state if userInfo is not available or close session
      setAvatarUrl(null);
      setError(null);
      setIsLoading(false);
    }
  }, [userInfo, fetchUrl]);

  return {
    avatarUrl,
    isLoading,
    error,
    refreshUrl: fetchUrl,
  };
};

export default useAvatarUrl;
