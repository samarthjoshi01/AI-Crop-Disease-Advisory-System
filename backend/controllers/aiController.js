const { getAdvisoryResponse, getDiagnosisAnalysis, detectDiseaseFromImage, GeminiServiceError } = require('../services/geminiService');
const Advisory = require('../models/Advisory');
const Diagnosis = require('../models/Diagnosis');
const Crop = require('../models/Crop');
const { ApiError } = require('../middleware/errorHandler');

/**
 * @desc    AI-powered farming advisory (replaces simulated responses)
 * @route   POST /api/ai/advisory
 * @access  Protected (JWT)
 */
const aiAdvisory = async (req, res, next) => {
  try {
    const { question } = req.body;

    if (!question || question.trim() === '') {
      return next(new ApiError('question is a required field', 400));
    }

    const trimmedQuestion = question.trim();

    // Validate question length
    if (trimmedQuestion.length > 1000) {
      return next(new ApiError('Question must be under 1000 characters', 400));
    }

    // Call Gemini AI
    const { answer, category } = await getAdvisoryResponse(trimmedQuestion);

    // Save to database (preserves chat history)
    const advisory = await Advisory.create({
      user: req.user.id,
      question: trimmedQuestion,
      answer,
      category,
    });

    res.status(201).json({
      success: true,
      data: advisory,
      meta: {
        aiPowered: true,
        model: 'gemini-1.5-flash',
      },
    });
  } catch (error) {
    if (error instanceof GeminiServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
        meta: { aiPowered: true },
      });
    }
    next(error);
  }
};

/**
 * @desc    AI-powered crop disease analysis
 * @route   POST /api/ai/diagnose
 * @access  Protected (JWT)
 */
const aiDiagnose = async (req, res, next) => {
  try {
    const { cropName, diseaseName, symptoms } = req.body;

    if (!cropName || !cropName.trim()) {
      return next(new ApiError('cropName is a required field', 400));
    }

    if (!diseaseName || !diseaseName.trim()) {
      return next(new ApiError('diseaseName is a required field', 400));
    }

    // Call Gemini AI for diagnosis analysis
    const { analysis, severity } = await getDiagnosisAnalysis(
      cropName.trim(),
      diseaseName.trim(),
      symptoms?.trim() || ''
    );

    res.status(200).json({
      success: true,
      data: {
        cropName: cropName.trim(),
        diseaseName: diseaseName.trim(),
        analysis,
        severity,
        analyzedAt: new Date().toISOString(),
      },
      meta: {
        aiPowered: true,
        model: 'gemini-1.5-flash',
      },
    });
  } catch (error) {
    if (error instanceof GeminiServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
        meta: { aiPowered: true },
      });
    }
    next(error);
  }
};

/**
 * @desc    AI-powered disease detection from crop image
 * @route   POST /api/ai/detect-image
 * @access  Protected (JWT)
 */
const aiDetectFromImage = async (req, res, next) => {
  try {
    const { image, mimeType, cropName } = req.body;

    if (!image) {
      return next(new ApiError('image (base64) is required', 400));
    }

    if (!mimeType) {
      return next(new ApiError('mimeType is required (e.g., image/jpeg)', 400));
    }

    // Validate mime type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(mimeType)) {
      return next(new ApiError(`Unsupported image type: ${mimeType}. Use JPEG, PNG, WebP, or GIF.`, 400));
    }

    // Call Gemini Vision AI
    const detection = await detectDiseaseFromImage(
      image,
      mimeType,
      cropName?.trim() || ''
    );

    // Auto-save diagnosis to database
    const crop = await Crop.findOne({
      name: new RegExp(`^${detection.cropName}$`, 'i'),
    });

    const diagnosis = await Diagnosis.create({
      user: req.user.id,
      crop: crop ? crop._id : null,
      cropName: detection.cropName,
      diseaseName: detection.diseaseName,
      confidence: detection.confidence,
      status: detection.isHealthy ? 'Treated' : 'Detected',
      treatment: detection.treatment,
      preventiveMeasures: detection.preventiveMeasures,
      diagnosisDate: new Date(),
    });

    await diagnosis.populate('crop', 'name season region');

    res.status(201).json({
      success: true,
      data: {
        detection,
        diagnosis,
      },
      meta: {
        aiPowered: true,
        model: 'gemini-1.5-flash',
        visionAnalysis: true,
      },
    });
  } catch (error) {
    console.error('[AI DETECT-IMAGE ERROR]', error.message || error);
    if (error instanceof GeminiServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
        meta: { aiPowered: true },
      });
    }
    next(error);
  }
};

module.exports = {
  aiAdvisory,
  aiDiagnose,
  aiDetectFromImage,
};

