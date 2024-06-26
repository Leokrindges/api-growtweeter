import { Router } from "express";
import { UsersControler } from "../controllers/user.controller";
import { CreateUsersMiddleware } from "../middlewares/user/users.middlewares";

export class UserRoutes {
  public static execute(): Router {
    const router = Router();

    // definições de rotas para um usuário
    router.post("/", [CreateUsersMiddleware.validate], UsersControler.create);
    router.get("/", UsersControler.list);
    router.get("/:userId", UsersControler.get);
    router.put(
      "/:userId",
      [CreateUsersMiddleware.validate],
      UsersControler.update
    );
    router.delete("/:userId", UsersControler.delete);

    return router;
  }
}
