import { Router } from "express";
import { otpController } from "../controllers/otp.controller";
import { otpEmailRequest,otpEmailVerify } from "@workspace/schema/otp";
import { bodyValidator } from "../validators/body.validator";

const otpRouter:Router = Router();

otpRouter.post('/create/email',bodyValidator(otpEmailRequest),otpController.createVerifyEmailOtp);
otpRouter.post('/verify/email',bodyValidator(otpEmailVerify),otpController.verifyEmailOtp);
otpRouter.post("/create/forgot-password",bodyValidator(otpEmailRequest),otpController.createForgotPasswordOtp);
otpRouter.post("/verify/forgot-password",bodyValidator(otpEmailVerify),otpController.verifyForgotPasswordOtp);

export default otpRouter;