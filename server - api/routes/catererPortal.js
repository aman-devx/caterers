const express = require('express');
const catererPortalController = require('../controllers/catererPortalController');
const uploadController = require('../controllers/uploadController');
const { upload, handleUploadError } = require('../middleware/upload');

const router = express.Router();

router.get('/analytics', catererPortalController.getAnalyticsData);
router.get('/dashboard', catererPortalController.getDashboard);
router.get('/profile', catererPortalController.getProfile);
router.put('/profile', catererPortalController.updateProfile);

router.get('/menu', catererPortalController.listMenu);
router.post('/menu', catererPortalController.createMenuItem);
router.put('/menu/:menuId', catererPortalController.updateMenuItem);
router.delete('/menu/:menuId', catererPortalController.deleteMenuItem);

router.get('/menu-categories', catererPortalController.listMenuCategories);
router.post('/menu-categories', catererPortalController.createMenuCategory);
router.delete('/menu-categories/:id', catererPortalController.deleteMenuCategory);

router.post('/gallery', catererPortalController.addGalleryImage);
router.delete('/gallery', catererPortalController.removeGalleryImage);

router.post('/services', catererPortalController.createService);
router.put('/services/:id', catererPortalController.updateService);
router.delete('/services/:id', catererPortalController.deleteService);

router.post('/packages', catererPortalController.createPackage);
router.put('/packages/:id', catererPortalController.updatePackage);
router.delete('/packages/:id', catererPortalController.deletePackage);

router.post('/testimonials', catererPortalController.createTestimonial);
router.put('/testimonials/:id', catererPortalController.updateTestimonial);
router.delete('/testimonials/:id', catererPortalController.deleteTestimonial);

router.post('/advertisements', catererPortalController.createAdvertisement);
router.put('/advertisements/:id', catererPortalController.updateAdvertisement);
router.delete('/advertisements/:id', catererPortalController.deleteAdvertisement);

router.put('/bookings/:id', catererPortalController.updateBooking);

router.post('/upload', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) return handleUploadError(err, req, res, next);
    uploadController.uploadImage(req, res, next);
  });
});

module.exports = router;
