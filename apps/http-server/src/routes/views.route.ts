import {postIdObj} from "@workspace/schema/views";
import {bodyValidator} from "../validators/body.validator";
import {paramsValidator} from "../validators/params.validator";
import {viewsController} from "../controllers/views.controller";
import {accessTokenValidator} from "../validators/jwt.validator";
import {Router} from "express";

const viewsRouter:Router = Router();
// @ts-ignore
viewsRouter.post("/",bodyValidator(postIdObj),accessTokenValidator(),viewsController.createView);

export default viewsRouter;