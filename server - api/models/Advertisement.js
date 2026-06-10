const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema(
  {
    catererId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    link: { type: String, default: '' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model('Advertisement', advertisementSchema);
