import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      usuario: {
        id: number;
        nome: string;
        email: string;
        senha: string;
        Id: number;
      };
    }
  }
}
