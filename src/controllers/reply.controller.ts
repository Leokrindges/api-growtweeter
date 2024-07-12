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
          userId: (user as User).id,
        },
      });

      return res.status(201).json({
        ok: true,
        message: `Reply cadastrado com sucesso para o usuário ${
          (user as User).name
        }`,
        replyTweet: createTweetReply,
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

  public static async get(req: Request, res: Response) {
    try {
      const { replyId } = req.params;
      const { user } = req.body;

      const replyFound = await prismaConnection.reply.findFirst({
        where: { tweet: { type: "R", id: replyId }, userId: (user as User).id },
        select: {
          tweet: true,
          user: true,
        },
      });

      if (!replyFound) {
        return res.status(400).json({
          ok: false,
          message: "Reply não encontrado",
        });
      }

      return res.status(200).json({
        ok: true,
        message: "Reply encontrado",
        reply: replyFound,
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

  //COMO UM REPLY É UM TWEET O REPLY PODE SER ATUAIZADO PELA ROTA DE TWEETS, POR ISO COMENTEI A FUNÇÃO

  // public static async update(req: Request, res: Response) {
  //   try {
  //     const { replyId } = req.params;

  //     const { content, user } = req.body;

  //     const replyFound = await prismaConnection.reply.findFirst({
  //       where: { tweet: { type: "R", id: replyId }, userId: (user as User).id },
  //       include: {
  //         tweet: true,
  //         user: {
  //           select: {
  //             name: true,
  //             username: true,
  //           },
  //         },
  //       },
  //     });

  //     if (!replyFound) {
  //       return res.status(400).json({
  //         ok: false,
  //         message: "Reply não encontrado",
  //       });
  //     }

  //     const replyUpdated = await prismaConnection.tweet.update({
  //       where: {
  //         id: replyFound.id,
  //       },
  //       data: {
  //         content: content,
  //       },
  //     });

  //     return res.status(200).json({
  //       ok: true,
  //       message: "Reply atualizado",
  //       replyUpdated,
  //     });
  //   } catch (err) {
  //     return res.status(500).json({
  //       ok: false,
  //       message: `Ocorreu um erro inesperado. Erro: ${(err as Error).name} - ${
  //         (err as Error).message
  //       }`,
  //     });
  //   }
  // }

  public static async delete(req: Request, res: Response) {
    try {
      const { replyId } = req.params;
      const { user } = req.body;

      const replyFound = await prismaConnection.reply.findFirst({
        where: { tweetId: replyId, userId: (user as User).id },
      });

      if (!replyFound) {
        return res.status(400).json({
          ok: false,
          message: "Reply não encontrado",
        });
      }

      await prismaConnection.reply.delete({
        where: {
          id: replyFound.id,
        },
      });

      const replyDeleted = await prismaConnection.tweet.delete({
        where: {
          id: replyId,
          AND: { type: "R", userId: (user as User).id },
        },
      });

      return res.status(200).json({
        ok: true,
        message: "Reply deletado com sucesso",
        replyDeleted,
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
