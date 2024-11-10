import * as jwt from 'jsonwebtoken';
import { UnauthorizedError, InternalServerError } from '../errors';

interface IJwtData {
    id: number;
}

export class JwtService {
    static sign(data: IJwtData): string {
        if (!process.env.JWT_SECRET) {
            throw new InternalServerError('JWT_SECRET não encontrado');
        }

        return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '9h' });
    }

    static verify(token: string): IJwtData {
        if (!process.env.JWT_SECRET) {
            throw new InternalServerError('JWT_SECRET não encontrado');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (typeof decoded === 'string') {
                throw new UnauthorizedError('Token inválido');
            }

            return decoded as IJwtData;

        } catch (error) {
            throw new UnauthorizedError('Token inválido');
        }
    }
}