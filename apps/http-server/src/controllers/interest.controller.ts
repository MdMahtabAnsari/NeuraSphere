import { CustomRequest } from "../types/customRuquest";
import {Request,Response,NextFunction} from 'express';
import { interestService } from "../services/interest.service";
import { interestObj,pageLimitObj } from "@workspace/schema/interest";
import { z } from "zod";

class InterestController {
    async createUserInterests(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const { interest } = req.body as z.infer<typeof interestObj>;
            const data = await interestService.createUserInterests(req.user.id, interest);
            res.status(201).json({
                message: "Interests added successfully",
                status: "success",
                data: data
            });
        } catch (error) {
            next(error);
        }
    }

    async updateUserInterests(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const { interest } = req.body as z.infer<typeof interestObj>;
            const data = await interestService.updateUserInterests(req.user.id, interest);
            res.status(200).json({
                message: "Interests updated successfully",
                status: "success",
                data: data
            });
        } catch (error) {
            next(error);
        }
    }

    async getInterests(req: Request, res: Response, next: NextFunction) {
        try {
            const { page, limit } = req.query as z.infer<typeof pageLimitObj>;
            const data = await interestService.getInterests(page?parseInt(page):1, limit?parseInt(limit):10);
            res.status(200).json({
                message: "Interests fetched successfully",
                status: "success",
                data: data
            });
        } catch (error) {
            next(error);
        }
    }

    async getUserInterests(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const { page, limit } = req.query as z.infer<typeof pageLimitObj>;
            const data = await interestService.getUserInterests(req.user.id, page?parseInt(page):1, limit?parseInt(limit):10);
            res.status(200).json({
                message: "User interests fetched successfully",
                status: "success",
                data: data
            });
        } catch (error) {
            next(error);
        }
    }
}

export const interestController = new InterestController();