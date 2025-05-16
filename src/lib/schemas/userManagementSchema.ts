import Joi from 'joi';

type TUserManagementSchema = {
  email: string;
  username: string;
  role: string;
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
  role: Joi.string().required().messages({
    'string.empty': 'Role is not allowed to be empty',
  }),
  // roles: Joi.array().items(Joi.string()).required(),
});
