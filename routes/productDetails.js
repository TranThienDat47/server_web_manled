import express from 'express';

import productDetailsController from '../app/controllers/ProductDetailsController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.get('/:id', productDetailsController.show);

router.post('/', productDetailsController.add);

router.put('/increaseView/:id', productDetailsController.increaseView);

router.post('/like', productDetailsController.like);

router.post('/dislike', productDetailsController.dislike);

router.post('/check_user_like', productDetailsController.checkUserLike);

router.put('/:id', productDetailsController.update);

router.delete('/:id', productDetailsController.delete);

export default router;
