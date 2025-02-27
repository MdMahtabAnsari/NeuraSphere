import {authController} from "../controllers/auth.controller";
import {Router} from "express";
import {signup,login} from "@workspace/schema/auth";
import {bodyValidator} from "../validators/body.validator";
import { refreshTokenValidator,accessTokenValidator } from "../validators/jwt.validator";
import {updateUserOtpBasedPassword} from "@workspace/schema/user";

const authRoute :Router = Router();

authRoute.post("/signup",bodyValidator(signup),authController.signup);
authRoute.post("/login",bodyValidator(login),authController.login);
// @ts-ignore
authRoute.post("/refresh",refreshTokenValidator(),authController.refresh);
// @ts-ignore
authRoute.post("/reset-password",bodyValidator(updateUserOtpBasedPassword),accessTokenValidator(),authController.updateUserOtpBasedPassword);

export default authRoute;

