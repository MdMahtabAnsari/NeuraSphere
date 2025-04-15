import {type} from  '@workspace/schema/notification'
import {z} from 'zod'

export const createContent=(notificationType:z.infer<typeof type>,username:string,isComment:boolean)=>{
    switch (notificationType) {
        case 'Post':
            return `${username} has created a new post.`
        case 'Reply':
            return `${username} has replied to your comment.`
        case 'Comment':
            return `${username} has commented on your post.`
        case 'Like':
            return `${username} ${isComment?'liked your comment.':'liked your post.'}.`
        case 'Dislike':
            return `${username} ${isComment?'disliked your comment.':'disliked your post.'}.`
        case 'Follow':
            return `${username} has followed you.`
        case 'Unfollow':
            return `${username} has unfollowed you.`
        case 'Request':
            return `${username} has sent you a friend request.`
        case 'Accept':
            return `${username} has accepted your friend request.`
        default:
            return `${username} has an unknown notification type.`;
    }
}