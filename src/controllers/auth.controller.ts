import { Request, Response } from "express";
import { AuthService } from '../services/auth.service';
import { onError } from '../utils/on-error.util';

export class AuthController {
  public static async login(req: Request, res: Response) {
    try {
      const { email, username, password } = req.body;

      const service = new AuthService()
      const { authToken, userLogged } = await service.loginUser({
        email,
        username,
        password
      });

      return res.status(200).json({
        ok: true,
        message: "Usuário autenticado",
        authToken,
        userLogged
      });
    } catch (err) {
      return onError(err, res)
    }
  }
}
