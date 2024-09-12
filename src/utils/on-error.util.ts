import { Response } from 'express';
import { HttpError } from '../errors/http.error';

export function onError(err: unknown, res: Response): Response {
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({
          ok: false,
          message: err.message
        })
    }

    return res.status(500).json({
        ok: false,
        message: `Ocorreu um erro inesperado. Erro: ${(err as Error).name} - ${
            (err as Error).message
        }`,
    });
}