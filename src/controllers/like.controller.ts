import { Request, Response } from "express";
import { prismaConnection } from "../database/prisma.connection";
import { User } from "@prisma/client";

export class LikeController {
  public static async createLike(req: Request, res: Response) {
    try {
      const { tweetId } = req.params;
      const { user } = req.body;

      //levei em consideração que um usuário não pode curtir seu próprio tweet
      const whosTweet = await prismaConnection.tweet.findMany({
        where: { id: tweetId, userId: (user as User).id },
        include: {
          user: true,
        },
      });

      if (whosTweet.length > 0) {
        return res.status(400).json({
          ok: false,
          message: "Não é possivel curtir seu próprio tweet",
        });
      }

      const tweetFound = await prismaConnection.tweet.findFirst({
        where: { id: tweetId },
      });

      if (!tweetFound) {
        return res.status(400).json({
          ok: false,
          message: "Tweet não encontrado",
        });
      }

      //verifica se user já curtiu o tweet
      const userliked = await prismaConnection.like.count({
        where: {
          tweetId: tweetId,
          userId: user.id,
        },
      });

      //conta quantos likes o tweet tem
      const countLiked = await prismaConnection.like.count({
        where: {
          tweetId: tweetId,
        },
      });

      if (userliked) {
        const tweetRemoveLike = await prismaConnection.like.deleteMany({
          where: {
            tweetId: tweetId,
            userId: user.id,
          },
        });

        return res.status(201).json({
          ok: true,
          message: "Like removido com sucesso",
          tweetRemoveLike,
          totalLikes: countLiked - 1,
        });
      } else {
        const tweetLiked = await prismaConnection.like.create({
          data: {
            tweetId: tweetId,
            userId: user.id,
          },
        });

        return res.status(201).json({
          ok: true,
          message: "Tweet curtido com sucesso",
          tweetLiked,
          totalLikes: countLiked + 1,
        });
      }
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
