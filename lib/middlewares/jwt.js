import { createToken, decodeToken } from '../token/token';

const jwtMiddleware = async (req, res, next) => {
    const token = req.cookies.accesstoken;
    if (!token) {
        req.user = null;
        return next();
    }
    try {
        const decoded = await decodeToken(token);
        const { user } = decoded;
        if (Date.now() / 1000 - decoded.iat > 60 * 60 * 24 * 3) {
            const freshToken = await createToken({ user }, 'user');
            res.cookie('accesstoken', freshToken, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 7,
            });
        }
        req.user = user;
    } catch (e) {
        req.user = null;
    }
    return next();
};

export { jwtMiddleware };
