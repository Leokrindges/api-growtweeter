import { Request, Response } from "express";
import { prismaConnection } from "../database/prisma.connection";

export class UsersControler {
  public static async create(req: Request, res: Response) {
    try {
      let { name, email, username, password } = req.body;

      await prismaConnection.user.create({
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
      const { limit, page } = req.query;

      let limitDefault = 5;
      let pageDefault = 1;

      if (limit) {
        limitDefault = Number(limit);
      }

      if (pageDefault) {
        pageDefault = Number(page);
      }

      const user = await prismaConnection.user.findMany({
        skip: limitDefault * (pageDefault - 1),
        take: limitDefault,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          deleted: false,
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
        pagination: {
          limit: limitDefault,
          page: pageDefault,
          count: count,
          totalPages: Math.ceil(count / limitDefault), // para arendondar para cima
        },
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
  public static  async get(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const userFound = await prismaConnection.user.findUnique({
        where: {
          id: userId,
          deleted: false,
        },
      });

      if (!userFound) {
        res.status(400).json({
          ok: false,
          message: "Usuário não encontrado!",
        });
      }

      return res.status(200).json({
        ok: true,
        message: "Usuário encontrado",
        user: userFound,
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
      const { name, email, username, password } = req.body;

      const userUpdated = await prismaConnection.user.update({
        where: {
          id: userId,
          deleted: false,
        },
        data: {
          name,
          email,
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
