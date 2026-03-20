/**
 * Validation Utilities
 *
 * Centralized validation functions and regex patterns for forms,
 * user input, and data validation throughout the application.
 *
 * @example
 * import { isValidEmail, EMAIL_REGEX } from '@/lib/validation';
 *
 * if (!isValidEmail(email)) {
 *   setError("Invalid email address");
 * }
 */

// ============================================
// Regular Expressions
// ============================================

/**
 * Email validation regex (RFC 5322 simplified)
 * Matches: user@example.com, user.name+tag@example.co.uk
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Phone number regex (flexible, allows various formats)
 * Matches: (123) 456-7890, 123-456-7890, 1234567890, +1 123 456 7890
 */
export const PHONE_REGEX = /^[\d\s\-\(\)\+]+$/;

/**
 * Name validation (letters, spaces, hyphens, apostrophes)
 * Matches: John, Mary-Jane, O'Brien, José García
 */
export const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s\-']+$/;

/**
 * Alphanumeric with spaces
 * Matches: Ring 123, Custom Design A1
 */
export const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9\s]+$/;

/**
 * URL validation (basic)
 * Matches: https://example.com, http://site.org/path
 */
export const URL_REGEX = /^https?:\/\/.+\..+/;

// ============================================
// Email Validation
// ============================================

/**
 * Validates email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  return EMAIL_REGEX.test(email.trim());
};

/**
 * Validates and normalizes email address
 * @param {string} email - Email address to normalize
 * @returns {{isValid: boolean, normalized: string}} Validation result and normalized email
 */
export const validateEmail = (email) => {
  const trimmed = email?.trim().toLowerCase() || "";
  return {
    isValid: EMAIL_REGEX.test(trimmed),
    normalized: trimmed,
  };
};

// ============================================
// Phone Validation
// ============================================

/**
 * Validates phone number format (flexible)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone format
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== "string") return false;
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");
  return cleaned.length >= 10 && PHONE_REGEX.test(phone);
};

/**
 * Formats phone number to consistent format
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone (XXX) XXX-XXXX
 */
