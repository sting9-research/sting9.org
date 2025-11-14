/**
 * TypeScript type definitions for Sting9 Email Worker
 */

// Cloudflare Email Worker types
export interface Env {
  API_BASE_URL: string;
  MAX_EMAIL_SIZE_MB: string;
  RATE_LIMIT_PER_HOUR: string;
}

// Parsed email structure from postal-mime
export interface ParsedEmail {
  headers: Map<string, string>;
  from?: EmailAddress;
  to?: EmailAddress[];
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  subject?: string;
  messageId?: string;
  inReplyTo?: string;
  references?: string;
  date?: string;
  html?: string;
  text?: string;
  attachments: EmailAttachment[];
}

export interface EmailAddress {
  name?: string;
  address: string;
}

export interface EmailAttachment {
  filename?: string;
  mimeType: string;
  disposition?: string;
  contentId?: string;
  content: Uint8Array;
}

// Extracted phishing email content
export interface ExtractedPhishingEmail {
  from: string;
  subject: string;
  date?: string;
  to?: string;
  content: string; // Full email text/HTML
  urls: string[];
  attachmentNames: string[];
  isForwarded: boolean;
  forwardedBy?: string;
}

// Sting9 API submission types
export interface SubmissionPayload {
  type: 'email' | 'sms';
  content: string;
  metadata?: SubmissionMetadata;
  client_info?: ClientInfo;
}

export interface SubmissionMetadata {
  from?: string;
  to?: string;
  subject?: string;
  date?: string;
  attachments?: string[];
  urls?: string[];
}

export interface ClientInfo {
  platform: string;
  app_version: string;
  device_model?: string;
  os_version?: string;
}

// API Response types
export interface ApiSuccessResponse {
  success: true;
  data: {
    submission_id: string;
    status: 'processing' | 'completed' | 'failed';
    created_at: string;
    anonymization_status: 'pending' | 'completed';
    estimated_processing_time: number;
  };
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      error: string;
    }>;
    request_id?: string;
    retry_after?: number;
  };
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

// Worker processing result
export interface ProcessingResult {
  success: boolean;
  submissionId?: string;
  error?: string;
  errorCode?: string;
}

// Rate limiting
export interface RateLimitEntry {
  email: string;
  submissions: number[];
  lastCleanup: number;
}
