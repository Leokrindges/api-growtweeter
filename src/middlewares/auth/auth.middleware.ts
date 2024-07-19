import { NextFunction, Request, Response } from "express";
import { prismaConnection } from "../../database/prisma.connection";

export class AuthMiddleware {
  public static async validate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const headers = req.headers;

    if (!headers.authorization) {
      return res.status(401).json({
        ok: false,
        message: "Token é obrigatório",
      });
    }

    const userFound = await prismaConnection.user.findFirst({
      where: { authToken: headers.authorization, deleted: false },
    });

    if (!userFound) {
      return res.status(401).json({
        ok: false,
        message: "Usuário não autorizado",
      });
    }

    req.body.user = userFound;

    return next();
  }
}
