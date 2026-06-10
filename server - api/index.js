const app = require('./app');
const { connectDB } = require('./config/db');
const { seedCaterers } = require('./utils/seed');
const { seedAdmin } = require('./utils/seedAdmin');
const { seedCategories } = require('./utils/seedCategories');
const { seedCategoryAdmin } = require('./utils/seedCategoryAdmin');
const { seedCatererDetails } = require('./utils/seedCatererDetails');
const { seedAnalytics } = require('./utils/seedAnalytics');

const port = process.env.PORT || 4000;

async function start() {
  try {
    await connectDB();
    await seedCaterers();
    await seedCategories();
    await seedAdmin();
    await seedCategoryAdmin();
    await seedCatererDetails();
    await seedAnalytics();

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

module.exports = app;
