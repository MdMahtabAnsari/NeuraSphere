import { InternalServerError, BadRequestError, AppError } from '../utils/errors';
import { interest } from '@workspace/schema/interest';
import { z } from 'zod';
import { interestRepository } from '../repositories/interest.repository';
import { interestGraph } from '../graph/interest.graph';

class InterestService {
    async createUserInterests(userId: string, data: z.infer<typeof interest>) {
        try {
            const interestData = await interestRepository.createUserIntrests(userId, data);
            await interestGraph.createUserInterests(userId, interestData);
            return interestData;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in creating user intrests", error)
            throw new InternalServerError();
        }
    }

    async updateUserInterests(userId: string, data: z.infer<typeof interest>) {
        try {
            if (data.length) {
                const interestData = await interestRepository.updateUserIntrests(userId, data);
                await interestGraph.updateUserInterests(userId, interestData);
                return interestData;
            }
            await interestRepository.deleteUserIntrests(userId);
            await interestGraph.deleteUserInterests(userId);
            return null;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in updating user intrests", error)
            throw new InternalServerError();
        }
    }

    async getInterests(page: number = 1, limit: number = 10) {
        try {
            const intrests = await interestRepository.getInterests(page, limit);
            const totalPage = interestRepository.getInterestPages(limit);
            return { intrests, totalPage, currentPage: page };
        } catch (error) {
            console.error("Error in getting interests", error);
            throw new InternalServerError();
        }
    }

    async getUserInterests(userId: string, page: number = 1, limit: number = 10) {
        try {
            const intrests = await interestRepository.getUserInterests(userId, page, limit);
            const totalPage = interestRepository.getUserInterestPages(userId, limit);
            return { intrests, totalPage, currentPage: page };
        } catch (error) {
            console.error("Error in getting user interests", error);
            throw new InternalServerError();
        }
    }

}

export const interestService = new InterestService();