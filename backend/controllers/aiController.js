const { getAdvisoryResponse, getDiagnosisAnalysis, GeminiServiceError } = require('../services/geminiService');
const Advisory = require('../models/Advisory');
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

module.exports = {
  aiAdvisory,
  aiDiagnose,
};
