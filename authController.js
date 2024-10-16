const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^[A-Za-z0-9@#%^&+=]{8,}$/;
  
    const { email, password } = req.body;
  
    if (!emailPattern.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
  
    if (!passwordPattern.test(password)) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
    }
  
    // Proceed with user registration
    try {
      const user = await User.create({ email, password });
      res.status(201).json({ success: true, data: { id: user._id, email: user.email } });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
  

// Log in user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
