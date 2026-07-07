const Crop = require('../models/Crop');
const { ApiError } = require('../middleware/errorHandler');

/**
 * @desc    Get all crops
 * @route   GET /api/crops
 */
const getAllCrops = async (req, res, next) => {
  try {
    const crops = await Crop.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: crops.length,
      data: crops,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single crop by ID
 * @route   GET /api/crops/:id
 */
const getCropById = async (req, res, next) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return next(new ApiError(`Crop with ID '${req.params.id}' not found`, 404));
    }

    res.status(200).json({
      success: true,
      data: crop,
    });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return next(new ApiError(`Invalid crop ID format: '${req.params.id}'`, 400));
    }
    next(error);
  }
};

/**
 * @desc    Create a new crop
 * @route   POST /api/crops
 */
const createCrop = async (req, res, next) => {
  try {
    const { name, season, region, imageUrl } = req.body;

    if (!name || name.trim() === '') {
      return next(new ApiError('name is a required field', 400));
    }

    const crop = await Crop.create({
      name: name.trim(),
      season: season || '',
      region: region || '',
      imageUrl: imageUrl || null,
    });

    res.status(201).json({
      success: true,
      data: crop,
    });
  } catch (error) {
    // Handle duplicate key error (unique crop name)
    if (error.code === 11000) {
      return next(new ApiError(`Crop '${req.body.name}' already exists`, 409));
    }
    next(error);
  }
};

/**
 * @desc    Update a crop
 * @route   PUT /api/crops/:id
 */
const updateCrop = async (req, res, next) => {
  try {
    const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!crop) {
      return next(new ApiError(`Crop with ID '${req.params.id}' not found`, 404));
    }

    res.status(200).json({
      success: true,
      data: crop,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return next(new ApiError(`Invalid crop ID format: '${req.params.id}'`, 400));
    }
    if (error.code === 11000) {
      return next(new ApiError(`Crop '${req.body.name}' already exists`, 409));
    }
    next(error);
  }
};

/**
 * @desc    Delete a crop
 * @route   DELETE /api/crops/:id
 */
const deleteCrop = async (req, res, next) => {
  try {
    const crop = await Crop.findByIdAndDelete(req.params.id);

    if (!crop) {
      return next(new ApiError(`Crop with ID '${req.params.id}' not found`, 404));
    }

    res.status(204).send();
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return next(new ApiError(`Invalid crop ID format: '${req.params.id}'`, 400));
    }
    next(error);
  }
};

module.exports = {
  getAllCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop,
};
