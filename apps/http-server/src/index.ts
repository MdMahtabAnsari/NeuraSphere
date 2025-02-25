import express from 'express';
import serverConfig from "./configs/server.config";
import routes from "./routes";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

app.listen(serverConfig.PORT,() =>{
  console.log(`Server is running on http://localhost:${serverConfig.PORT}`);
});