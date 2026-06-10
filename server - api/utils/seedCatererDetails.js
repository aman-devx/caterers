const Caterer = require('../models/Caterer');
const MenuItem = require('../models/MenuItem');
const MenuCategory = require('../models/MenuCategory');
const PricingPackage = require('../models/PricingPackage');
const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');
const Advertisement = require('../models/Advertisement');
const Booking = require('../models/Booking');
const profiles = require('../data/catererProfiles');

async function seedCatererDetails() {
  const needsMenuReseed = !(await MenuItem.findOne({ isVeg: { $exists: true } }));

  for (const p of profiles) {
    const exists = await Caterer.findOne({ id: p.id });
    if (!exists) continue;

    await Caterer.updateOne(
      { id: p.id },
      {
        $set: {
          description: p.description,
          coverImage: p.coverImage,
          logo: p.logo,
          gallery: p.gallery,
          images: p.gallery,
          phone: p.phone,
          email: p.email,
          website: p.website,
          socialMedia: p.socialMedia,
          profileViews: p.profileViews,
          totalBookings: p.totalBookings,
          revenue: p.revenue,
        },
      }
    );

    if (!needsMenuReseed) continue;

    await MenuCategory.deleteMany({ catererId: p.id });
    await MenuCategory.insertMany(p.menuCategories.map((name, i) => ({ catererId: p.id, name, sortOrder: i })));

    await PricingPackage.deleteMany({ catererId: p.id });
    if (p.packages?.length) await PricingPackage.insertMany(p.packages.map((pk) => ({ ...pk, catererId: p.id })));

    await Service.deleteMany({ catererId: p.id });
    if (p.services?.length) await Service.insertMany(p.services.map((s) => ({ ...s, catererId: p.id })));

    await MenuItem.deleteMany({ catererId: p.id });
    if (p.menuItems?.length) {
      await MenuItem.insertMany(
        p.menuItems.map((m) => ({
          catererId: p.id,
          name: m.name,
          description: m.description,
          price: m.price,
          category: m.category,
          images: m.images || [],
          isVeg: m.isVeg !== false,
          isAvailable: true,
        }))
      );
    }

    await Testimonial.deleteMany({ catererId: p.id });
    if (p.testimonials?.length) await Testimonial.insertMany(p.testimonials.map((t) => ({ ...t, catererId: p.id })));

    await Booking.deleteMany({ catererId: p.id });
    if (p.bookings?.length) await Booking.insertMany(p.bookings.map((b) => ({ ...b, catererId: p.id })));

    await Advertisement.deleteMany({ catererId: p.id });
    if (p.ads?.length) await Advertisement.insertMany(p.ads.map((a) => ({ ...a, catererId: p.id })));
  }

  console.log(needsMenuReseed ? 'Reseeded caterer menus with curated images' : 'Caterer profiles updated');
}

module.exports = { seedCatererDetails };
