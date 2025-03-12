import Joi from 'joi';

type TCategorySchema = {
  category: string;
  category_desc: string;
};

// export const categorySchema = Joi.object<TCategorySchema>({
//   category: Joi.string().min(3).max(30).required().messages({
//     'string.min':
//       'Category length must be equal to or greater than 3 characters.',
//     'string.max': 'Category length must be between 3 and 30 characters',
//     'string.empty': 'Category is not allowed to be empty',
//   }),
//   category_desc: Joi.string().min(3).max(50).required().messages({
//     'string.min':
//       'Description length must be equal to or greater than 3 characters.',
//     'string.max': 'Description length must be between 3 and 50 characters',
//     'string.empty': 'Description is not allowed to be empty',
//   }),
// });

export function customeSchema(
  schemaType: 'category' | 'subcategory',
): Joi.Schema<TCategorySchema> {
  const fieldDescription = schemaType + '_desc';
  return Joi.object<TCategorySchema>({
    [schemaType]: Joi.string()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.min': `${schemaType.charAt(0).toUpperCase() + schemaType.slice(1)} length must be equal to or greater than 3 characters.`,
        'string.max': `${schemaType.charAt(0).toUpperCase() + schemaType.slice(1)} length must be between 3 and 30 characters`,
        'string.empty': `${schemaType.charAt(0).toUpperCase() + schemaType.slice(1)} is not allowed to be empty`,
      }),
    [fieldDescription]: Joi.string().min(3).max(50).required().messages({
      'string.min':
        'Description length must be equal to or greater than 3 characters.',
      'string.max': 'Description length must be between 3 and 50 characters',
      'string.empty': 'Description is not allowed to be empty',
    }),
  });
}
