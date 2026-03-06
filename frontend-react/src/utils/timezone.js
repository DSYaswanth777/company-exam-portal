/**
 * IST (Asia/Kolkata) timezone utility functions
 * All times displayed in IST throughout the application
 * IMPORTANT: Backend stores in UTC, Frontend displays in IST
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
 * Format date in IST with readable format
 * @param {string|Date} date - Date to format (UTC string from backend)
 * @returns {string} Formatted date string in IST (e.g., "07 Jan 2026, 14:30 IST")
 */
export const formatDateIST = (date) => {
  if (!date) return "Not set";

  // Force UTC interpretation for strings from backend
  const d = new Date(typeof date === "string" ? ensureUTC(date) : date);

  if (isNaN(d.getTime())) return "Invalid Date";

  const options = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  // Indian English locale ensures 'am/pm' and DD MMM YYYY format
  return d.toLocaleString("en-IN", options).replace(/, /g, " ") + " IST";
};

/**
 * Format date in IST - short format without time
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date (e.g., "07 Jan 2026")
 */
export const formatDateOnlyIST = (date) => {
  if (!date) return "Not set";

  const d = new Date(typeof date === "string" ? ensureUTC(date) : date);
  if (isNaN(d.getTime())) return "Invalid Date";

  const options = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  return d.toLocaleString("en-IN", options);
};

/**
 * Convert UTC string to IST datetime-local input format
 * @param {string} utcDateString - UTC ISO string from backend
 * @returns {string} IST datetime string for input (YYYY-MM-DDTHH:MM)
 */
export const convertUTCToInputIST = (utcDateString) => {
  if (!utcDateString) return "";

  const d = new Date(ensureUTC(utcDateString));
  if (isNaN(d.getTime())) return "";

  // Use Intl.DateTimeFormat to get components in IST
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
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
    {},
  );

  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
};

/**
 * Convert IST datetime-local input to UTC ISO string
 * @param {string} inputDateTimeString - Datetime string from input (YYYY-MM-DDTHH:MM)
 * @returns {string|null} UTC ISO string
 */
export const convertInputISTToUTC = (inputDateTimeString) => {
  if (!inputDateTimeString) return null;

  try {
    // inputDateTimeString is "YYYY-MM-DDTHH:MM" in IST
    const [datePart, timePart] = inputDateTimeString.split("T");

    // Create a Date object by appending the IST offset (+05:30)
    const isoWithOffset = `${datePart}T${timePart}:00+05:30`;
    const date = new Date(isoWithOffset);

    if (isNaN(date.getTime())) return null;
    return date.toISOString();
  } catch (err) {
    console.error("IST to UTC conversion error:", err);
    return null;
  }
};

/**
 * Common formatting for list views/tables
 */
export const formatDateLocal = (date) => {
  return formatDateIST(date);
};

export const formatDateUTC = (date) => {
  return formatDateIST(date);
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
