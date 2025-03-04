import { Router } from "express";
import { postReactionController } from "../controllers/postReaction.controller";
import {parmsValidator} from "../validators/params.validator";
import { queryValidator } from "../validators/query.validator";
import { idObject,pageLimitObj } from "@workspace/schema/reaction";
import { accessTokenValidator } from "../validators/jwt.validator";


const postReactionRouter:Router = Router();
// @ts-ignore
postReactionRouter.post("/:id/like",parmsValidator(idObject),accessTokenValidator(),postReactionController.likePost);
// @ts-ignore
postReactionRouter.post("/:id/dislike",parmsValidator(idObject),accessTokenValidator(),postReactionController.dislikePost);
// @ts-ignore
postReactionRouter.delete("/:id/like",parmsValidator(idObject),accessTokenValidator(),postReactionController.unLikePost);
// @ts-ignore
postReactionRouter.delete("/:id/dislike",parmsValidator(idObject),accessTokenValidator(),postReactionController.removeDislikePost);

postReactionRouter.get('/:id/users/like',parmsValidator(idObject),accessTokenValidator(),queryValidator(pageLimitObj),postReactionController.getLikedUsers);

postReactionRouter.get('/:id/users/dislike',parmsValidator(idObject),queryValidator(pageLimitObj),accessTokenValidator(),postReactionController.getDislikedUsers);

export default postReactionRouter;