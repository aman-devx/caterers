const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    catererId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
