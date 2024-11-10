import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/customError';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ erro: err.message });
  } else {
    console.error('Erro não tratado:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
}
