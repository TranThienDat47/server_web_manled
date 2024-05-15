import express from 'express';

import productsController from '../app/controllers/ProductsController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.get('/search', productsController.search);

router.get('/get_product_of_category', productsController.getProductOfCategory);

router.get('/:id', productsController.show);

router.put('/:id', productsController.update);

router.delete('/:id', productsController.delete);

router.post('/', productsController.add);

export default router;
