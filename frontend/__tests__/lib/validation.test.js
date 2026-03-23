/**
 * Unit tests for frontend/lib/validation.js
 */

import {
  EMAIL_REGEX,
  PHONE_REGEX,
  NAME_REGEX,
  isValidEmail,
  validateEmail,
  isValidPhone,
  formatPhone,
  isValidName,
  isValidFullName,
  isValidFileType,
  isValidFileSize,
  validateImageFile,
  isValidTextLength,
  isRequired,
  isValidURL,
  isInRange,
  isPositiveNumber,
  isValidBudgetRange,
  isValidConsultationType,
  isValidRingSize,
  sanitizeText,
  sanitizeFilename,
  getErrorMessage,
} from "../../lib/validation.js";

// ─── isValidEmail ────────────────────────────────────────────────────────────

test("isValidEmail accepts standard email", () => {
  expect(isValidEmail("user@example.com")).toBe(true);
});

test("isValidEmail accepts email with subdomain", () => {
  expect(isValidEmail("user@mail.example.co.uk")).toBe(true);
});

test("isValidEmail accepts email with plus tag", () => {
  expect(isValidEmail("user.name+tag@example.com")).toBe(true);
});

test("isValidEmail rejects missing @", () => {
  expect(isValidEmail("userexample.com")).toBe(false);
});

test("isValidEmail rejects missing domain", () => {
  expect(isValidEmail("user@")).toBe(false);
});

test("isValidEmail rejects empty string", () => {
  expect(isValidEmail("")).toBe(false);
});

test("isValidEmail rejects null", () => {
  expect(isValidEmail(null)).toBe(false);
});

test("isValidEmail rejects undefined", () => {
  expect(isValidEmail(undefined)).toBe(false);
});

test("isValidEmail rejects whitespace-only", () => {
  expect(isValidEmail("   ")).toBe(false);
});

// ─── validateEmail ───────────────────────────────────────────────────────────

test("validateEmail normalizes email to lowercase", () => {
  const { isValid, normalized } = validateEmail("User@EXAMPLE.COM");
  expect(isValid).toBe(true);
  expect(normalized).toBe("user@example.com");
});

test("validateEmail trims whitespace", () => {
  const { normalized } = validateEmail("  user@example.com  ");
  expect(normalized).toBe("user@example.com");
});

test("validateEmail returns isValid false for bad email", () => {
  const { isValid } = validateEmail("notanemail");
  expect(isValid).toBe(false);
});

test("validateEmail handles null gracefully", () => {
  const { isValid, normalized } = validateEmail(null);
  expect(isValid).toBe(false);
  expect(normalized).toBe("");
});

// ─── isValidPhone ────────────────────────────────────────────────────────────

test("isValidPhone accepts standard US number", () => {
  expect(isValidPhone("(123) 456-7890")).toBe(true);
});

test("isValidPhone accepts dashed format", () => {
  expect(isValidPhone("123-456-7890")).toBe(true);
});

test("isValidPhone accepts digits only", () => {
  expect(isValidPhone("1234567890")).toBe(true);
});

test("isValidPhone accepts international format", () => {
  expect(isValidPhone("+1 123 456 7890")).toBe(true);
});

test("isValidPhone rejects too short", () => {
  expect(isValidPhone("12345")).toBe(false);
});

test("isValidPhone rejects null", () => {
  expect(isValidPhone(null)).toBe(false);
});

test("isValidPhone rejects letters", () => {
  expect(isValidPhone("abc-def-ghij")).toBe(false);
});

// ─── formatPhone ─────────────────────────────────────────────────────────────

test("formatPhone formats 10 digit number", () => {
  expect(formatPhone("1234567890")).toBe("(123) 456-7890");
});

test("formatPhone formats number with dashes", () => {
  expect(formatPhone("123-456-7890")).toBe("(123) 456-7890");
});

test("formatPhone returns original if not 10 digits after cleaning", () => {
  expect(formatPhone("12345")).toBe("12345");
});

test("formatPhone returns empty string for null", () => {
  expect(formatPhone(null)).toBe("");
});

test("formatPhone returns empty string for empty string", () => {
  expect(formatPhone("")).toBe("");
});

// ─── isValidName ─────────────────────────────────────────────────────────────

test("isValidName accepts simple name", () => {
  expect(isValidName("John")).toBe(true);
});

test("isValidName accepts hyphenated name", () => {
  expect(isValidName("Mary-Jane")).toBe(true);
});

test("isValidName accepts name with apostrophe", () => {
  expect(isValidName("O'Brien")).toBe(true);
});

test("isValidName accepts accented characters", () => {
  expect(isValidName("José García")).toBe(true);
});

test("isValidName rejects single character", () => {
  expect(isValidName("J")).toBe(false);
});

test("isValidName rejects null", () => {
  expect(isValidName(null)).toBe(false);
});

test("isValidName rejects digits", () => {
  expect(isValidName("John123")).toBe(false);
});

