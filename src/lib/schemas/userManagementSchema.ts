import Joi from 'joi';

type TUserManagementSchema = {
  email: string;
  username: string;
  rol: string;
};

export const userManagementSchema = Joi.object<TUserManagementSchema>({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: false })
    .required()
    .messages({
      'string.empty': 'Email is not allowed to be empty',
      'string.email': 'Email must be a valid email',
    }),
  username: Joi.string().required().messages({
    'string.empty': 'User name is not allowed to be empty',
  }),
  rol: Joi.string().required().messages({
    'string.empty': 'Rol is not allowed to be empty',
  }),
  // roles: Joi.array().items(Joi.string()).required(),
});
