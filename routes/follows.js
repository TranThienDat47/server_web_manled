import express from 'express';

import followController from '../app/controllers/FollowController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.get('/count_follow/:product_id', followController.getCountFollowOfProduct);

router.post('/check_follow', verifyToken, followController.checkIsFollow);

router.post('/list_follow', followController.getListFollowOfUser);

router.post('/follow', verifyToken, followController.follow);

router.delete('/unfollow', verifyToken, followController.unfollow);

export default router;
