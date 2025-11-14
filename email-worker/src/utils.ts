/**
 * Utility functions for email processing
 */

/**
 * Convert a ReadableStream to a string
 */
export async function streamToString(stream: ReadableStream): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }

  // Final decode to flush any remaining bytes
  result += decoder.decode();
  return result;
}

/**
 * Convert a ReadableStream to an ArrayBuffer
 */
export async function streamToArrayBuffer(stream: ReadableStream): Promise<ArrayBuffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let totalLength = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    totalLength += value.length;
  }

  // Combine all chunks into a single ArrayBuffer
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result.buffer;
}

/**
 * Extract all URLs from text content
 */
export function extractUrls(text: string): string[] {
  if (!text) return [];

  // Regex to match http/https URLs
  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi;
  const matches = text.match(urlRegex);

  if (!matches) return [];

  // Deduplicate and clean URLs
  const uniqueUrls = new Set<string>();

  for (let url of matches) {
    // Remove trailing punctuation that's likely not part of the URL
    url = url.replace(/[.,;:!?)\]]+$/, '');
    uniqueUrls.add(url);
  }

  return Array.from(uniqueUrls);
}

/**
 * Parse email address string to extract address and name
 * Examples: "John Doe <john@example.com>" or "john@example.com"
 */
export function parseEmailAddress(input: string): { name?: string; address: string } | null {
  if (!input) return null;

  // Pattern: "Name <email@example.com>"
  const withNameMatch = input.match(/^(.+?)\s*<([^>]+)>$/);
  if (withNameMatch) {
    return {
      name: withNameMatch[1].trim().replace(/^["']|["']$/g, ''),
      address: withNameMatch[2].trim(),
    };
  }

  // Pattern: just "email@example.com"
  const emailMatch = input.match(/([^\s@]+@[^\s@]+\.[^\s@]+)/);
  if (emailMatch) {
    return { address: emailMatch[1].trim() };
  }

  return null;
}

/**
 * Format email address for display
 */
export function formatEmailAddress(name: string | undefined, address: string): string {
  if (name) {
    return `${name} <${address}>`;
  }
  return address;
}

/**
 * Extract value from email header text
 * Example: extract "Subject: Test" from multiline forwarded content
 */
export function extractHeaderValue(text: string, headerName: string): string | null {
  if (!text) return null;

  // Case-insensitive search for header
  const regex = new RegExp(`^${headerName}\\s*:\\s*(.+?)$`, 'im');
  const match = text.match(regex);

  return match ? match[1].trim() : null;
}

/**
 * Parse ISO 8601 date string to Date object
 */
export function parseDate(dateString: string): Date | null {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

/**
 * Format Date to ISO 8601 string
 */
export function formatDateISO(date: Date): string {
  return date.toISOString();
}

/**
 * Sanitize text by removing excessive whitespace and control characters
 */
export function sanitizeText(text: string): string {
  if (!text) return '';

  return text
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n') // Reduce multiple newlines
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '') // Remove control chars
    .trim();
}

/**
 * Truncate text to maximum length
 */
export function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Check if email size exceeds limit
 */
export function isEmailTooLarge(sizeBytes: number, maxSizeMB: number): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return sizeBytes > maxBytes;
}

/**
 * Clean and normalize subject line
 */
export function normalizeSubject(subject: string): string {
  if (!subject) return '';

  // Remove common prefixes like "Fwd:", "Re:", "FWD:", etc.
  let cleaned = subject.replace(/^(re|fwd?|fw):\s*/gi, '').trim();

  return sanitizeText(cleaned);
}

/**
 * Extract domain from email address
 */
export function extractDomain(email: string): string | null {
  const parsed = parseEmailAddress(email);
  if (!parsed) return null;

  const match = parsed.address.match(/@(.+)$/);
  return match ? match[1].toLowerCase() : null;
}

/**
 * Generate a simple hash for rate limiting (email address)
 */
export function hashEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Convert Uint8Array to string
 */
export function uint8ArrayToString(array: Uint8Array): string {
  const decoder = new TextDecoder();
  return decoder.decode(array);
}

/**
 * Check if content appears to be HTML
 */
export function isHtml(content: string): boolean {
  if (!content) return false;
  return /<[a-z][\s\S]*>/i.test(content);
}

/**
 * Strip HTML tags from content (simple version)
 */
export function stripHtml(html: string): string {
  if (!html) return '';

  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove scripts
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove styles
    .replace(/<[^>]+>/g, '') // Remove all tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
