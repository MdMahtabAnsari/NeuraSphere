import { friendController } from "../controllers/friend.controller";
import { Router } from "express";
import { friendIdObj, pageLimitObj,idObj } from "@workspace/schema/friend";
import { paramsValidator } from "../validators/params.validator";
import { queryValidator } from "../validators/query.validator";
import { bodyValidator } from "../validators/body.validator";
import { accessTokenValidator } from "../validators/jwt.validator";

const friendRouter:Router = Router();

// @ts-ignore
friendRouter.post("/block", bodyValidator(friendIdObj),accessTokenValidator(), friendController.blockFriend);
// @ts-ignore
friendRouter.post("/unblock", bodyValidator(friendIdObj), accessTokenValidator(),friendController.unblockFriend);
// @ts-ignore
friendRouter.get("/blocked", queryValidator(pageLimitObj), accessTokenValidator(),friendController.getBlockedFriends);
// @ts-ignore
friendRouter.post("/request", bodyValidator(friendIdObj), accessTokenValidator(),friendController.createFriendRequest);
// @ts-ignore
friendRouter.post("/accept", bodyValidator(friendIdObj), accessTokenValidator(),friendController.acceptFriendRequest);
// @ts-ignore
friendRouter.post("/reject", bodyValidator(friendIdObj), accessTokenValidator(),friendController.rejectFriendRequest);
// @ts-ignore
friendRouter.get("/requests", queryValidator(pageLimitObj), accessTokenValidator(),friendController.getFriendRequests);
// @ts-ignore
friendRouter.get("/suggestions", queryValidator(pageLimitObj), accessTokenValidator(),friendController.getFriendSuggestions);
// @ts-ignore
friendRouter.delete("/remove/:friendId", paramsValidator(friendIdObj), accessTokenValidator(),friendController.removeFriend);
// @ts-ignore
friendRouter.get('/status/:friendId', paramsValidator(friendIdObj),accessTokenValidator() ,friendController.getFriendshipStatus);
// @ts-ignore
friendRouter.get("/mutuals/:friendId", paramsValidator(friendIdObj),queryValidator(pageLimitObj) ,accessTokenValidator(),friendController.getMutualFriends);

friendRouter.get('/:id',paramsValidator(idObj),queryValidator(pageLimitObj) ,accessTokenValidator(),friendController.getFriends);

export default friendRouter;
