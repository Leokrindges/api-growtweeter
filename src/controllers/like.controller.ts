import { Request, Response } from "express";
import { prismaConnection } from "../database/prisma.connection";
import { User } from "@prisma/client";
import { LikeService } from "../services/like.service";

export class LikeController {
  public static async createLike(req: Request, res: Response) {
    try {
      const { tweetId } = req.params;
      const { user } = req.body;

      const service = new LikeService();
      const isLiked = await service.createLike({ tweetId, userId: user.id });
      
      if (isLiked) {
        return res.status(201).json({
          ok: true,
          message: "Tweet curtido com sucesso",
        });
      } else {
        return res.status(201).json({
          ok: true,
          message: "Like removido com sucesso",
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
