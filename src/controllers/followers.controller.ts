import { User } from "@prisma/client";
import { Request, Response } from "express";
import { prismaConnection } from "../database/prisma.connection";

export class FollowersController {
  public static async follow(req: Request, res: Response) {
    try {
      const userId  = req.params.id;
      const { user } = req.body;

      if (userId === (user as User).id) {
        return res.status(400).json({
          ok: false,
          message: "Não é possivel seguir a si mesmo",
        });
      }

      const userFound = await prismaConnection.user.findFirst({
        where: { id: userId, deleted: false },
      });

      if (!userFound) {
        return res.status(404).json({
          ok: false,
          message: "Usuário não encontrado",
        });
      }


      const checkAlredyFollow = await prismaConnection.follower.findFirst({
        where: { followerId: (user as User).id, userId: userId  },
      });

      if (checkAlredyFollow) {
        return res.status(400).json({
          ok: false,
          message: `O usuário ${(user as User).name} já segue ${
            userFound.name
          }`,
        });
      }

      const createFollower = await prismaConnection.follower.create({
        data: {
          userId: userId,
          followerId: (user as User).id,
        },
      });

      return res.status(201).json({
        ok: true,
        message: "Seguindo com sucesso",
        createFollower,
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

  public static async unfollow(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const { user } = req.body;

      if (userId === (user as User).id) {
        return res.status(400).json({
          ok: false,
          message: "Não é possivel deixar seguir a si mesmo",
        });
      }

      const userFound = await prismaConnection.user.findFirst({
        where: { id: userId },
      });

      if (!userFound) {
        return res.status(400).json({
          ok: false,
          message: "Usuário inválido",
        });
      }

      const checkAlredyFollow = await prismaConnection.follower.findFirst({
        where: { followerId: (user as User).id, userId: userFound.id },
      });

      if (!checkAlredyFollow) {
        return res.status(400).json({
          ok: false,
          message: `O usuário ${(user as User).name} não segue ${
            userFound.name
          }`,
        });
      }

      const unfollow = await prismaConnection.follower.delete({
        where: {
          id: checkAlredyFollow.id,
        },
      });

      return res.status(201).json({
        ok: true,
        message: "Deixar de seguir realizado com sucesso",
        unfollow,
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
  
  public static async showFollowers(req: Request, res: Response) {
    try {
      const { user } = req.body;
      const { limit, page } = req.query;

      let limitDefault = 5;
      let pageDefault = 1;

      if (limit) {
        limitDefault = Number(limit);
      }

      if (page) {
        pageDefault = Number(page);
      }

      const followers = await prismaConnection.follower.findMany({
        where: { userId: (user as User).id },
        skip: limitDefault * (pageDefault - 1),
        take: limitDefault,
        select: {
          follower: {
            select: {
              name: true,
              username: true
            },
          },
        },
      });

      const count = await prismaConnection.follower.count({
        where: { userId: (user as User).id },
      });

      return res.status(200).json({
        ok: true,
        message: "Lista de seguidores gerada com sucesso",
        followers,
        pagination: {
          limit: limitDefault,
          page: pageDefault,
          count: count,
          totalPages: Math.ceil(count / limitDefault),
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

  public static async showFollowing(req: Request, res: Response) {
    try {
      const { user } = req.body;
      const { limit, page } = req.query;

      let limitDefault = 5;
      let pageDefault = 1;

      if (limit) {
        limitDefault = Number(limit);
      }

      if (page) {
        pageDefault = Number(page);
      }

      const following = await prismaConnection.follower.findMany({
        where: { followerId: (user as User).id },
        skip: limitDefault * (pageDefault - 1),
        take: limitDefault,
        select: {
          user: {
            select: {
              name: true,
              username: true
            },
          },
        },
      });

      const count = await prismaConnection.follower.count({
        where: { followerId: (user as User).id },
      });

      return res.status(200).json({
        ok: true,
        message: "Lista de seguindos gerada com sucesso",
        following,
        pagination: {
          limit: limitDefault,
          page: pageDefault,
          count: count,
          totalPages: Math.ceil(count / limitDefault),
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
}
