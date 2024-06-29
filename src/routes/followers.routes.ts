import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";
import { FollowersController } from "../controllers/folowers.controller";

export class FollowersRoutes{
    public static execute(){
        const router = Router()

        router.get("/", [AuthMiddleware.validate], FollowersController.showFollowers)

        return router
    }
}