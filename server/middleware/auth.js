const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    // Bearer <token>
    const bearer = token.split(' ');
    const bearerToken = bearer[1];

    jwt.verify(bearerToken, process.env.JWT_SECRET || 'default_secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.userId = decoded.id;
        req.role = decoded.role;
        next();
    });
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Require Admin Role' });
        }
    });
};

module.exports = { verifyToken, verifyAdmin, isAdmin: verifyAdmin };
