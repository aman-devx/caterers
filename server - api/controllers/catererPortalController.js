const Caterer = require('../models/Caterer');
const MenuItem = require('../models/MenuItem');
const MenuCategory = require('../models/MenuCategory');
const PricingPackage = require('../models/PricingPackage');
const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');
const Advertisement = require('../models/Advertisement');
const Booking = require('../models/Booking');
const { validateMenuItem } = require('../middleware/validateMenuItem');
const { getAnalytics } = require('../utils/analyticsHelper');

const cid = (req) => req.user.catererId;

async function getAnalyticsData(req, res) {
  try {
    const period = req.query.period || 'monthly';
    const data = await getAnalytics(cid(req), period);
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to load analytics' });
  }
}

async function getDashboard(req, res) {
  try {
    const catererId = cid(req);
    const period = req.query.period || 'monthly';
    const [caterer, menu, menuCategories, packages, services, testimonials, ads, bookings, analytics] =
      await Promise.all([
        Caterer.findOne({ id: catererId }).lean(),
        MenuItem.find({ catererId }).sort({ category: 1 }).lean(),
        MenuCategory.find({ catererId }).sort({ sortOrder: 1 }).lean(),
        PricingPackage.find({ catererId }).lean(),
        Service.find({ catererId }).lean(),
        Testimonial.find({ catererId }).lean(),
        Advertisement.find({ catererId }).lean(),
        Booking.find({ catererId }).sort({ createdAt: -1 }).lean(),
        getAnalytics(catererId, period),
      ]);

    res.json({
      profile: caterer,
      menu: menu.map((m) => ({ ...m, id: m._id.toString() })),
      menuCategories,
      packages,
      services,
      testimonials: testimonials.map((t) => ({ ...t, id: t._id.toString() })),
      advertisements: ads.map((a) => ({ ...a, id: a._id.toString() })),
      bookings: bookings.map((b) => ({ ...b, id: b._id.toString() })),
      analytics,
    });
  } catch {
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
}

async function getProfile(req, res) {
  try {
    const caterer = await Caterer.findOne({ id: cid(req) }).lean();
    if (!caterer) return res.status(404).json({ error: 'Profile not found' });
    res.json(caterer);
  } catch {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

async function updateProfile(req, res) {
  try {
    const allowed = [
      'name', 'location', 'description', 'pricePerPlate', 'cuisines', 'rating',
      'coverImage', 'logo', 'gallery', 'phone', 'email', 'website', 'socialMedia',
    ];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (updates.gallery) updates.images = updates.gallery;

    const caterer = await Caterer.findOneAndUpdate({ id: cid(req) }, { $set: updates }, { new: true }).lean();
    res.json(caterer);
  } catch {
    res.status(500).json({ error: 'Failed to update profile' });
  }
}

async function listMenu(req, res) {
  try {
    const items = await MenuItem.find({ catererId: cid(req) }).sort({ category: 1, name: 1 });
    res.json(items.map((item) => item.toPublicJSON()));
  } catch {
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
}

async function createMenuItem(req, res) {
  const errors = validateMenuItem(req.body);
  if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });

  try {
    const item = await MenuItem.create({
      catererId: cid(req),
      name: req.body.name.trim(),
      description: req.body.description?.trim() || '',
      price: req.body.price,
      category: req.body.category.trim(),
      isAvailable: req.body.isAvailable !== false,
      isVeg: req.body.isVeg !== false,
      images: req.body.images || [],
      details: req.body.details?.trim() || '',
    });
    res.status(201).json(item.toPublicJSON());
  } catch {
    res.status(500).json({ error: 'Failed to create menu item' });
  }
}

async function updateMenuItem(req, res) {
  try {
    const item = await MenuItem.findOne({ _id: req.params.menuId, catererId: cid(req) });
    if (!item) return res.status(404).json({ error: 'Menu item not found' });

    ['name', 'description', 'price', 'category', 'isAvailable', 'isVeg', 'images', 'details'].forEach((key) => {
      if (req.body[key] !== undefined) {
        item[key] = typeof req.body[key] === 'string' ? req.body[key].trim() : req.body[key];
      }
    });
    await item.save();
    res.json(item.toPublicJSON());
  } catch {
    res.status(500).json({ error: 'Failed to update menu item' });
  }
}

async function deleteMenuItem(req, res) {
  try {
    const item = await MenuItem.findOneAndDelete({ _id: req.params.menuId, catererId: cid(req) });
    if (!item) return res.status(404).json({ error: 'Menu item not found' });
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete' });
  }
}

async function listMenuCategories(req, res) {
  try {
    const cats = await MenuCategory.find({ catererId: cid(req) }).sort({ sortOrder: 1 });
    res.json(cats.map((c) => ({ id: c._id.toString(), name: c.name, sortOrder: c.sortOrder })));
  } catch {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
}

async function createMenuCategory(req, res) {
  try {
    const cat = await MenuCategory.create({
      catererId: cid(req),
      name: req.body.name.trim(),
      sortOrder: Number(req.body.sortOrder) || 0,
    });
    res.status(201).json({ id: cat._id.toString(), name: cat.name, sortOrder: cat.sortOrder });
  } catch {
    res.status(500).json({ error: 'Failed to create category' });
  }
}

async function deleteMenuCategory(req, res) {
  try {
    await MenuCategory.findOneAndDelete({ _id: req.params.id, catererId: cid(req) });
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete' });
  }
}

async function addGalleryImage(req, res) {
  try {
    const caterer = await Caterer.findOne({ id: cid(req) });
    if (!caterer) return res.status(404).json({ error: 'Not found' });
    const url = req.body.url;
    if (!url) return res.status(400).json({ error: 'URL required' });
    caterer.gallery = [...(caterer.gallery || []), url];
    caterer.images = caterer.gallery;
    await caterer.save();
    res.json({ gallery: caterer.gallery });
  } catch {
    res.status(500).json({ error: 'Failed to add image' });
  }
}

async function removeGalleryImage(req, res) {
  try {
    const caterer = await Caterer.findOne({ id: cid(req) });
    if (!caterer) return res.status(404).json({ error: 'Not found' });
    caterer.gallery = (caterer.gallery || []).filter((u) => u !== req.body.url);
    caterer.images = caterer.gallery;
    await caterer.save();
    res.json({ gallery: caterer.gallery });
  } catch {
    res.status(500).json({ error: 'Failed to remove image' });
  }
}

async function createService(req, res) {
  try {
    const s = await Service.create({ catererId: cid(req), ...req.body, name: req.body.name.trim() });
    res.status(201).json({ id: s._id.toString(), ...s.toObject() });
  } catch {
    res.status(500).json({ error: 'Failed to create service' });
  }
}

async function updateService(req, res) {
  try {
    const s = await Service.findOneAndUpdate(
      { _id: req.params.id, catererId: cid(req) },
      { $set: req.body },
      { new: true }
    );
    if (!s) return res.status(404).json({ error: 'Not found' });
    res.json({ id: s._id.toString(), ...s.toObject() });
  } catch {
    res.status(500).json({ error: 'Failed to update' });
  }
}

async function deleteService(req, res) {
  try {
    await Service.findOneAndDelete({ _id: req.params.id, catererId: cid(req) });
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete' });
  }
}

async function createPackage(req, res) {
  try {
    const p = await PricingPackage.create({ catererId: cid(req), ...req.body });
    res.status(201).json({ id: p._id.toString(), ...p.toObject() });
  } catch {
    res.status(500).json({ error: 'Failed to create package' });
  }
}

async function updatePackage(req, res) {
  try {
    const p = await PricingPackage.findOneAndUpdate(
      { _id: req.params.id, catererId: cid(req) },
      { $set: req.body },
      { new: true }
    );
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json({ id: p._id.toString(), ...p.toObject() });
  } catch {
    res.status(500).json({ error: 'Failed to update' });
  }
}

async function deletePackage(req, res) {
  try {
    await PricingPackage.findOneAndDelete({ _id: req.params.id, catererId: cid(req) });
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete' });
  }
}

async function createTestimonial(req, res) {
  try {
    const t = await Testimonial.create({ catererId: cid(req), ...req.body });
    res.status(201).json({ id: t._id.toString(), ...t.toObject() });
  } catch {
    res.status(500).json({ error: 'Failed to create' });
  }
}

async function updateTestimonial(req, res) {
  try {
    const t = await Testimonial.findOneAndUpdate(
      { _id: req.params.id, catererId: cid(req) },
      { $set: req.body },
      { new: true }
    );
    if (!t) return res.status(404).json({ error: 'Not found' });
    res.json({ id: t._id.toString(), ...t.toObject() });
  } catch {
    res.status(500).json({ error: 'Failed to update' });
  }
}

async function deleteTestimonial(req, res) {
  try {
    await Testimonial.findOneAndDelete({ _id: req.params.id, catererId: cid(req) });
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete' });
  }
}

async function createAdvertisement(req, res) {
  try {
    const a = await Advertisement.create({ catererId: cid(req), ...req.body });
    res.status(201).json({ id: a._id.toString(), ...a.toObject() });
  } catch {
    res.status(500).json({ error: 'Failed to create ad' });
  }
}

async function updateAdvertisement(req, res) {
  try {
    const a = await Advertisement.findOneAndUpdate(
      { _id: req.params.id, catererId: cid(req) },
      { $set: req.body },
      { new: true }
    );
    if (!a) return res.status(404).json({ error: 'Not found' });
    res.json({ id: a._id.toString(), ...a.toObject() });
  } catch {
    res.status(500).json({ error: 'Failed to update' });
  }
}

async function deleteAdvertisement(req, res) {
  try {
    await Advertisement.findOneAndDelete({ _id: req.params.id, catererId: cid(req) });
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete' });
  }
}

async function updateBooking(req, res) {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, catererId: cid(req) },
      { $set: { status: req.body.status } },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: 'Not found' });

    if (req.body.status === 'accepted') {
      await Caterer.updateOne({ id: cid(req) }, { $inc: { totalBookings: 1 } });
    }
    res.json({ id: booking._id.toString(), status: booking.status });
  } catch {
    res.status(500).json({ error: 'Failed to update booking' });
  }
}

module.exports = {
  getAnalyticsData,
  getDashboard,
  getProfile,
  updateProfile,
  listMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  listMenuCategories,
  createMenuCategory,
  deleteMenuCategory,
  addGalleryImage,
  removeGalleryImage,
  createService,
  updateService,
  deleteService,
  createPackage,
  updatePackage,
  deletePackage,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  updateBooking,
};
