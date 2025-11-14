/**
 * Extract original phishing email from forwarded messages
 */

import type { ParsedEmail, ExtractedPhishingEmail } from './types';
import {
  parseEmail,
  parseEmlAttachment,
  findEmailAttachments,
  getEmailBody,
  getPlainTextBody,
  getAttachmentNames,
} from './parser';
import {
  extractUrls,
  extractHeaderValue,
  sanitizeText,
  stripHtml,
  isHtml,
  uint8ArrayToString,
  formatEmailAddress,
} from './utils';

/**
 * Extract the original phishing email from a forwarded message
 */
export async function extractPhishingEmail(
  parsed: ParsedEmail
): Promise<ExtractedPhishingEmail> {
  // Strategy 1: Check for .eml attachment first (Outlook, some clients)
  const emlAttachments = findEmailAttachments(parsed);
  if (emlAttachments.length > 0) {
    return await extractFromEmlAttachment(emlAttachments[0], parsed);
  }

  // Strategy 2: Parse inline forwarded content
  return await extractFromInlineForward(parsed);
}

/**
 * Extract from .eml attachment
 */
async function extractFromEmlAttachment(
  attachment: { content: Uint8Array; filename?: string },
  outerEmail: ParsedEmail
): Promise<ExtractedPhishingEmail> {
  try {
    // Parse the attached email
    const innerEmail = await parseEmlAttachment(attachment.content);

    const body = getEmailBody(innerEmail);
    const urls = extractUrls(body);

    return {
      from: innerEmail.from
        ? formatEmailAddress(innerEmail.from.name, innerEmail.from.address)
        : 'Unknown',
      subject: innerEmail.subject || 'No Subject',
      date: innerEmail.date,
      to: innerEmail.to?.[0]
        ? formatEmailAddress(innerEmail.to[0].name, innerEmail.to[0].address)
        : undefined,
      content: getFullEmailContent(innerEmail),
      urls,
      attachmentNames: getAttachmentNames(innerEmail),
      isForwarded: true,
      forwardedBy: outerEmail.from?.address,
    };
  } catch (error) {
    console.error('Failed to parse .eml attachment:', error);
    // Fallback to inline parsing
    return await extractFromInlineForward(outerEmail);
  }
}

/**
 * Extract from inline forwarded content
 */
async function extractFromInlineForward(parsed: ParsedEmail): Promise<ExtractedPhishingEmail> {
  const body = getEmailBody(parsed);
  const plainBody = isHtml(body) ? stripHtml(body) : body;

  // Try to detect forwarded message boundaries
  const forwarded = detectForwardedMessage(plainBody);

  if (forwarded) {
    const urls = extractUrls(forwarded.content);

    return {
      from: forwarded.from || 'Unknown',
      subject: forwarded.subject || parsed.subject || 'No Subject',
      date: forwarded.date,
      to: forwarded.to,
      content: forwarded.content,
      urls,
      attachmentNames: getAttachmentNames(parsed),
      isForwarded: true,
      forwardedBy: parsed.from?.address,
    };
  }

  // Fallback: Use the entire email as-is
  const urls = extractUrls(body);

  return {
    from: parsed.from
      ? formatEmailAddress(parsed.from.name, parsed.from.address)
      : 'Unknown',
    subject: parsed.subject || 'No Subject',
    date: parsed.date,
    to: parsed.to?.[0]
      ? formatEmailAddress(parsed.to[0].name, parsed.to[0].address)
      : undefined,
    content: body,
    urls,
    attachmentNames: getAttachmentNames(parsed),
    isForwarded: false,
    forwardedBy: undefined,
  };
}

/**
 * Detect and extract forwarded message from text
 */