// ─── isValidFullName ─────────────────────────────────────────────────────────

test("isValidFullName accepts first and last name", () => {
  expect(isValidFullName("John Smith")).toBe(true);
});

test("isValidFullName rejects single name", () => {
  expect(isValidFullName("John")).toBe(false);
});

test("isValidFullName rejects null", () => {
  expect(isValidFullName(null)).toBe(false);
});

// ─── isValidFileType ─────────────────────────────────────────────────────────

test("isValidFileType accepts image/jpeg", () => {
  expect(isValidFileType({ type: "image/jpeg" })).toBe(true);
});

test("isValidFileType accepts image/png", () => {
  expect(isValidFileType({ type: "image/png" })).toBe(true);
});

test("isValidFileType accepts image/webp", () => {
  expect(isValidFileType({ type: "image/webp" })).toBe(true);
});

test("isValidFileType rejects image/gif by default", () => {
  expect(isValidFileType({ type: "image/gif" })).toBe(false);
});

test("isValidFileType accepts image/gif when explicitly allowed", () => {
  expect(isValidFileType({ type: "image/gif" }, ["image/gif"])).toBe(true);
});

test("isValidFileType rejects null", () => {
  expect(isValidFileType(null)).toBe(false);
});

// ─── isValidFileSize ─────────────────────────────────────────────────────────

test("isValidFileSize accepts file under 5MB", () => {
  expect(isValidFileSize({ size: 1024 * 1024 })).toBe(true);
});

test("isValidFileSize accepts file exactly at 5MB limit", () => {
  expect(isValidFileSize({ size: 5 * 1024 * 1024 })).toBe(true);
});

test("isValidFileSize rejects file over 5MB", () => {
  expect(isValidFileSize({ size: 6 * 1024 * 1024 })).toBe(false);
});

test("isValidFileSize respects custom max size", () => {
  expect(isValidFileSize({ size: 2 * 1024 * 1024 }, 1 * 1024 * 1024)).toBe(false);
});

test("isValidFileSize rejects null", () => {
  expect(isValidFileSize(null)).toBe(false);
});

// ─── validateImageFile ───────────────────────────────────────────────────────

test("validateImageFile returns isValid true for valid JPEG", () => {
  const { isValid, error } = validateImageFile({ type: "image/jpeg", size: 1024 });
  expect(isValid).toBe(true);
  expect(error).toBeNull();
});

test("validateImageFile returns error for invalid type", () => {
  const { isValid, error } = validateImageFile({ type: "image/gif", size: 1024 });
  expect(isValid).toBe(false);
  expect(error).toBeTruthy();
});

test("validateImageFile returns error for oversized file", () => {
  const { isValid, error } = validateImageFile({ type: "image/jpeg", size: 6 * 1024 * 1024 });
  expect(isValid).toBe(false);
  expect(error).toBeTruthy();
});

test("validateImageFile returns error for null", () => {
  const { isValid } = validateImageFile(null);
  expect(isValid).toBe(false);
});

// ─── isValidTextLength ───────────────────────────────────────────────────────

test("isValidTextLength accepts text within range", () => {
  expect(isValidTextLength("hello", 1, 10)).toBe(true);
});

test("isValidTextLength rejects too short", () => {
  expect(isValidTextLength("hi", 5, 10)).toBe(false);
});

test("isValidTextLength rejects too long", () => {
  expect(isValidTextLength("hello world", 1, 5)).toBe(false);
});

test("isValidTextLength accepts at boundary", () => {
  expect(isValidTextLength("hello", 5, 10)).toBe(true);
});

test("isValidTextLength with no min/max accepts any text", () => {
  expect(isValidTextLength("anything")).toBe(true);
});

// ─── isRequired ──────────────────────────────────────────────────────────────

test("isRequired returns true for non-empty string", () => {
  expect(isRequired("hello")).toBe(true);
});

test("isRequired returns false for empty string", () => {
  expect(isRequired("")).toBe(false);
});

test("isRequired returns false for whitespace string", () => {
  expect(isRequired("   ")).toBe(false);
});

test("isRequired returns false for null", () => {
  expect(isRequired(null)).toBe(false);
});

test("isRequired returns false for undefined", () => {
  expect(isRequired(undefined)).toBe(false);
});

test("isRequired returns true for non-empty array", () => {
  expect(isRequired([1, 2])).toBe(true);
});

test("isRequired returns false for empty array", () => {
  expect(isRequired([])).toBe(false);
});

test("isRequired returns true for truthy non-string/array value", () => {
  expect(isRequired(0)).toBe(true);
  expect(isRequired(42)).toBe(true);
});

// ─── isValidURL ──────────────────────────────────────────────────────────────

test("isValidURL accepts https URL", () => {
  expect(isValidURL("https://example.com")).toBe(true);
});

test("isValidURL accepts http URL with path", () => {
  expect(isValidURL("http://site.org/path")).toBe(true);
});

