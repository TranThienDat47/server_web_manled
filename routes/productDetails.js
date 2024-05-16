import express from 'express';

import productDetailsController from '../app/controllers/ProductDetailsController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.get('/:id', productDetailsController.showOfParent);

router.post('/', productDetailsController.add);

router.put('/increaseView/:id', productDetailsController.increaseView);

router.post('/like', verifyToken, productDetailsController.like);

router.post('/dislike', verifyToken, productDetailsController.dislike);

router.post('/check_user_like', verifyToken, productDetailsController.checkUserLike);

router.put('/:id', productDetailsController.update);

router.delete('/:id', productDetailsController.delete);

export default router;
