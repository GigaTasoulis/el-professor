const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Example of a protected route
router.get('/dashboard', protect, admin, (req, res) => {
  res.json({ message: 'Admin Dashboard' });
});

module.exports = router;
