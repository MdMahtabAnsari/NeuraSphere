import {Express} from 'express';
import authRoute from './auth.route';
import errorHandler from "../middlewares/errorHandler.middleware";
import otpRouter from './otp.route';
import userRouter from './user.route';
import postRouter from './post.route';
import postReactionRouter from './postReaction.route';
import commentRouter from './comment.route';
import commentReactionRouter from './commentReaction.route';
import viewsRoute from "./views.route";
import friendRouter from './friend.route';
import interestRouter from './interest.route';
import followerRouter from './follower.route';

const routes = (app:Express) => {
    app.use("/api/auth",authRoute);
    app.use("/api/otp",otpRouter);
    app.use("/api/users",userRouter);
    app.use("/api/users/interests",interestRouter);
    app.use("/api/posts",postRouter);
    app.use("/api/posts/reactions",postReactionRouter);
    app.use("/api/comments",commentRouter);
    app.use("/api/comments/reactions",commentReactionRouter);
    app.use("/api/views",viewsRoute);
    app.use("/api/friends",friendRouter);
    app.use("/api/followers",followerRouter);
    app.use(errorHandler);
}

export default routes;