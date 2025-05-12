import { Router } from "express";
import { postController } from "../controllers/post.controller";
import { createPost,updatePost,idObject,getPostByTags,pageLimitObj,getPostByUsernamesAndUseridAndNameAndMobileAndEmail,contentObj } from "@workspace/schema/post";
import { bodyValidator } from "../validators/body.validator";
import { accessTokenValidator } from "../validators/jwt.validator";
import { paramsValidator } from "../validators/params.validator";
import { queryValidator } from "../validators/query.validator";


const postRouter:Router = Router();
// @ts-ignore
postRouter.post('/create',bodyValidator(createPost),accessTokenValidator(),postController.createPost);
// @ts-ignore
postRouter.put('/update',bodyValidator(updatePost),accessTokenValidator(),postController.updatePost);
// @ts-ignore
postRouter.delete('/delete/:id',paramsValidator(idObject),accessTokenValidator(),postController.deletePost);
// @ts-ignore
postRouter.get('/search/tags',queryValidator(getPostByTags),accessTokenValidator(),postController.getPostByTag);

// @ts-ignore
postRouter.get('/me',queryValidator(pageLimitObj),accessTokenValidator(),postController.getUserPosts);
// @ts-ignore
postRouter.get('/search',queryValidator(getPostByUsernamesAndUseridAndNameAndMobileAndEmail),accessTokenValidator(),postController.getPostByUsernamesAndUseridAndNameAndMobileAndEmail);
// @ts-ignore

postRouter.get('/suggestions',queryValidator(pageLimitObj),accessTokenValidator(),postController.getPostSuggestion);
// @ts-ignore
postRouter.get('/viral',queryValidator(pageLimitObj),accessTokenValidator(),postController.getViralPosts);
// @ts-ignore
postRouter.get('/:id',paramsValidator(idObject),accessTokenValidator(),postController.getPostById);
// @ts-ignore
postRouter.get('/other/:id',paramsValidator(idObject),queryValidator(pageLimitObj),accessTokenValidator(),postController.getOtherUserPosts);

postRouter.post('/ai/suggestion',bodyValidator(contentObj),accessTokenValidator(),postController.createPostSuggestion);




export default postRouter;