import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";
import { ShowFeedController } from "../controllers/showFeed.controller";

export class FeedRoutes {
  public static execute() {
    const router = Router();

    router.get("/", [AuthMiddleware.validate], ShowFeedController.showFeed);

    return router;
  }
}
