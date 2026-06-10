const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@caterersnearme.com';
  const exists = await User.findOne({ email });

  if (exists) {
    console.log('Admin user already exists — skipping');
    return;
  }

  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    email,
    password: hashed,
    role: 'admin',
    name: 'Platform Admin',
  });

  console.log(`Admin seeded: ${email} (password: ${password})`);
}

module.exports = { seedAdmin };
