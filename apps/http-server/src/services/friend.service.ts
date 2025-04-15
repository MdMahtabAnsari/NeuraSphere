import { friendRepository } from "../repositories/friend.repository";
import { AppError, BadRequestError, InternalServerError } from "../utils/errors";
import { friendGraph } from "../graph/friend.graph";
import { friendRedis } from "../redis/friend.redis";
import { notificationService } from './notification.service';


class FriendService {

    async createFriendRequest(userId: string, friendId: string) {
        try {
            if (userId === friendId) {
                throw new BadRequestError("You can't send a friend request to yourself");
            }
            const requested = await friendRepository.createFriendRequest(userId, friendId);
            await friendGraph.createFriendRequest(userId, friendId);
            if(requested){
                const cachedCount = await friendRedis.getFriendRequestCount(friendId);
                if (cachedCount) {
                    await friendRedis.incrementFriendRequestCount(friendId);
                }
                else {
                    const count = await friendRepository.getFriendRequestCount(friendId);
                    await friendRedis.setFriendRequestCount(friendId, count);
                }
                await notificationService.createNotification({
                    senderId: userId,
                    receiverId: friendId,
                    type: 'Request',
                });
            }
            return requested;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in FriendService.createFriendRequest", error);
            throw new InternalServerError();
        }
    }

    async acceptFriendRequest(userId: string, friendId: string) {
        try {
            const accepted = await friendRepository.acceptFriendRequest(userId, friendId);
            await friendGraph.acceptFriendRequest(userId, friendId);
            if(accepted){
                const cachedCount = await friendRedis.getFriendRequestCount(userId);
                if (cachedCount) {
                    await friendRedis.decrementFriendRequestCount(userId);
                }
                else {
                    const count = await friendRepository.getFriendRequestCount(userId);
                    await friendRedis.setFriendRequestCount(userId, count);
                }
                const cachedFriendCount = await friendRedis.getFriendCount(friendId);
                if (cachedFriendCount) {
                    await friendRedis.incrementFriendCount(friendId);
                }
                else {
                    const count = await friendRepository.getFriendCount(friendId);
                    await friendRedis.setFriendCount(friendId, count);
                }
                await notificationService.createNotification({

                    senderId: userId,
                    receiverId: friendId,
                    type: 'Accept',
                });
            }
            return accepted;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in FriendService.acceptFriendRequest", error);
            throw new InternalServerError();
        }
    }

    async rejectFriendRequest(userId: string, friendId: string) {
        try {
            const rejected = await friendRepository.rejectFriendRequest(userId, friendId);
            await friendGraph.rejectFriendRequest(userId, friendId);
            if(rejected){
                const cachedCount = await friendRedis.getFriendRequestCount(userId);
                if (cachedCount) {
                    await friendRedis.decrementFriendRequestCount(userId);
                }
                else {
                    const count = await friendRepository.getFriendRequestCount(userId);
                    await friendRedis.setFriendRequestCount(userId, count);
                }
            }
            return rejected;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in FriendService.rejectFriendRequest", error);
            throw new InternalServerError();
        }
    }
    async getFriendRequests(userId: string, page: number = 1, limit: number = 10) {
        try {
            const requests = await friendRepository.getBlockedFriendList(userId, page, limit);
            const totalPages = await friendRepository.getFriendRequestsPages(userId, limit);
            return {
                requests,
                totalPages,
                currentPage: page
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in FriendService.getFriendRequests", error);
            throw new InternalServerError();
        }
    }
    async getFriends(userId: string, page: number = 1, limit: number = 10) {
        try {
            const friends = await friendRepository.getFriendList(userId, page, limit);
            const totalPages = await friendRepository.getFriendsPages(userId, limit);
            return {
                friends,
                totalPages,
                currentPage: page
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in FriendService.getFriends", error);
            throw new InternalServerError();
        }
    }

    async blockFriend(userId: string, friendId: string) {
        try {
            if (userId === friendId) {
                throw new BadRequestError("You can't block yourself");
            }
            const blocked = await friendRepository.blockFriend(userId, friendId);
            await friendGraph.blockFriend(userId, friendId);
            return blocked;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in FriendService.blockFriend", error);
            throw new InternalServerError();
        }
    }

    async unblockFriend(userId: string, friendId: string) {
        try {
            const unblock = await friendRepository.unblockFriend(userId, friendId);
            await friendGraph.unBlockFriend(userId, friendId);
            return unblock;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in FriendService.unblockFriend", error);
            throw new InternalServerError();
        }
    }

    async getBlockedFriends(userId: string, page: number = 1, limit: number = 10) {
        try {
            const blocked = await friendRepository.getBlockedFriendList(userId, page, limit);
            const totalPages = await friendRepository.getBlockedFriendsPages(userId, limit);
            return {
                blocked,
                totalPages,
                currentPage: page
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in FriendService.getBlockedFriends", error);
            throw new InternalServerError();
        }
    }

    async removeFriend(userId: string, friendId: string) {
        try {
            const removedFriend = await friendRepository.removeFriend(userId, friendId);
            await friendGraph.removeFriend(userId, friendId);
            return removedFriend;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in FriendService.removeFriend", error);
            throw new InternalServerError();
        }
    }

    async getFriendshipStatus(userId: string, friendId: string) {
        try {
            return await friendRepository.getFriendshipStatus(userId, friendId);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in FriendService.getFriendshipStatus", error);
            throw new InternalServerError();
        }
    }

    async getMutualFriends(userId: string, friendId: string, page: number = 1, limit: number = 10) {
        try {
            const mutual = await friendGraph.getMutualFriends(userId, friendId, page, limit);
            const totalPages = await friendGraph.getMutualFriendsPages(userId, friendId, limit);
            return {
                mutual,
                totalPages,
                currentPage: page
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in FriendService.getMutualFriends", error);
            throw new InternalServerError();
        }
    }

    async getFriendSuggestions(userId: string, page: number = 1, limit: number = 10) {
        try {
            const suggestions = await friendGraph.getFriendSuggestions(userId, page, limit);
            const totalPages = await friendGraph.getFriendSuggestionsPages(userId, limit);
            return {
                suggestions,
                totalPages,
                currentPage: page
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in FriendService.getFriendSuggestions", error);
            throw new InternalServerError();
        }
    }

    async getFriendCount(userId: string) {
        try {
            const cachedCount = await friendRedis.getFriendCount(userId);
            if (cachedCount) {
                return cachedCount;
            }
            const count = await friendRepository.getFriendCount(userId);
            await friendRedis.setFriendCount(userId, count);
            return count;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in FriendService.getFriendCount", error);
            throw new InternalServerError();
        }
    }

    async getFriendRequestCount(userId: string) {
        try {
            const cachedCount = await friendRedis.getFriendRequestCount(userId);
            if (cachedCount) {
                return cachedCount;
            }
            const count = await friendRepository.getFriendRequestCount(userId);
            await friendRedis.setFriendRequestCount(userId, count);
            return count;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in FriendService.getFriendRequestCount", error);
            throw new InternalServerError();
        }
    }

    async getBlockedCount(userId: string) {
        try {
            const cachedCount = await friendRedis.getBlockedCount(userId);
            if (cachedCount) {
                return cachedCount;
            }
            const count = await friendRepository.getBlockedCount(userId);
            await friendRedis.setBlockedCount(userId, count);
            return count;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in FriendService.getBlockedCount", error);
            throw new InternalServerError();
        }
    }
}

export const friendService = new FriendService();