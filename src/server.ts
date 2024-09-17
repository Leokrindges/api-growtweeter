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
import swaggerUI from 'swagger-ui-express';
import swaggerDoc from './docs/swagger.json';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (_, res) => {
  res.status(200).json({
    message: 'Hello Growdever!',
    ok: true,
  });
});

app.use('/docs', swaggerUI.serve);
app.get('/docs', swaggerUI.setup(swaggerDoc));

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
