import { client, Prisma } from '@workspace/database/client';
import { InternalServerError, NotFoundError, ConflictError, BadRequestError, AppError } from '../utils/errors';


class FriendRepository {

    async createFriendRequest(senderId: string, receiverId: string) {
        try {
            const isReceiverExits = await client.friends.findFirst({
                where: {
                    senderId: receiverId,
                    receiverId: senderId
                }
            });
            if (isReceiverExits) {
                if (isReceiverExits.status === 'Pending') {
                    throw new ConflictError('Receiver already has a pending friend request');
                }
                else if (isReceiverExits.status === 'Accepted') {
                    throw new ConflictError('Receiver already friend with you');
                }
                else if (isReceiverExits.status === 'Blocked') {
                    throw new ConflictError('Receiver is blocked you');
                }
                else {
                    await client.friends.delete({
                        where: {
                            id: isReceiverExits.id
                        }
                    });
                }
            }

            const isSenderExits = await client.friends.findFirst({
                where: {
                    senderId: senderId,
                    receiverId: receiverId
                }
            });
            if (isSenderExits) {
                if (isSenderExits.status === 'Pending') {
                    throw new ConflictError('You already have a pending friend request');
                }
                else if (isSenderExits.status === 'Accepted') {
                    throw new ConflictError('You already friend with receiver');
                }
                else {
                    await client.friends.delete({
                        where: {
                            id: isSenderExits.id
                        }
                    });
                }
            }

            return await client.friends.create({
                data: {
                    senderId: senderId,
                    receiverId: receiverId,
                    status: 'Pending'
                }
            });

        } catch (error) {
            console.error("Error in createFriendRequest", error);
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                if(error.code === 'P2025'){
                    throw new BadRequestError('Invalid user id');
                }
                else if(error.code === 'P2020'){
                    throw new BadRequestError('Invalid friend id');
                }
            }

            else if (error instanceof AppError) {
                throw error;
            }
            throw new InternalServerError();
        }
    }

    async acceptFriendRequest(senderId: string, receiverId: string) {
        try {
            const isFriendRequestExits = await client.friends.findFirst({
                where: {
                    senderId: receiverId,
                    receiverId: senderId
                }
            });
            if (!isFriendRequestExits) {
                throw new NotFoundError('Friend request');
            }
            else if (isFriendRequestExits.status === 'Accepted') {
                throw new ConflictError('Friend request already accepted');
            }
            else if (isFriendRequestExits.status === 'Blocked') {
                throw new ConflictError('You are blocked by receiver');
            }
            else if (isFriendRequestExits.status === 'Rejected') {
                throw new ConflictError('Friend request is rejected');
            }
            else {
                await client.friends.delete({
                    where: {
                        id: isFriendRequestExits.id
                    }
                });
            }
            return await client.friends.create({
                data: {
                    senderId: senderId,
                    receiverId: receiverId,
                    status: 'Accepted'
                }
            });


        } catch (error) {
            console.error("Error in acceptFriendRequest", error);
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                if(error.code === 'P2025'){
                    throw new BadRequestError('Invalid user id');
                }
                else if(error.code === 'P2020'){
                    throw new BadRequestError('Invalid friend id');
                }
            }
            else if (error instanceof AppError) {
                throw error;
            }
            throw new InternalServerError();

        }
    }

    async rejectFriendRequest(senderId: string, receiverId: string) {
        try {
            const isFriendRequestExits = await client.friends.findFirst({
                where: {
                    senderId: receiverId,
                    receiverId: senderId
                }
            });
            if (!isFriendRequestExits) {
                throw new NotFoundError('Friend request');
            }
            else if (isFriendRequestExits.status === 'Accepted') {
                throw new ConflictError('Friend request already accepted');
            }
            else if (isFriendRequestExits.status === 'Blocked') {
                throw new ConflictError('You are blocked by receiver');
            }
            else if (isFriendRequestExits.status === 'Rejected') {
                throw new ConflictError('Friend request is rejected');
            }
            else {
                await client.friends.delete({
                    where: {
                        id: isFriendRequestExits.id
                    }
                });
            }
            return await client.friends.create({
                data: {
                    senderId: senderId,
                    receiverId: receiverId,
                    status: 'Rejected'
                }
            });

        } catch (error) {
            console.error("Error in rejectFriendRequest", error);
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                if(error.code === 'P2025'){
                    throw new BadRequestError('Invalid user id');
                }
                else if(error.code === 'P2020'){
                    throw new BadRequestError('Invalid friend id');
                }
            }
            else if (error instanceof AppError) {
                throw error;
            }
            throw new InternalServerError();

        }
    }

    async blockFriend(senderId: string, receiverId: string) {
        try {
            const isReceiverExits = await client.friends.findFirst({
                where: {
                    senderId: receiverId,
                    receiverId: senderId
                }
            });
            if (isReceiverExits) {
                if (isReceiverExits.status !== 'Blocked') {
                    await client.friends.delete({
                        where: {
                            id: isReceiverExits.id
                        }
                    });
                }

            }
            const isSenderExits = await client.friends.findFirst({
                where: {
                    senderId: senderId,
                    receiverId: receiverId
                }
            });
            if (isSenderExits) {
                if (isSenderExits.status !== 'Blocked') {
                    await client.friends.delete({
                        where: {
                            id: isSenderExits.id
                        }
                    });
                }
            }
            return await client.friends.create({
                data: {
                    senderId: senderId,
                    receiverId: receiverId,
                    status: 'Blocked'
                }
            });


        } catch (error) {
            console.error("Error in blockFriend", error);
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                if(error.code === 'P2025'){
                    throw new BadRequestError('Invalid user id');
                }
                else if(error.code === 'P2020'){
                    throw new BadRequestError('Invalid friend id');
                }
            }
            else if (error instanceof AppError) {
                throw error;
            }
            throw new InternalServerError();
        }
    }

    async unblockFriend(senderId: string, receiverId: string) {
        try {
            const isFriendExits = await client.friends.findFirst({
                where: {
                    senderId: senderId,
                    receiverId: receiverId
                }
            });
            if (!isFriendExits) {
                throw new NotFoundError('Friend');
            }
            if (isFriendExits.status !== 'Blocked') {
                throw new ConflictError('Friend is not blocked');
            }
            return await client.friends.delete({
                where: {
                    id: isFriendExits.id
                }
            });


        } catch (error) {
            console.error("Error in unblockFriend", error);
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                if(error.code === 'P2025'){
                    throw new BadRequestError('Invalid user id');
                }
                else if(error.code === 'P2020'){
                    throw new BadRequestError('Invalid friend id');
                }
            }
            else if (error instanceof AppError) {
                throw error;
            }
            throw new InternalServerError
        }
    }

    async getFriendList(userId: string, page: number = 1, limit: number = 10) {
        try {
            const friendList = await client.friends.findMany({
                where: {
                    OR: [
                        {
                            senderId: userId,
                            status: 'Accepted'
                        },
                        {
                            receiverId: userId,
                            status: 'Accepted'
                        }
                    ]
                },
                skip: (page - 1) * limit,
                take: limit,
                select: {
                    sender: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            image: true
                        }
                    },
                    receiver: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            image: true
                        }
                    }
                }
            });
            return friendList.map(friend => {
                if (friend.sender.id === userId) {
                    return friend.receiver;
                }
                return friend.receiver = friend.sender;
            });

        } catch (error) {
            console.error("Error in getFriendList", error);
            throw new InternalServerError();
        }
    }

    async getFriendRequestList(userId: string, page: number = 1, limit: number = 10) {
        try {
            return await client.friends.findMany({
                where: {
                    receiverId: userId,
                    status: 'Pending'
                },
                skip: (page - 1) * limit,
                take: limit,
                select: {
                    sender: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            image: true
                        }
                    }
                }
            });

        } catch (error) {
            console.error("Error in getFriendRequestList", error);
            throw new InternalServerError
        }
    }

    async getBlockedFriendList(userId: string, page: number = 1, limit: number = 10) {
        try {
            return await client.friends.findMany({
                where: {
                    senderId: userId,
                    status: 'Blocked'
                },
                skip: (page - 1) * limit,
                take: limit,
                select: {
                    receiver: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            image: true
                        }
                    }
                }
            });

        } catch (error) {
            console.error("Error in getBlockedFriendList", error);
            throw new InternalServerError();

        }
    }

    async removeFriend(userId: string, friendId: string) {
        try {
            const isFriendExits = await client.friends.findFirst({
                where: {
                    OR: [
                        {
                            senderId: userId,
                            receiverId: friendId,
                            status: 'Accepted'
                        },
                        {
                            senderId: friendId,
                            receiverId: userId,
                            status: 'Accepted'
                        }
                    ]
                }
            });
            if (!isFriendExits) {
                throw new NotFoundError('Friend');
            }
            return await client.friends.delete({
                where: {
                    id: isFriendExits.id
                }
            });

        } catch (error) {
            console.error("Error in removeFriend", error);
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                if(error.code === 'P2025'){
                    throw new BadRequestError('Invalid user id');
                }
                else if(error.code === 'P2020'){
                    throw new BadRequestError('Invalid friend id');
                }
            }
            else if (error instanceof AppError) {
                throw error;
            }
            throw new InternalServerError();

        }
    }

    async getFriendshipStatus(userId: string, friendId: string) {
        try {
            const isReceiverExits = await client.friends.findFirst({
                where: {
                    senderId: friendId,
                    receiverId: userId
                }
            });
            if (isReceiverExits) {
                return isReceiverExits;
            }
            const isSenderExits = await client.friends.findFirst({
                where: {
                    senderId: userId,
                    receiverId: friendId
                }
            });
            if (isSenderExits) {
                return isSenderExits;
            }
            return null;

        } catch (error) {
            console.error("Error in getFriendshipStatus", error);
            throw new InternalServerError();

        }
    }

    async getFriendRequestsPages(userId: string, limit: number = 10) {
        try {
            const totalRequests = await client.friends.count({
                where: {
                    receiverId: userId,
                    status: 'Pending'
                }
            });
            return Math.ceil(totalRequests / limit);

        } catch (error) {
            console.error("Error in getFriendRequestsPages", error);
            throw new InternalServerError();

        }
    }

    async getFriendsPages(userId: string, limit: number = 10) {
        try {
            const totalFriends = await client.friends.count({
                where: {
                    OR: [
                        {
                            senderId: userId,
                            status: 'Accepted'
                        },
                        {
                            receiverId: userId,
                            status: 'Accepted'
                        }
                    ]
                }
            });
            return Math.ceil(totalFriends / limit);

        } catch (error) {
            console.error("Error in getFriendsPages", error);
            throw new InternalServerError();

        }
    }

    async getBlockedFriendsPages(userId: string, limit: number = 10) {
        try {
            const totalBlockedFriends = await client.friends.count({
                where: {
                    senderId: userId,
                    status: 'Blocked'
                }
            });
            return Math.ceil(totalBlockedFriends / limit);

        } catch (error) {
            console.error("Error in getBlockedFriendsPages", error);
            throw new InternalServerError();

        }
    }


}

export const friendRepository = new FriendRepository();