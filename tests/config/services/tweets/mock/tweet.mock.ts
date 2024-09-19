import { Tweet } from "@prisma/client";
import { randomUUID } from "crypto";
import { CreateTweet } from "../../../../../src/dtos/create-tweet.dto";
import { updateTweetDTO } from "../../../../../src/dtos/update-tweet.dto";
import { TweetUser } from "../../../../../src/dtos/tweetUser.dto";

export class TweetMock {
  public static buildFakeTweet(): Tweet {
    return {
      id: randomUUID(),
      userId: randomUUID(),
      content: "test",
      type: "N",
      createdAt: new Date().toISOString() as unknown as Date,
    };
  }

  public static buildCreateTweetDTO(): CreateTweet {
    return {
      content: "teste1",
      userId: randomUUID(),
    };
  }

  public static buildUpdateTweetDTO(): updateTweetDTO {
    return {
      tweetId: randomUUID(),
      content: "teste2",
      userId: randomUUID(),
    };
  }

  public static buildTweetUser(): TweetUser {
    return {
      userId: randomUUID(),
      tweetId: randomUUID(),
    };
  }
}
