const Caterer = require('../models/Caterer');
const Category = require('../models/Category');
const Service = require('../models/Service');
const MenuItem = require('../models/MenuItem');

async function getSuggestions(req, res) {
  try {
    const query = (req.query.q || '').toString().toLowerCase().trim();
    const locationQ = (req.query.location || '').toString().toLowerCase().trim();
    const categoryQ = (req.query.category || '').toString().toLowerCase().trim();

    const [caterers, categories, services, menuItems] = await Promise.all([
      Caterer.find().lean(),
      Category.find({ isActive: true }).lean(),
      Service.find({ isActive: true }).lean(),
      MenuItem.find({ isAvailable: true }).lean(),
    ]);

    const locations = [...new Set(caterers.map((c) => c.location))];
    const cuisines = [...new Set(caterers.flatMap((c) => c.cuisines))];

    const catererMatches = query
      ? caterers.filter(
          (c) =>
            c.name.toLowerCase().includes(query) ||
            c.cuisines.some((cu) => cu.toLowerCase().includes(query))
        )
      : caterers.slice(0, 5);

    const nameSuggestions = query
      ? [...new Set(catererMatches.map((c) => c.name))].slice(0, 6)
      : caterers.slice(0, 5).map((c) => c.name);

    const locationSuggestions = locationQ
      ? locations.filter((l) => l.toLowerCase().includes(locationQ)).slice(0, 6)
      : locations.slice(0, 6);

    const categorySuggestions = categoryQ
      ? categories
          .filter((cat) => cat.name.toLowerCase().includes(categoryQ) || cat.slug.includes(categoryQ))
          .map((cat) => ({ id: cat.id, name: cat.name, slug: cat.slug }))
          .slice(0, 6)
      : categories.map((cat) => ({ id: cat.id, name: cat.name, slug: cat.slug })).slice(0, 6);

    const cuisineSuggestions = query
      ? cuisines.filter((c) => c.toLowerCase().includes(query)).slice(0, 6)
      : cuisines.slice(0, 8);

    const serviceSuggestions = query
      ? services
          .filter((s) => s.name.toLowerCase().includes(query))
          .map((s) => s.name)
          .slice(0, 6)
      : [...new Set(services.map((s) => s.name))].slice(0, 6);

    const menuSuggestions = query
      ? menuItems
          .filter((m) => m.name.toLowerCase().includes(query))
          .map((m) => m.name)
          .slice(0, 6)
      : [];

    let filtered = caterers;
    if (query) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.cuisines.some((cu) => cu.toLowerCase().includes(query))
      );
    }
    if (locationQ) filtered = filtered.filter((c) => c.location.toLowerCase().includes(locationQ));
    if (categoryQ) {
      const catIds = categories
        .filter((cat) => cat.name.toLowerCase().includes(categoryQ))
        .map((c) => c.id);
      if (catIds.length) {
        filtered = filtered.filter((c) => c.categoryIds?.some((id) => catIds.includes(id)));
      }
    }

    res.json({
      nameSuggestions,
      locationSuggestions,
      categorySuggestions,
      cuisineSuggestions,
      serviceSuggestions,
      menuSuggestions,
      catererResults: catererMatches.slice(0, 8).map((c) => ({
        id: c.id,
        name: c.name,
        location: c.location,
        rating: c.rating,
        pricePerPlate: c.pricePerPlate,
        cuisines: c.cuisines || [],
        coverImage: c.coverImage || c.logo || '',
        logo: c.logo || '',
      })),
      results: filtered,
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
}

module.exports = { getSuggestions };
