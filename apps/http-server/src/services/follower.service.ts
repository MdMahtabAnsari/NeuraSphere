import { followerGraph } from "../graph/follower.graph";
import { followerRepository } from "../repositories/follower.repository";
import { InternalServerError, AppError, BadRequestError } from "../utils/errors";
import { followerRedis } from "../redis/follower.redis";

class FollwerService {
    async followUser(userId: string, followingId: string) {
        try {
            if (userId === followingId) {
                throw new BadRequestError("You can't follow yourself")
            }
            const follow = await followerRepository.followUser(userId, followingId)
            await followerGraph.followUser(userId, followingId)
            if (follow) {
                const cachedFollowerCount = await followerRedis.getFollowerCount(userId)
                if (cachedFollowerCount) {
                    await followerRedis.incrementFollowerCount(userId)
                }
                else {
                    const count = await followerRepository.getFollowersCount(userId)
                    await followerRedis.setFollowerCount(userId, count)
                }
                const cachedFollowingCount = await followerRedis.getFollowingCount(followingId)
                if (cachedFollowingCount) {
                    await followerRedis.incrementFollowingCount(followingId)
                }
                else {
                    const count = await followerRepository.getFollowingCount(followingId)
                    await followerRedis.setFollowingCount(followingId, count)
                }
            }
            return follow

        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            console.error("Error following user Service", error)
            throw new InternalServerError()
        }

    }

    async unfollowUser(userId: string, followingId: string) {
        try {
            if (userId === followingId) {
                throw new BadRequestError("You can't unfollow yourself")
            }
            const unfollow = await followerRepository.unfollowUser(userId, followingId)
            await followerGraph.unfollowUser(userId, followingId)
            if (unfollow) {
                const cachedFollowerCount = await followerRedis.getFollowerCount(userId)
                if (cachedFollowerCount) {
                    await followerRedis.decrementFollowerCount(userId)
                }
                else{
                    const count = await followerRepository.getFollowersCount(userId)
                    await followerRedis.setFollowerCount(userId, count)
                }
                const cachedFollowingCount = await followerRedis.getFollowingCount(followingId)
                if (cachedFollowingCount) {
                    await followerRedis.decrementFollowingCount(followingId)
                }
                else{
                    const count = await followerRepository.getFollowingCount(followingId)
                    await followerRedis.setFollowingCount(followingId, count)
                }
            }
            return unfollow
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            console.error("Error unfollowing user Service", error)
            throw new InternalServerError()
        }
    }

    async getFollowers(userId: string, page: number = 1, limit: number = 10) {
        try {
            const followers = await followerRepository.getFollowers(userId, page, limit)
            const totalPage = await followerRepository.getFollowerPageCount(userId, limit)
            return { followers, totalPage, currentPage: page }
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            console.error("Error getting followers Service", error)
            throw new InternalServerError()
        }
    }

    async getFollowing(userId: string, page: number = 1, limit: number = 10) {
        try {
            const following = await followerRepository.getFollowing(userId, page, limit)
            const totalPage = await followerRepository.getFollowingPageCount(userId, limit)
            return { following, totalPage, currentPage: page }
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            console.error("Error getting following Service", error)
            throw new InternalServerError()
        }
    }

    async getMutualFollowers(userId: string, followingId: string, page: number = 1, limit: number = 10) {
        try {
            const mutual = await followerGraph.getMutualFollowers(userId, followingId, page, limit);
            const totalPage = await followerGraph.getMutualFollowersPages(userId, followingId, limit);

            return {
                mutual,
                totalPage,
                currentPage: page
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            console.error("Error getting mutual followers Service", error)
            throw new InternalServerError()
        }
    }

    async getFollowerSuggestions(userId: string, page: number = 1, limit: number = 10) {
        try {
            const suggestions = await followerGraph.getFollwersSuggestions(userId, page, limit)
            const totalPage = await followerGraph.getFollowersSuggestionsPages(userId, limit)
            return { suggestions, totalPage, currentPage: page }
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            console.error("Error getting follower suggestions Service", error)
            throw new InternalServerError()
        }
    }

    async getFollowerCount(userId: string) {
        try {
            const cachedCount = await followerRedis.getFollowerCount(userId)
            if (cachedCount) {
                return cachedCount
            }
            const count = await followerRepository.getFollowersCount(userId)
            await followerRedis.setFollowerCount(userId, count)
            return count
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            console.error("Error getting follower count Service", error)
            throw new InternalServerError()
        }
    }

    async getFollowingCount(userId: string) {
        try {
            const cachedCount = await followerRedis.getFollowingCount(userId)
            if (cachedCount) {
                return cachedCount
            }
            const count = await followerRepository.getFollowingCount(userId)
            await followerRedis.setFollowingCount(userId, count)
            return count
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            console.error("Error getting following count Service", error)
            throw new InternalServerError()
        }
    }

    async isFollowing(userId: string, followingId: string) {
        try {
            return await followerRepository.isFollowing(userId, followingId)
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            console.error("Error checking if following Service", error)
            throw new InternalServerError()
        }
    }
}

export const followerService = new FollwerService();