const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Caterer = require('../models/Caterer');

/** Seeds demo caterer login only (no category manager role). */
async function seedCategoryAdmin() {
  const catererEmail = process.env.DEMO_CATERER_EMAIL || 'caterer@caterersnearme.com';
  const catererExists = await User.findOne({ email: catererEmail });

  if (!catererExists) {
    const firstCaterer = await Caterer.findOne().sort({ id: 1 });
    if (firstCaterer) {
      const password = process.env.DEMO_CATERER_PASSWORD || 'caterer123';
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({
        email: catererEmail,
        password: hashed,
        role: 'caterer',
        name: firstCaterer.name,
        catererId: firstCaterer.id,
      });
      await Caterer.updateOne({ id: firstCaterer.id }, { userId: user._id.toString() });
      console.log(`Demo caterer seeded: ${catererEmail} (password: ${password})`);
    }
  }
}

module.exports = { seedCategoryAdmin };
