import { NextFunction, Request, Response } from "express";
import PasswordValidator from 'password-validator';

export class UpdateUsersMiddleware {
  public static async validate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { name, username, password } = req.body;

    const passwordRequirements = new PasswordValidator();
    passwordRequirements.is().min(8);
    passwordRequirements.has().uppercase();
    passwordRequirements.has().digits(1);

    if (name && typeof name !== "string") {
      return res.status(400).json({
        ok: false,
        message: "Nome inválido.",
      });
    }

    if (username && typeof username !== "string") {
      return res.status(400).json({
        ok: false,
        message: "Username inválido.",
      });
    }

    if (password && !passwordRequirements.validate(password)) {
      return res.status(400).json({
        ok: false,
        message:
          "A senha deve possuir no minímo 8 caracteres, uma letra maiúscula, e um número",
      });
    }

    return next();
  }
}
