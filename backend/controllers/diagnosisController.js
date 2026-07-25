const Diagnosis = require('../models/Diagnosis');
const Crop = require('../models/Crop');
const { ApiError } = require('../middleware/errorHandler');

/**
 * @desc    Get all diagnosis records
 * @route   GET /api/diagnoses
 */
const getAllDiagnoses = async (req, res, next) => {
  try {
    const diagnoses = await Diagnosis.find({ user: req.user.id })
      .populate('crop', 'name season region')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: diagnoses.length,
      data: diagnoses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search diagnoses by crop name or disease name
 * @route   GET /api/diagnoses/search?q=...
 */
const searchDiagnoses = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      const diagnoses = await Diagnosis.find({ user: req.user.id })
        .populate('crop', 'name season region')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: diagnoses.length,
        data: diagnoses,
      });
    }

    const regex = new RegExp(q.trim(), 'i');

    const diagnoses = await Diagnosis.find({
      user: req.user.id,
      $or: [
        { cropName: regex },
        { diseaseName: regex },
        { status: regex },
      ],
    })
      .populate('crop', 'name season region')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: diagnoses.length,
      data: diagnoses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single diagnosis by ID
 * @route   GET /api/diagnoses/:id
 */
const getDiagnosisById = async (req, res, next) => {
  try {
    const diagnosis = await Diagnosis.findOne({ _id: req.params.id, user: req.user.id })
      .populate('crop', 'name season region');

    if (!diagnosis) {
      return next(new ApiError(`Diagnosis with ID '${req.params.id}' not found`, 404));
    }

    res.status(200).json({
      success: true,
      data: diagnosis,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return next(new ApiError(`Invalid diagnosis ID format: '${req.params.id}'`, 400));
    }
    next(error);
  }
};

/**
 * @desc    Create a new diagnosis record
 * @route   POST /api/diagnoses
 */
const createDiagnosis = async (req, res, next) => {
  try {
    const { cropName, diseaseName, confidence, status, treatment, preventiveMeasures } = req.body;

    // Validation
    if (!cropName || !diseaseName) {
      return next(new ApiError('cropName and diseaseName are required fields', 400));
    }

    if (confidence !== undefined && (typeof confidence !== 'number' || confidence < 0 || confidence > 100)) {
      return next(new ApiError('confidence must be a number between 0 and 100', 400));
    }

    // Try to find matching crop document for the reference
    const crop = await Crop.findOne({ name: new RegExp(`^${cropName.trim()}$`, 'i') });

    const diagnosis = await Diagnosis.create({
      user: req.user.id,
      crop: crop ? crop._id : null,
      cropName: cropName.trim(),
      diseaseName: diseaseName.trim(),
      confidence: confidence || 0,
      status: status || 'Detected',
      treatment: treatment || '',
      preventiveMeasures: preventiveMeasures || '',
      diagnosisDate: new Date(),
    });

    // Populate the crop reference before returning
    await diagnosis.populate('crop', 'name season region');

    res.status(201).json({
      success: true,
      data: diagnosis,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing diagnosis
 * @route   PUT /api/diagnoses/:id
 */
const updateDiagnosis = async (req, res, next) => {
  try {
    const { confidence } = req.body;

    // Validation
    if (confidence !== undefined && (typeof confidence !== 'number' || confidence < 0 || confidence > 100)) {
      return next(new ApiError('confidence must be a number between 0 and 100', 400));
    }

    // If cropName is being updated, try to link to a Crop document
    if (req.body.cropName) {
      const crop = await Crop.findOne({ name: new RegExp(`^${req.body.cropName.trim()}$`, 'i') });
      if (crop) {
        req.body.crop = crop._id;
      }
    }

    const diagnosis = await Diagnosis.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate('crop', 'name season region');

    if (!diagnosis) {
      return next(new ApiError(`Diagnosis with ID '${req.params.id}' not found`, 404));
    }

    res.status(200).json({
      success: true,
      data: diagnosis,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return next(new ApiError(`Invalid diagnosis ID format: '${req.params.id}'`, 400));
    }
    next(error);
  }
};

/**
 * @desc    Delete a diagnosis record
 * @route   DELETE /api/diagnoses/:id
 */
const deleteDiagnosis = async (req, res, next) => {
  try {
    const diagnosis = await Diagnosis.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!diagnosis) {
      return next(new ApiError(`Diagnosis with ID '${req.params.id}' not found`, 404));
    }

    res.status(204).send();
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return next(new ApiError(`Invalid diagnosis ID format: '${req.params.id}'`, 400));
    }
    next(error);
  }
};

module.exports = {
  getAllDiagnoses,
  searchDiagnoses,
  getDiagnosisById,
  createDiagnosis,
  updateDiagnosis,
  deleteDiagnosis,
};
