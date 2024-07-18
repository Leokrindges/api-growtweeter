import { randomUUID } from "crypto";
import { Request, Response } from "express";
import { prismaConnection } from "../database/prisma.connection";

export class AuthController {
  public static async login(req: Request, res: Response) {
    try {
      const { email, username, password } = req.body;

      const userFound = await prismaConnection.user.findFirst({
        where: {
          OR: [{ email }, { username }],
          password: password,
          deleted: false,
        },
      });

      if (!userFound) {
        return res.status(401).json({
          ok: false,
          message: "Credeciais inválidas",
        });
      }

      const authToken = randomUUID();

      await prismaConnection.user.update({
        where: { id: userFound.id },
        data: { authToken },
      });

      return res.status(200).json({
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

      await prismaConnection.user.updateMany({
        where: {
          authToken: headers.authorization,
        },
        data: { authToken: null },
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
