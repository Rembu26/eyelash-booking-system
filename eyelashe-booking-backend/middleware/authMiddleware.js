const jwt = require('jsonwebtoken');
const Person = require('../models/Person'); // add this

async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader ||!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 1. Pull full user from DB so we have latest role
        const person = await Person.findById(decoded.id).select('-passwordHash -otpCode -otpExpires');

        if (!person) {
            return res.status(401).json({ message: 'User not found' });
        }

        // 2. Block walk-ins from protected routes
        if (person.role === 'walk-in') {
            return res.status(403).json({ message: 'Please complete registration first' });
        }

        req.user = person; // attach full person doc, not just {id, role}
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

module.exports = authMiddleware;