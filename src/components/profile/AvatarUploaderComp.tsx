'use client';

import useAvatarUrl from '@/lib/hooks/useAvatarUrl';
import { TAuthStore, useAuthStore } from '@/lib/stores/authStore';
import {
  fetchAuthSession,
  updateUserAttribute,
  UpdateUserAttributeInput,
} from '@aws-amplify/auth';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  FormLabel,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { uploadData, UploadDataWithPathInput } from 'aws-amplify/storage';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';

const AvatarUploaderComp = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { userInfo, notifyAvatarUpdate, setUserInfo } = useAuthStore(
    useShallow((state: TAuthStore) => ({
      notifyAvatarUpdate: state.notifyAvatarUpdate,
      userInfo: state.userInfo,
      setUserInfo: state.setUserInfo,
      // setHasPicture: state.setHasPicture,
    })),
  );
  const {
    avatarUrl,
    refreshUrl,
    isLoading: isLoadingUrl,
    error: urlError,
  } = useAvatarUrl();

  const combinedIsLoading = isUploading || isLoadingUrl;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select an image file.');
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }
      // File size limit (ex.: 5MB)
      const maxSizeMB = 5;
      if (file.size > maxSizeMB * 1024 * 1024) {
        setUploadError(`File size exceeds ${maxSizeMB}MB limit.`);
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }

      setSelectedFile(file);
      setUploadError(null);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleHasProfilePictureUpdate = async (newS3Url: string) => {
    try {
      console.log('Forcing token refresh...');
      await fetchAuthSession({ forceRefresh: true });
      console.log('Tokens refreshed.');
    } catch (refreshError) {
      console.error('Error refreshing session:', refreshError);
    }

    try {
      if (!userInfo || !newS3Url) {
        toast.error('User info not found or new URL is empty.');
        return;
      }

      const input: UpdateUserAttributeInput = {
        userAttribute: {
          attributeKey: 'picture',
          value: (!!newS3Url).toString(),
        },
      };
      await updateUserAttribute(input);
      console.log('Cognito user attribute "picture" updated.');

      setUserInfo({
        ...userInfo,
        picture: (!!newS3Url).toString(),
      });

      console.log('Forcing token refresh after avatar update...');
      await fetchAuthSession({ forceRefresh: true });
      console.log('Tokens refreshed successfully after avatar update.');

      toast.success('Avatar URL saved to profile.');
    } catch (error) {
      console.error('Error updating user attribute "picture":', error);
      toast.error('Could not save the new avatar URL to your profile.');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.warn('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      console.log(`Uploading ${selectedFile.name}`);

      const inputUpload: UploadDataWithPathInput = {
        path: ({ identityId }) => `private/${identityId}/avatar`,
        data: selectedFile,
        options: {
          contentType: selectedFile.type, // Helping S3 to get correctly the file by type
          onProgress: ({ transferredBytes, totalBytes }) => {
            if (totalBytes) {
              const progress = Math.round(
                (transferredBytes / totalBytes) * 100,
              );
              setUploadProgress(progress);
            }
          },
        },
      };

      const newUrl = await uploadData(inputUpload).result;
      await handleHasProfilePictureUpdate(newUrl.path);
      await refreshUrl(false); // Refresh the URL without loading
      notifyAvatarUpdate();
      toast.success('Avatar uploaded successfully!');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Upload failed. Please try again.';
      setUploadError(errorMessage);
      toast.error(`Upload failed: ${errorMessage}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null); // Returning to oiginal url
    setUploadError(null);
  };

  useEffect(() => {
    let objectUrl: string | null = null;
    if (selectedFile) {
      objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      setUploadError(null); // Cleaning error after choice a new file
    } else {
      setPreviewUrl(avatarUrl || null);
    }

    // Free up memory when the component unmounts or the file changes
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [avatarUrl, selectedFile]);

  // Handling hook errors (optional to show in local UI)
  useEffect(() => {
    if (urlError) {
      setUploadError(`Error loading avatar: ${urlError.message}`);
    }
    // Does not clean uploadError here avoiding delete previous upload errors
  }, [urlError]);

  return (
    <Box
      sx={{
        border: '1px dashed grey',
        p: 2,
        borderRadius: 1,
        width: 'fit-content',
      }}
    >
      <Stack
        spacing={2}
        alignItems="center"
      >
        <Typography variant="subtitle1">Profile Avatar</Typography>

        {/* Avatar previsualization */}
        <Box
          sx={{
            position: 'relative',
            width: 120,
            height: 120,
          }}
        >
          <Avatar
            src={previewUrl ?? undefined}
            sx={{
              width: 120,
              height: 120,
              mb: 1,
              bgcolor:
                !previewUrl && !combinedIsLoading
                  ? 'action.disabled'
                  : undefined,
              opacity: combinedIsLoading ? 0.5 : 1,
            }}
            alt={selectedFile ? 'Selected Avatar Preview' : 'Current Avatar'}
          />
          {/* Indicador de Carga Combinado (Subida O Refresco de URL) */}
          {combinedIsLoading && (
            <CircularProgress
              thickness={3}
              size={135}
              sx={{
                position: 'absolute',
                top: -8,
                left: -7,
                // marginTop: '-20px', // Centrar
                // marginLeft: '-20px', // Centrar
              }}
            />
          )}
        </Box>

        {/* Showing filename selected */}
        {selectedFile && (
          <Typography
            variant="caption"
            color="text.secondary"
          >
            {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
          </Typography>
        )}

        {/* file input hidden and button for activate */}
        <FormLabel
          htmlFor="avatar-upload-input"
          sx={{ width: '100%' }}
        >
          <input
            accept="image/*" // Just accept image files
            style={{ display: 'none' }}
            id="avatar-upload-input"
            type="file"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <Button
            variant="outlined"
            component="span" // Making button like a input label
            startIcon={<PhotoCameraIcon />}
            fullWidth
            disabled={isUploading}
          >
            {selectedFile ? 'Change Image' : 'Select Image'}
          </Button>
        </FormLabel>

        {/* Upload progress */}
        {isUploading && (
          <Box sx={{ width: '100%', mt: 1 }}>
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
            />
            <Typography
              variant="caption"
              align="center"
              display="block"
            >
              {uploadProgress}%
            </Typography>
          </Box>
        )}

        {/* Actions button (Upload / Cancel) */}
        {selectedFile && !isUploading && (
          <Stack
            direction="row"
            spacing={1}
            sx={{ width: '100%' }}
          >
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<CloudUploadIcon />}
              onClick={handleUpload}
            >
              Upload
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<DeleteIcon />}
              fullWidth
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Stack>
        )}

        {/* Error message */}
        {uploadError && (
          <Typography
            color="error"
            variant="caption"
            sx={{ mt: 1 }}
          >
            {uploadError}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default AvatarUploaderComp;
