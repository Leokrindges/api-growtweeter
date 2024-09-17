import { Request, Response } from "express";
import { TweetService } from "../services/tweet.service";
import { onError } from "../utils/on-error.util";

export class TweetController {
  public static async create(req: Request, res: Response) {
    try {
      const { user, content } = req.body;

      const service = new TweetService();
      const data = service.createTweet({ content, userId: user.id });

      return res.status(201).json({
        ok: true,
        message: `Tweet cadastrado com sucesso`,
        data,
      });
    } catch (err) {
      return onError(err, res);
    }
  }

  public static async list(req: Request, res: Response) {
    try {
      let { limit, page } = req.query;
      const { user } = req.body;

      const service = new TweetService();
      const listTweets = await service.listTweets({
        limit: Number(limit),
        page: Number(page),
        userId: user.id,
      });

      return res.status(200).json({
        ok: true,
        message: "Tweets listados com sucesso",
        user: user,
        tweets: listTweets.tweet,
        pagination: listTweets.pagination,
      });
    } catch (err) {
      return onError(err, res);
    }
  }

  public static async update(req: Request, res: Response) {
    try {
      const tweetId = req.params.id;
      const { content, user } = req.body;

      const service = new TweetService();

      const data = service.updateTweets({ tweetId, content, userId: user.id });

      return res.status(200).json({
        ok: true,
        message: "Tweet atualizado com sucesso",
        data,
      });
    } catch (err) {
      return onError(err, res);
    }
  }

  public static async delete(req: Request, res: Response) {
    try {
      const tweetId = req.params.id;
      const { user } = req.body;

      const service = new TweetService();
      const data = service.deleteTweets({ tweetId, userId: user.id });

      return res.status(200).json({
        ok: true,
        message: "Tweet deletado com sucesso",
        data,
      });
    } catch (err) {
      return onError(err, res);
    }
  }
}
