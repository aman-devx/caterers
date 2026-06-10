const AnalyticsEvent = require('../models/AnalyticsEvent');

async function seedAnalytics() {
  const count = await AnalyticsEvent.countDocuments();
  if (count > 50) return;

  const catererIds = ['2', '3', '4', '6', '7', '8'];
  const events = [];
  const now = Date.now();

  for (const catererId of catererIds) {
    for (let d = 30; d >= 0; d--) {
      const date = new Date(now - d * 86400000);
      const views = Math.floor(Math.random() * 15) + 2;
      for (let i = 0; i < views; i++) {
        events.push({
          catererId,
          type: 'profile_view',
          label: 'Profile viewed',
          createdAt: new Date(date.getTime() + i * 3600000),
        });
      }
      if (d % 3 === 0) {
        events.push({
          catererId,
          type: 'menu_view',
          menuItemName: 'Butter Chicken',
          label: 'Menu item viewed',
          createdAt: date,
        });
      }
    }
  }

  await AnalyticsEvent.insertMany(events);
  console.log(`Seeded ${events.length} analytics events`);
}

module.exports = { seedAnalytics };
