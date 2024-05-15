import express from 'express';

import seeLaterMovieController from '../app/controllers/SeeLaterMovieController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.post('/check_seeLaterMovie', seeLaterMovieController.checkIsSeeLaterMovie);

router.post('/list_seeLaterMovie', seeLaterMovieController.getListSeeLaterMovieOfUser);

router.post('/seeLaterMovie', seeLaterMovieController.seeLaterMovie);

router.delete('/unseeLaterMovie', seeLaterMovieController.unseeLaterMovie);

export default router;
