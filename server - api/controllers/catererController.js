const Caterer = require('../models/Caterer');
const MenuItem = require('../models/MenuItem');
const Booking = require('../models/Booking');
const { getFullProfile } = require('../services/catererProfileService');

async function listCaterers(req, res) {
  try {
    const caterers = await Caterer.find().sort({ id: 1 }).lean();
    res.json(caterers);
  } catch {
    res.status(500).json({ error: 'Failed to fetch caterers' });
  }
}

async function getCatererProfile(req, res) {
  try {
    const profile = await getFullProfile(req.params.id, true);
    if (!profile) return res.status(404).json({ error: 'Caterer not found' });
    res.json(profile);
  } catch {
    res.status(500).json({ error: 'Failed to fetch caterer' });
  }
}

async function getCatererMenu(req, res) {
  try {
    const caterer = await Caterer.findOne({ id: req.params.id }).lean();
    if (!caterer) return res.status(404).json({ error: 'Caterer not found' });

    const items = await MenuItem.find({ catererId: req.params.id, isAvailable: true }).sort({
      category: 1,
      name: 1,
    });
    res.json(items.map((item) => item.toPublicJSON()));
  } catch {
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
}

async function createBooking(req, res) {
  const { customerName, email, phone, eventDate, guests, message } = req.body;

  if (!customerName || !email || !eventDate || !guests) {
    return res.status(400).json({ error: 'Name, email, event date, and guests are required' });
  }

  try {
    const caterer = await Caterer.findOne({ id: req.params.id });
    if (!caterer) return res.status(404).json({ error: 'Caterer not found' });

    const booking = await Booking.create({
      catererId: req.params.id,
      customerName,
      email,
      phone: phone || '',
      eventDate: new Date(eventDate),
      guests: Number(guests),
      message: message || '',
      status: 'pending',
    });

    res.status(201).json({
      id: booking._id.toString(),
      message: 'Booking request submitted successfully',
    });
  } catch {
    res.status(500).json({ error: 'Failed to submit booking' });
  }
}

module.exports = {
  listCaterers,
  getCatererProfile,
  getCatererMenu,
  createBooking,
};
