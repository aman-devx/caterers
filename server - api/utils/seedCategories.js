const Category = require('../models/Category');
const Caterer = require('../models/Caterer');
const seedData = require('../data/categories.json');

async function seedCategories() {
  const count = await Category.countDocuments();

  if (count === 0) {
    await Category.insertMany(seedData);
    console.log(`Seeded ${seedData.length} categories`);
  }

  const caterers = await Caterer.find().lean();
  if (caterers.length > 0) {
    const updates = caterers.map((c, i) => {
      const categoryId = seedData[i % seedData.length]?.id;
      if (!categoryId || (c.categoryIds && c.categoryIds.length > 0)) return null;
      return Caterer.updateOne({ id: c.id }, { $set: { categoryIds: [categoryId] } });
    }).filter(Boolean);

    if (updates.length > 0) {
      await Promise.all(updates);
      console.log('Linked caterers to categories');
    }
  }
}

module.exports = { seedCategories };
