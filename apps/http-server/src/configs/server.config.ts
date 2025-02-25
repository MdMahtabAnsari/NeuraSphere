import {config} from "dotenv";
config();

const serverConfig = {
    PORT: process.env.PORT || "3001",
}

export default serverConfig;