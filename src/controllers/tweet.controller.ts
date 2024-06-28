import { NextFunction, Request, Response } from "express";
import { prismaConnection } from "../database/prisma.connection";
import { User } from "@prisma/client";

export class TweetController {
  public static async create(req: Request, res: Response) {
    try {
      const { user, content } = req.body;

      const tweetCreated = await prismaConnection.tweet.create({
        data: {
          userId: (user as User).id,
          content: content,
        },
      });

      return res.status(201).json({
        ok: true,
        message: `Tweet cadastrado com sucesso para o usuário ${
          (user as User).name
        }`,
        tweetCreated,
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
      let { limit, page } = req.query;
      const { user } = req.body;

      let limitDefault = 10;
      let pageDefault = 1;

      if (limit) {
        limitDefault = Number(limit);
      }

      if (page) {
        pageDefault = Number(page);
      }

      const tweets = await prismaConnection.tweet.findMany({
        skip: limitDefault * (pageDefault - 1),
        take: limitDefault,
        orderBy: { createdAt: "desc" },
        where: {
          userId: user.id,
        },
        include: {
          user: true,
        },
      });

      const count = await prismaConnection.tweet.count({
        where: {
          userId: user.id,
        },
      });
      return res.status(200).json({
        ok: true,
        message: "Tweets listados com sucesso",
        user: user,
        tweets: tweets,
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

  public static async update(req: Request, res: Response) {
    try {
      const { tweetId } = req.params;
      const { content, user } = req.body;

      const tweetBelongsUser = await prismaConnection.tweet.findFirst({
        where: {
          id: tweetId,
          userId: user.id,
        },
        include: {
          user: true,
        },
      });

      if (!tweetBelongsUser) {
        return res.status(400).json({
          ok: false,
          message: "Tweet inválido",
        });
      }

      const tweetUpdate = await prismaConnection.tweet.update({
        where: { id: tweetId },
        data: {
          content: content,
        },
      });

      return res.status(200).json({
        ok: true,
        message: "Tweet atualizado com sucesso",
        tweetUpdate,
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
      const { tweetId } = req.params;
      const { user } = req.body;

      const tweetBelongsUser = await prismaConnection.tweet.findFirst({
        where: {
          id: tweetId,
          userId: user.id,
        },
        include: {
          user: true,
        },
      });

      if (!tweetBelongsUser) {
        return res.status(400).json({
          ok: false,
          message: "Tweet inválido",
        });
      }

      const tweetDeleted = await prismaConnection.tweet.delete({
        where: {
          id: tweetId,
        },
      });

      return res.status(200).json({
        ok: true,
        message: "Tweet deletado com sucesso",
        tweetDeleted,
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
