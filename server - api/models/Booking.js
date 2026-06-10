const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    catererId: { type: String, required: true, index: true },
    customerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: '' },
    eventDate: { type: Date, required: true },
    guests: { type: Number, required: true, min: 1 },
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending',
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
