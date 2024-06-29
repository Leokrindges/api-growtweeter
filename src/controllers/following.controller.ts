import { Request, Response } from "express";
import { prismaConnection } from "../database/prisma.connection";
import { User } from "@prisma/client";

export class FollowingController {
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
        where: { userId: (user as User).id },
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
        where: { userId: (user as User).id },
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
