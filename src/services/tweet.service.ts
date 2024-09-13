import { Tweet } from "@prisma/client";
import { prismaConnection } from "../database/prisma.connection";
import { ListTweetDTO } from "../dtos/list-tweet.dto";
import { updateTweetDTO } from "../dtos/update-tweet.dto";
import { HttpError } from "../errors/http.error";
import { DeleteTweet } from "../dtos/delete-tweet.dto";
import { CreateTweet } from "../dtos/create-tweet.dto";

export class TweetService {
  public async createTweet(input: CreateTweet): Promise<Tweet> {
    const data = await prismaConnection.tweet.create({
      data: {
        userId: input.userId,
        content: input.content,
      },
    });

    return data
  }
  public async listTweets(input: ListTweetDTO): Promise<any> {
    let limitDefault = 10;
    let pageDefault = 1;

    if (input.limit) {
      limitDefault = Number(input.limit);
    }

    if (input.page) {
      pageDefault = Number(input.page);
    }

    const tweets = await prismaConnection.tweet.findMany({
      skip: limitDefault * (pageDefault - 1),
      take: limitDefault,
      orderBy: { createdAt: "desc" },
      where: {
        userId: input.userId,
      },
      include: {
        _count: { select: { like: true, reply: true } },
      },
    });

    const tweetsLiked = await prismaConnection.like.findMany({
      where: { tweet: { id: input.userId } },
    });

    const count = await prismaConnection.tweet.count({
      where: {
        userId: input.userId,
      },
    });

    return {
      tweets: tweets,
      pagination: {
        limit: limitDefault,
        page: pageDefault,
        count: count,
        totalPages: Math.ceil(count / limitDefault),
      },
    };
  }

  public async updateTweets(input: updateTweetDTO): Promise<Tweet> {
    const tweetBelongsUser = await prismaConnection.tweet.findFirst({
      where: {
        id: input.tweetId,
        userId: input.userId,
      },
    });

    if (!tweetBelongsUser) throw new HttpError("Tweet não encontrado", 404);

    const data = await prismaConnection.tweet.update({
      where: { id: input.tweetId },
      data: {
        content: input.content,
      },
    });

    return data;
  }

  public async deleteTweets(input: DeleteTweet): Promise<Tweet> {
    const tweetBelongsUser = await prismaConnection.tweet.findFirst({
      where: {
        id: input.tweetId,
        userId: input.userId,
      },
    });

    if (!tweetBelongsUser) throw new HttpError("Tweet não encontrado", 404);

    const data = await prismaConnection.tweet.delete({
      where: {
        id: input.tweetId,
      },
    });

    return data;
  }
}
