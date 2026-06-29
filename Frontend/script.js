/**
 * script.js
 * California House Price Predictor
 * Handles: validation, API call, result display, error handling
 */

'use strict';

/* ─────────────────────────────────────────────
   Configuration
───────────────────────────────────────────── */
const API_URL = 'http://127.0.0.1:8000/predict';
const REQUEST_TIMEOUT_MS = 15000; // 15 s before we abort

/* ─────────────────────────────────────────────
   DOM References
───────────────────────────────────────────── */
const form        = document.getElementById('predictForm');
const predictBtn  = document.getElementById('predictBtn');
const resultCard  = document.getElementById('resultCard');
const resultPrice = document.getElementById('resultPrice');
const errorBanner = document.getElementById('errorBanner');
const errorMsg    = document.getElementById('errorMessage');

/**
 * Field descriptors.
 * Each entry maps the HTML input id → payload key + validation rules.
 */
const FIELDS = [
  {
    id:      'longitude',
    key:     'longitude',
    label:   'Longitude',
    min:     -180,
    max:     180,
    isFloat: true,
  },
  {
    id:      'latitude',
    key:     'latitude',
    label:   'Latitude',
    min:     -90,
    max:     90,
    isFloat: true,
  },
  {
    id:      'housing_median_age',
    key:     'housing_median_age',
    label:   'Housing Median Age',
    min:     1,
    max:     200,
    isFloat: true,
  },
  {
    id:      'total_rooms',
    key:     'total_rooms',
    label:   'Total Rooms',
    min:     1,
    max:     null,
    isFloat: false,
  },
  {
    id:      'total_bedrooms',
    key:     'total_bedrooms',
    label:   'Total Bedrooms',
    min:     1,
    max:     null,
    isFloat: false,
  },
  {
    id:      'population',
    key:     'population',
    label:   'Population',
    min:     1,
    max:     null,
    isFloat: false,
  },
  {
    id:      'households',
    key:     'households',
    label:   'Households',
    min:     1,
    max:     null,
    isFloat: false,
  },
  {
    id:      'median_income',
    key:     'median_income',
    label:   'Median Income',
    min:     0,
    max:     null,
    isFloat: true,
  },
];

/* ─────────────────────────────────────────────
   Validation Helpers
───────────────────────────────────────────── */

/**
 * Validate a single field.
 * @param {object} fieldDef - entry from FIELDS array
 * @returns {{ valid: boolean, value: number|null, message: string }}
 */
function validateField(fieldDef) {
  const input = document.getElementById(fieldDef.id);
  const raw   = input.value.trim();

  // Required check
  if (raw === '') {
    return { valid: false, value: null, message: `${fieldDef.label} is required.` };
  }

  // Numeric check
  const num = Number(raw);
  if (isNaN(num)) {
    return { valid: false, value: null, message: `${fieldDef.label} must be a number.` };
  }

  // Integer check
  if (!fieldDef.isFloat && !Number.isInteger(num)) {
    return { valid: false, value: null, message: `${fieldDef.label} must be a whole number.` };
  }

  // Min check
  if (fieldDef.min !== null && num < fieldDef.min) {
    return { valid: false, value: null, message: `${fieldDef.label} must be ≥ ${fieldDef.min}.` };
  }

  // Max check
  if (fieldDef.max !== null && num > fieldDef.max) {
    return { valid: false, value: null, message: `${fieldDef.label} must be ≤ ${fieldDef.max}.` };
  }

  return { valid: true, value: num, message: '' };
}

/**
 * Show or clear a validation message for a field.
 * Also toggles .is-invalid / .is-valid CSS classes.
 */
function setFieldState(fieldId, isValid, message) {
  const input = document.getElementById(fieldId);
  const error = document.getElementById(`${fieldId}-error`);

  input.classList.toggle('is-invalid', !isValid);
  input.classList.toggle('is-valid',   isValid);

  if (error) {
    error.textContent = isValid ? '' : message;
  }
}

/**
 * Run validation on all fields.
 * @returns {{ allValid: boolean, payload: object }}
 */
