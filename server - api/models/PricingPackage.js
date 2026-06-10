const mongoose = require('mongoose');

const pricingPackageSchema = new mongoose.Schema(
  {
    catererId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    includes: { type: [String], default: [] },
    isPopular: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model('PricingPackage', pricingPackageSchema);
