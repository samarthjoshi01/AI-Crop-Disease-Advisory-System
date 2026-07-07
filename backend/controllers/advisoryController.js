const Advisory = require('../models/Advisory');
const { ApiError } = require('../middleware/errorHandler');

/**
 * @desc    Get all advisory records
 * @route   GET /api/advisories
 */
const getAllAdvisories = async (req, res, next) => {
  try {
    const advisories = await Advisory.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: advisories.length,
      data: advisories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new advisory (submit a farming question)
 * @route   POST /api/advisories
 *
 * Simulates an AI response for now. Real Gemini API integration
 * will come in later weeks.
 */
const createAdvisory = async (req, res, next) => {
  try {
    const { question } = req.body;

    if (!question || question.trim() === '') {
      return next(new ApiError('question is a required field', 400));
    }

    // Simulated AI responses based on keywords
    const simulatedResponses = {
      blight:
        'Blight is a common fungal disease. Key prevention strategies include crop rotation, proper spacing for air circulation, avoiding overhead irrigation, and applying copper-based fungicides as a preventive measure during humid weather. Remove and destroy infected plant material promptly.',
      pest:
        'For pest management, consider an Integrated Pest Management (IPM) approach: 1) Monitor fields weekly with sticky traps, 2) Encourage natural predators like ladybugs and lacewings, 3) Use neem oil spray (5ml/L) as a first organic intervention, 4) Apply targeted chemical pesticides only when pest populations exceed economic threshold levels.',
      water:
        'Efficient water management is essential for crop health. Consider drip irrigation to save 40-60% water compared to flood irrigation. Water early morning to reduce evaporation. Monitor soil moisture at root zone depth. During critical growth stages (flowering, grain filling), ensure consistent moisture without waterlogging.',
      fertilizer:
        'For balanced nutrition, start with a soil test to determine exact nutrient requirements. Apply nitrogen in split doses (basal + top-dressing at critical stages). Use organic sources like vermicompost (2-3 tonnes/ha) alongside chemical fertilizers. Micronutrient deficiencies (zinc, boron) are common — address based on soil test results.',
      soil:
        'Maintaining soil health is fundamental. Practice crop rotation with legumes to fix nitrogen naturally. Add organic matter (FYM, compost) to improve soil structure and water retention. Maintain soil pH between 6.0-7.5 for most crops. Avoid excessive tillage to preserve soil microbiome and structure.',
      harvest:
        'Optimal harvest timing depends on the crop maturity indicators. For grains, check moisture content (wheat: 12-14%, rice: 20-22% at harvest). For vegetables, harvest during cool morning hours. Use clean, sharp tools. Sort and grade produce immediately. Store in well-ventilated areas to prevent post-harvest losses.',
      seed:
        'Always use certified seeds from reliable sources. Perform seed treatment with fungicide (thiram/captan) before sowing to prevent seed-borne diseases. Test seed germination rate — aim for 85%+ viability. Store seeds in cool, dry conditions with moisture content below 12%. Consider seed priming for better emergence.',
    };

    const questionLower = question.toLowerCase();
    let answer =
      'Thank you for your question! Based on general agricultural best practices, I recommend consulting with your local agricultural extension officer for region-specific guidance. Key principles include maintaining soil health through organic matter, practicing crop rotation, ensuring proper irrigation, and monitoring crops regularly for early disease detection.';

    // Match keywords to generate a relevant response
    for (const [keyword, response] of Object.entries(simulatedResponses)) {
      if (questionLower.includes(keyword)) {
        answer = response;
        break;
      }
    }

    // Determine category from question content
    let category = 'General';
    if (
      questionLower.includes('disease') ||
      questionLower.includes('blight') ||
      questionLower.includes('rust') ||
      questionLower.includes('wilt')
    ) {
      category = 'Disease Prevention';
    } else if (
      questionLower.includes('pest') ||
      questionLower.includes('insect') ||
      questionLower.includes('bug')
    ) {
      category = 'Pest Management';
    } else if (
      questionLower.includes('water') ||
      questionLower.includes('irrigation') ||
      questionLower.includes('rain')
    ) {
      category = 'Water Management';
    } else if (
      questionLower.includes('fertilizer') ||
      questionLower.includes('nutrient') ||
      questionLower.includes('soil')
    ) {
      category = 'Soil & Fertilizers';
    } else if (
      questionLower.includes('harvest') ||
      questionLower.includes('yield') ||
      questionLower.includes('production')
    ) {
      category = 'Harvest & Yield';
    } else if (
      questionLower.includes('seed') ||
      questionLower.includes('plant') ||
      questionLower.includes('sow')
    ) {
      category = 'Seasonal Planning';
    }

    const advisory = await Advisory.create({
      question: question.trim(),
      answer,
      category,
    });

    res.status(201).json({
      success: true,
      data: advisory,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an advisory record
 * @route   PUT /api/advisories/:id
 */
const updateAdvisory = async (req, res, next) => {
  try {
    const advisory = await Advisory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!advisory) {
      return next(new ApiError(`Advisory with ID '${req.params.id}' not found`, 404));
    }

    res.status(200).json({
      success: true,
      data: advisory,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return next(new ApiError(`Invalid advisory ID format: '${req.params.id}'`, 400));
    }
    next(error);
  }
};

/**
 * @desc    Delete an advisory record
 * @route   DELETE /api/advisories/:id
 */
const deleteAdvisory = async (req, res, next) => {
  try {
    const advisory = await Advisory.findByIdAndDelete(req.params.id);

    if (!advisory) {
      return next(new ApiError(`Advisory with ID '${req.params.id}' not found`, 404));
    }

    res.status(204).send();
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return next(new ApiError(`Invalid advisory ID format: '${req.params.id}'`, 400));
    }
    next(error);
  }
};

module.exports = {
  getAllAdvisories,
  createAdvisory,
  updateAdvisory,
  deleteAdvisory,
};
