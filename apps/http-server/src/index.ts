import express from 'express';
import serverConfig from "./configs/server.config";
import routes from "./routes/index";
import morgan from "morgan";
import helmet from 'helmet';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import "./strategies"
const app = express();
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

routes(app);

app.listen(serverConfig.PORT,() =>{
  console.log(`Server is running on http://localhost:${serverConfig.PORT}`);
});