import express from 'express';
import { authLocalRegister, localLogin, check } from '../utils/auth/auth.ctrl';

const authRouter = express.Router();

authRouter.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

authRouter.post('/register/local', authLocalRegister);
authRouter.post('/login/local', localLogin);
authRouter.get('/check', check);

export { authRouter };
//module.exports = authRouter;
