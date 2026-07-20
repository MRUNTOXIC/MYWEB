const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const leaderOnly = (req, res, next) => {
  if (req.user.role !== 'leader') {
    res.status(403).json({ message: 'Leader access required' });
    return;
  }
  next();
};

module.exports = { protect, leaderOnly };
