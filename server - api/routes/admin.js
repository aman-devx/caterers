const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.get('/caterers', adminController.listCaterers);
router.post('/caterers', adminController.createCaterer);
router.delete('/caterers/:id', adminController.deleteCaterer);

module.exports = router;
