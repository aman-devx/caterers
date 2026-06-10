const bcrypt = require('bcryptjs');
const Caterer = require('../models/Caterer');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');
const { getNextId } = require('../utils/getNextId');
const { validateAdminCaterer } = require('../middleware/validateAdminCaterer');

async function listCaterers(req, res) {
  try {
    const caterers = await Caterer.find().sort({ id: 1 }).lean();
    const users = await User.find({ role: 'caterer' }).lean();
    const userByCatererId = Object.fromEntries(
      users.filter((u) => u.catererId).map((u) => [u.catererId, u])
    );

    const result = caterers.map((c) => ({
      ...c,
      loginEmail: userByCatererId[c.id]?.email || null,
      hasLogin: Boolean(userByCatererId[c.id]),
    }));

    res.json(result);
  } catch {
    res.status(500).json({ error: 'Failed to fetch caterers' });
  }
}

async function createCaterer(req, res) {
  const errors = validateAdminCaterer(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  const email = req.body.email.toLowerCase().trim();

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }

    const catererId = await getNextId();
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const caterer = await Caterer.create({
      id: catererId,
      name: req.body.name.trim(),
      location: req.body.location.trim(),
      pricePerPlate: req.body.pricePerPlate,
      cuisines: req.body.cuisines.map((c) => c.trim()),
      rating: req.body.rating,
      description: req.body.description?.trim() || '',
    });

    const user = await User.create({
      email,
      password: hashedPassword,
      role: 'caterer',
      name: req.body.name.trim(),
      catererId: caterer.id,
    });

    await Caterer.updateOne({ id: caterer.id }, { userId: user._id.toString() });

    res.status(201).json({
      caterer: { ...caterer.toObject(), userId: user._id.toString() },
      credentials: { email, role: 'caterer' },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Caterer or user already exists' });
    }
    res.status(500).json({ error: 'Failed to create caterer' });
  }
}

async function deleteCaterer(req, res) {
  try {
    const caterer = await Caterer.findOneAndDelete({ id: req.params.id });
    if (!caterer) {
      return res.status(404).json({ error: 'Caterer not found' });
    }

    await User.deleteMany({ catererId: req.params.id });
    await MenuItem.deleteMany({ catererId: req.params.id });

    res.json({ message: 'Caterer and associated data deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete caterer' });
  }
}

module.exports = { listCaterers, createCaterer, deleteCaterer };
