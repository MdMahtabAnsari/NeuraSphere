import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { updateUser ,identifierObj,pageLimitObj} from "@workspace/schema/user";
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
userRouter.get("/profile/:identifier",paramsValidator(identifierObj),accessTokenValidator(),userController.getProfile);

userRouter.get("/:identifier",paramsValidator(identifierObj),queryValidator(pageLimitObj),accessTokenValidator(),userController.getUsers);

export default userRouter;