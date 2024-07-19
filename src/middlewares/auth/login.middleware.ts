import { NextFunction, Request, Response } from "express";

export class LoginMiddleware {
  public static validate(req: Request, res: Response, next: NextFunction) {
    const { email, username, password } = req.body;

    var emailValidator = require("email-validator");

    if (!email && !username) {
      return res.status(400).json({
        ok: false,
        message: "Informe um e-mail ou username",
      });
    }

    if (email && (typeof email !== "string" || !emailValidator.validate(email))) {
      return res.status(400).json({
        ok: false,
        message: "Informe um e-mail válido",
      });
    }


    if (username && typeof username !== "string") {
      return res.status(400).json({
        ok: false,
        message: "Informe um username válido",
      });
    }

    if (!password || typeof password !== "string") {
      return res.status(400).json({
        ok: false,
        message: "Informe uma senha no formato conjunto de caracteres",
      });
    }

    return next();
  }
}
