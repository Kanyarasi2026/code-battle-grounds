import Joi from 'joi';

export const schemas = {
  join: Joi.object<{ roomId: string; username: string }>({
    roomId: Joi.string().uuid().required().messages({
      'string.guid': 'Invalid room ID format',
      'any.required': 'Room ID is required',
    }),
    username: Joi.string()
      .min(2)
      .max(30)
      .pattern(/^[a-zA-Z0-9_\s]+$/)
      .required()
      .messages({
        'string.min': 'Username must be at least 2 characters',
        'string.max': 'Username cannot exceed 30 characters',
        'string.pattern.base':
          'Username can only contain letters, numbers, underscores, and spaces',
        'any.required': 'Username is required',
      }),
  }),

  codeChange: Joi.object<{ roomId: string; code: string }>({
    roomId: Joi.string().uuid().required(),
    code: Joi.string()
      .max(100000)
      .allow('')
      .required()
      .messages({
        'string.max': 'Code cannot exceed 100KB',
      }),
  }),

  languageChange: Joi.object<{ roomId: string; language: string }>({
    roomId: Joi.string().uuid().required(),
    language: Joi.string()
      .valid('cpp', 'c', 'javascript', 'java', 'python')
      .required()
      .messages({
        'any.only': 'Invalid programming language',
      }),
  }),

  executeCode: Joi.object<{
    roomId: string;
    code: string;
    language: string;
    stdin?: string;
  }>({
    roomId: Joi.string().uuid().required(),
    code: Joi.string().max(100000).required(),
    language: Joi.string()
      .valid('cpp', 'c', 'javascript', 'java', 'python')
      .required(),
    stdin: Joi.string().max(10000).allow('').optional(),
  }),

  inputChange: Joi.object<{ roomId: string; stdin: string }>({
    roomId: Joi.string().uuid().required(),
    stdin: Joi.string().max(10000).allow('').required(),
  }),
};

export const validate = <T>(schema: Joi.ObjectSchema<T>, data: unknown): T => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    throw new Error(errors.join(', '));
  }

  return value as T;
};
