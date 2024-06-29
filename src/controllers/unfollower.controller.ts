import { User } from "@prisma/client";
import { Request, Response } from "express";
import { prismaConnection } from "../database/prisma.connection";

export class UnfollowerController {
  public static async unfollower(req: Request, res: Response) {
    try {
      const { followerId } = req.params;
      const { user } = req.body;

      if (followerId === (user as User).id) {
        return res.status(400).json({
          ok: false,
          message: "Não é possivel deixar seguir a si mesmo",
        });
      }

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
        where: { followerId: userFound.id, userId: (user as User).id },
        include: {
          follower: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!checkAlredyFollow) {
        return res.status(400).json({
          ok: false,
          message: `O usuário ${(user as User).name} não segue ${
            userFound.name
          }`,
        });
      }

      const unfollow = await prismaConnection.follower.delete({
        where: {
          id: checkAlredyFollow.id,
        },
      });

      return res.status(201).json({
        ok: true,
        message: "Deixar de seguir realizado com sucesso",
        unfollow,
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
