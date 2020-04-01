import express from 'express';
const authRouter = express.Router();

import { authLocalRegister, localLogin, check } from '../utils/auth/auth.ctrl';

authRouter.post('/register', authLocalRegister);
authRouter.post('/login', localLogin);
authRouter.get('/check', check);

export { authRouter };
