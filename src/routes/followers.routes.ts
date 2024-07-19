import { Router } from "express";
import { FollowersController } from "../controllers/followers.controller";
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";
import { ValidUuidParamsMiddleware } from '../middlewares/common/valid-uuid-params.middleware';

export class FollowersRoutes{
    public static execute(){
        const router = Router()

        router.post(
            "/follow/:id",
            [AuthMiddleware.validate, ValidUuidParamsMiddleware.validate],
            FollowersController.follow
        );

        router.delete(
            "/unfollow/:id",
            [AuthMiddleware.validate, ValidUuidParamsMiddleware.validate],
            FollowersController.unfollow
        );

        router.get("/", [AuthMiddleware.validate], FollowersController.showFollowers); 

        router.get(
            "/following",
            [AuthMiddleware.validate],
            FollowersController.showFollowing
        ); 

        return router
    }
}