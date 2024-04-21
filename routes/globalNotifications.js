import express from 'express';

import gloabalNotificationController from '../app/controllers/GlobalNotificationsController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.get('/', gloabalNotificationController.getWithCustomer);

router.post('/add_all', gloabalNotificationController.addAll);

router.post('/add_many', gloabalNotificationController.addMany);

// router.put('/', gloabalNotificationController.update);

// router.delete('/', gloabalNotificationController.delete);

export default router;
