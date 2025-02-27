import {Express} from 'express';
import authRoute from './auth.route';
import errorHandler from "../middlewares/errorHandler.middleware";
import otpRouter from './otp.route';
import userRouter from './user.route';

const routes = (app:Express) => {
    app.use("/api/auth",authRoute);
    app.use("/api/otp",otpRouter);
    app.use("/api/users",userRouter);
    app.use(errorHandler);
}

export default routes;