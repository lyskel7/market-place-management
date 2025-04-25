import Joi from 'joi';

type TProfileInfo = {
  username: string;
};

// const validateS3ImageUrl = (value: string, helpers: Joi.CustomHelpers) => {
//   try {
//     // 1. Parsear la URL
//     const url = new URL(value);

//     // 2. Verificar HTTPS
//     if (url.protocol !== 'https:') {
//       return helpers.error('url.scheme.https', { label: helpers.state.key });
//     }

//     // 3. Verificar el Host (patrones comunes de S3/CloudFront)
//     const hostname = url.hostname;
//     const isS3Domain =
//       /\.s3[\.-][a-z0-9-]+\.amazonaws\.com$/i.test(hostname) || // bucket.s3.region... or s3.region...
//       /\.s3-accelerate\.amazonaws\.com$/i.test(hostname) || // S3 Accelerate
//       hostname.endsWith('.amazonaws.com'); // Cubre otros posibles servicios de AWS como CloudFront si no tienes CNAME

//     // OPCIONAL: Añadir tus dominios personalizados de CloudFront si los usas
//     const allowedCustomDomains = [
//       'cdn.midominio.com',
//       'imagenes.miempresa.net',
//     ];
//     const isAllowedCustomDomain = allowedCustomDomains.includes(hostname);

//     if (!isS3Domain && !isAllowedCustomDomain) {
//       return helpers.error('url.domain.s3', { label: helpers.state.key });
//     }

//     // 4. Verificar la extensión del archivo en el Path
//     const imageExtensionRegex = /\.(jpg|jpeg|png|gif|webp)$/i;
//     if (!imageExtensionRegex.test(url.pathname)) {
//       return helpers.error('url.extension.image', { label: helpers.state.key });
//     }

//     // Si todo está bien, devuelve el valor original
//     return value;
//   } catch (err) {
//     console.error('Error parsing URL:', err);
//     // Si new URL() falla, no es una URL válida en absoluto
//     return helpers.error('string.uri', { label: helpers.state.key, value });
//   }
// };

// Esquema Joi usando la validación personalizada
export const profileInfoSchema = Joi.object<TProfileInfo>({
  username: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.min': '{#label} must be at least {#limit} characters long.',
      'string.max': '{#label} cannot be longer than {#limit} characters.',
      'string.pattern.base': '{#label} contains invalid characters.',
      'string.empty': '{#label} cannot be empty.',
      'any.required': '{#label} is required.',
    })
    .label('Username'),

  // avatarUrl: Joi.string()
  //   .custom(validateS3ImageUrl, 'S3 Image URL Validation') // Aplicar la función personalizada
  //   .required() // O .optional()
  //   .messages({
  //     // Mensajes para errores específicos de la función custom
  //     'url.scheme.https': '{#label} must use HTTPS.',
  //     'url.domain.s3': '{#label} must be a valid S3 or allowed CDN domain.',
  //     'url.extension.image':
  //       '{#label} must point to a valid image file (jpg, jpeg, png, gif, webp).',
  //     // Mensajes estándar de Joi que aún pueden aplicar (si custom no captura algo)
  //     'string.base': '{#label} must be a string.',
  //     'string.uri': '{#label} must be a valid URL.', // Se captura si new URL() falla
  //     'any.required': '{#label} is required.',
  //     'string.empty': '{#label} cannot be empty.',
  //   })
  //   .label('Avatar URL'), // Poner una etiqueta ayuda en los mensajes de error
  // // ... otros campos
});

// Ejemplo de uso:
// const { error, value } = schema.validate({ avatarUrl: 'https://mi-bucket-123.s3.us-east-1.amazonaws.com/avatars/user1.jpg' });

// if (error) {
//   console.error('Validation failed:', error.details);
// } else {
//   console.log('Validation passed:', value);
// }

// const { error: error2 } = schema.validate({ avatarUrl: 'http://example.com/image.png' }); // Fallará por HTTP y dominio
// console.error('Validation 2 failed:', error2.details);

// const { error: error3 } = schema.validate({ avatarUrl: 'https://mi-bucket-123.s3.us-east-1.amazonaws.com/document.pdf' }); // Fallará por extensión
// console.error('Validation 3 failed:', error3.details);
