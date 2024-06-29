import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";
import { UnfollowerController } from "../controllers/unfollower.controller";

export class UnfollowRoutes {
  public static execute() {
    const router = Router();

    router.delete(
      "/:followerId",
      [AuthMiddleware.validate],
      UnfollowerController.unfollower
    );

    return router;
  }
}
