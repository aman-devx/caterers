const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema(
  {
    catererId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ['profile_view', 'menu_view', 'booking_created', 'booking_accepted'],
      required: true,
    },
    menuItemId: { type: String, default: null },
    menuItemName: { type: String, default: '' },
    label: { type: String, default: '' },
  },
  { versionKey: false, timestamps: true }
);

analyticsEventSchema.index({ catererId: 1, createdAt: -1 });

module.exports = mongoose.model('AnalyticsEvent', analyticsEventSchema);
