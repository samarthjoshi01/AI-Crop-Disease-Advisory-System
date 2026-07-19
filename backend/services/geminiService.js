const { GoogleGenerativeAI } = require('@google/generative-ai');

// ──────────────────────────────────────────────
// Gemini Client Initialization
// ──────────────────────────────────────────────

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-flash-latest',
  generationConfig: {
    temperature: 0.7,
    topP: 0.9,
    maxOutputTokens: 1024,
  },
});

// ──────────────────────────────────────────────
// System Prompts
// ──────────────────────────────────────────────

const ADVISORY_SYSTEM_PROMPT = `You are CropCare AI, a friendly and knowledgeable agricultural advisor for Indian farmers. You specialize in:
- Crop disease identification and treatment
- Pest management (IPM strategies)
- Soil health and fertilizer recommendations
- Water and irrigation management
- Seasonal crop planning
- Post-harvest handling and storage

Guidelines:
1. Give practical, actionable advice that smallholder farmers can follow.
2. Mention specific products, dosages, or techniques when relevant.
3. Always suggest organic/natural alternatives alongside chemical options.
4. Keep answers concise but thorough (150-300 words).
5. Use numbered steps when explaining procedures.
6. If a question is outside agriculture, politely redirect to farming topics.
7. Consider Indian agricultural conditions (monsoon seasons, common regional crops).
8. End with a brief preventive tip when relevant.`;

const DIAGNOSIS_SYSTEM_PROMPT = `You are CropCare AI, an expert crop disease diagnostician. Given a crop name and disease name, provide a structured analysis.

Your response MUST follow this exact format:

**Severity:** [Low/Medium/High/Critical]

**Description:**
A brief 2-3 sentence description of the disease, how it affects the crop, and conditions that favor it.

**Treatment Plan:**
1. [First treatment step with specific product/dosage]
2. [Second treatment step]
3. [Third treatment step]

**Organic Alternatives:**
1. [Natural treatment option]
2. [Biological control method]

**Prevention Tips:**
1. [Prevention measure 1]
2. [Prevention measure 2]
3. [Prevention measure 3]

**When to Seek Expert Help:**
[Brief note on when the farmer should consult an agricultural extension officer]`;

// ──────────────────────────────────────────────
// Helper: Call Gemini with timeout
// ──────────────────────────────────────────────

async function callGeminiWithTimeout(prompt, systemPrompt, timeoutMs = 30000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: `System instruction: ${systemPrompt}` }],
        },
        {
          role: 'model',
          parts: [{ text: 'Understood. I will follow these instructions for all my responses.' }],
        },
      ],
    });

    const result = await chat.sendMessage(prompt, {
      signal: controller.signal,
    });

    const response = result.response;
    return response.text();
  } finally {
    clearTimeout(timeoutId);
  }
}

// ──────────────────────────────────────────────
// Classify category from question content
// ──────────────────────────────────────────────

function classifyCategory(text) {
  const lower = text.toLowerCase();

  if (/disease|blight|rust|wilt|rot|fungus|fungi|mildew|spot/.test(lower)) {
    return 'Disease Prevention';
  }
  if (/pest|insect|bug|caterpillar|aphid|mite|weevil|borer/.test(lower)) {
    return 'Pest Management';
  }
  if (/water|irrigat|rain|drought|moisture|drip/.test(lower)) {
    return 'Water Management';
  }
  if (/fertiliz|nutrient|soil|compost|npk|nitrogen|phosphorus|potassium|organic matter/.test(lower)) {
    return 'Soil & Fertilizers';
  }
  if (/harvest|yield|production|storage|post.?harvest/.test(lower)) {
    return 'Harvest & Yield';
  }
  if (/seed|plant|sow|season|crop rotation|transplant/.test(lower)) {
    return 'Seasonal Planning';
  }

  return 'General';
}

// ──────────────────────────────────────────────
// Public API: Advisory Response
// ──────────────────────────────────────────────

/**
 * Get an AI-powered advisory response for a farming question.
 * @param {string} question - The farmer's question
 * @returns {Promise<{answer: string, category: string}>}
 */
async function getAdvisoryResponse(question) {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new GeminiServiceError(
      'Gemini API key is not configured. Please add your API key to the .env file.',
      'CONFIG_ERROR'
    );
  }

  try {
    const answer = await callGeminiWithTimeout(question, ADVISORY_SYSTEM_PROMPT);
    const category = classifyCategory(question);

    return { answer, category };
  } catch (error) {
    throw classifyError(error);
  }
}

// ──────────────────────────────────────────────
// Public API: Diagnosis Analysis
// ──────────────────────────────────────────────

/**
 * Get AI-powered disease diagnosis analysis.
 * @param {string} cropName - Name of the crop
 * @param {string} diseaseName - Name of the disease
 * @param {string} [symptoms] - Optional additional symptoms description
 * @returns {Promise<{analysis: string, severity: string}>}
 */
async function getDiagnosisAnalysis(cropName, diseaseName, symptoms = '') {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new GeminiServiceError(
      'Gemini API key is not configured. Please add your API key to the .env file.',
      'CONFIG_ERROR'
    );
  }

  try {
    let prompt = `Analyze the following crop disease:\n\nCrop: ${cropName}\nDisease: ${diseaseName}`;
    if (symptoms) {
      prompt += `\nAdditional symptoms/notes: ${symptoms}`;
    }

    const analysis = await callGeminiWithTimeout(prompt, DIAGNOSIS_SYSTEM_PROMPT);

    // Extract severity from the response
    const severityMatch = analysis.match(/\*\*Severity:\*\*\s*(Low|Medium|High|Critical)/i);
    const severity = severityMatch ? severityMatch[1] : 'Unknown';

    return { analysis, severity };
  } catch (error) {
    throw classifyError(error);
  }
}

// ──────────────────────────────────────────────
// Error Classification
// ──────────────────────────────────────────────

class GeminiServiceError extends Error {
  constructor(message, code, statusCode = 500) {
    super(message);
    this.name = 'GeminiServiceError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

function classifyError(error) {
  // Already classified
  if (error instanceof GeminiServiceError) {
    return error;
  }

  // Timeout / Abort
  if (error.name === 'AbortError' || error.message?.includes('aborted')) {
    return new GeminiServiceError(
      'AI request timed out. Please try again with a shorter question.',
      'TIMEOUT',
      504
    );
  }

  // Rate limiting
  if (error.status === 429 || error.message?.includes('429') || error.message?.includes('rate')) {
    return new GeminiServiceError(
      'AI service rate limit reached. Please wait a moment and try again.',
      'RATE_LIMIT',
      429
    );
  }

  // Authentication
  if (error.status === 401 || error.status === 403 || error.message?.includes('API key')) {
    return new GeminiServiceError(
      'AI service authentication failed. Please check the API key configuration.',
      'AUTH_ERROR',
      401
    );
  }

  // Safety filter
  if (error.message?.includes('SAFETY') || error.message?.includes('blocked')) {
    return new GeminiServiceError(
      'The AI could not process this request due to content safety filters. Please rephrase your question.',
      'SAFETY_BLOCK',
      400
    );
  }

  // Generic fallback
  return new GeminiServiceError(
    'AI service is temporarily unavailable. Please try again later.',
    'SERVICE_ERROR',
    503
  );
}

module.exports = {
  getAdvisoryResponse,
  getDiagnosisAnalysis,
  GeminiServiceError,
};