function detectForwardedMessage(text: string): {
  from?: string;
  subject?: string;
  date?: string;
  to?: string;
  content: string;
} | null {
  if (!text) return null;

  // Pattern 1: Gmail format
  // "---------- Forwarded message ---------"
  const gmailMatch = text.match(/-{5,}\s*Forwarded message\s*-{5,}([\s\S]+)/i);
  if (gmailMatch) {
    return parseGmailForward(gmailMatch[1]);
  }

  // Pattern 2: Outlook/Apple Mail format
  // "Begin forwarded message:"
  const outlookMatch = text.match(/Begin forwarded message:\s*([\s\S]+)/i);
  if (outlookMatch) {
    return parseOutlookForward(outlookMatch[1]);
  }

  // Pattern 3: Generic format with headers
  // Look for "From:" followed by other headers
  const genericMatch = text.match(/From:\s*(.+?)[\r\n][\s\S]+Subject:\s*(.+?)[\r\n]/i);
  if (genericMatch) {
    return parseGenericForward(text);
  }

  return null;
}

/**
 * Parse Gmail-style forwarded message
 */
function parseGmailForward(content: string): {
  from?: string;
  subject?: string;
  date?: string;
  to?: string;
  content: string;
} {
  const from = extractHeaderValue(content, 'From');
  const date = extractHeaderValue(content, 'Date');
  const subject = extractHeaderValue(content, 'Subject');
  const to = extractHeaderValue(content, 'To');

  // Extract message body (after headers)
  const bodyMatch = content.match(/Subject:.*?[\r\n]+[\r\n]+([\s\S]+)/i);
  const messageContent = bodyMatch ? sanitizeText(bodyMatch[1]) : sanitizeText(content);

  return {
    from: from || undefined,
    subject: subject || undefined,
    date: date || undefined,
    to: to || undefined,
    content: messageContent,
  };
}

/**
 * Parse Outlook/Apple Mail-style forwarded message
 */
function parseOutlookForward(content: string): {
  from?: string;
  subject?: string;
  date?: string;
  to?: string;
  content: string;
} {
  const from = extractHeaderValue(content, 'From');
  const date = extractHeaderValue(content, 'Date');
  const subject = extractHeaderValue(content, 'Subject');
  const to = extractHeaderValue(content, 'To');

  // Extract message body (after headers)
  // Headers are usually followed by a blank line
  const lines = content.split(/[\r\n]+/);
  let bodyStartIndex = 0;

  // Find where headers end (first blank line after headers)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line && i > 0) {
      bodyStartIndex = i + 1;
      break;
    }
  }

  const messageContent = sanitizeText(lines.slice(bodyStartIndex).join('\n'));

  return {
    from: from || undefined,
    subject: subject || undefined,
    date: date || undefined,
    to: to || undefined,
    content: messageContent,
  };
}

/**
 * Parse generic forwarded message format
 */
function parseGenericForward(content: string): {
  from?: string;
  subject?: string;
  date?: string;
  to?: string;
  content: string;
} {
  const from = extractHeaderValue(content, 'From');
  const date = extractHeaderValue(content, 'Date');
  const subject = extractHeaderValue(content, 'Subject');
  const to = extractHeaderValue(content, 'To');

  // Try to extract body after headers
  const bodyMatch = content.match(
    /(?:From|Subject|Date|To):.*?[\r\n]+(?:(?:From|Subject|Date|To):.*?[\r\n]+)*[\r\n]+([\s\S]+)/i
  );
  const messageContent = bodyMatch ? sanitizeText(bodyMatch[1]) : sanitizeText(content);

  return {
    from: from || undefined,
    subject: subject || undefined,
    date: date || undefined,
    to: to || undefined,
    content: messageContent,
  };
}

/**
 * Get full email content with headers
 */
function getFullEmailContent(parsed: ParsedEmail): string {
  const parts: string[] = [];

  if (parsed.from) {
    parts.push(
      `From: ${formatEmailAddress(parsed.from.name, parsed.from.address)}`
    );
  }

  if (parsed.to && parsed.to.length > 0) {
    parts.push(`To: ${parsed.to.map((t) => formatEmailAddress(t.name, t.address)).join(', ')}`);
  }

  if (parsed.subject) {
    parts.push(`Subject: ${parsed.subject}`);
  }

  if (parsed.date) {
    parts.push(`Date: ${parsed.date}`);
  }

  parts.push(''); // Blank line
  parts.push(getEmailBody(parsed));

  return parts.join('\n');
}
