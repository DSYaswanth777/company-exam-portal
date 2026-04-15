/**
 * UTC timezone utility functions
 * All times displayed in UTC throughout the application
 * IMPORTANT: Backend stores in UTC, Frontend displays in UTC
 */

/**
 * Ensures a date string is treated as UTC by adding 'Z' if missing
 * @param {string} dateString
 * @returns {string}
 */
const ensureUTC = (dateString) => {
  if (!dateString) return dateString;
  if (typeof dateString !== "string") return dateString;
  // If it doesn't have 'Z' or a timezone offset (+/-), assume it's UTC from backend
  if (
    !dateString.includes("Z") &&
    !dateString.includes("+") &&
    !dateString.match(/-\d{2}:?\d{2}$/)
  ) {
    return dateString + "Z";
  }
  return dateString;
};

/**
 * Format date in UTC with readable format
 * @param {string|Date} date - Date to format (UTC string from backend)
 * @returns {string} Formatted date string in UTC (e.g., "07 Jan 2026, 14:30 UTC")
 */
export const formatDateUTCStr = (date) => {
  if (!date) return "Not set";

  // Force UTC interpretation for strings from backend
  const d = new Date(typeof date === "string" ? ensureUTC(date) : date);

  if (isNaN(d.getTime())) return "Invalid Date";

  const options = {
    timeZone: "UTC",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return d.toLocaleString("en-IN", options).replace(/, /g, " ") + " UTC";
};

// Kept for backward compatibility during transition if needed
export const formatDateIST = formatDateUTCStr;

/**
 * Format date in UTC - short format without time
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date (e.g., "07 Jan 2026")
 */
export const formatDateOnlyUTC = (date) => {
  if (!date) return "Not set";

  const d = new Date(typeof date === "string" ? ensureUTC(date) : date);
  if (isNaN(d.getTime())) return "Invalid Date";

  const options = {
    timeZone: "UTC",
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  return d.toLocaleString("en-IN", options);
};

export const formatDateOnlyIST = formatDateOnlyUTC;

/**
 * Convert UTC string to UTC datetime-local input format
 * @param {string} utcDateString - UTC ISO string from backend
 * @returns {string} UTC datetime string for input (YYYY-MM-DDTHH:MM)
 */
export const convertUTCToInputUTC = (utcDateString) => {
  if (!utcDateString) return "";

  const d = new Date(ensureUTC(utcDateString));
  if (isNaN(d.getTime())) return "";

  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(d);
  const p = parts.reduce(
    (acc, part) => ({ ...acc, [part.type]: part.value }),
    {}
  );

  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
};

export const convertUTCToInputIST = convertUTCToInputUTC;

/**
 * Convert UTC datetime-local input to UTC ISO string
 * @param {string} inputDateTimeString - Datetime string from input (YYYY-MM-DDTHH:MM)
 * @returns {string|null} UTC ISO string
 */
export const convertInputUTCToUTC = (inputDateTimeString) => {
  if (!inputDateTimeString) return null;

  try {
    const [datePart, timePart] = inputDateTimeString.split("T");
    const isoWithOffset = `${datePart}T${timePart}:00Z`;
    const date = new Date(isoWithOffset);

    if (isNaN(date.getTime())) return null;
    return date.toISOString();
  } catch (err) {
    console.error("UTC conversion error:", err);
    return null;
  }
};

export const convertInputISTToUTC = convertInputUTCToUTC;

/**
 * Common formatting for list views/tables
 */
export const formatDateLocal = (date) => {
  return formatDateUTCStr(date);
};

export const formatDateUTC = (date) => {
  return formatDateUTCStr(date);
};

/**
 * Standard date formatter for components
 * @param {string|Date} dateString
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return formatDateLocal(dateString);
};
