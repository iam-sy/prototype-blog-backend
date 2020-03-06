import Joi from '@hapi/joi';
import userModel from '../../db/models/userModel';
import { createToken } from '../../lib/token/token';

//register code
const authLocalRegister = async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
        displayName: Joi.string()
            .regex(/^[a-zA-Z0-9r-힣]{3,12}$/)
            .required(),
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .min(6)
            .max(10),
    });
    const { value, error } = schema.validate(body);
    if (error) {
        res.status(400).json({ message: error.message });
        return;
    }

    const { displayName, email, password } = body;
    try {
        // 이메일 중복 체크
        const exists = await userModel.findExistancy({ email, displayName });
        if (exists) {
            const key = exists.email === email ? 'email' : 'displayName';
            res.status(409).send({ message: `${key} exists error` });
            return true;
        }
        // 유저 생성
        const user = await userModel.localRegister({
            displayName,
            email,
            password,
        });

        // accessToken 생성
        const accessToken = await user.generateToken();

        // set cookie
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        res.status(201).send('');
    } catch (e) {
        res.status(500);
    }
};

const localLogin = async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
        displayName: Joi.string()
            .regex(/^[a-zA-Z0-9r-힣]{3,12}$/)
            .required(),
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .min(6)
            .max(10),
    });

    const { value, error } = schema.validate(body);
    if (error) {
        res.status(400).json({ message: error.message });
        return true;
    }

    const { email, password } = body;
    try {
        const user = await userModel.findByEmail(email);
        if (!user) {
            res.status(403).json({ message: error.message });
            return true;
        }

        const validated = user.validatePassword(password);
        if (!validated) {
            res.status(403).json({ message: error.message });
            return true;
        }

        const accessToken = await user.generateToken();
        // set cookie
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        res.status(201).send('');
    } catch (e) {
        throw e;
    }
};

export { authLocalRegister, localLogin };
