import express from 'express';

import notificationController from '../app/controllers/NotificationsController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.get('/:user_id', verifyToken, notificationController.readCount);

router.post('/', verifyToken, notificationController.show);

router.post('/read', verifyToken, notificationController.read);

router.post('/like_comment', verifyToken, notificationController.likeComment);

router.post('/reply_comment', verifyToken, notificationController.replyComment);

// router.put('/', notificationController.update);

router.delete('/', verifyToken, notificationController.delete);

export default router;
