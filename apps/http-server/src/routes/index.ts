import {Express} from 'express';
import authRoute from './auth.route';
import errorHandler from "../middlewares/errorHandler.middleware";
import otpRouter from './otp.route';
import userRouter from './user.route';
import postRouter from './post.route';
import postReactionRouter from './postReaction.route';
import commentRouter from './comment.route';
import commentReactionRouter from './commentReaction.route';

const routes = (app:Express) => {
    app.use("/api/auth",authRoute);
    app.use("/api/otp",otpRouter);
    app.use("/api/users",userRouter);
    app.use("/api/posts",postRouter);
    app.use("/api/posts/reactions",postReactionRouter);
    app.use("/api/comments",commentRouter);
    app.use("/api/comments/reactions",commentReactionRouter);
    app.use(errorHandler);
}

export default routes;