import {authController} from "../controllers/auth.controller";
import {Router} from "express";

const authRoute :Router = Router();

authRoute.post("/signup",authController.signup);

export default authRoute;

