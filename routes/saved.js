import express from 'express';

import savedController from '../app/controllers/SavedController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.post('/check_saved', verifyToken, savedController.checkIsSaved);

router.post('/list_saved', verifyToken, savedController.getListSavedOfUser);

router.post('/saved', verifyToken, savedController.saved);

router.delete('/un_saved', verifyToken, savedController.unSaved);

export default router;
