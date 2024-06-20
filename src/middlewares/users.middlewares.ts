import { NextFunction, Request, Response } from "express";
import { prismaConnection } from "../database/prisma.connection";

export class CreateUsersMiddleware {
  public static async validate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { name, email, username, password } = req.body;

    var passwordValidator = require("password-validator");
    var passwordRequirements = new passwordValidator();
    passwordRequirements.is().min(8);
    passwordRequirements.has().uppercase();
    passwordRequirements.has().digits(1);

    if (!name || typeof name !== "string") {
      return res.status(400).json({
        ok: false,
        message: "Nome é obrigatório.",
      });
    }

    if (!email.EmailValidator(email)) {
      return res.status(400).json({
        ok: false,
        message: "E-mail inválido!",
      });
    }

    try {
      const emailAlreadyExists = await prismaConnection.user.count({
        where: {
          email: email,
          deleted: false,
        },
      });

      if (emailAlreadyExists > 0) {
        return res.status(400).json({
          ok: false,
          message:
            "Já existe esse e-mail cadastrado, por gentileza, digite um diferente!",
        });
      }
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: `Ocorreu um erro inesperado. Erro: ${(err as Error).name} - ${
          (err as Error).message
        }`,
      });
    }

    if (!username || typeof username !== "string") {
      return res.status(400).json({
        ok: false,
        message: "Username é obrigatório.",
      });
    }

    if (!password || !passwordRequirements.validate(password)) {
      return res.status(400).json({
        ok: false,
        message:
          "A senha deve possuir no minímo 8 caracteres, uma letra maiúscula, e um número",
      });
    }

    return next();
  }
}
