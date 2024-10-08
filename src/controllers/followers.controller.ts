import { User } from "@prisma/client";
import { Request, Response } from "express";
import { FollowService } from "../services/followers.service";
import { onError } from "../utils/on-error.util";
import prismaConnection from "../database/prisma.connection";

export class FollowersController {
  public static async follow(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const { user } = req.body;

      const service = new FollowService();
      const createFollower = service.followService({
        name: user.name,
        userId,
        userIdLogged: user.id,
      });

      return res.status(201).json({
        ok: true,
        message: "Seguindo com sucesso",
        createFollower,
      });
    } catch (err) {
      return onError(err, res);
    }
  }

  public static async unfollow(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const { user } = req.body;

      const service = new FollowService();

      const unfollow = service.unfollowService({
        name: user.name,
        userId,
        userIdLogged: user.id,
      });

      return res.status(201).json({
        ok: true,
        message: "Deixar de seguir realizado com sucesso",
        unfollow,
      });
    } catch (err) {
      return onError(err, res);
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
              username: true,
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
              username: true,
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
