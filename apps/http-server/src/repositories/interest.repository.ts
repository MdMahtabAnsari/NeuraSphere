import { client, Prisma } from '@workspace/database/client';
import { InternalServerError, BadRequestError } from '../utils/errors';
import { interest } from '@workspace/schema/interest';
import { z } from 'zod';

class InterestRepository {

    async createUserIntrests(userId: string, data: z.infer<typeof interest>) {
        try {
            return await Promise.all(data.map(async (interest) => {
                const interestData = await client.interest.upsert({
                    where: { name: interest },
                    update: {},
                    create: { name: interest },
                })
                await client.user_Interests.create({
                    data: {
                        userId: userId,
                        interestId: interestData.id
                    }
                })
                return interestData
            }));
        } catch (error) {
            console.error("Error in creating user intrests", error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw new BadRequestError("Invalid intrest")
                }
            }
            throw new InternalServerError()
        }
    }

    async updateUserIntrests(userId: string, data: z.infer<typeof interest>) {
        try {
            await client.user_Interests.deleteMany({
                where: {
                    userId: userId
                }
            })
            return await this.createUserIntrests(userId, data)
        } catch (error) {
            console.error("Error in updating user intrests", error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw new BadRequestError("Invalid intrest")
                }
            }
            throw new InternalServerError()
        }
    }

    async deleteUserIntrests(userId: string) {
        try {
            return await client.user_Interests.deleteMany({
                where: {
                    userId: userId
                }
            })
        }
        catch (error) {
            console.error("Error in deleting user intrests", error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw new BadRequestError("Invalid intrest")
                }
            }
            throw new InternalServerError()
        }
    }

    async getInterests(page: number = 1, limit: number = 10) {
        try {
            return await client.interest.findMany({
                skip: (page - 1) * limit,
                take: limit
            })
        } catch (error) {
            console.error("Error in getting interests", error)
            throw new InternalServerError()
        }
    }

    async getInterestPages(limit: number = 10) {
        try {
            const count = await client.interest.count()
            return Math.ceil(count / limit)
        } catch (error) {
            console.error("Error in getting interest pages", error)
            throw new InternalServerError()
        }
    }

    async getUserInterests(userId: string, page: number = 1, limit: number = 10) {
        try {
            return await client.user_Interests.findMany({
                where: {
                    userId: userId
                },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    interest: true
                }
            })
        } catch (error) {
            console.error("Error in getting user interests", error)
            throw new InternalServerError()
        }
    }

    async getUserInterestPages(userId: string, limit: number = 10) {
        try {
            const count = await client.user_Interests.count({
                where: {
                    userId: userId
                }
            })
            return Math.ceil(count / limit)
        } catch (error) {
            console.error("Error in getting user interest pages", error)
            throw new InternalServerError()
        }
    }

}

export const interestRepository = new InterestRepository();