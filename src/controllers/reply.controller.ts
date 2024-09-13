import { User } from "@prisma/client";
import { Request, Response } from "express";
import { prismaConnection } from "../database/prisma.connection";
import { ReplyService } from "../services/reply.service";
import { onError } from "../utils/on-error.util";

export class ReplyController {
  public static async create(req: Request, res: Response) {
    try {
      const tweetId = req.params.id;
      const { user, content } = req.body;

      const service = new ReplyService();

      const createTweetReply = service.createReply({
        content,
        tweetId,
        userId: user.id,
      });

      return res.status(201).json({
        ok: true,
        message: `Reply cadastrado com sucesso!`,
        replyTweet: createTweetReply,
      });
    } catch (err) {
      return onError(err, res);
    }
  }

  public static async get(req: Request, res: Response) {
    try {
      const tweetId = req.params.id;
      const { user } = req.body;

      const service = new ReplyService();
      const replyFound = service.getReplyById({
        tweetId,
        userId: user.id,
      });

      return res.status(200).json({
        ok: true,
        message: "Reply encontrado",
        reply: replyFound,
      });
    } catch (err) {
      return onError(err, res);
    }
  }

  public static async delete(req: Request, res: Response) {
    try {
      const tweetId = req.params.id;
      const { user } = req.body;

      const service = new ReplyService();
      const replyDeleted = service.deleteReply({ tweetId, userId: user.id });

      return res.status(200).json({
        ok: true,
        message: "Reply deletado com sucesso",
        replyDeleted,
      });
    } catch (err) {
      return onError(err, res);
    }
  }
}
