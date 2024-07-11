import { Request, Response } from "express";
import { prismaConnection } from "../database/prisma.connection";

export class UsersControler {
  public static async create(req: Request, res: Response) {
    try {
      let { name, email, username, password } = req.body;

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

      const data = await prismaConnection.user.create({
        data: {
          name,
          email,
          username,
          password,
        },
      });

      return res.status(200).json({
        ok: true,
        message: "Usuário criado com sucesso!",
        data
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
  public static async list(req: Request, res: Response) {
    try {

      const user = await prismaConnection.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          deleted: false,
        },
        include: {
          tweet: true,
          like: true,
        },
      });

      const count = await prismaConnection.user.count({
        where: {
          deleted: false,
        },
      });

      return res.status(200).json({
        ok: true,
        message: "Usuário listado com sucesso!",
        user: user,
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
 
  public static async update(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { name, username, password } = req.body;

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

      const userUpdated = await prismaConnection.user.update({
        where: {
          id: userId,
          deleted: false,
        },
        data: {
          name,
          username,
          password,
        },
      });

      return res.status(200).json({
        ok: true,
        message: "Usuário atualizado com sucesso!",
        user: userUpdated,
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
  public static async delete(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const userDeleted = await prismaConnection.user.update({
        where: {
          id: userId,
          deleted: false,
        },
        data: {
          deleted: true,
          deletedAt: new Date(),
        },
      });

      return res.status(200).json({
        ok: true,
        messagem: "Usuário deletado com sucesso!",
        userDeleted,
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
