import { InternalServerError, NotFoundError, ConflictError } from '../utils/errors/index'
import { client, Prisma } from '@workspace/database/client'

class FollowerRepository {

    async followUser(userId: string, followingId: string) {
        try {
            return await client.follower.create({
                data: {
                    followerId: userId,
                    followingId: followingId
                }
            })
        } catch (error) {
            console.error("Error following user Repository", error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new NotFoundError("User")
                }
                else if (error.code === 'P2003') {
                    throw new ConflictError("User already followed")
                }
            }
            throw new InternalServerError()
        }
    }

    async unfollowUser(userId: string, followingId: string) {
        try {
            return await client.follower.delete({
                where: {
                    followerId_followingId: {
                        followerId: userId,
                        followingId: followingId
                    }
                }
            })
        } catch (error) {
            console.error("Error unfollowing user Repository", error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new NotFoundError("User")
                }
                else if (error.code === 'P2003') {
                    throw new NotFoundError("User not followed")
                }
            }
            throw new InternalServerError()
        }
    }

    async getFollowers(userId: string, page: number = 1, limit: number = 10) {
        try {
            return await client.follower.findMany({
                where: {
                    followingId: userId
                },
                skip: (page - 1) * limit,
                take: limit,
                select: {
                    follower: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true
                        }
                    }
                }
            })
        } catch (error) {
            console.error("Error getting followers Repository", error)
            throw new InternalServerError()
        }
    }

    async getFollowing(userId: string, page: number = 1, limit: number = 10) {
        try {
            return await client.follower.findMany({
                where: {
                    followerId: userId
                },
                skip: (page - 1) * limit,
                take: limit,
                select: {
                    following: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true
                        }
                    }
                }
            })
        } catch (error) {
            console.error("Error getting following Repository", error)
            throw new InternalServerError()
        }
    }

    async getFollowersCount(userId: string) {
        try {
            return await client.follower.count({
                where: {
                    followingId: userId
                }
            })
        } catch (error) {
            console.error("Error getting followers count Repository", error)
            throw new InternalServerError()
        }
    }

    async getFollowingCount(userId: string) {
        try {
            return await client.follower.count({
                where: {
                    followerId: userId
                }
            })
        } catch (error) {
            console.error("Error getting following count Repository", error)
            throw new InternalServerError()
        }
    }

    async getFollowerPageCount(userId: string, limit: number = 10) {
        try {
            const count = await this.getFollowersCount(userId)
            return Math.ceil(count / limit)
        } catch (error) {
            console.error("Error getting follower page count Repository", error)
            throw new InternalServerError()
        }
    }

    async getFollowingPageCount(userId: string, limit: number = 10) {
        try {
            const count = await this.getFollowingCount(userId)
            return Math.ceil(count / limit)
        } catch (error) {
            console.error("Error getting following page count Repository", error)
            throw new InternalServerError()
        }
    }

    async isFollowing(userId: string, followingId: string) {
        try {
            const follower = await client.follower.findFirst({
                where: {
                    followerId: userId,
                    followingId: followingId
                }
            })
            return follower ? true : false
        } catch (error) {
            console.error("Error checking if following Repository", error)
            throw new InternalServerError()
        }
    }
}

export const followerRepository = new FollowerRepository();