import { Router } from "express";
import { postReactionController } from "../controllers/postReaction.controller";
import {paramsValidator} from "../validators/params.validator";
import { queryValidator } from "../validators/query.validator";
import {bodyValidator} from "../validators/body.validator";
import { pageLimitObj,postIdObj } from "@workspace/schema/reaction";
import { accessTokenValidator } from "../validators/jwt.validator";


const postReactionRouter:Router = Router();
// @ts-ignore
postReactionRouter.post("/like",bodyValidator(postIdObj),accessTokenValidator(),postReactionController.likePost);
// @ts-ignore
postReactionRouter.post("/dislike",bodyValidator(postIdObj),accessTokenValidator(),postReactionController.dislikePost);
// @ts-ignore
postReactionRouter.delete("/:postId/like",paramsValidator(postIdObj),accessTokenValidator(),postReactionController.unLikePost);
// @ts-ignore
postReactionRouter.delete("/:postId/dislike",paramsValidator(postIdObj),accessTokenValidator(),postReactionController.removeDislikePost);

postReactionRouter.get('/:postId/users/like',paramsValidator(postIdObj),accessTokenValidator(),queryValidator(pageLimitObj),postReactionController.getLikedUsers);

postReactionRouter.get('/:postId/users/dislike',paramsValidator(postIdObj),queryValidator(pageLimitObj),accessTokenValidator(),postReactionController.getDislikedUsers);

export default postReactionRouter;