function validateAll() {
  const payload = {};
  let allValid  = true;

  for (const field of FIELDS) {
    const result = validateField(field);
    setFieldState(field.id, result.valid, result.message);

    if (!result.valid) {
      allValid = false;
    } else {
      payload[field.key] = result.value;
    }
  }

  return { allValid, payload };
}

/* ─────────────────────────────────────────────
   Inline validation on blur (UX: show error
   only after a field has been touched)
───────────────────────────────────────────── */
FIELDS.forEach((field) => {
  const input = document.getElementById(field.id);
  if (!input) return;

  input.addEventListener('blur', () => {
    // Only validate if the user has typed something
    if (input.value.trim() !== '') {
      const result = validateField(field);
      setFieldState(field.id, result.valid, result.message);
    }
  });

  // Clear error while user is actively typing
  input.addEventListener('input', () => {
    if (input.classList.contains('is-invalid') && input.value.trim() !== '') {
      // Re-validate silently so the error clears once fixed
      const result = validateField(field);
      if (result.valid) {
        setFieldState(field.id, true, '');
      }
    }
  });
});

/* ─────────────────────────────────────────────
   UI State Helpers
───────────────────────────────────────────── */

/** Show the loading state on the button */
function setLoading(loading) {
  predictBtn.disabled = loading;
  predictBtn.classList.toggle('is-loading', loading);
}

/** Show the result card with a formatted price */
function showResult(price) {
  const formatted = new Intl.NumberFormat('en-US', {
    style:                 'currency',
    currency:              'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

  resultPrice.textContent = formatted;

  // Force re-trigger the price animation each time
  resultPrice.style.animation = 'none';
  // eslint-disable-next-line no-unused-expressions
  resultPrice.offsetHeight; // reflow trick
  resultPrice.style.animation = '';

  resultCard.hidden = false;

  // Smooth scroll to the result
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/** Show/hide the global error banner */
function showError(message) {
  errorMsg.textContent   = message;
  errorBanner.hidden     = false;
  resultCard.hidden      = true;

  // Auto-hide after 8 s
  clearTimeout(showError._timer);
  showError._timer = setTimeout(() => {
    errorBanner.hidden = true;
  }, 8000);
}

function hideError() {
  errorBanner.hidden = true;
}

/* ─────────────────────────────────────────────
   API Call
───────────────────────────────────────────── */

/**
 * Send a POST request to the FastAPI /predict endpoint.
 * Returns the predicted_house_value as a number.
 * Throws a descriptive Error on any failure.
 *
 * @param {object} payload - validated feature values
 * @returns {Promise<number>}
 */
async function fetchPrediction(payload) {
  const controller = new AbortController();
  const timerId    = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;

  try {
    response = await fetch(API_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
      signal:  controller.signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your backend is running.');
    }
    // Network-level failure (server unreachable, CORS, etc.)
    throw new Error(
      'Could not reach the prediction API. Make sure FastAPI is running at ' +
      API_URL
    );
  } finally {
    clearTimeout(timerId);
  }

  // HTTP error codes
  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const body = await response.json();
      if (body?.detail) detail = body.detail;
    } catch (_) { /* ignore parse failure */ }
    throw new Error(`API error: ${detail}`);
  }

  // Parse JSON body
  let data;
  try {
    data = await response.json();
  } catch (_) {
    throw new Error('Received an invalid response from the server (not JSON).');
  }

  // Validate the expected key
  if (typeof data?.predicted_house_value !== 'number') {
    throw new Error(
      'Unexpected response shape. Expected { predicted_house_value: number }.'
    );
  }

  return data.predicted_house_value;
}

/* ─────────────────────────────────────────────
   Form Submit Handler
───────────────────────────────────────────── */
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  hideError();

  // 1. Validate
  const { allValid, payload } = validateAll();
  if (!allValid) {
    // Focus the first invalid input for accessibility
    const firstInvalid = form.querySelector('.is-invalid');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  // 2. Show loading
  setLoading(true);

  try {
    // 3. Call API
    const price = await fetchPrediction(payload);

    // 4. Display result
    showResult(price);
  } catch (err) {
    // 5. Show error banner
    showError(err.message || 'An unexpected error occurred.');
  } finally {
    // 6. Always restore button
    setLoading(false);
  }
});
