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

  public static async update(req: Request, res: Response){

  }

  public static async delete(req: Request, res: Response) {
    try {
      const { tweetId } = req.params;

      const tweetBelongsUser = await prismaConnection.tweet.findFirst({
        where: { userId: req.headers.authorization, id: tweetId },
      });

      if(!tweetBelongsUser){
        return res.status(400).json({
            ok: false,
            message: "Tweet inválido para este usuário"
        })
      }

      const tweetDeleted = await prismaConnection.tweet.delete({
        where: {
          id: tweetId,
          deleted: false,
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
