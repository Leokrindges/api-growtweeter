import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";
import { FollowController } from "../controllers/follow.controler";

export class FollowRoutes {
  public static execute() {
    const router = Router();

    router.post(
      "/:followerId",
      [AuthMiddleware.validate],
      FollowController.follow
    );

    return router;
  }
}
