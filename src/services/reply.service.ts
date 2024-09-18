import { Tweet } from "@prisma/client";
import { HttpError } from "../errors/http.error";
import { CreateReply } from "../dtos/create-reply.dto";
import { TweetUser } from "../dtos/tweetUser.dto";
import prismaConnection from "../database/prisma.connection";

export class ReplyService {
  public async createReply(input: CreateReply): Promise<Tweet> {
    const tweetFound = await prismaConnection.tweet.findFirst({
      where: { id: input.tweetId },
    });

    if (!tweetFound) throw new HttpError("Tweet não encontrado", 404);

    const createTweetReply = await prismaConnection.tweet.create({
      data: {
        userId: input.userId,
        content: input.content,
        type: "R",
      },
    });

    await prismaConnection.reply.create({
      data: {
        tweetOriginalId: input.tweetId,
        tweetReplyId: createTweetReply.id,
      },
    });

    return createTweetReply;
  }

  public async getReplyById(input: TweetUser): Promise<Tweet> {
    const replyFound = await prismaConnection.tweet.findFirst({
      where: { userId: input.userId, id: input.tweetId, type: "R" },
    });

    if (!replyFound) throw new HttpError("Reply não encontrado", 404);

    return replyFound;
  }

  public async deleteReply(input: TweetUser): Promise<Tweet> {
    const replyFound = await prismaConnection.reply.findFirst({
      where: { tweetReplyId: input.tweetId },
    });

    if (!replyFound) throw new HttpError("Reply não encontrado", 404);

    await prismaConnection.reply.delete({
      where: {
        id: replyFound.id,
      },
    });

    const replyDeleted = await prismaConnection.tweet.delete({
      where: {
        id: input.tweetId,
        AND: { type: "R", userId: input.userId },
      },
    });

    return replyDeleted;
  }
}
