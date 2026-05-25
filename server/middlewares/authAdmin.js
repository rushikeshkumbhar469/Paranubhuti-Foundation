const jwt = require('jsonwebtoken');

const authAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Admin authentication required.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'paranubhuti-admin-secret';
    const decoded = jwt.verify(token, secret);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired session. Please log in again.' });
  }
};

module.exports = authAdmin;
