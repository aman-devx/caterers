const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, trim: true, default: '' },
    image: { type: String, default: '' },
    images: { type: [String], default: [] },
    pricingNote: { type: String, trim: true, default: '' },
    details: { type: String, trim: true, default: '' },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: true }
);

categorySchema.methods.toPublicJSON = function () {
  return {
    id: this.id,
    name: this.name,
    slug: this.slug,
    description: this.description,
    image: this.image,
    images: this.images,
    pricingNote: this.pricingNote,
    details: this.details,
    isActive: this.isActive,
    sortOrder: this.sortOrder,
  };
};

module.exports = mongoose.model('Category', categorySchema);
