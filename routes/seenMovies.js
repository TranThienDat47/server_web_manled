import express from 'express';

import seenMovieController from '../app/controllers/SeenMovieController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.post('/check_seenMovie', verifyToken, seenMovieController.checkIsSeenMovie);

router.post('/list_seenMovie', verifyToken, seenMovieController.getListSeenMovieOfUser);

router.post('/seenMovie', verifyToken, seenMovieController.seenMovie);

router.delete('/unseenMovie', verifyToken, seenMovieController.unseenMovie);

export default router;
