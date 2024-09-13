import { User } from "@prisma/client";
import { prismaConnection } from "../database/prisma.connection";
import { Request, Response } from "express";
import { ok } from "assert";
import { onError } from "../utils/on-error.util";

export class ShowFeedController {
  public static async showFeed(req: Request, res: Response) {
    try {
      const { user } = req.body;

      const followersIds = await prismaConnection.follower.findMany({
        where: { userId: user.id },
        select: { followerId: true },
      });

      const userIds = followersIds.map((follower) => follower.followerId);
      userIds.push((user as User).id);

      const feed = await prismaConnection.tweet.findMany({
        orderBy: { createdAt: "desc" },
        where: { userId: { in: userIds } },
        include: {
          user:true,
          _count:true,          
        },
      });

      return res.status(200).json({
        ok: true,
        message: "Listado Feed com sucesso",
        feed,

      });
    } catch (err) {
      return onError(err, res);

    }
  }
}
