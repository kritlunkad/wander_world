const Package = require('../models/Package');

// @desc    Get all packages (with optional destination & maxPrice filter)
// @route   GET /api/packages
// @access  Public
const getPackages = async (req, res, next) => {
  try {
    const { destination, maxPrice } = req.query;
    let query = {};

    if (destination) {
      query.destination = { $regex: destination, $options: 'i' };
    }

    if (maxPrice) {
      const parsedMax = Number(maxPrice);
      if (!isNaN(parsedMax)) {
        query.price = { $lte: parsedMax };
      }
    }

    const packages = await Package.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: packages.length,
      data: packages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single package by ID
// @route   GET /api/packages/:id
// @access  Public
const getPackageById = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: `Package not found with id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: pkg,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new package
// @route   POST /api/packages
// @access  Private/Admin
const createPackage = async (req, res, next) => {
  try {
    const pkg = await Package.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      data: pkg,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a package
// @route   PUT /api/packages/:id
// @access  Private/Admin
const updatePackage = async (req, res, next) => {
  try {
    let pkg = await Package.findById(req.params.id);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: `Package not found with id of ${req.params.id}`,
      });
    }

    pkg = await Package.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Package updated successfully',
      data: pkg,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a package
// @route   DELETE /api/packages/:id
// @access  Private/Admin
const deletePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: `Package not found with id of ${req.params.id}`,
      });
    }

    await Package.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Package deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
};
