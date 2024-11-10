import { RequestHandler } from 'express';
import { loginService } from '../services/loginService';
import { JwtService } from '../services/jwtService';
import { usuarioValidator } from './validators';
import { BadRequestError, UnauthorizedError, InternalServerError } from '../errors';

export const login: RequestHandler = async (req, res) => {
  const { error } = usuarioValidator.validate(req.body);
  if (error) {
    res.status(400).send(new BadRequestError(error.details[0].message));
    return;
  }
  const { email, senha } = req.body;
  try {
    const usuario = await loginService.login(email, senha);
    const token = JwtService.sign({ id: usuario.id });
    res.status(200).json({ token });
  } catch (err: any) {
    if (err.message === 'Credenciais inválidas.') {
      res.status(401).send(new UnauthorizedError());
    } else {
      res.status(500).send(new InternalServerError());
    }
  }
};