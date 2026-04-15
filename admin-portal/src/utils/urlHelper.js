import { API_BASE_URL } from '../lib/api';

/**
 * Ensures a URL is absolute by prepending the API_BASE_URL if it's a relative path.
 * @param {string} path - The path to format.
 * @returns {string|null} - The full URL or null if path is empty.
 */
export const getFullUrl = (path) => {
  if (!path) return null;
  
  // If it's already an absolute URL, return it
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  
  // Clean up base URL and path to ensure exactly one slash between them
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseUrl}${cleanPath}`;
};
