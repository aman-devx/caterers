const mongoose = require('mongoose');

const catererSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    pricePerPlate: { type: Number, required: true },
    cuisines: { type: [String], required: true },
    rating: { type: Number, required: true },
    description: { type: String, trim: true, default: '' },
    userId: { type: String, default: null },
    categoryIds: { type: [String], default: [] },
    coverImage: { type: String, default: '' },
    logo: { type: String, default: '' },
    gallery: { type: [String], default: [] },
    images: { type: [String], default: [] },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    website: { type: String, default: '' },
    socialMedia: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
    profileViews: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Caterer', catererSchema);
