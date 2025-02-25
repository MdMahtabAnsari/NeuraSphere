import {Express} from 'express';
import authRoute from './auth.route';
import errorHandler from "../middlewares/errorHandler.middleware";

const routes = (app:Express) => {
    app.use("/api/auth",authRoute);
    app.use(errorHandler);
}

export default routes;