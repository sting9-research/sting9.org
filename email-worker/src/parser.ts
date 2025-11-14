/**
 * Email parsing using postal-mime
 */

import PostalMime from 'postal-mime';
import type { ParsedEmail, EmailAttachment } from './types';

/**
 * Parse raw email content using postal-mime
 */
export async function parseEmail(rawEmail: ArrayBuffer | string): Promise<ParsedEmail> {
  const parser = new PostalMime();

  try {
    const parsed = await parser.parse(rawEmail);

    // Convert postal-mime structure to our ParsedEmail type
    return {
      headers: new Map(Object.entries(parsed.headers || {})),
      from: parsed.from
        ? { name: parsed.from.name, address: parsed.from.address }
        : undefined,
      to: parsed.to?.map((addr) => ({ name: addr.name, address: addr.address })),
      cc: parsed.cc?.map((addr) => ({ name: addr.name, address: addr.address })),
      bcc: parsed.bcc?.map((addr) => ({ name: addr.name, address: addr.address })),
      subject: parsed.subject,
      messageId: parsed.messageId,
      inReplyTo: parsed.inReplyTo,
      references: parsed.references,
      date: parsed.date,
      html: parsed.html,
      text: parsed.text,
      attachments: (parsed.attachments || []).map(
        (att): EmailAttachment => ({
          filename: att.filename,
          mimeType: att.mimeType || 'application/octet-stream',
          disposition: att.disposition,
          contentId: att.contentId,
          content: att.content,
        })
      ),
    };
  } catch (error) {
    throw new Error(
      `Failed to parse email: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Parse an .eml attachment (RFC822 message)
 */
export async function parseEmlAttachment(content: Uint8Array): Promise<ParsedEmail> {
  return parseEmail(content.buffer);
}

/**
 * Get email body content (prefer HTML, fallback to text)
 */
export function getEmailBody(parsed: ParsedEmail): string {
  return parsed.html || parsed.text || '';
}

/**
 * Get plain text version of email body
 */
export function getPlainTextBody(parsed: ParsedEmail): string {
  // If we have plain text, use it
  if (parsed.text) {
    return parsed.text;
  }

  // Otherwise, we'll need to work with HTML in the extractor
  return parsed.html || '';
}

/**
 * Get all email headers as a formatted string
 */
export function formatHeaders(parsed: ParsedEmail): string {
  const lines: string[] = [];

  if (parsed.from) {
    lines.push(`From: ${formatAddress(parsed.from)}`);
  }

  if (parsed.to && parsed.to.length > 0) {
    lines.push(`To: ${parsed.to.map(formatAddress).join(', ')}`);
  }

  if (parsed.subject) {
    lines.push(`Subject: ${parsed.subject}`);
  }

  if (parsed.date) {
    lines.push(`Date: ${parsed.date}`);
  }

  if (parsed.messageId) {
    lines.push(`Message-ID: ${parsed.messageId}`);
  }

  return lines.join('\n');
}

/**
 * Format an email address for display
 */
function formatAddress(addr: { name?: string; address: string }): string {
  if (addr.name) {
    return `${addr.name} <${addr.address}>`;
  }
  return addr.address;
}

/**
 * Check if email has attachments
 */
export function hasAttachments(parsed: ParsedEmail): boolean {
  return parsed.attachments && parsed.attachments.length > 0;
}

/**
 * Get attachment filenames
 */
export function getAttachmentNames(parsed: ParsedEmail): string[] {
  if (!parsed.attachments) return [];

  return parsed.attachments
    .filter((att) => att.filename)
    .map((att) => att.filename as string);
}

/**
 * Find .eml or RFC822 message attachments
 */
export function findEmailAttachments(parsed: ParsedEmail): EmailAttachment[] {
  if (!parsed.attachments) return [];

  return parsed.attachments.filter(
    (att) =>
      att.mimeType === 'message/rfc822' ||
      att.mimeType === 'message/rfc2822' ||
      att.filename?.toLowerCase().endsWith('.eml')
  );
}

/**
 * Get full email content as text (headers + body)
 */
export function getFullEmailText(parsed: ParsedEmail): string {
  const parts: string[] = [];

  // Add headers
  parts.push(formatHeaders(parsed));

  // Add blank line separator
  parts.push('');

  // Add body
  parts.push(getEmailBody(parsed));

  return parts.join('\n');
}
