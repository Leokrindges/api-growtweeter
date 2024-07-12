import { User } from "@prisma/client";
import { prismaConnection } from "../database/prisma.connection";
import { Request, Response } from "express";
import { ok } from "assert";

export class ShowFeedController {
  public static async showFeed(req: Request, res: Response) {
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

      const followersIds = await prismaConnection.follower.findMany({
        where: {
          followerId: (user as User).id,
        },
        select: { userId: true },
      });

      const userIds = followersIds.map((follower) => follower.userId);
      userIds.push((user as User).id);

      const feed = await prismaConnection.tweet.findMany({
        skip: limitDefault * (pageDefault - 1),
        take: limitDefault,
        orderBy: { createdAt: "desc" },
        where: { userId: { in: userIds } },
        include: {
          like: {
            select: {
              user: true,
            },
          },
          reply: {
            select: {
              user: true,
            },
          },
        },
      });
      
      const count = await prismaConnection.tweet.count({
        where: { userId: { in: userIds } },
      });

      return res.status(200).json({
        ok: true,
        message: "Listado Feed com sucesso",
        feed,
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
