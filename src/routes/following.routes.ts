import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";
import { FollowingController } from "../controllers/following.controller";

export class FollowingRoutes {
  public static execute() {
    const router = Router();

    router.get(
      "/",
      [AuthMiddleware.validate],
      FollowingController.showFollowing
    );

    return router;
  }
}
