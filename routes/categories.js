import express from 'express';

import categoriesController from '../app/controllers/CategoriesController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.get('/', categoriesController.showAll);

router.post('/get_of', categoriesController.show);

router.post('/', categoriesController.add);

router.put('/', categoriesController.update);

router.delete('/', categoriesController.delete);

export default router;
