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

      const showFeed = await prismaConnection.user.findFirst({
        where: { id: (user as User).id },
        select: {
          tweet: {
            skip: limitDefault * (pageDefault - 1),
            take: limitDefault,
            orderBy: { createdAt: "desc" },
            include: {
              like: {
                select: {
                  user: {
                    select: {
                      name: true,
                      username: true,
                    },
                  },
                },
              },
              reply: {
                select: {
                  tweet: {
                    select: {
                      content: true,
                      user: {
                        select: {
                          name: true,
                          username: true,
                        },
                      },
                    },
                  },
                  user: {
                    select: {
                      name: true,
                      username: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const count = await prismaConnection.user.count({
        where: {
          deleted: false,
        },
      });

      return res.status(200).json({
        ok: true,
        message: "Listado Feed com sucesso",
        showFeed,
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
