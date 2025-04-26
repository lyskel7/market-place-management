'use client';

// import { MARKET_BUCKET } from '@/lib/constants/backend';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  Avatar,
  Box,
  Button,
  FormLabel,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import {
  getUrl,
  GetUrlWithPathInput,
  uploadData,
  UploadDataWithPathInput,
} from 'aws-amplify/storage';
import { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'; // Controller si integramos con RHF más complejo
import { toast } from 'react-toastify';
import { fetchAuthSession } from 'aws-amplify/auth';

// Interfaz para las props, incluyendo la URL actual y una callback de éxito
interface IAvatarUploaderProps {
  currentAvatarUrl?: string | null; // URL del avatar actual (opcional)
  onUploadSuccess: (newAvatarUrl: string) => void; // Callback cuando la subida es exitosa
  userIdForPath?: string; // Opcional: Si quieres construir path basado en ID (no recomendado con accessLevel)
}

// Tipo para el estado del formulario (si se usara con RHF más adelante)
type TFormValues = {
  avatarFile?: FileList | null; // react-hook-form maneja FileList para input type="file"
};

// const AVATAR_RELATIVE_PATH = 'avatar.png'; // Nombre fijo para el avatar (sobrescribirá el anterior)

const AvatarUploader = ({
  currentAvatarUrl,
  onUploadSuccess,
}: IAvatarUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentAvatarUrl || null,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Usamos RHF aquí principalmente para mostrar cómo se integraría,
  // pero la lógica principal no depende de él para la subida del archivo.
  const { control, setValue } = useForm<TFormValues>();

  // Observa cambios en el campo del archivo de RHF (si se usara Controller)
  // const avatarFileWatcher = watch('avatarFile');

  // Efecto para crear/revocar la URL de previsualización local
  useEffect(() => {
    let objectUrl: string | null = null;
    if (selectedFile) {
      objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      setUploadError(null); // Limpiar error al seleccionar nuevo archivo
    } else {
      // Si no hay archivo seleccionado, volver a la URL actual si existe
      setPreviewUrl(currentAvatarUrl || null);
    }

    // Función de limpieza para liberar memoria
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [selectedFile, currentAvatarUrl]); // Ejecutar cuando cambie el archivo seleccionado o la URL actual

  // Manejador para cuando el usuario selecciona un archivo
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validación básica (opcional)
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select an image file.');
        setSelectedFile(null);
        if (control?._fields?.avatarFile) setValue('avatarFile', null); // Reset RHF field
        return;
      }
      // Validación de tamaño (opcional - ej: 5MB)
      const maxSizeMB = 5;
      if (file.size > maxSizeMB * 1024 * 1024) {
        setUploadError(`File size exceeds ${maxSizeMB}MB limit.`);
        setSelectedFile(null);
        if (control?._fields?.avatarFile) setValue('avatarFile', null); // Reset RHF field
        return;
      }

      setSelectedFile(file);
      if (control?._fields?.avatarFile)
        setValue('avatarFile', event.target.files); // Update RHF field
    } else {
      setSelectedFile(null);
      if (control?._fields?.avatarFile) setValue('avatarFile', null); // Reset RHF field
    }
  };

  // Manejador para iniciar la subida
  const handleUpload = async () => {
    // --- LOG DE DIAGNÓSTICO ---
    try {
      console.log('Fetching session details before upload...');
      const session = await fetchAuthSession();
      // Intenta obtener las credenciales para ver si revelan el ARN del rol
      // Esto puede o no funcionar dependiendo de la versión exacta y configuración
      try {
        const creds = await session.credentials;
        console.log('Current AWS Credentials (if available):', creds);
      } catch (credError) {
        console.warn('Could not fetch explicit credentials object:', credError);
      }
      console.log('Current Session Identity ID:', session.identityId);
      console.log(
        'Current Session User Sub (from User Pool):',
        session.userSub,
      );
      console.log('Current Session Tokens:', session.tokens); // Cuidado: ¡No loguear tokens en producción! Útil para depurar si el grupo está en el ID token.

      if (!session.identityId) {
        console.error(
          'CRITICAL: No identityId found in session before upload!',
        );
        toast.error('Authentication error: Missing identity ID.');
        setIsUploading(false);
        return;
      }
      console.log(
        `--> Preparing to upload with identityId: ${session.identityId}`,
      );
    } catch (sessionError) {
      console.error(
        'CRITICAL: Error fetching auth session before upload:',
        sessionError,
      );
      toast.error('Authentication error fetching session.');
      setIsUploading(false);
      return;
    }
    // --- FIN LOG DE DIAGNÓSTICO ---
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
          contentType: selectedFile.type, // Ayuda a S3 a servir el archivo correctamente
          onProgress: ({ transferredBytes, totalBytes }) => {
            if (totalBytes) {
              const progress = Math.round(
                (transferredBytes / totalBytes) * 100,
              );
              setUploadProgress(progress);
              console.log(`Upload progress: ${progress}%`);
            }
          },
        },
      };

      const uploadResult = await uploadData(inputUpload).result; // Espera a que la promesa de subida se complete

      toast.success('Avatar uploaded successfully!');

      // Obtiene la URL firmada (o pública si accessLevel fuera 'public') del archivo subido
      const inputGet: GetUrlWithPathInput = {
        path: uploadResult.path,
        options: {
          expiresIn: 3600, // Tiempo de validez en segundos para URL firmada (private/protected)
          validateObjectExistence: true,
        },
      };

      const urlResult = await getUrl(inputGet);
      const newUrl = urlResult.url.toString();
      console.log('New avatar URL:', newUrl);

      // Llama a la callback de éxito pasando la nueva URL
      onUploadSuccess(newUrl);

      // Limpia el estado local (opcional, depende de si quieres permitir otra subida)
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
    setPreviewUrl(currentAvatarUrl || null); // Volver a la URL original
    setUploadError(null);
    if (control?._fields?.avatarFile) setValue('avatarFile', null); // Reset RHF field
  };

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

        {/* Previsualización del Avatar */}
        <Avatar
          src={previewUrl ?? undefined} // Usa la preview o la URL actual
          sx={{
            width: 120,
            height: 120,
            mb: 1,
            bgcolor: !previewUrl ? 'action.disabled' : undefined,
          }}
          alt={selectedFile ? 'Selected Avatar Preview' : 'Current Avatar'}
        />

        {/* Muestra el nombre del archivo seleccionado */}
        {selectedFile && (
          <Typography
            variant="caption"
            color="text.secondary"
          >
            {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
          </Typography>
        )}

        {/* Input de Archivo (oculto) y Botón para activarlo */}
        <FormLabel
          htmlFor="avatar-upload-input"
          sx={{ width: '100%' }}
        >
          <input
            accept="image/*" // Aceptar solo imágenes
            style={{ display: 'none' }}
            id="avatar-upload-input"
            type="file"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <Button
            variant="outlined"
            component="span" // Hace que el botón actúe como label para el input
            startIcon={<PhotoCameraIcon />}
            fullWidth
            disabled={isUploading}
          >
            {selectedFile ? 'Change Image' : 'Select Image'}
          </Button>
        </FormLabel>

        {/* Progreso de Subida */}
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

        {/* Botones de Acción (Subir / Cancelar) */}
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

        {/* Mensaje de Error */}
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

export default AvatarUploader;
