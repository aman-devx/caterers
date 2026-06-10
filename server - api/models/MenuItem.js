const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    catererId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    isAvailable: { type: Boolean, default: true },
    isVeg: { type: Boolean, default: true },
    images: { type: [String], default: [] },
    details: { type: String, trim: true, default: '' },
  },
  { versionKey: false, timestamps: true }
);

menuItemSchema.methods.toPublicJSON = function () {
  return {
    id: this._id.toString(),
    catererId: this.catererId,
    name: this.name,
    description: this.description,
    price: this.price,
    category: this.category,
    isAvailable: this.isAvailable,
    isVeg: this.isVeg,
    images: this.images,
    details: this.details,
  };
};

module.exports = mongoose.model('MenuItem', menuItemSchema);
