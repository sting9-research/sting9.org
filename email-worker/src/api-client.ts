/**
 * Sting9 API client for submitting phishing emails
 */

import type {
  ExtractedPhishingEmail,
  SubmissionPayload,
  ApiResponse,
  ApiSuccessResponse,
  ApiErrorResponse,
  ProcessingResult,
  Env,
} from './types';

const CLIENT_VERSION = '1.0.0';
const USER_AGENT = `Sting9-EmailWorker/${CLIENT_VERSION}`;

/**
 * Submit extracted phishing email to Sting9 API
 */
export async function submitToApi(
  email: ExtractedPhishingEmail,
  env: Env
): Promise<ProcessingResult> {
  try {
    // Build submission payload
    const payload: SubmissionPayload = {
      type: 'email',
      content: email.content,
      metadata: {
        from: email.from,
        subject: email.subject,
        date: email.date,
        to: email.to,
        urls: email.urls.length > 0 ? email.urls : undefined,
        attachments: email.attachmentNames.length > 0 ? email.attachmentNames : undefined,
      },
      client_info: {
        platform: 'Cloudflare Email Worker',
        app_version: CLIENT_VERSION,
      },
    };

    // Validate payload before sending
    const validation = validatePayload(payload);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error || 'Invalid payload',
        errorCode: 'VALIDATION_ERROR',
      };
    }

    // Make API request
    const apiUrl = `${env.API_BASE_URL}/api/v1/submissions`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': USER_AGENT,
      },
      body: JSON.stringify(payload),
    });

    const responseData: ApiResponse = await response.json();

    // Handle success response
    if (response.ok && responseData.success) {
      const successData = responseData as ApiSuccessResponse;
      return {
        success: true,
        submissionId: successData.data.submission_id,
      };
    }

    // If HTTP status is OK but response doesn't have success flag,
    // treat it as success (don't retry) but log the unexpected structure
    if (response.ok) {
      console.warn('API returned OK status but unexpected response structure:', responseData);
      return {
        success: true,
        submissionId: 'unknown',
      };
    }

    // Handle error response (non-OK HTTP status)
    const errorData = responseData as ApiErrorResponse;

    // Defensive check: ensure error object exists
    if (!errorData.error) {
      console.error('Unexpected error response structure:', responseData);
      return {
        success: false,
        error: `API error: ${response.status} ${response.statusText}`,
        errorCode: `HTTP_${response.status}`,
      };
    }

    return {
      success: false,
      error: errorData.error.message,
      errorCode: errorData.error.code,
    };
  } catch (error) {
    console.error('API submission failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorCode: 'NETWORK_ERROR',
    };
  }
}

/**
 * Submit with retry logic for transient failures
 */
export async function submitWithRetry(
  email: ExtractedPhishingEmail,
  env: Env,
  maxRetries: number = 2
): Promise<ProcessingResult> {
  let lastError: ProcessingResult | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const result = await submitToApi(email, env);

    // Success - return immediately
    if (result.success) {
      return result;
    }

    // Don't retry on validation errors or rate limits
    if (
      result.errorCode === 'VALIDATION_ERROR' ||
      result.errorCode === 'RATE_LIMIT_EXCEEDED'
    ) {
      return result;
    }

    lastError = result;

    // Wait before retrying (exponential backoff)
    if (attempt < maxRetries) {
      const delayMs = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
      await sleep(delayMs);
    }
  }

  return lastError || {
    success: false,
    error: 'Max retries exceeded',
    errorCode: 'MAX_RETRIES',
  };
}

/**
 * Validate submission payload
 */
function validatePayload(payload: SubmissionPayload): { valid: boolean; error?: string } {
  // Check required fields
  if (!payload.type) {
    return { valid: false, error: 'Missing field: type' };
  }

  if (!payload.content) {
    return { valid: false, error: 'Missing field: content' };
  }

  // Validate content length
  if (payload.content.length < 10) {
    return { valid: false, error: 'Content must be at least 10 characters' };
  }

  // Validate content is not only whitespace
  if (payload.content.trim().length === 0) {
    return { valid: false, error: 'Content cannot be empty or only whitespace' };
  }

  // Check total payload size (API limit is 1MB)
  const payloadSize = JSON.stringify(payload).length;
  if (payloadSize > 1024 * 1024) {
    return { valid: false, error: 'Payload exceeds 1MB limit' };
  }

  // Validate metadata if present
  if (payload.metadata) {
    if (payload.metadata.from && payload.metadata.from.length > 320) {
      return { valid: false, error: 'From address exceeds 320 characters' };
    }

    if (payload.metadata.to && payload.metadata.to.length > 320) {
      return { valid: false, error: 'To address exceeds 320 characters' };
    }

    if (payload.metadata.subject && payload.metadata.subject.length > 500) {
      return { valid: false, error: 'Subject exceeds 500 characters' };
    }
  }

  return { valid: true };
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if API is healthy
 */
export async function checkApiHealth(env: Env): Promise<boolean> {
  try {
    const healthUrl = `${env.API_BASE_URL}/api/v1/health`;

    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'User-Agent': USER_AGENT,
      },
    });

    if (!response.ok) return false;

    const data = (await response.json()) as { status?: string };
    return data.status === 'healthy' || data.status === 'degraded';
  } catch {
    return false;
  }
}
