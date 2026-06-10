const Caterer = require('../models/Caterer');
const seedData = require('../data/caterers.json');

async function seedCaterers() {
  const count = await Caterer.countDocuments();

  if (count > 0) {
    console.log(`Database already has ${count} caterers — skipping seed`);
    return;
  }

  try {
    await Caterer.insertMany(seedData);
    console.log(`Seeded ${seedData.length} caterers into MongoDB`);
  } catch (err) {
    if (err.code === 11000) {
      console.log('Seed skipped — caterers already present in database');
      return;
    }
    throw err;
  }
}

module.exports = { seedCaterers };
