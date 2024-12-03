const jwt = require('jsonwebtoken');

const validateSignupToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Temporary token missing' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err || !decoded.allowSignup) {
            return res.status(403).json({ message: 'Invalid or expired temporary token' });
        }
        next();
    });
};

module.exports = validateSignupToken;
