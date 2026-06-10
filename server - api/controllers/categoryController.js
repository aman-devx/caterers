const Category = require('../models/Category');
const Caterer = require('../models/Caterer');
const MenuItem = require('../models/MenuItem');

async function listCategories(req, res) {
  try {
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
    res.json(categories);
  } catch {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
}

async function getCategoryBySlug(req, res) {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true }).lean();
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const caterers = await Caterer.find({ categoryIds: category.id }).sort({ rating: -1 }).lean();
    const catererIds = caterers.map((c) => c.id);

    const menuItems = await MenuItem.find({
      catererId: { $in: catererIds },
      isAvailable: true,
    }).lean();

    const menuByCaterer = {};
    for (const item of menuItems) {
      if (!menuByCaterer[item.catererId]) menuByCaterer[item.catererId] = [];
      menuByCaterer[item.catererId].push({
        id: item._id.toString(),
        catererId: item.catererId,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        isAvailable: item.isAvailable,
        images: item.images || [],
        details: item.details || '',
      });
    }

    const prices = menuItems.map((m) => m.price);
    const catererPrices = caterers.map((c) => c.pricePerPlate);
    const allPrices = [...prices, ...catererPrices].filter((p) => p > 0);

    res.json({
      ...category,
      caterers,
      menuByCaterer,
      pricing: {
        min: allPrices.length ? Math.min(...allPrices) : null,
        max: allPrices.length ? Math.max(...allPrices) : null,
        note: category.pricingNote,
      },
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
}

module.exports = { listCategories, getCategoryBySlug };
