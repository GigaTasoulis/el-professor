const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log(`Login attempt for username: ${username}`);

    // Attempt to find the user in the database
    const user = await User.findOne({ username });
    if (!user) {
      console.log(`User not found with username: ${username}`);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    console.log(`User found: ${user.username}, role: ${user.role}`);

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Password does not match for user: ${username}`);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    console.log('Login successful');
    res.json({
      _id: user._id,
      username: user.username,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
