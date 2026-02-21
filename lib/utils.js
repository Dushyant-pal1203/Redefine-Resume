// lib/utils.js

/**
 * Validates if a string is a valid URL
 * @param {string} url - The URL string to validate
 * @returns {boolean} - True if valid URL, false otherwise
 */
export function isValidUrl(url) {
  if (!url || typeof url !== "string") return false;

  const trimmedUrl = url.trim();
  if (!trimmedUrl) return false;

  try {
    // Check if it starts with http:// or https://
    if (!/^https?:\/\//i.test(trimmedUrl)) {
      return false;
    }

    const urlObj = new URL(trimmedUrl);

    // Check for valid hostname (must have at least one dot for domain)
    const hostname = urlObj.hostname;
    if (!hostname || hostname.length < 3 || !hostname.includes(".")) {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Cleans and formats a URL (adds https:// if missing)
 * @param {string} url - The URL string to clean
 * @returns {string} - Cleaned URL or empty string if invalid
 */
export function cleanUrl(url) {
  if (!url || typeof url !== "string") return "";

  let cleaned = url.trim();
  if (!cleaned) return "";

  // Add https:// if protocol is missing
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = "https://" + cleaned;
  }

  // Validate the cleaned URL
  if (isValidUrl(cleaned)) {
    return cleaned;
  }

  return "";
}

/**
 * Alternative validation that's more lenient
 * @param {string} url - The URL string to validate
 * @returns {boolean} - True if potentially valid URL
 */
export function isPotentiallyValidUrl(url) {
  if (!url || typeof url !== "string") return false;

  const trimmedUrl = url.trim();
  if (!trimmedUrl) return false;

  // Basic pattern check for URL-like strings
  const urlPattern =
    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
  return urlPattern.test(trimmedUrl);
}

// Utility for class name merging (common in shadcn/ui projects)
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
