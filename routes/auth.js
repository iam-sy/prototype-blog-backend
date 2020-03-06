import express from 'express';
import { authLocalRegister } from '../utils/auth/auth.ctrl';

const authRouter = express.Router();

authRouter.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

authRouter.post('/local/register', authLocalRegister);

export { authRouter };
//module.exports = authRouter;
