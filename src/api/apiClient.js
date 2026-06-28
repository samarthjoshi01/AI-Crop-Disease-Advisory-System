/**
 * Centralized API client for CropCare AI frontend.
 * Uses fetch with consistent error handling and base URL configuration.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Generic fetch wrapper with error handling.
 * @param {string} endpoint - API endpoint (e.g., '/diagnoses')
 * @param {object} options - Fetch options (method, body, headers)
 * @returns {Promise<object>} Parsed JSON response
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
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
