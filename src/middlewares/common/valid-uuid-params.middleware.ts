import { NextFunction, Request, Response } from "express";
import { validate as validUuid } from 'uuid';

export class ValidUuidParamsMiddleware {
  public static async validate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;

    if(!validUuid(id)) {
        return res.status(400).json({
            ok: false,
            message: "UUID inválido"
        })
    }


    return next();
  }
}
