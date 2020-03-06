import jwt from 'jsonwebtoken';
const { JWT_SECRET: secret } = process.env;

function generateToken(payload, subject) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            secret,
            {
                issuer: 'xlrj0716.synology.me',
                expiresIn: '7d',
                subject,
            },
            (error, token) => {
                if (error) reject(error);
                resolve(token);
            },
        );
    });
}

export { generateToken };
