"use client";
import { getNotifications,getNotificationCount,getUnreadNotificationCount,markNotificationAsRead } from "@/lib/api/notification";
import { NotificationDataSchema } from "@workspace/schema/api-response/notification";
import { useEffect, useState } from "react";
import { z } from "zod";
import { NotificationList,UnreadAndTotalRatio } from "@/components/custom/notification";
import { NotificationTypeEnum } from "@workspace/schema/api-response/notification";
import { useRouter } from "next/navigation";


export default function Page() {
    const [notifications, setNotifications] = useState<z.infer<typeof NotificationDataSchema>>({
        notifications: [],
        totalPage: 1,
        currentPage: 1,
    });
    const [unread, setUnread] = useState<number>(0);
    const [totalCount, setTotalCount] = useState<number>(0);
    const router = useRouter();

    useEffect(() => {
        if (notifications.currentPage <= notifications.totalPage) {
            fetchNotifications();
        }
    }, [notifications.currentPage]);
    useEffect(() => {
        fetchUnreadNotificationCount();
        fetchReadNotificationCount();
    }, []);

    const fetchUnreadNotificationCount = async () => {
        const data = await getUnreadNotificationCount();
        if (data.status === "success") {
            setUnread(data.data);
        }
    };
    const fetchReadNotificationCount = async () => {
        const data = await getNotificationCount();
        if (data.status === "success") {
            setTotalCount(data.data);
        }
    };
    const fetchNotifications = async () => {
        const data = await getNotifications({ page: notifications.currentPage, limit: 10 });
        if (data.status === "success") {
            setNotifications((prev) => ({
                ...prev,
                notifications: [...prev.notifications, ...data.data.notifications],
                currentPage: prev.currentPage + 1,
                totalPage: data.data.totalPage,
            }));
        } else {
            setNotifications((prev) => ({
                ...prev,
                currentPage: prev.currentPage + 1,
                totalPage: prev.totalPage,
            }));
        }
    };

    const handleOnClick = async ({ id, type, isRead }: { id: string; type: z.infer<typeof NotificationTypeEnum>, isRead: boolean }) => {

        if(!isRead){
            const data = await markNotificationAsRead(id);
            if (data.status === "success") {
                setNotifications((prev) => ({
                    ...prev,
                    notifications: prev.notifications.map((notification) => {
                        if (notification.id === id) {
                            return data.data;
                        }
                        return notification;
                    }),
                }));
                fetchUnreadNotificationCount();
                if(type === "Accept" || type === "Request" || type === "Unfollow" || type === "Follow"){
                    router.push(`/dashboard/profile/${data.data.senderId}`);
                }
                else{
                    router.push(`/dashboard/post/${data.data.postId}`);
                }
            }
        }
        else{
            if(type === "Accept" || type === "Request" || type === "Unfollow" || type === "Follow"){
                router.push(`/dashboard/profile/${id}`);
            }
            else{
                router.push(`/dashboard/post/${id}`);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full gap-4 my-10">
            <UnreadAndTotalRatio unreadCount={unread} count={totalCount} />
            <NotificationList notifications={notifications} fetchNotification={fetchNotifications} handleOnClick={handleOnClick} />
        </div>
    );
}