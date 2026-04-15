/**
 * Extracts a user-friendly error message from a backend error response.
 * Handles strings, Pydantic validation error arrays, and nested detail objects.
 *
 * @param {any} err - The error object from axios/api call
 * @returns {string} - The formatted error message
 */
export const getErrorMessage = (err) => {
  const detail = err?.response?.data?.detail;

  if (!detail) {
    return err?.message || "An unexpected error occurred";
  }

  // Handle Pydantic validation errors (array of objects)
  if (Array.isArray(detail)) {
    return detail
      .map((e) => {
        // e.loc is something like ["body", "window_end"]
        const field = e.loc[e.loc.length - 1];
        return `${field}: ${e.msg}`;
      })
      .join(", ");
  }

  // Handle case where detail is a simple string
  if (typeof detail === "string") {
    return detail;
  }

  // Handle case where detail is an object with its own detail/message
  if (typeof detail === "object") {
    return detail.message || detail.detail || JSON.stringify(detail);
  }

  return "Action failed";
};