test("isValidURL rejects URL without protocol", () => {
  expect(isValidURL("example.com")).toBe(false);
});

test("isValidURL rejects null", () => {
  expect(isValidURL(null)).toBe(false);
});

// ─── isInRange ───────────────────────────────────────────────────────────────

test("isInRange returns true for value within range", () => {
  expect(isInRange(5, 1, 10)).toBe(true);
});

test("isInRange returns true at boundaries", () => {
  expect(isInRange(1, 1, 10)).toBe(true);
  expect(isInRange(10, 1, 10)).toBe(true);
});

test("isInRange returns false outside range", () => {
  expect(isInRange(0, 1, 10)).toBe(false);
  expect(isInRange(11, 1, 10)).toBe(false);
});

test("isInRange returns false for NaN", () => {
  expect(isInRange("abc", 1, 10)).toBe(false);
});

// ─── isPositiveNumber ────────────────────────────────────────────────────────

test("isPositiveNumber returns true for positive number", () => {
  expect(isPositiveNumber(5)).toBe(true);
  expect(isPositiveNumber(0.1)).toBe(true);
});

test("isPositiveNumber returns false for zero", () => {
  expect(isPositiveNumber(0)).toBe(false);
});

test("isPositiveNumber returns false for negative", () => {
  expect(isPositiveNumber(-1)).toBe(false);
});

test("isPositiveNumber parses numeric strings", () => {
  expect(isPositiveNumber("5")).toBe(true);
});

test("isPositiveNumber returns false for non-numeric string", () => {
  expect(isPositiveNumber("abc")).toBe(false);
});

// ─── isValidBudgetRange ──────────────────────────────────────────────────────

test("isValidBudgetRange accepts all valid ranges", () => {
  for (const range of ["2k-4k", "4k-7k", "7k-10k", "10k+", "flexible"]) {
    expect(isValidBudgetRange(range)).toBe(true);
  }
});

test("isValidBudgetRange rejects unknown range", () => {
  expect(isValidBudgetRange("1k-2k")).toBe(false);
});

// ─── isValidConsultationType ─────────────────────────────────────────────────

test("isValidConsultationType accepts zoom and in-person", () => {
  expect(isValidConsultationType("zoom")).toBe(true);
  expect(isValidConsultationType("in-person")).toBe(true);
});

test("isValidConsultationType rejects unknown type", () => {
  expect(isValidConsultationType("phone")).toBe(false);
});

// ─── isValidRingSize ─────────────────────────────────────────────────────────

test("isValidRingSize accepts valid sizes", () => {
  expect(isValidRingSize("7")).toBe(true);
  expect(isValidRingSize("3")).toBe(true);
  expect(isValidRingSize("15")).toBe(true);
});

test("isValidRingSize accepts half sizes", () => {
  expect(isValidRingSize("7.5")).toBe(true);
});

test("isValidRingSize rejects out of range", () => {
  expect(isValidRingSize("2")).toBe(false);
  expect(isValidRingSize("16")).toBe(false);
});

test("isValidRingSize rejects null/empty", () => {
  expect(isValidRingSize(null)).toBe(false);
  expect(isValidRingSize("")).toBe(false);
});

// ─── sanitizeText ────────────────────────────────────────────────────────────

test("sanitizeText removes angle brackets", () => {
  expect(sanitizeText("<script>alert('xss')</script>")).not.toContain("<");
  expect(sanitizeText("<script>alert('xss')</script>")).not.toContain(">");
});

test("sanitizeText trims whitespace", () => {
  expect(sanitizeText("  hello  ")).toBe("hello");
});

test("sanitizeText normalizes multiple spaces", () => {
  expect(sanitizeText("hello   world")).toBe("hello world");
});

test("sanitizeText returns empty string for null", () => {
  expect(sanitizeText(null)).toBe("");
});

// ─── sanitizeFilename ────────────────────────────────────────────────────────

test("sanitizeFilename lowercases and replaces special chars", () => {
  // spaces and ! each become _, then consecutive underscores are collapsed to one
  expect(sanitizeFilename("My File! 123.jpg")).toBe("my_file_123.jpg");
});

test("sanitizeFilename collapses multiple underscores", () => {
  const result = sanitizeFilename("hello___world.png");
  expect(result).not.toContain("__");
});

test("sanitizeFilename returns empty string for null", () => {
  expect(sanitizeFilename(null)).toBe("");
});

// ─── getErrorMessage ─────────────────────────────────────────────────────────

test("getErrorMessage returns specific message for known type", () => {
  expect(getErrorMessage("email")).toBe("Please enter a valid email address");
  expect(getErrorMessage("required")).toBe("This field is required");
  expect(getErrorMessage("phone")).toBe("Please enter a valid phone number");
});

test("getErrorMessage returns fallback for unknown type", () => {
  expect(getErrorMessage("unknownType")).toBe("Invalid input");
});
