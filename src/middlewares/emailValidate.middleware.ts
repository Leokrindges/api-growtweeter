import { NextFunction, Request, Response } from "express";
import { prismaConnection } from "../database/prisma.connection";

export class EmailValidateMiddleware {
  public static async validateEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { email } = req.body;

    const emailAlreadyExists = await prismaConnection.user.findFirst({
      where: {
        email: email,
        deleted: false,
      },
    });

    if (emailAlreadyExists) {
      return res.status(400).json({
        ok: false,
        message:
          "Já existe esse e-mail cadastrado, por gentileza, digite um diferente!",
      });
    }
    return next();
  }
}
