/**
 * Sting9 Email Worker
 * Receives phishing emails forwarded to submit@sting9.org and submits them to the API
 */

import type { Env, RateLimitEntry } from './types';
import { parseEmail } from './parser';
import { extractPhishingEmail } from './extractor';
import { submitWithRetry } from './api-client';
import { streamToArrayBuffer, isEmailTooLarge, hashEmail } from './utils';

// In-memory rate limiting storage (resets on worker restart)
const rateLimitStore = new Map<string, RateLimitEntry>();

export default {
  /**
   * Fetch handler - for local testing via HTTP
   * Handles POST requests to /cdn-cgi/handler/email
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Handle local testing endpoint
    if (url.pathname === '/cdn-cgi/handler/email' && request.method === 'POST') {
      try {
        const from = url.searchParams.get('from') || 'unknown@example.com';
        const to = url.searchParams.get('to') || 'submit@sting9.org';
        const rawEmail = await request.arrayBuffer();

        console.log('🧪 Local testing mode - simulating email receipt');

        // Create mock ForwardableEmailMessage
        const mockMessage = {
          from,
          to,
          headers: new Headers(),
          raw: new ReadableStream({
            start(controller) {
              controller.enqueue(new Uint8Array(rawEmail));
              controller.close();
            },
          }),
          rawSize: rawEmail.byteLength,
          setReject: () => {},
          forward: async () => {},
          reply: async () => {},
        } as unknown as ForwardableEmailMessage;

        // Process the email
        await this.email(mockMessage, env, ctx);

        return new Response('Email processed successfully\n', {
          status: 200,
          headers: { 'Content-Type': 'text/plain' },
        });
      } catch (error) {
        console.error('Local testing error:', error);
        return new Response(
          `Error processing email: ${error instanceof Error ? error.message : String(error)}\n`,
          {
            status: 500,
            headers: { 'Content-Type': 'text/plain' },
          }
        );
      }
    }

    // Default response for other paths
    return new Response('Sting9 Email Worker\nPOST to /cdn-cgi/handler/email for local testing', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  },

  /**
   * Email handler - called when an email is received
   */
  async email(message: ForwardableEmailMessage, env: Env, ctx: ExecutionContext): Promise<void> {
    const startTime = Date.now();

    try {
      console.log('📧 Received email:', {
        from: message.from,
        to: message.to,
        size: message.rawSize,
      });

      // Check email size limit
      const maxSizeMB = parseInt(env.MAX_EMAIL_SIZE_MB || '10', 10);
      if (isEmailTooLarge(message.rawSize, maxSizeMB)) {
        console.error('❌ Email too large:', {
          size: message.rawSize,
          maxSize: maxSizeMB * 1024 * 1024,
        });
        return;
      }

      // Check rate limiting
      const rateLimitPerHour = parseInt(env.RATE_LIMIT_PER_HOUR || '10', 10);
      if (isRateLimited(message.from, rateLimitPerHour)) {
        console.warn('⚠️ Rate limit exceeded for:', message.from);
        return;
      }

      // Parse the raw email
      console.log('📖 Parsing email...');
      const rawEmail = await streamToArrayBuffer(message.raw);
      const parsed = await parseEmail(rawEmail);

      console.log('📝 Parsed email:', {
        subject: parsed.subject,
        from: parsed.from?.address,
        hasAttachments: parsed.attachments?.length > 0,
      });

      // Extract the original phishing email from forwarded content
      console.log('🔍 Extracting phishing email...');
      const phishingEmail = await extractPhishingEmail(parsed);

      console.log('✅ Extracted phishing email:', {
        isForwarded: phishingEmail.isForwarded,
        from: phishingEmail.from,
        subject: phishingEmail.subject,
        urlCount: phishingEmail.urls.length,
        attachmentCount: phishingEmail.attachmentNames.length,
      });

      // Submit to Sting9 API
      console.log('📤 Submitting to API...');
      const result = await submitWithRetry(phishingEmail, env, 2);

      if (result.success) {
        console.log('✅ Submission successful:', {
          submissionId: result.submissionId,
          processingTime: Date.now() - startTime,
        });

        // Track successful submission for rate limiting
        trackSubmission(message.from);
      } else {
        console.error('❌ Submission failed:', {
          error: result.error,
          errorCode: result.errorCode,
        });
      }
    } catch (error) {
      console.error('💥 Email processing error:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        from: message.from,
        processingTime: Date.now() - startTime,
      });
    }

    // Note: We do NOT send any reply emails
    // The processing happens silently
  },
};

/**
 * Check if sender has exceeded rate limit
 */
function isRateLimited(email: string, maxPerHour: number): boolean {
  const now = Date.now();
  const key = hashEmail(email);
  const entry = rateLimitStore.get(key);

  if (!entry) {
    return false;
  }

  // Clean up old submissions (older than 1 hour)
  const oneHourAgo = now - 60 * 60 * 1000;
  entry.submissions = entry.submissions.filter((timestamp) => timestamp > oneHourAgo);

  // Check if limit exceeded
  return entry.submissions.length >= maxPerHour;
}

/**
 * Track a successful submission for rate limiting
 */
function trackSubmission(email: string): void {
  const now = Date.now();
  const key = hashEmail(email);
  const entry = rateLimitStore.get(key);

  if (!entry) {
    rateLimitStore.set(key, {
      email: key,
      submissions: [now],
      lastCleanup: now,
    });
  } else {
    entry.submissions.push(now);
    entry.lastCleanup = now;
  }

  // Cleanup: Remove entries older than 2 hours to prevent memory growth
  cleanupOldEntries();
}

/**
 * Cleanup old rate limit entries
 */
function cleanupOldEntries(): void {
  const now = Date.now();
  const twoHoursAgo = now - 2 * 60 * 60 * 1000;

  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.lastCleanup < twoHoursAgo) {
      rateLimitStore.delete(key);
    }
  }
}
