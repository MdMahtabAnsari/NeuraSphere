import {commentReactionController} from "../controllers/commentReaction.controller";
import {Router} from "express";
import {accessTokenValidator} from "../validators/jwt.validator";
import {paramsValidator} from "../validators/params.validator";
import {queryValidator} from "../validators/query.validator";
import {bodyValidator} from "../validators/body.validator";
import {postIdCommentIdObj} from "@workspace/schema/reaction";

const commentReactionRouter:Router = Router();

commentReactionRouter.post("like");