import { Router } from "express";
import { bodyValidator } from "../validators/body.validator";
import { queryValidator } from "../validators/query.validator";
import { pageLimitObj,interestObj } from "@workspace/schema/interest";
import { interestController } from "../controllers/interest.controller";
import { accessTokenValidator } from "../validators/jwt.validator";

const interestRouter:Router = Router();
// @ts-ignore
interestRouter.post("/create",bodyValidator(interestObj),accessTokenValidator(),interestController.createUserInterests);
// @ts-ignore
interestRouter.put("/update",bodyValidator(interestObj),accessTokenValidator(),interestController.updateUserInterests);
// @ts-ignore
interestRouter.get("/",queryValidator(pageLimitObj),interestController.getInterests);
// @ts-ignore
interestRouter.get("/user",queryValidator(pageLimitObj),accessTokenValidator(),interestController.getUserInterests);


export default interestRouter;