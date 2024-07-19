import { Router } from "express";
import { TweetController } from "../controllers/tweet.controller";
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";
import { ValidUuidParamsMiddleware } from '../middlewares/common/valid-uuid-params.middleware';
import { CreateTweetMiddleware } from "../middlewares/tweet/tweet.middlewares";

export class TweetRoutes {
  public static execute(): Router {
    const router = Router();

    router.post(
      "/",
      [AuthMiddleware.validate],
      [CreateTweetMiddleware.validate],
      TweetController.create
    );
    router.get("/", [AuthMiddleware.validate], TweetController.list);
    router.put("/:id", [AuthMiddleware.validate, ValidUuidParamsMiddleware.validate], TweetController.update);
    router.delete(
      "/:id",
      [AuthMiddleware.validate, ValidUuidParamsMiddleware.validate],
      TweetController.delete
    );

    return router;
  }
}
