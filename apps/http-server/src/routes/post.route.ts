import { Router } from "express";
import { postController } from "../controllers/post.controller";
import { createPost,updatePost,idObject,getPostByTags,pageLimitObj,getPostByUsernamesAndUseridAndNameAndMobileAndEmail } from "@workspace/schema/post";
import { bodyValidator } from "../validators/body.validator";
import { accessTokenValidator } from "../validators/jwt.validator";
import { parmsValidator } from "../validators/params.validator";
import { queryValidator } from "../validators/query.validator";


const postRouter:Router = Router();
// @ts-ignore
postRouter.post('/create',bodyValidator(createPost),accessTokenValidator(),postController.createPost);
// @ts-ignore
postRouter.put('/update',bodyValidator(updatePost),accessTokenValidator(),postController.updatePost);
// @ts-ignore
postRouter.delete('/delete/:id',parmsValidator(idObject),accessTokenValidator(),postController.deletePost);

postRouter.get('/search/tags',queryValidator(getPostByTags),accessTokenValidator(),postController.getPostByTag);

// @ts-ignore
postRouter.get('/me',queryValidator(pageLimitObj),accessTokenValidator(),postController.getUserPosts);

postRouter.get('/search',queryValidator(getPostByUsernamesAndUseridAndNameAndMobileAndEmail),accessTokenValidator(),postController.getPostByUsernamesAndUseridAndNameAndMobileAndEmail);

postRouter.get('/:id',parmsValidator(idObject),accessTokenValidator(),postController.getPostById);

postRouter.get('/other/:id',parmsValidator(idObject),queryValidator(pageLimitObj),accessTokenValidator(),postController.getOtherUserPosts);


export default postRouter;