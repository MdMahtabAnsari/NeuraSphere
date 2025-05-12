"use client"
import { NotificationDataSchema, NotificationSchema,NotificationTypeEnum } from "@workspace/schema/api-response/notification";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import InfiniteScroll from 'react-infinite-scroll-component';
import { z } from "zod"
import { format, parseISO } from "date-fns";
import { NotificationCardSkeleton } from "@/components/custom/skeleton/notification"

export function NotificationCard({ notification, handleOnClick }: { notification: z.infer<typeof NotificationSchema>, handleOnClick: ({id,userId,postId,type,isRead}:{id:string,userId:string,postId:string,type:z.infer<typeof NotificationTypeEnum>,isRead:boolean}) => void }) {
    const { content, createdAt, isRead, type } = notification;
    return (
        <Card className={`w-full max-w-lg cursor-pointer ${!isRead ? "border-lime-500" : ""}`} onClick={() => handleOnClick({id: notification.id, userId: notification.senderId, postId: notification.postId?notification.postId:"", type: type, isRead: isRead})}>
            <CardContent className="space-y-2">
                {content && <p>{content}</p>}
            </CardContent>
            <CardFooter className="flex justify-between">
                <CardDescription>{format(parseISO(createdAt), "MMMM do, yyyy h:mm:ss a")}</CardDescription>
            </CardFooter>
        </Card>
    )
}

export function UnreadAndTotalRatio({ unreadCount, count }: { unreadCount: number, count: number }) {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full gap-2">
            <h1 className="text-2xl font-bold">Notification</h1>
            <div className="flex items-center justify-center gap-2">
                <h1 className="text-lg font-bold">{unreadCount} Unread</h1>
                <span className="text-lg font-bold">|</span>
                <h1 className="text-lg font-bold">{count} Total</h1>
            </div>
        </div>
    )
}

export function NotificationList({ notifications, fetchNotification, handleOnClick }: { notifications: z.infer<typeof NotificationDataSchema>, fetchNotification: () => void, handleOnClick: ({ id, userId, postId, type, isRead }: { id: string, userId: string, postId: string, type: z.infer<typeof NotificationTypeEnum>, isRead: boolean }) => void }) {
    return (
        <div className="flex flex-col justify-start items-center gap-4 w-full h-full my-6">
            <InfiniteScroll
                dataLength={notifications.notifications.length}
                next={fetchNotification}
                hasMore={notifications.currentPage <= notifications.totalPage}
                loader={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <NotificationCardSkeleton />
                        <NotificationCardSkeleton />
                        <NotificationCardSkeleton />
                    </div>

                }
                endMessage={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <h1 className="text-2xl font-bold">No more notifications</h1>
                    </div>
                }
                className="flex flex-col items-center justify-center w-full h-full gap-2"
            >
                {notifications.notifications.map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} handleOnClick={handleOnClick} />
                ))}
            </InfiniteScroll>
        </div>
    )
}