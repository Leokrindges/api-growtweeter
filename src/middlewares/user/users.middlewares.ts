import { NextFunction, Request, Response } from "express";

export class CreateUsersMiddleware {
  public static async validate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { name, email, username, password } = req.body;

    var passwordValidator = require("password-validator");
    var emailValidator = require("email-validator");

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

    if (!emailValidator.validate(email) || !email) {
      return res.status(400).json({
        ok: false,
        message: "E-mail inválido!",
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
