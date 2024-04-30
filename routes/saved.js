import express from 'express';

import savedController from '../app/controllers/SavedController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.post('/check_saved', savedController.checkIsSaved);

router.post('/list_saved', savedController.getListSavedOfUser);

router.post('/saved', savedController.saved);

router.delete('/un_saved', savedController.unSaved);

export default router;
