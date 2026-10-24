const express = require('express');
const router = express.Router();
const {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
} = require('../controllers/packageController');
const { protect, isAdmin } = require('../middleware/auth');

// Routes for /api/packages
router
  .route('/')
  .get(getPackages)
  .post(protect, isAdmin, createPackage);

router
  .route('/:id')
  .get(getPackageById)
  .put(protect, isAdmin, updatePackage)
  .delete(protect, isAdmin, deletePackage);

module.exports = router;
