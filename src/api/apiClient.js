/**
 * Centralized API client for CropCare AI frontend.
 * Uses fetch with consistent error handling and base URL configuration.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic fetch wrapper with error handling.
 * Automatically attaches JWT token from localStorage if present.
 * @param {string} endpoint - API endpoint (e.g., '/diagnoses')
 * @param {object} options - Fetch options (method, body, headers)
 * @returns {Promise<object>} Parsed JSON response
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  // Retrieve stored JWT token
  const token = localStorage.getItem('cropcare_token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  // Convert body to JSON string if it's an object
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  // Handle 204 No Content (DELETE responses)
  if (response.status === 204) {
    return { success: true, data: null };
  }

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data?.error?.message || `API Error: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return data;
}

// ──────────────────────────────────────────────
// Auth API
// ──────────────────────────────────────────────

export const authApi = {
  /** Register a new user */
  register: (name, email, password) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    }),

  /** Login with email and password */
  login: (email, password) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  /** Get current authenticated user */
  getMe: () => apiRequest('/auth/me'),
};

// ──────────────────────────────────────────────
// Diagnosis API
// ──────────────────────────────────────────────

export const diagnosisApi = {
  /** Get all diagnosis records */
  getAll: () => apiRequest('/diagnoses'),

  /** Get a single diagnosis by ID */
  getById: (id) => apiRequest(`/diagnoses/${id}`),

  /** Search diagnoses by query string */
  search: (query) => apiRequest(`/diagnoses/search?q=${encodeURIComponent(query)}`),

  /** Create a new diagnosis */
  create: (diagnosisData) =>
    apiRequest('/diagnoses', {
      method: 'POST',
      body: diagnosisData,
    }),

  /** Update an existing diagnosis */
  update: (id, diagnosisData) =>
    apiRequest(`/diagnoses/${id}`, {
      method: 'PUT',
      body: diagnosisData,
    }),

  /** Delete a diagnosis */
  delete: (id) =>
    apiRequest(`/diagnoses/${id}`, {
      method: 'DELETE',
    }),
};

// ──────────────────────────────────────────────
// Advisory API
// ──────────────────────────────────────────────

export const advisoryApi = {
  /** Get all advisory records */
  getAll: () => apiRequest('/advisories'),

  /** Submit a farming question */
  create: (question) =>
    apiRequest('/advisories', {
      method: 'POST',
      body: { question },
    }),
};

// ──────────────────────────────────────────────
// AI API (Gemini-powered)
// ──────────────────────────────────────────────

export const aiApi = {
  /** Get AI-powered farming advisory response */
  advisory: (question) =>
    apiRequest('/ai/advisory', {
      method: 'POST',
      body: { question },
    }),

  /** Get AI-powered crop disease analysis */
  diagnose: (cropName, diseaseName, symptoms = '') =>
    apiRequest('/ai/diagnose', {
      method: 'POST',
      body: { cropName, diseaseName, symptoms },
    }),
};
