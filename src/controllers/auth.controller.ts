import { Request, Response } from "express";
import { prismaConnection } from "../database/prisma.connection";
import { randomUUID } from "crypto";

export class AuthController {
  public static async login(req: Request, res: Response) {
    try {
      const { email, username, password } = req.body;

      const userFound = await prismaConnection.user.findUnique({
        where: {
          email: email,
          username: username,
          password: password,
        },
      });

      if (!userFound) {
        return res.status(401).json({
          ok: false,
          message: "Credeciais inválidas",
        });
      }

      if (userFound.authToken) {
        return res.status(400).json({
          ok: false,
          message: "Usuário já autenticado",
        });
      }

      const authToken = randomUUID();

      await prismaConnection.user.update({
        where: { id: userFound.id },
        data: { authToken }
    });

      await res.status(200).json({
        ok: true,
        message: "Usuário autenticado",
        authToken,
      });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: `Ocorreu um erro inesperado. Erro: ${(err as Error).name} - ${
          (err as Error).message
        }`,
      });
    }
  }

  public static async logout(req: Request, res: Response) {
    try {
      const headers = req.headers;

      if (!headers.authorization) {
        return res.status(401).json({
          ok: false,
          message: "Token é obrigatório",
        });
      }      

      console.log(headers.authorization);

      //USEI POIS VNA FRENTE DO TOKEN VEM "Bearer "
      const authToken = headers.authorization.replaceAll("Bearer ", "")
      
      await prismaConnection.user.updateMany({
        where: {
            authToken: authToken
        },
        data: { authToken: null }
    });

      return res.status(200).json({
        ok: true,
        message: "Logout realizado com sucesso",
      });

    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: `Ocorreu um erro inesperado. Erro: ${(err as Error).name} - ${
          (err as Error).message
        }`,
      });
    }
  }
}
