import express from 'express';

import notificationController from '../app/controllers/NotificationsController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.post('/', notificationController.show);

router.post('/like_comment', notificationController.likeComment);

router.post('/reply_comment', notificationController.replyComment);

// router.put('/', notificationController.update);

router.delete('/', notificationController.delete);

export default router;
