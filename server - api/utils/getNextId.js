const Caterer = require('../models/Caterer');

async function getNextId() {
  const caterers = await Caterer.find({}, 'id').lean();
  const maxId = caterers.reduce((max, c) => Math.max(max, Number(c.id) || 0), 0);
  return String(maxId + 1);
}

module.exports = { getNextId };
