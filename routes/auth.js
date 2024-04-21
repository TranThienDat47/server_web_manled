import express from 'express';

import authController from '../app/controllers/AuthController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, authController.check);

router.get('/verify', authController.verify);

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/login/check_account_valid', authController.checkAccountValid);

router.post('/login/resend', verifyToken, authController.resend);

export default router;
