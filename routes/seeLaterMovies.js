import express from 'express';

import seeLaterMovieController from '../app/controllers/SeeLaterMovieController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.post('/check_seeLaterMovie', verifyToken, seeLaterMovieController.checkIsSeeLaterMovie);

router.post('/list_seeLaterMovie', verifyToken, seeLaterMovieController.getListSeeLaterMovieOfUser);

router.post('/seeLaterMovie', verifyToken, seeLaterMovieController.seeLaterMovie);

router.delete('/unseeLaterMovie', verifyToken, seeLaterMovieController.unseeLaterMovie);

export default router;