export const formatPhone = (phone) => {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

// ============================================
// Name Validation
// ============================================

/**
 * Validates person's name
 * @param {string} name - Name to validate
 * @returns {boolean} True if valid name
 */
export const isValidName = (name) => {
  if (!name || typeof name !== "string") return false;
  const trimmed = name.trim();
  return trimmed.length >= 2 && NAME_REGEX.test(trimmed);
};

/**
 * Validates full name (first + last)
 * @param {string} fullName - Full name to validate
 * @returns {boolean} True if appears to be full name
 */
export const isValidFullName = (fullName) => {
  if (!fullName || typeof fullName !== "string") return false;
  const trimmed = fullName.trim();
  // Must have at least one space (first + last name)
  return trimmed.includes(" ") && isValidName(trimmed);
};

// ============================================
// File Validation
// ============================================

/**
 * Validates file type
 * @param {File} file - File object to validate
 * @param {string[]} acceptedTypes - Array of accepted MIME types
 * @returns {boolean} True if file type is accepted
 */
export const isValidFileType = (
  file,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
) => {
  if (!file || !file.type) return false;
  return acceptedTypes.includes(file.type);
};

/**
 * Validates file size
 * @param {File} file - File object to validate
 * @param {number} maxSizeBytes - Maximum file size in bytes
 * @returns {boolean} True if file size is within limit
 */
export const isValidFileSize = (file, maxSizeBytes = 5 * 1024 * 1024) => {
  if (!file || !file.size) return false;
  return file.size <= maxSizeBytes;
};

/**
 * Validates image file
 * @param {File} file - File object to validate
 * @param {number} maxSizeBytes - Maximum file size in bytes
 * @returns {{isValid: boolean, error: string|null}} Validation result
 */
export const validateImageFile = (file, maxSizeBytes = 5 * 1024 * 1024) => {
  if (!file) {
    return { isValid: false, error: "No file provided" };
  }

  if (!isValidFileType(file, ["image/jpeg", "image/png", "image/webp"])) {
    return { isValid: false, error: "File must be JPEG, PNG, or WebP" };
  }

  if (!isValidFileSize(file, maxSizeBytes)) {
    const maxMB = maxSizeBytes / (1024 * 1024);
    return { isValid: false, error: `File must be less than ${maxMB}MB` };
  }

  return { isValid: true, error: null };
};

// ============================================
// Text Validation
// ============================================

/**
 * Validates text length
 * @param {string} text - Text to validate
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @returns {boolean} True if within length constraints
 */
export const isValidTextLength = (
  text,
  minLength = 0,
  maxLength = Infinity,
) => {
  if (!text || typeof text !== "string") return minLength === 0;
  const trimmed = text.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength;
};

/**
 * Validates required field (not empty)
 * @param {any} value - Value to validate
 * @returns {boolean} True if value is not empty
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Validates URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
export const isValidURL = (url) => {
  if (!url || typeof url !== "string") return false;
  return URL_REGEX.test(url.trim());
};

// ============================================
// Number Validation
// ============================================

/**
 * Validates number is within range
 * @param {number} value - Number to validate
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {boolean} True if within range
 */
export const isInRange = (value, min, max) => {
  const num = Number(value);
  if (isNaN(num)) return false;
  return num >= min && num <= max;
};

/**
 * Validates positive number
 * @param {number} value - Number to validate
 * @returns {boolean} True if positive number
 */
export const isPositiveNumber = (value) => {
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

// ============================================
// Form-Specific Validation
// ============================================

/**
 * Validates budget range selection
 * @param {string} budgetRange - Selected budget range value
 * @returns {boolean} True if valid budget range
 */
export const isValidBudgetRange = (budgetRange) => {
  const validRanges = ["2k-4k", "4k-7k", "7k-10k", "10k+", "flexible"];
  return validRanges.includes(budgetRange);
};

/**
 * Validates consultation type selection
 * @param {string} consultationType - Selected consultation type
 * @returns {boolean} True if valid consultation type
 */
export const isValidConsultationType = (consultationType) => {
  return ["zoom", "in-person"].includes(consultationType);
};

/**
 * Validates ring size input
 * @param {string} size - Ring size value
 * @returns {boolean} True if valid ring size (3-15 or half sizes)
 */
export const isValidRingSize = (size) => {
  if (!size) return false;
  const num = parseFloat(size);
  return !isNaN(num) && num >= 3 && num <= 15;
};

// ============================================
// Sanitization
// ============================================

/**
 * Sanitizes text input (removes potentially harmful content)
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
export const sanitizeText = (text) => {
  if (!text || typeof text !== "string") return "";
  return text
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets (basic XSS prevention)
    .replace(/\s+/g, " "); // Normalize whitespace
};

/**
 * Sanitizes filename
 * @param {string} filename - Filename to sanitize
 * @returns {string} Sanitized filename
 */
export const sanitizeFilename = (filename) => {
  if (!filename || typeof filename !== "string") return "";
  return filename
    .trim()
    .replace(/[^a-zA-Z0-9_\-\.]/g, "_") // Replace special chars with underscore
    .replace(/_{2,}/g, "_") // Remove multiple underscores
    .toLowerCase();
};

// ============================================
// Error Messages
// ============================================

/**
 * Gets standard error message for validation type
 * @param {string} type - Validation type
 * @returns {string} Error message
 */
export const getErrorMessage = (type) => {
  const messages = {
    required: "This field is required",
    email: "Please enter a valid email address",
    phone: "Please enter a valid phone number",
    name: "Please enter a valid name",
    fullName: "Please enter your full name (first and last)",
    url: "Please enter a valid URL",
    fileType: "Please upload a valid image file (JPEG, PNG, or WebP)",
    fileSize: "File size must be less than 5MB",
    textLength: "Text must be within the allowed length",
    range: "Value must be within the valid range",
  };

  return messages[type] || "Invalid input";
};
