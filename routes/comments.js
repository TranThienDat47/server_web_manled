import express from 'express';

import commentsController from '../app/controllers/CommentsController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.get('/', commentsController.get);

router.post('/', verifyToken, commentsController.add);

router.post('/check_user_like_comment', verifyToken, commentsController.checkUserLikeComment);

router.post('/num_like', verifyToken, commentsController.getNumLikeComment);

router.post('/like', verifyToken, commentsController.likeComment);

router.post('/dislike', verifyToken, commentsController.disLikeComment);

router.put('/:id', verifyToken, commentsController.update);

export default router;
