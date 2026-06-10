const express = require('express');
const catererController = require('../controllers/catererController');

const router = express.Router();

router.get('/', catererController.listCaterers);
router.get('/:id/full', catererController.getCatererProfile);
router.get('/:id/menu', catererController.getCatererMenu);
router.get('/:id', catererController.getCatererProfile);
router.post('/:id/bookings', catererController.createBooking);

module.exports = router;
