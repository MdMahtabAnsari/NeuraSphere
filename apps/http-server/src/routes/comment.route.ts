import { commentController } from "../controllers/comment.controller";
import { comment,updateComment,idObject,getComments } from "@workspace/schema/comment";
import { Router } from "express";
import { bodyValidator } from "../validators/body.validator";
import { accessTokenValidator } from "../validators/jwt.validator";
import { paramsValidator } from "../validators/params.validator";
import { queryValidator } from "../validators/query.validator";

const commentRouter:Router = Router()

// @ts-ignore
commentRouter.post('/create',bodyValidator(comment),accessTokenValidator(),commentController.createComment)
// @ts-ignore
commentRouter.put('/update',bodyValidator(updateComment),accessTokenValidator(),commentController.updateComment)
// @ts-ignore
commentRouter.delete('/delete/:id',paramsValidator(idObject),accessTokenValidator(),commentController.deleteComment)

commentRouter.get('/get',queryValidator(getComments),accessTokenValidator(),commentController.getComments)


export default commentRouter