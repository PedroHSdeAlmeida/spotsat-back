import Joi from 'joi';

export const usuarioValidator = Joi.object({
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required(),
});
