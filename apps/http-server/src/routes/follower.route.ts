import { followerController } from "../controllers/follower.controller";
import { followingIdObj,pageLimitObj,idObj } from "@workspace/schema/follower";
import { paramsValidator } from "../validators/params.validator";
import { queryValidator } from "../validators/query.validator";
import { bodyValidator } from "../validators/body.validator";
import { accessTokenValidator } from "../validators/jwt.validator";
import { Router } from "express";

const followerRouter:Router = Router();

followerRouter.get('/following/:id',paramsValidator(idObj),queryValidator(pageLimitObj) ,accessTokenValidator(),followerController.getFollowing);
// @ts-ignore
followerRouter.get('/mutuals/:followingId',paramsValidator(followingIdObj),queryValidator(pageLimitObj) ,accessTokenValidator(),followerController.getMutualFollowers);
// @ts-ignore
followerRouter.get('/suggestions',queryValidator(pageLimitObj) ,accessTokenValidator(),followerController.getFollowerSuggestions);
// @ts-ignore
followerRouter.post('/follow',bodyValidator(followingIdObj) ,accessTokenValidator(),followerController.followUser);
// @ts-ignore
followerRouter.delete('/unfollow/:followingId',paramsValidator(followingIdObj) ,accessTokenValidator(),followerController.unfollowUser);

followerRouter.get('/:id',paramsValidator(idObj),queryValidator(pageLimitObj) ,accessTokenValidator(),followerController.getFollowers);

export default followerRouter;