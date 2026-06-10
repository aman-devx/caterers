const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Caterer = require('../models/Caterer');

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        catererId: user.catererId,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: user.toSafeJSON() });
  } catch {
    res.status(500).json({ error: 'Login failed' });
  }
}

async function me(req, res) {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const payload = user.toSafeJSON();

    if (user.role === 'caterer' && user.catererId) {
      const caterer = await Caterer.findOne({ id: user.catererId }).lean();
      payload.caterer = caterer;
    }

    res.json(payload);
  } catch {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

module.exports = { login, me };
