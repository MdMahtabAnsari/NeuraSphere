import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { updateUser } from "@workspace/schema/user";
import { bodyValidator } from "../validators/body.validator";
import { accessTokenValidator } from "../validators/jwt.validator";
import {updateUserOldPassword} from "@workspace/schema/user";
const userRouter:Router = Router();

// @ts-ignore
userRouter.put('/update',bodyValidator(updateUser),accessTokenValidator(),userController.updateUser);
// @ts-ignore
userRouter.put("/update/password",bodyValidator(updateUserOldPassword),accessTokenValidator(),userController.updateUserOldPassword);

export default userRouter;