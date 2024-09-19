import { Like } from "@prisma/client";
import { randomUUID } from "crypto";
import { TweetUser } from "../../../../../src/dtos/tweetUser.dto";

export class LikeMock {
  public static buildFakeLike(): Like {
    return {
      id: randomUUID(),
      userId: randomUUID(),
      tweetId: randomUUID(),
      likedIn: new Date().toISOString() as unknown as Date,
    };
  }
  public static buildCreateLikeDTO(): TweetUser {
    return {
      userId: randomUUID(),
      tweetId: randomUUID(),
    };
  }
}
