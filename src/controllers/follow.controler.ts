import { Request, Response } from "express";
import { prismaConnection } from "../database/prisma.connection";
import { User } from "@prisma/client";

export class FollowController {
  public static async follow(req: Request, res: Response) {
    try {
      const { followerId } = req.params;
      const { user } = req.body;

      const userFound = await prismaConnection.user.findFirst({
        where: { id: followerId },
      });

      if (!userFound) {
        return res.status(400).json({
          ok: false,
          message: "Usuário inválido",
        });
      }
      const checkAlredyFollow = await prismaConnection.follower.findFirst({
        where: { followerId: followerId, userId: (user as User).id },
        include: {
          follower: {
            select: {
              name: true,
            },
          },
        },
      });

      if (checkAlredyFollow) {
        return res.status(400).json({
          ok: false,
          message: `O usuário ${(user as User).name} já segue ${
            checkAlredyFollow.follower.name
          }`,
        });
      }

      const createFollower = await prismaConnection.follower.create({
        data: {
          userId: (user as User).id,
          followerId: followerId,
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
}
