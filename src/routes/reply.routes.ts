import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";
import { ReplyController } from "../controllers/reply.controller";

export class ReplyRoutes {
  public static execute(): Router {
    const router = Router();

    router.post("/:tweetId", [AuthMiddleware.validate], ReplyController.create)
    router.get("/:replyId", [AuthMiddleware.validate], ReplyController.get)
    // router.put("/:replyId", [AuthMiddleware.validate], ReplyController.update)
    router.delete("/:replyId", [AuthMiddleware.validate], ReplyController.delete)

    return router;
  }
}
