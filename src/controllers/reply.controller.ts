import { Request, Response } from "express";
import { prismaConnection } from "../database/prisma.connection";
import { User } from "@prisma/client";

export class ReplyController {
  public static async create(req: Request, res: Response) {
    try {
      const { tweetId } = req.params;
      const { user, content } = req.body;

      const tweetFound = await prismaConnection.tweet.findFirst({
        where: { id: tweetId },
      });

      if (!tweetFound) {
        return res.status(400).json({
          ok: false,
          message: "Tweet não encontrado",
        });
      }

      const createTweetReply = await prismaConnection.tweet.create({
        data: {
          userId: (user as User).id,
          content: content,
          type: "R",
        },
      });

      await prismaConnection.reply.create({
        data: {
          tweetId: tweetId,
          userId: (user as User).id
        }
      })

      //conta quantos replys o tweet tem
      const countReply = await prismaConnection.reply.count({
        where: {
          tweetId: tweetId,
        },
      });

      return res.status(201).json({
        ok: true,
        message: `Reply cadastrado com sucesso para o usuário ${
          (user as User).name
        }`,
        originalTweet: tweetFound,
        replyTweet: createTweetReply,
        totalReply: countReply
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
