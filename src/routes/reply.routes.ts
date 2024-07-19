import { Router } from "express";
import { ReplyController } from "../controllers/reply.controller";
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";
import { ValidUuidParamsMiddleware } from '../middlewares/common/valid-uuid-params.middleware';

export class ReplyRoutes {
  public static execute(): Router {
    const router = Router();

    router.post("/:id", [AuthMiddleware.validate, ValidUuidParamsMiddleware.validate], ReplyController.create)
    router.get("/:id", [AuthMiddleware.validate, ValidUuidParamsMiddleware.validate], ReplyController.get)
    router.delete("/:id", [AuthMiddleware.validate, ValidUuidParamsMiddleware.validate], ReplyController.delete)

    return router;
  }
}




