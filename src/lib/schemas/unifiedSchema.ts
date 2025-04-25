import Joi from 'joi';
import { ETypes } from '../enums';

type TCategorySchema = {
  [index: string]: string;
};

type TAuthSchema = {
  email: string;
  password: string;
};

type TChangePasswordSchema = {
  newPassword: string;
  confirmedPassword: string;
  oldPassword?: string;
};

export const authSchema = Joi.object<TAuthSchema>({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: false })
    .required()
    .messages({
      'string.empty': 'Email is not allowed to be empty',
      'string.email': 'Email must be a valid email',
    }),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(/^[a-zA-Z0-9-_#@]+$/)
    .required() // Añade esto si la contraseña es obligatoria
    .messages({
      'string.min': 'Password must be al least 8 chars.',
      'string.max': 'Password cannot be longer than 30 characters.',
      'string.pattern.base':
        'Password contains characters that are not allowed. Only letters (a-z, A-Z), numbers (0-9) and the symbols: - _ # @ and others are allowed.',
      'string.empty': 'Password is not allowed to be empty.',
      'any.required': 'Password is mandatory',
    }),
});

export const passwordValidator = (customLabel?: string) => {
  const label = customLabel || 'Password';

  return Joi.string()
    .min(8)
    .required()
    .label(label)
    .custom((value, helpers) => {
      if (!/[A-Z]/.test(value)) {
        return helpers.error('password.uppercase', { label });
      }
      if (!/[a-z]/.test(value)) {
        return helpers.error('password.lowercase', { label });
      }
      if (!/[0-9]/.test(value)) {
        return helpers.error('password.number', { label });
      }
      if (!/[@$!^%*?&#()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
        return helpers.error('password.special', { label });
      }
      return value;
    })
    .messages({
      'string.min': '{#label} length must be at least {#limit} characters.',
      'string.empty': '{#label} cannot be empty',
      'any.required': '{#label} is required',
      'password.uppercase':
        '{#label} must include at least one uppercase letter.',
      'password.lowercase':
        '{#label} must include at least one lowercase letter.',
      'password.number': '{#label} must include at least one number.',
      'password.special':
        '{#label} must include at least one special character (@$!%*?&).',
    });
};

export const unifiedPasswordSchema = Joi.object<TChangePasswordSchema>({
  oldPassword: Joi.when('isChangeFirsTime', {
    is: true,
    then: Joi.forbidden(),
    otherwise: passwordValidator('Old password'),
  }),

  newPassword: passwordValidator('New password').when('isChangeFirsTime', {
    is: true,
    then: Joi.not().valid(Joi.ref('oldPassword')).messages({
      'any.only': 'New password must be different from old password',
    }),
  }),

  confirmedPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Passwords must match',
      'any.required': 'This field is required',
    }),
});

export function customeSchema(schemaType: ETypes): Joi.Schema<TCategorySchema> {
  return Joi.object<TCategorySchema>({
    itemName: Joi.string()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.min': `${schemaType.charAt(0).toUpperCase() + schemaType.slice(1)} length must be equal to or greater than 3 characters.`,
        'string.max': `${schemaType.charAt(0).toUpperCase() + schemaType.slice(1)} length must be between 3 and 30 characters`,
        'string.empty': `${schemaType.charAt(0).toUpperCase() + schemaType.slice(1)} is not allowed to be empty`,
      }),
    itemDesc: Joi.string().min(3).max(50).required().messages({
      'string.min':
        'Description length must be equal to or greater than 3 characters.',
      'string.max': 'Description length must be between 3 and 50 characters',
      'string.empty': 'Description is not allowed to be empty',
    }),
  });
}
