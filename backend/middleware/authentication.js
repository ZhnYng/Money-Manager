const jwtDecode = require('jwt-decode');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            const user = jwtDecode(token)
            req.user = user;
            next();
        } catch (InvalidTokenError) {
            return res.sendStatus(403);
        }
    } else {
        res.sendStatus(401);
    }
};

module.exports = authenticateJWT;