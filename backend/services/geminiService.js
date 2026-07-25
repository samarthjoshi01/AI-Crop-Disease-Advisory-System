const { GoogleGenerativeAI } = require('@google/generative-ai');

// ──────────────────────────────────────────────
// Gemini Client Initialization
// ──────────────────────────────────────────────

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Text model for advisory and diagnosis
const model = genAI.getGenerativeModel({
  model: 'gemini-3.1-flash-lite',
  generationConfig: {
    temperature: 0.7,
    topP: 0.9,
    maxOutputTokens: 1024,
  },
});

// Vision model — dedicated for image analysis with structured JSON output
const visionModel = genAI.getGenerativeModel({
  model: 'gemini-3.1-flash-lite',
  systemInstruction: `You are CropCare AI, an expert crop disease identification system. When given a crop/plant image, identify diseases and return structured JSON.
Guidelines:
- If healthy, set diseaseName to "Healthy" and isHealthy to true.
- Confidence is a number 0-100.
- Provide practical treatment advice for Indian farmers.
- Include both chemical and organic alternatives.`,
  generationConfig: {
    temperature: 0.4,
    maxOutputTokens: 2048,
    responseMimeType: 'application/json',
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

const IMAGE_DETECTION_SYSTEM_PROMPT = `You are CropCare AI, an expert crop disease identification system. You will receive an image of a crop/plant and must identify any diseases present.

Your response MUST be valid JSON (no markdown code fences) with this exact structure:
{
  "cropName": "Name of the crop/plant identified",
  "diseaseName": "Name of the disease detected, or 'Healthy' if no disease found",
  "confidence": 85.0,
  "severity": "Low|Medium|High|Critical",
  "description": "2-3 sentence description of the disease and how it affects the crop",
  "treatment": "Specific treatment steps with product names and dosages",
  "preventiveMeasures": "Prevention tips for the future",
  "isHealthy": false
}

Guidelines:
1. If the plant appears healthy, set diseaseName to "Healthy", isHealthy to true, confidence to your certainty level, and provide general care tips in treatment.
2. If you cannot identify the plant or disease clearly, still provide your best assessment with a lower confidence score.
3. Confidence should be a number between 0 and 100.
4. Always provide practical, actionable treatment advice suitable for Indian farmers.
5. Mention both chemical and organic treatment alternatives.
6. If a crop name hint is provided by the user, use it to improve accuracy.
7. Return ONLY the JSON object, no other text.`;

// ──────────────────────────────────────────────
// Helper: Call Gemini with timeout
// ──────────────────────────────────────────────

async function callGeminiWithTimeout(prompt, systemPrompt, timeoutMs = 30000) {
  const maxRetries = 2;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      if (attempt > 1) {
        console.log(`[TEXT AI] Attempt ${attempt}/${maxRetries}...`);
      }

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

      clearTimeout(timeoutId);
      return result.response.text();
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;

      // Only retry on 503 (server overloaded)
      const is503 = error.message?.includes('503') ||
        error.message?.includes('high demand') ||
        error.message?.includes('overloaded') ||
        error.status === 503;

      if (is503 && attempt < maxRetries) {
        const delayMs = attempt * 5000; // 5s delay
        console.log(`[TEXT AI] Server busy, retrying in ${delayMs / 1000}s...`);
        await sleep(delayMs);
        continue;
      }

      throw error;
    }
  }

  throw lastError;
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
// Helper: Sleep for retry backoff
// ──────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ──────────────────────────────────────────────
// Public API: Detect Disease from Image
// ──────────────────────────────────────────────

/**
 * Detect crop disease from an uploaded image using Gemini vision.
 * Automatically retries on 503 (high demand) errors with exponential backoff.
 * @param {string} base64Image - Base64-encoded image data
 * @param {string} mimeType - Image MIME type (e.g., 'image/jpeg')
 * @param {string} [cropNameHint] - Optional crop name hint from user
 * @returns {Promise<object>} Detected disease info as JSON
 */
async function detectDiseaseFromImage(base64Image, mimeType, cropNameHint = '') {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new GeminiServiceError(
      'Gemini API key is not configured. Please add your API key to the .env file.',
      'CONFIG_ERROR'
    );
  }

  let userPrompt = 'Analyze this crop/plant image. Return JSON with: cropName, diseaseName, confidence (0-100), severity (Low/Medium/High/Critical), description, treatment, preventiveMeasures, isHealthy.';
  if (cropNameHint) {
    userPrompt += ` The user says this is a "${cropNameHint}" crop.`;
  }

  const maxRetries = 2;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[VISION] Attempt ${attempt}/${maxRetries}...`);

      // Use Promise.race for timeout protection (60s)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('TIMEOUT')), 60000);
      });

      const apiPromise = visionModel.generateContent({
        contents: [{
          role: 'user',
          parts: [
            { text: userPrompt },
            { inlineData: { mimeType, data: base64Image } },
          ],
        }],
      }).then(res => res.response.text());

      const responseText = await Promise.race([apiPromise, timeoutPromise]);

      // Parse JSON (responseMimeType guarantees clean JSON, but be safe)
      let jsonString = responseText;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonString = jsonMatch[0];
      }

      const result = JSON.parse(jsonString);

      console.log(`[VISION] Success on attempt ${attempt}`);

      // Validate and normalize
      return {
        cropName: result.cropName || cropNameHint || 'Unknown',
        diseaseName: result.diseaseName || 'Unknown',
        confidence: Math.min(100, Math.max(0, Number(result.confidence) || 0)),
        severity: ['Low', 'Medium', 'High', 'Critical'].includes(result.severity)
          ? result.severity
          : 'Unknown',
        description: typeof result.description === 'string' ? result.description : JSON.stringify(result.description || ''),
        treatment: typeof result.treatment === 'string' ? result.treatment : 
          (Array.isArray(result.treatment) ? result.treatment.join('\n') : 
           (typeof result.treatment === 'object' && result.treatment !== null ? 
            Object.entries(result.treatment).map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`).join('\n') : 
            String(result.treatment || ''))),
        preventiveMeasures: typeof result.preventiveMeasures === 'string' ? result.preventiveMeasures : 
          (Array.isArray(result.preventiveMeasures) ? result.preventiveMeasures.join('\n') : 
           String(result.preventiveMeasures || '')),
        isHealthy: Boolean(result.isHealthy),
      };
    } catch (error) {
      lastError = error;
      console.error(`[VISION] Attempt ${attempt} failed:`, error.message);

      // Only retry on 503 (server overloaded) — do NOT retry on 429 (rate limit)
      const is503 = error.message?.includes('503') ||
        error.message?.includes('high demand') ||
        error.message?.includes('overloaded') ||
        error.status === 503;

      if (is503 && attempt < maxRetries) {
        const delayMs = attempt * 5000; // 5s delay before retry
        console.log(`[VISION] Server busy, retrying in ${delayMs / 1000}s...`);
        await sleep(delayMs);
        continue;
      }

      // Non-retryable error or exhausted retries
      if (error instanceof SyntaxError) {
        throw new GeminiServiceError(
          'AI returned an invalid response format. Please try again.',
          'PARSE_ERROR',
          500
        );
      }
      throw classifyError(error);
    }
  }

  // Should not reach here, but just in case
  throw classifyError(lastError);
}



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
  if (error.name === 'AbortError' || error.message?.includes('aborted') || error.message === 'TIMEOUT') {
    return new GeminiServiceError(
      'AI request timed out. Please try again.',
      'TIMEOUT',
      504
    );
  }

  // Rate limiting & Quota
  if (error.status === 429 || error.message?.includes('429') || error.message?.toLowerCase().includes('rate limit') || error.message?.includes('RATE_LIMIT') || error.message?.includes('quota')) {
    return new GeminiServiceError(
      'Daily AI Quota Exceeded. You have used all free requests for this API key. Please generate a new free key at https://aistudio.google.com and update the .env file.',
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
  detectDiseaseFromImage,
  GeminiServiceError,
};
