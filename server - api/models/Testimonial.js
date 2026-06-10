const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    catererId: { type: String, required: true, index: true },
    customerName: { type: String, required: true, trim: true },
    text: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    eventType: { type: String, default: '' },
    featured: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
