import prismaConnection from "../database/prisma.connection";
import { TweetUser } from "../dtos/tweetUser.dto";
import { HttpError } from "../errors/http.error";

export class LikeService {
  public async createLike(input: TweetUser): Promise<boolean> {
    const whosTweet = await prismaConnection.tweet.findMany({
      where: { id: input.tweetId, userId: input.userId },
      include: {
        user: true,
      },
    });

    if (whosTweet.length > 0)
      throw new HttpError("Não é possivel curtir seu próprio tweet", 400);

    const tweetFound = await prismaConnection.tweet.findFirst({
      where: { id: input.tweetId },
    });

    if (!tweetFound) throw new HttpError("Tweet não encontrado", 404);

    //verifica se user já curtiu o tweet
    const userliked = await prismaConnection.like.count({
      where: {
        tweetId: input.tweetId,
        userId: input.userId,
      },
    });

    if (userliked) {
      await prismaConnection.like.deleteMany({
        where: {
          tweetId: input.tweetId,
          userId: input.userId,
        },
      });

      return false;
    }
    await prismaConnection.like.create({
      data: {
        tweetId: input.tweetId,
        userId: input.userId,
      },
    });

    return true;
  }
}
