import { Router } from "express";
import { UsersControler } from "../controllers/user.controller";
import { CreateUsersMiddleware } from "../middlewares/users.middlewares";
import { EmailValidateMiddleware } from "../middlewares/emailValidate.middleware";
import { UsernameValidateMiddleware } from "../middlewares/UsernameValidate.middleware copy";

export class UserRoutes {
  public static execute(): Router {
    const router = Router();

    // definições de rotas para um usuário
    router.post(
      "/",
      [CreateUsersMiddleware.validate],
      [EmailValidateMiddleware.validateEmail],
      [UsernameValidateMiddleware.validateEmail],
      UsersControler.create
    );
    router.get("/", UsersControler.list);
    router.get("/:userId", UsersControler.get);
    router.put(
      "/:userId",
      [CreateUsersMiddleware.validate],
      [EmailValidateMiddleware.validateEmail],
      [UsernameValidateMiddleware.validateEmail],
      UsersControler.update
    );
    router.delete("/:userId", UsersControler.delete);

    return router;
  }
}
