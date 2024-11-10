import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../services';
import { UnauthorizedError } from '../errors';

export async function authenticateJWT(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    if (token) {
      try {
        const jwtData = JwtService.verify(token);
        if (typeof jwtData !== 'string' && 'id' in jwtData) {
          console.log('ID do usuário:', jwtData.id);
          req.usuario = {
            id: jwtData.id,
            nome: '',
            email: '',
            senha: '',
            Id: jwtData.id,
          };
          next();
          return;
        } else {
          throw new UnauthorizedError('Token inválido.');
        }
      } catch (error) {
        return next(new UnauthorizedError('Token inválido.'));
      }
    }
  }

  return next(new UnauthorizedError('Usuário não autenticado.'));
}
