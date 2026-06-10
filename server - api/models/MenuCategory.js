const mongoose = require('mongoose');

const menuCategorySchema = new mongoose.Schema(
  {
    catererId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model('MenuCategory', menuCategorySchema);
