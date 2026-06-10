const Caterer = require('../models/Caterer');
const MenuItem = require('../models/MenuItem');
const MenuCategory = require('../models/MenuCategory');
const PricingPackage = require('../models/PricingPackage');
const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');
const Advertisement = require('../models/Advertisement');
const { logEvent } = require('../utils/analyticsHelper');

async function getFullProfile(catererId, incrementView = false) {
  const caterer = await Caterer.findOne({ id: catererId }).lean();
  if (!caterer) return null;

  if (incrementView) {
    await Caterer.updateOne({ id: catererId }, { $inc: { profileViews: 1 } });
    caterer.profileViews = (caterer.profileViews || 0) + 1;
    logEvent(catererId, 'profile_view', { label: 'Profile viewed' }).catch(() => {});
  }

  const [menuItems, menuCategories, packages, services, testimonials, advertisements] =
    await Promise.all([
      MenuItem.find({ catererId, isAvailable: true }).sort({ category: 1, name: 1 }).lean(),
      MenuCategory.find({ catererId }).sort({ sortOrder: 1 }).lean(),
      PricingPackage.find({ catererId }).lean(),
      Service.find({ catererId, isActive: true }).lean(),
      Testimonial.find({ catererId }).sort({ featured: -1, createdAt: -1 }).lean(),
      Advertisement.find({ catererId, isActive: true }).lean(),
    ]);

  return {
    ...caterer,
    menuItems: menuItems.map((m) => ({
      id: m._id.toString(),
      catererId: m.catererId,
      name: m.name,
      description: m.description,
      price: m.price,
      category: m.category,
      isAvailable: m.isAvailable,
      isVeg: m.isVeg !== false,
      images: m.images || [],
      details: m.details || '',
    })),
    menuCategories,
    packages,
    services,
    testimonials: testimonials.map((t) => ({
      id: t._id.toString(),
      customerName: t.customerName,
      text: t.text,
      rating: t.rating,
      eventType: t.eventType,
      featured: t.featured,
    })),
    reviews: testimonials.map((t) => ({
      id: t._id.toString(),
      customerName: t.customerName,
      text: t.text,
      rating: t.rating,
      eventType: t.eventType,
    })),
    advertisements: advertisements.map((a) => ({
      id: a._id.toString(),
      title: a.title,
      image: a.image,
      link: a.link,
      isActive: a.isActive,
    })),
  };
}

module.exports = { getFullProfile };
