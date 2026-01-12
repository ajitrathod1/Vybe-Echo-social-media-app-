const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token') || req.header('authorization');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const t = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
    const decoded = jwt.verify(t, JWT_SECRET);
    req.user = decoded; // expecting { id, name, email }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
