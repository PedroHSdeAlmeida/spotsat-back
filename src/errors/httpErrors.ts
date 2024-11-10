import { CustomError } from './customError';

export class BadRequestError extends CustomError {
  constructor(message = 'Requisição inválida') {
    super(message, 400);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message = 'Não autorizado') {
    super(message, 401);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message = 'Proibido') {
    super(message, 403);
  }
}

export class NotFoundError extends CustomError {
  constructor(message = 'Não encontrado') {
    super(message, 404);
  }
}

export class ConflictError extends CustomError {
  constructor(message = 'Conflito de dados') {
    super(message, 409);
  }

}

export class InternalServerError extends CustomError {
  constructor(message = 'Erro interno do servidor') {
    super(message, 500);
  }
}