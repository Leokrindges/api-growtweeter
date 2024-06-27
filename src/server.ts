import cors from "cors";
import "dotenv/config";
import express from "express";
import { UserRoutes } from "./routes/users.routes";
import { AuthRoutes } from "./routes/auth.routes";
import { TweetRoutes } from "./routes/tweet.routes";
import { LikeRoutes } from "./routes/like.routes";
import { ReplyRoutes } from "./routes/reply.routes";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/user", UserRoutes.execute());
app.use("/auth", AuthRoutes.execute());
app.use("/tweet", TweetRoutes.execute());
app.use("/like", LikeRoutes.execute());
app.use("/reply", ReplyRoutes.execute())

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
