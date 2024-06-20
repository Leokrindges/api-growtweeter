import { Router } from "express";
import { UsersControler } from "../controllers/user.controller";

export class UserRoutes {
  public static execute(): Router {
    const router = Router();

    // definições de rotas para um usuário
    router.post("/", UsersControler.create);
    router.get("/", UsersControler.list);
    router.get("/:userId", UsersControler.get);
    router.put("/:userId", UsersControler.update);
    router.delete("/:userId", UsersControler.delete);

    return router;
  }
}
