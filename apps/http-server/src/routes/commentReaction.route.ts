import {commentReactionController} from "../controllers/commentReaction.controller";
import {Router} from "express";
import {accessTokenValidator} from "../validators/jwt.validator";
import {paramsValidator} from "../validators/params.validator";
import {queryValidator} from "../validators/query.validator";
import {bodyValidator} from "../validators/body.validator";
import {postIdCommentIdObj,commentIdObj,pageLimitObj} from "@workspace/schema/reaction";

const commentReactionRouter:Router = Router();

// @ts-ignore
commentReactionRouter.post("/like",bodyValidator(postIdCommentIdObj),accessTokenValidator(),commentReactionController.likeComment);
// @ts-ignore
commentReactionRouter.post("/dislike",bodyValidator(postIdCommentIdObj),accessTokenValidator(),commentReactionController.dislikeComment);
// @ts-ignore
commentReactionRouter.delete("/:postId/:commentId/like",paramsValidator(postIdCommentIdObj),accessTokenValidator(),commentReactionController.unLikeComment);
// @ts-ignore
commentReactionRouter.delete("/:postId/:commentId/dislike",paramsValidator(postIdCommentIdObj),accessTokenValidator(),commentReactionController.removeDislikeComment);

commentReactionRouter.get('/:commentId/users/like',paramsValidator(commentIdObj),queryValidator(pageLimitObj),accessTokenValidator(),commentReactionController.getLikedUsers);

commentReactionRouter.get('/:commentId/users/dislike',paramsValidator(commentIdObj),queryValidator(pageLimitObj),accessTokenValidator(),commentReactionController.getDislikedUsers);

export default commentReactionRouter;