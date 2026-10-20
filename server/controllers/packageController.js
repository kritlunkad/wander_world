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

module.exports = {
  getPackages,
  getPackageById,
};
