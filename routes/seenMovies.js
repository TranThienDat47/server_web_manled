import express from 'express';

import seenMovieController from '../app/controllers/SeenMovieController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.post('/check_seenMovie', seenMovieController.checkIsSeenMovie);

router.post('/list_seenMovie', seenMovieController.getListSeenMovieOfUser);

router.post('/seenMovie', seenMovieController.seenMovie);

router.delete('/unseenMovie', seenMovieController.unseenMovie);

export default router;
