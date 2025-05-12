import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { updateUser ,identifierObj,pageLimitObj,usernameObj,emailObj,mobileObj} from "@workspace/schema/user";
import { bodyValidator } from "../validators/body.validator";
import { paramsValidator } from "../validators/params.validator";
import { queryValidator } from "../validators/query.validator";
import { accessTokenValidator } from "../validators/jwt.validator";
import {updateUserOldPassword} from "@workspace/schema/user";
const userRouter:Router = Router();

// @ts-ignore
userRouter.put('/update',bodyValidator(updateUser),accessTokenValidator(),userController.updateUser);
// @ts-ignore
userRouter.put("/update/password",bodyValidator(updateUserOldPassword),accessTokenValidator(),userController.updateUserOldPassword);
// @ts-ignore
userRouter.get("/profile/me",accessTokenValidator(),userController.getMyProfile);
// @ts-ignore
userRouter.get("/profile/:identifier",paramsValidator(identifierObj),accessTokenValidator(),userController.getProfile);

userRouter.get("/:identifier",paramsValidator(identifierObj),queryValidator(pageLimitObj),accessTokenValidator(),userController.getUsers);
userRouter.get("/isAvailable/username/:username",paramsValidator(usernameObj),userController.isUsernameAvailable);
userRouter.get("/isAvailable/email/:email",paramsValidator(emailObj),userController.isEmailAvailable);
userRouter.get("/isAvailable/mobile/:mobile",paramsValidator(mobileObj),userController.isMobileAvailable);
userRouter.get("/isValid/email/:email", paramsValidator(emailObj), userController.isValidEmail);

export default userRouter;