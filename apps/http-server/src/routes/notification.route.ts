import { notificationController } from '../controllers/notification.controller';
import { accessTokenValidator } from '../validators/jwt.validator';
import { queryValidator } from '../validators/query.validator';
import { bodyValidator } from '../validators/body.validator';
import { idObj, pageLimitObj } from '@workspace/schema/notification';
import { Router } from 'express';

const notificationRouter:Router = Router();
// @ts-ignore
notificationRouter.post('/mark-as-read',  bodyValidator(idObj), accessTokenValidator(), notificationController.markNotificationAsRead);
// @ts-ignore
notificationRouter.get('/',  queryValidator(pageLimitObj), accessTokenValidator(), notificationController.getNotifications);
// @ts-ignore
notificationRouter.get('/count', accessTokenValidator(), notificationController.getNotificationCount);
// @ts-ignore
notificationRouter.get('/unread-count', accessTokenValidator(), notificationController.getUnreadNotificationCount);

export default notificationRouter;
