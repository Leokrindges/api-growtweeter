import { Router } from "express"
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";
import { TweetController } from "../controllers/tweet.controller";


export class TweetRoutes{
    public static execute(): Router{
        const router = Router();
        
        router.post("/", [AuthMiddleware.validate], TweetController.create)
        router.get("/", [], )
        router.put("/:")
        router.delete("/:tweetId", TweetController.delete)

        return router;
    }
}