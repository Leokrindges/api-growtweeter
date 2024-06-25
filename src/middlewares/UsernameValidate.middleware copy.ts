import { NextFunction, Request, Response } from "express";
import { prismaConnection } from "../database/prisma.connection";

export class UsernameValidateMiddleware {
  public static async validateEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { username } = req.body;

    const usernameAlredyExists = await prismaConnection.user.findFirst({
      where: {
        username: username,
        deleted: false,
      },
    });

    if (usernameAlredyExists) {
      return res.status(400).json({
        ok: false,
        message:
          "Já existe um usuário com esse username, digite um diferente!",
      });
    }
    return next();
  }
}
