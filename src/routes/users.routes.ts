import { Router } from "express";
import { UsersControler } from "../controllers/user.controller";
import { ValidUuidParamsMiddleware } from '../middlewares/common/valid-uuid-params.middleware';
import { UpdateUsersMiddleware } from '../middlewares/user/update-users.middlewares';
import { CreateUsersMiddleware } from "../middlewares/user/users.middlewares";

export class UserRoutes {
  public static execute(): Router {
    const router = Router();

    // definições de rotas para um usuário
    router.post("/", [CreateUsersMiddleware.validate], UsersControler.create);
    router.get("/", UsersControler.list);
    router.put(
      "/:id",
      [ValidUuidParamsMiddleware.validate, UpdateUsersMiddleware.validate],
      UsersControler.update
    );
    router.delete("/:id", [ValidUuidParamsMiddleware.validate], UsersControler.delete);

    return router;
  }
}
