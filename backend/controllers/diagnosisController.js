const { v4: uuidv4 } = require('uuid');
const { diagnoses } = require('../data/seedData');
const { ApiError } = require('../middleware/errorHandler');

/**
 * @desc    Get all diagnosis records
 * @route   GET /api/diagnoses
 */
const getAllDiagnoses = (req, res) => {
  res.status(200).json({
    success: true,
    count: diagnoses.length,
    data: diagnoses
  });
};

/**
 * @desc    Search diagnoses by crop name or disease name
 * @route   GET /api/diagnoses/search?q=...
 */
const searchDiagnoses = (req, res, next) => {
  const { q } = req.query;

  if (!q || q.trim() === '') {
    return res.status(200).json({
      success: true,
      count: diagnoses.length,
      data: diagnoses
    });
  }

  const query = q.toLowerCase().trim();
  const results = diagnoses.filter(
    (d) =>
      d.cropName.toLowerCase().includes(query) ||
      d.diseaseName.toLowerCase().includes(query) ||
      d.status.toLowerCase().includes(query)
  );

  res.status(200).json({
    success: true,
    count: results.length,
    data: results
  });
};

/**
 * @desc    Get a single diagnosis by ID
 * @route   GET /api/diagnoses/:id
 */
const getDiagnosisById = (req, res, next) => {
  const diagnosis = diagnoses.find((d) => d.id === req.params.id);

  if (!diagnosis) {
    return next(new ApiError(`Diagnosis with ID '${req.params.id}' not found`, 404));
  }

  res.status(200).json({
    success: true,
    data: diagnosis
  });
};

/**
 * @desc    Create a new diagnosis record
 * @route   POST /api/diagnoses
 */
const createDiagnosis = (req, res, next) => {
  const { cropName, diseaseName, confidence, status, treatment, preventiveMeasures } = req.body;

  // Validation
  if (!cropName || !diseaseName) {
    return next(new ApiError('cropName and diseaseName are required fields', 400));
  }

  if (confidence !== undefined && (typeof confidence !== 'number' || confidence < 0 || confidence > 100)) {
    return next(new ApiError('confidence must be a number between 0 and 100', 400));
  }

  const newDiagnosis = {
    id: uuidv4(),
    cropName: cropName.trim(),
    diseaseName: diseaseName.trim(),
    confidence: confidence || 0,
    status: status || 'Detected',
    treatment: treatment || '',
    preventiveMeasures: preventiveMeasures || '',
    imageUrl: null,
    diagnosisDate: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  diagnoses.push(newDiagnosis);

  res.status(201).json({
    success: true,
    data: newDiagnosis
  });
};

/**
 * @desc    Update an existing diagnosis
 * @route   PUT /api/diagnoses/:id
 */
const updateDiagnosis = (req, res, next) => {
  const index = diagnoses.findIndex((d) => d.id === req.params.id);

  if (index === -1) {
    return next(new ApiError(`Diagnosis with ID '${req.params.id}' not found`, 404));
  }

  const { cropName, diseaseName, confidence, status, treatment, preventiveMeasures } = req.body;

  // Validation
  if (confidence !== undefined && (typeof confidence !== 'number' || confidence < 0 || confidence > 100)) {
    return next(new ApiError('confidence must be a number between 0 and 100', 400));
  }

  // Update only provided fields
  if (cropName !== undefined) diagnoses[index].cropName = cropName.trim();
  if (diseaseName !== undefined) diagnoses[index].diseaseName = diseaseName.trim();
  if (confidence !== undefined) diagnoses[index].confidence = confidence;
  if (status !== undefined) diagnoses[index].status = status.trim();
  if (treatment !== undefined) diagnoses[index].treatment = treatment.trim();
  if (preventiveMeasures !== undefined) diagnoses[index].preventiveMeasures = preventiveMeasures.trim();

  res.status(200).json({
    success: true,
    data: diagnoses[index]
  });
};

/**
 * @desc    Delete a diagnosis record
 * @route   DELETE /api/diagnoses/:id
 */
const deleteDiagnosis = (req, res, next) => {
  const index = diagnoses.findIndex((d) => d.id === req.params.id);

  if (index === -1) {
    return next(new ApiError(`Diagnosis with ID '${req.params.id}' not found`, 404));
  }

  diagnoses.splice(index, 1);

  res.status(204).send();
};

module.exports = {
  getAllDiagnoses,
  searchDiagnoses,
  getDiagnosisById,
  createDiagnosis,
  updateDiagnosis,
  deleteDiagnosis
};
