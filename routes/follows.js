import express from 'express';

import followController from '../app/controllers/FollowController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.post('/check_follow', followController.checkIsFollow);

router.post('/list_follow', followController.getListFollowOfUser);

router.post('/follow', followController.follow);

router.delete('/unfollow', followController.unfollow);

export default router;
