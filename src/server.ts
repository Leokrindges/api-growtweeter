import cors from "cors";
import "dotenv/config";
import express from "express";
import { AuthRoutes } from "./routes/auth.routes";
import { FeedRoutes } from "./routes/feed.routes";
import { FollowersRoutes } from "./routes/followers.routes";
import { LikeRoutes } from "./routes/like.routes";
import { ReplyRoutes } from "./routes/reply.routes";
import { TweetRoutes } from "./routes/tweet.routes";
import { UserRoutes } from "./routes/users.routes";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/user", UserRoutes.execute());
app.use("/auth", AuthRoutes.execute());
app.use("/tweet", TweetRoutes.execute());
app.use("/like", LikeRoutes.execute());
app.use("/follower", FollowersRoutes.execute());
app.use("/reply", ReplyRoutes.execute());
app.use("/feed", FeedRoutes.execute());

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
