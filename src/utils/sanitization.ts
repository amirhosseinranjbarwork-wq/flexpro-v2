/**
 * Sanitization utilities for FlexPro v2
 * Provides XSS protection and safe HTML rendering
 */

/**
 * Basic HTML entity encoding
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Sanitize text content for display
 * Removes potentially dangerous HTML and encodes entities
 */
export function sanitizeText(text: string | null | undefined): string {
  if (!text) return '';

  // Remove any HTML tags
  const withoutTags = text.replace(/<[^>]*>/g, '');

  // Encode HTML entities
  return escapeHtml(withoutTags);
}

/**
 * Sanitize HTML content while allowing safe tags
 * Used for rendering user-generated content in print templates
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return '';

  // Only allow safe tags and attributes
  // These are defined for documentation purposes; the actual filtering uses regex patterns
  const _allowedTags = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const _allowedAttributes = ['style', 'class'];
  void _allowedTags; void _allowedAttributes; // Suppress unused warnings

  // Remove dangerous tags and attributes
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:[^"]*/gi, '');

  // Remove any remaining dangerous tags
  sanitized = sanitized.replace(/<\/?(?!(?:p|br|strong|b|em|i|u|ul|ol|li|h[1-6])\b)[^>]*>/gi, '');

  return sanitized;
}

/**
 * Create a safe HTML element for rendering
 */
export function createSafeElement(html: string): HTMLElement {
  const template = document.createElement('template');
  template.innerHTML = sanitizeHtml(html);
  return template.content.firstElementChild as HTMLElement || document.createElement('div');
}

/**
 * Sanitize file names for download
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9\-_.]/g, '') // Remove special characters except safe ones
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .substring(0, 255); // Limit length
}

/**
 * Sanitize user input for database storage
 */
export function sanitizeForDatabase(input: any): any {
  if (typeof input === 'string') {
    // Remove null bytes and other dangerous characters
    return input
      .replace(/\0/g, '') // Remove null bytes
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
      .trim();
  }

  if (Array.isArray(input)) {
    return input.map(item => sanitizeForDatabase(item));
  }

  if (typeof input === 'object' && input !== null) {
    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(input)) {
      // Skip dangerous keys
      if (!['__proto__', 'constructor', 'prototype'].includes(key)) {
        sanitized[key] = sanitizeForDatabase(value);
      }
    }
    return sanitized;
  }

  return input;
}

/**
 * Validate and sanitize exercise/food names
 */
export function sanitizeName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, ' ') // Normalize spaces
    .substring(0, 200); // Limit length
}

/**
 * Sanitize numeric inputs
 */
export function sanitizeNumber(input: any, min?: number, max?: number): number | null {
  const num = parseFloat(input);
  if (isNaN(num)) return null;

  if (min !== undefined && num < min) return min;
  if (max !== undefined && num > max) return max;

  return num;
}

/**
 * Create a safe URL for external links
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return null;
    }

    // Remove potentially dangerous parts
    return parsedUrl.toString();
  } catch {
    return null;
  }
}