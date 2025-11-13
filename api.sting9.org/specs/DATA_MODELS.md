# Sting9 Database Schema Specification

**Version:** 1.0
**Last Updated:** 2025-01-15
**Status:** Draft - MVP Phase

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Core Tables - MVP Phase](#2-core-tables---mvp-phase)
3. [API Endpoints & OpenAPI Specification](#3-api-endpoints--openapi-specification)
4. [User Management Tables](#4-user-management-tables)
5. [Advanced Tables - Phase 2+](#5-advanced-tables---phase-2)
6. [Relationships & Entity-Relationship Diagram](#6-relationships--entity-relationship-diagram)
7. [Anonymization Strategy](#7-anonymization-strategy)
8. [Indexing Strategy](#8-indexing-strategy)
9. [Future Scaling: Partitioning Strategy](#9-future-scaling-partitioning-strategy)
10. [Query Patterns & Optimization](#10-query-patterns--optimization)
11. [ML Training Data Structure](#11-ml-training-data-structure)
12. [Migration Strategy](#12-migration-strategy)
13. [Bulk Import Support](#13-bulk-import-support)
14. [Security & Privacy](#14-security--privacy)
15. [Implementation Roadmap](#15-implementation-roadmap)
16. [Appendices](#16-appendices)

---

## 1. Introduction

### 1.1 Project Context

The **Sting9 Research Initiative** is building the world's most comprehensive open-source dataset of phishing, smishing, and scam messages. This database will store 50+ million messages from multiple sources (email, SMS, messaging apps) with strict privacy controls, enabling AI models to detect malicious communications with 99.9% accuracy.

### 1.2 Database Design Principles

**Privacy-First Architecture:**
- All personally identifiable information (PII) must be automatically redacted
- Anonymous submission support without user tracking
- GDPR and privacy law compliant
- Audit trail for all data access

**Scalable Design:**
- Support for millions of messages efficiently
- Strategic indexing for fast queries
- Bulk import capabilities
- Ready for future partitioning when volume requires it

**ML-Ready Data Structure:**
- Structured features for machine learning
- Labeled training datasets
- Feature extraction views
- Export capabilities for researchers

**Multi-Source Support:**
- Unified schema for emails, SMS, and messaging apps
- Track submission sources (web form, API, email forward, bulk import)
- Partner organization management

### 1.3 Technology Stack

- **Database:** PostgreSQL 16+ (latest partitioning, JSON, and indexing features)
- **Driver:** pgx/v5 (high-performance PostgreSQL driver for Go)
- **Type-Safe SQL:** sqlc (generates Go code from SQL queries)
- **Migrations:** golang-migrate (version-controlled schema changes)
- **Anonymization:** Go service layer with regex patterns and NER libraries
- **Full-Text Search:** PostgreSQL native tsvector with GIN indexes
- **API Documentation:** OpenAPI 3.0 specification with Swagger UI

### 1.4 Key Requirements Summary

| Requirement | Specification |
|-------------|---------------|
| **Storage Capacity** | 50M+ messages |
| **Message Types** | Email, SMS, WhatsApp, Telegram, Signal, other |
| **Languages** | 100+ languages supported |
| **Submission Sources** | Web form, email forward, API, bulk import |
| **Privacy** | Automatic PII redaction, anonymized storage |
| **Performance** | < 100ms query response for dashboard |
| **Availability** | 99.9% uptime with automated backups |
| **Security** | Row-level security, audit logging, encrypted at rest |

---

## 2. Core Tables - MVP Phase

### 2.1 Submissions Table

The central table storing all message submissions with anonymized content and metadata.

**Design Rationale:**
- UUID primary key prevents enumeration attacks
- JSONB for flexible header storage
- tsvector for full-text search
- Versioning fields track anonymization/classification algorithm changes
- Simple table structure; partitioning can be added later when volume requires it

**SQL Schema:**

```sql
CREATE TABLE submissions (
    -- Primary identification
    submission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Message classification
    message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('email', 'sms', 'whatsapp', 'telegram', 'signal', 'other')),
    threat_level VARCHAR(20) CHECK (threat_level IN ('low', 'medium', 'high', 'critical', 'unknown')),
    attack_type VARCHAR(50),  -- phishing, spear-phishing, smishing, BEC, romance_scam, etc.

    -- Source tracking
    submission_source VARCHAR(30) NOT NULL CHECK (submission_source IN ('web_form', 'email_forward', 'text_forward', 'api', 'bulk_import', 'partner')),
    partner_id UUID REFERENCES partners(partner_id),
    import_batch_id UUID REFERENCES import_batches(batch_id),

    -- Anonymized content
    subject_text TEXT,  -- Email subject or SMS preview (anonymized)
    body_text TEXT NOT NULL,  -- Main content (PII redacted)
    body_text_search TSVECTOR,  -- For full-text search
    raw_headers JSONB,  -- Email headers with PII removed

    -- Language and locale
    detected_language VARCHAR(10),  -- ISO 639-1 code (e.g., 'en', 'es', 'fr')
    detected_country VARCHAR(2),  -- ISO 3166-1 alpha-2 (e.g., 'US', 'GB', 'DE')

    -- Anonymized sender information
    sender_domain VARCHAR(255),  -- Preserved for pattern analysis
    sender_domain_hash BYTEA,  -- SHA-256 hash of full sender email
    claimed_sender_name VARCHAR(255),  -- Display name (may be spoofed)

    -- Timing information
    message_timestamp TIMESTAMPTZ,  -- When message was originally sent
    submission_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Processing metadata
    processing_status VARCHAR(20) DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    anonymization_version INT NOT NULL DEFAULT 1,
    classification_version INT NOT NULL DEFAULT 1,

    -- Verification and quality
    verified BOOLEAN DEFAULT FALSE,
    verification_source VARCHAR(50),
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),  -- 0.00-1.00 ML confidence

    -- Soft delete and audit
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance (see Section 7 for full strategy)
CREATE INDEX idx_submissions_message_type ON submissions(message_type);
CREATE INDEX idx_submissions_submission_timestamp ON submissions(submission_timestamp);
CREATE INDEX idx_submissions_threat_level ON submissions(threat_level) WHERE threat_level IS NOT NULL;
CREATE INDEX idx_submissions_attack_type ON submissions(attack_type) WHERE attack_type IS NOT NULL;
CREATE INDEX idx_submissions_language ON submissions(detected_language);
CREATE INDEX idx_submissions_sender_domain ON submissions(sender_domain);
CREATE INDEX idx_submissions_body_search ON submissions USING GIN(body_text_search);
CREATE INDEX idx_submissions_processing_status ON submissions(processing_status) WHERE processing_status != 'completed';

-- Composite indexes for common query patterns
CREATE INDEX idx_submissions_type_time ON submissions(message_type, submission_timestamp);
CREATE INDEX idx_submissions_threat_time ON submissions(threat_level, submission_timestamp) WHERE threat_level IS NOT NULL;

-- Trigger to maintain tsvector for full-text search
CREATE TRIGGER tsvector_update BEFORE INSERT OR UPDATE ON submissions
FOR EACH ROW EXECUTE FUNCTION
tsvector_update_trigger(body_text_search, 'pg_catalog.english', subject_text, body_text);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Field Descriptions:**

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `submission_id` | UUID | NO | Primary key, randomly generated |
| `message_type` | VARCHAR(20) | NO | Type of message: email, sms, whatsapp, telegram, signal, other |
| `threat_level` | VARCHAR(20) | YES | Assessed threat: low, medium, high, critical, unknown |
| `attack_type` | VARCHAR(50) | YES | Attack classification: phishing, spear-phishing, smishing, BEC, etc. |
| `submission_source` | VARCHAR(30) | NO | How submitted: web_form, email_forward, api, bulk_import, partner |
| `partner_id` | UUID | YES | Foreign key to partners table if submitted by partner |
| `import_batch_id` | UUID | YES | Foreign key to import_batches if from bulk import |
| `subject_text` | TEXT | YES | Email subject or SMS preview (PII redacted by Go service) |
| `body_text` | TEXT | NO | Message content (PII redacted by Go service) |
| `body_text_search` | TSVECTOR | YES | Full-text search index, auto-populated by trigger |
| `raw_headers` | JSONB | YES | Email headers with PII removed (see Section 2.2 for structure) |
| `detected_language` | VARCHAR(10) | YES | ISO 639-1 language code detected from content |
| `detected_country` | VARCHAR(2) | YES | ISO 3166-1 country code inferred from sender/content |
| `sender_domain` | VARCHAR(255) | YES | Domain part of sender email (e.g., 'evil.com'), preserved for analysis |
| `sender_domain_hash` | BYTEA | YES | SHA-256 hash of full sender email for deduplication |
| `claimed_sender_name` | VARCHAR(255) | YES | Display name from sender field (often spoofed) |
| `message_timestamp` | TIMESTAMPTZ | YES | Original message sent time (from headers or metadata) |
| `submission_timestamp` | TIMESTAMPTZ | NO | When submitted to Sting9, used for partitioning |
| `processing_status` | VARCHAR(20) | NO | Current processing state: pending, processing, completed, failed |
| `anonymization_version` | INT | NO | Version of anonymization algorithm used |
| `classification_version` | INT | NO | Version of classification algorithm used |
| `verified` | BOOLEAN | NO | Has this been manually verified as malicious? |
| `verification_source` | VARCHAR(50) | YES | Who verified it: manual, partner, honeypot |
| `confidence_score` | DECIMAL(3,2) | YES | ML model confidence (0.00-1.00) |
| `deleted_at` | TIMESTAMPTZ | YES | Soft delete timestamp (NULL if not deleted) |
| `created_at` | TIMESTAMPTZ | NO | Record creation time |
| `updated_at` | TIMESTAMPTZ | NO | Record last update time |

**Example Data:**

```sql
INSERT INTO submissions (
    message_type,
    submission_source,
    subject_text,
    body_text,
    threat_level,
    attack_type,
    sender_domain,
    detected_language,
    message_timestamp,
    verified
) VALUES (
    'email',
    'web_form',
    'Urgent: Verify your PayPal account',
    'Dear customer, We have detected unusual activity on your account. Please verify your identity immediately by clicking here: https://evil[.]com/verify or your account will be suspended within 24 hours. Thank you, PayPal Security Team',
    'high',
    'phishing',
    'evil.com',
    'en',
    '2025-01-15 10:30:00+00',
    TRUE
);
```

**raw_headers JSONB Structure Example:**

```json
{
  "from": "security@paypa1[.]com",
  "to": "[REDACTED]",
  "subject": "Urgent: Verify your PayPal account",
  "date": "2025-01-15T10:30:00Z",
  "message_id": "<abc123@evil.com>",
  "received": [
    "from mail.evil.com by mx.example.com"
  ],
  "authentication_results": {
    "spf": "fail",
    "dkim": "fail",
    "dmarc": "fail"
  },
  "x_mailer": "PHPMailer 5.2.10",
  "reply_to": "support@evil[.]com"
}
```

---

### 2.2 Email Details Table

Extended metadata specific to email messages. One-to-one relationship with submissions where `message_type = 'email'`.

**SQL Schema:**

```sql
CREATE TABLE email_details (
    email_detail_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL UNIQUE REFERENCES submissions(submission_id) ON DELETE CASCADE,

    -- Email routing information (anonymized)
    received_hops INT,  -- Number of mail servers in delivery path
    spf_result VARCHAR(20),  -- pass, fail, softfail, neutral, none
    dkim_result VARCHAR(20),  -- pass, fail, neutral, none
    dmarc_result VARCHAR(20),  -- pass, fail, quarantine, reject, none

    -- Technical indicators
    has_html_content BOOLEAN DEFAULT FALSE,
    has_plain_text BOOLEAN DEFAULT FALSE,
    html_to_text_ratio DECIMAL(5,2),  -- Ratio of HTML to plain text (high ratio = suspicious)
    uses_url_shorteners BOOLEAN DEFAULT FALSE,
    uses_homoglyphs BOOLEAN DEFAULT FALSE,  -- Lookalike characters (e.g., paypa1.com)

    -- MIME structure
    mime_type VARCHAR(100),
    multipart_structure JSONB,  -- Tree structure of MIME parts

    -- Content characteristics
    external_image_count INT DEFAULT 0,
    form_count INT DEFAULT 0,  -- HTML forms in email
    script_count INT DEFAULT 0,  -- <script> tags (highly suspicious)

    -- Reply/forward indicators
    is_reply BOOLEAN DEFAULT FALSE,
    is_forward BOOLEAN DEFAULT FALSE,
    in_reply_to_hash BYTEA,  -- SHA-256 hash of Message-ID this replies to

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_email_details_submission ON email_details(submission_id);
CREATE INDEX idx_email_details_spf ON email_details(spf_result);
CREATE INDEX idx_email_details_dkim ON email_details(dkim_result);
CREATE INDEX idx_email_details_dmarc ON email_details(dmarc_result);
CREATE INDEX idx_email_details_url_shorteners ON email_details(uses_url_shorteners) WHERE uses_url_shorteners = TRUE;
CREATE INDEX idx_email_details_homoglyphs ON email_details(uses_homoglyphs) WHERE uses_homoglyphs = TRUE;
```

**Field Descriptions:**

| Field | Type | Description |
|-------|------|-------------|
| `email_detail_id` | UUID | Primary key |
| `submission_id` | UUID | Foreign key to submissions (UNIQUE for one-to-one) |
| `received_hops` | INT | Number of mail servers message passed through |
| `spf_result` | VARCHAR(20) | Sender Policy Framework validation result |
| `dkim_result` | VARCHAR(20) | DomainKeys Identified Mail signature validation |
| `dmarc_result` | VARCHAR(20) | Domain-based Message Authentication validation |
| `has_html_content` | BOOLEAN | Email includes HTML version |
| `has_plain_text` | BOOLEAN | Email includes plain text version |
| `html_to_text_ratio` | DECIMAL(5,2) | Ratio of HTML to text content (high = suspicious) |
| `uses_url_shorteners` | BOOLEAN | Contains bit.ly, tinyurl, etc. |
| `uses_homoglyphs` | BOOLEAN | Contains lookalike characters (Unicode tricks) |
| `mime_type` | VARCHAR(100) | Primary MIME type |
| `multipart_structure` | JSONB | Structure of multipart MIME message |
| `external_image_count` | INT | Number of images loaded from external URLs |
| `form_count` | INT | Number of HTML forms (credential harvesting) |
| `script_count` | INT | Number of <script> tags (XSS potential) |
| `is_reply` | BOOLEAN | Is this a reply to another message? |
| `is_forward` | BOOLEAN | Is this a forwarded message? |
| `in_reply_to_hash` | BYTEA | Hash of parent message ID if reply |

**Example multipart_structure JSONB:**

```json
{
  "type": "multipart/alternative",
  "parts": [
    {
      "type": "text/plain",
      "size": 1024
    },
    {
      "type": "text/html",
      "size": 8192,
      "has_forms": true,
      "has_scripts": false,
      "external_images": 3
    }
  ]
}
```

---

### 2.3 SMS Details Table

Extended metadata specific to SMS/text messages. One-to-one relationship with submissions where `message_type = 'sms'`.

**SQL Schema:**

```sql
CREATE TABLE sms_details (
    sms_detail_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL UNIQUE REFERENCES submissions(submission_id) ON DELETE CASCADE,

    -- SMS characteristics
    message_length INT,  -- Character count
    is_multipart BOOLEAN DEFAULT FALSE,  -- Split across multiple SMS
    part_number INT,  -- Which part (1, 2, 3...)
    total_parts INT,  -- Total number of parts

    -- Sender information (anonymized)
    sender_type VARCHAR(20) CHECK (sender_type IN ('shortcode', 'longcode', 'alphanumeric', 'unknown')),
    sender_country_code VARCHAR(5),  -- e.g., '+1', '+44'

    -- Content indicators
    contains_url BOOLEAN DEFAULT FALSE,
    contains_phone BOOLEAN DEFAULT FALSE,
    contains_reply_code BOOLEAN DEFAULT FALSE,  -- "Reply STOP to unsubscribe"
    urgency_keywords BOOLEAN DEFAULT FALSE,  -- "urgent", "immediate", "expires"

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sms_details_submission ON sms_details(submission_id);
CREATE INDEX idx_sms_details_sender_type ON sms_details(sender_type);
CREATE INDEX idx_sms_details_contains_url ON sms_details(contains_url) WHERE contains_url = TRUE;
CREATE INDEX idx_sms_details_urgency ON sms_details(urgency_keywords) WHERE urgency_keywords = TRUE;
```

**Field Descriptions:**

| Field | Type | Description |
|-------|------|-------------|
| `sms_detail_id` | UUID | Primary key |
| `submission_id` | UUID | Foreign key to submissions (UNIQUE) |
| `message_length` | INT | Number of characters in message |
| `is_multipart` | BOOLEAN | Message split across multiple SMS? |
| `part_number` | INT | Part number if multipart (1, 2, 3...) |
| `total_parts` | INT | Total parts if multipart |
| `sender_type` | VARCHAR(20) | shortcode (5-6 digits), longcode (full phone), alphanumeric, unknown |
| `sender_country_code` | VARCHAR(5) | Country code portion of sender (e.g., '+1') |
| `contains_url` | BOOLEAN | Message includes URL |
| `contains_phone` | BOOLEAN | Message includes phone number |
| `contains_reply_code` | BOOLEAN | Has "Reply STOP" or similar |
| `urgency_keywords` | BOOLEAN | Contains urgent/immediate/expires language |

---

### 2.4 Messaging App Details Table

Metadata for WhatsApp, Telegram, Signal, and other messaging platforms. One-to-one relationship with submissions where `message_type` is a messaging app.

**SQL Schema:**

```sql
CREATE TABLE messaging_app_details (
    messaging_detail_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL UNIQUE REFERENCES submissions(submission_id) ON DELETE CASCADE,

    -- Platform identification
    platform VARCHAR(30) NOT NULL,  -- whatsapp, telegram, signal, messenger, etc.

    -- Message characteristics
    is_group_message BOOLEAN DEFAULT FALSE,
    group_size INT,  -- Number of participants if group
    is_broadcast BOOLEAN DEFAULT FALSE,

    -- Media indicators
    has_image BOOLEAN DEFAULT FALSE,
    has_video BOOLEAN DEFAULT FALSE,
    has_audio BOOLEAN DEFAULT FALSE,
    has_document BOOLEAN DEFAULT FALSE,

    -- Forwarding chain
    forward_count INT DEFAULT 0,  -- How many times forwarded

    -- Contact information (anonymized)
    sender_account_age_days INT,  -- If available from platform

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messaging_details_submission ON messaging_app_details(submission_id);
CREATE INDEX idx_messaging_details_platform ON messaging_app_details(platform);
CREATE INDEX idx_messaging_details_group ON messaging_app_details(is_group_message) WHERE is_group_message = TRUE;
CREATE INDEX idx_messaging_details_forward ON messaging_app_details(forward_count) WHERE forward_count > 0;
```

---

### 2.5 URLs Table

Extracted URLs with analysis, deduplication, and threat intelligence.

**Design Rationale:**
- Separate table for URLs enables deduplication across submissions
- SHA-256 hash prevents storing duplicate malicious URLs
- Threat intelligence integration
- Track URL evolution (shorteners, redirects)

**SQL Schema:**

```sql
CREATE TABLE urls (
    url_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- URL identification
    full_url TEXT NOT NULL,
    url_hash BYTEA NOT NULL UNIQUE,  -- SHA-256 for deduplication
    normalized_url TEXT,  -- Canonicalized form (lowercase, sorted params)

    -- URL components
    scheme VARCHAR(20),  -- http, https, ftp, etc.
    domain VARCHAR(255) NOT NULL,
    domain_hash BYTEA,  -- SHA-256 of domain
    path TEXT,
    query_params JSONB,
    fragment TEXT,

    -- Domain analysis
    tld VARCHAR(50),  -- Top-level domain (.com, .net, .tk, etc.)
    domain_age_days INT,
    is_suspicious_tld BOOLEAN DEFAULT FALSE,  -- .tk, .ml, .ga, etc.

    -- URL characteristics
    is_shortened BOOLEAN DEFAULT FALSE,
    shortener_service VARCHAR(50),  -- bit.ly, tinyurl, goo.gl, etc.
    uses_ip_address BOOLEAN DEFAULT FALSE,  -- Domain is an IP
    has_port BOOLEAN DEFAULT FALSE,
    port_number INT,

    -- Security indicators
    uses_https BOOLEAN DEFAULT FALSE,
    redirects_to_url UUID REFERENCES urls(url_id),  -- Final destination
    redirect_chain JSONB,  -- Full redirect path

    -- Threat intelligence
    threat_status VARCHAR(20) DEFAULT 'unknown' CHECK (threat_status IN ('safe', 'suspicious', 'malicious', 'unknown')),
    blocklist_sources TEXT[],  -- Which blocklists flagged this

    -- Statistics
    occurrence_count INT DEFAULT 1,
    first_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_urls_hash ON urls(url_hash);
CREATE INDEX idx_urls_domain ON urls(domain);
CREATE INDEX idx_urls_domain_hash ON urls(domain_hash);
CREATE INDEX idx_urls_threat_status ON urls(threat_status);
CREATE INDEX idx_urls_is_shortened ON urls(is_shortened) WHERE is_shortened = TRUE;
CREATE INDEX idx_urls_first_seen ON urls(first_seen);
CREATE INDEX idx_urls_occurrence ON urls(occurrence_count DESC);

-- GIN index for blocklist array searches
CREATE INDEX idx_urls_blocklists ON urls USING GIN(blocklist_sources);

-- Trigger to update updated_at
CREATE TRIGGER update_urls_updated_at BEFORE UPDATE ON urls
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Field Descriptions:**

| Field | Type | Description |
|-------|------|-------------|
| `url_id` | UUID | Primary key |
| `full_url` | TEXT | Complete URL as extracted |
| `url_hash` | BYTEA | SHA-256 hash of full URL (UNIQUE for deduplication) |
| `normalized_url` | TEXT | Canonicalized URL (lowercase, sorted params) |
| `scheme` | VARCHAR(20) | Protocol (http, https, ftp) |
| `domain` | VARCHAR(255) | Domain name (e.g., 'evil.com') |
| `domain_hash` | BYTEA | SHA-256 hash of domain |
| `path` | TEXT | URL path (/login/verify) |
| `query_params` | JSONB | Query parameters as key-value pairs |
| `fragment` | TEXT | Fragment/anchor (#section) |
| `tld` | VARCHAR(50) | Top-level domain extension |
| `domain_age_days` | INT | How old is the domain registration? |
| `is_suspicious_tld` | BOOLEAN | Using known malicious TLDs (.tk, .ml, .ga) |
| `is_shortened` | BOOLEAN | Is this a URL shortener link? |
| `shortener_service` | VARCHAR(50) | Which shortener (bit.ly, tinyurl) |
| `uses_ip_address` | BOOLEAN | Domain is IP address instead of hostname |
| `has_port` | BOOLEAN | Non-standard port specified |
| `port_number` | INT | Port number if non-standard |
| `uses_https` | BOOLEAN | HTTPS instead of HTTP |
| `redirects_to_url` | UUID | FK to final destination URL after redirects |
| `redirect_chain` | JSONB | Array of redirect hops |
| `threat_status` | VARCHAR(20) | safe, suspicious, malicious, unknown |
| `blocklist_sources` | TEXT[] | Array of blocklists that flagged this |
| `occurrence_count` | INT | How many submissions contain this URL |
| `first_seen` | TIMESTAMPTZ | First time URL appeared in dataset |
| `last_seen` | TIMESTAMPTZ | Most recent occurrence |

**Example query_params JSONB:**

```json
{
  "id": "12345",
  "token": "abc123",
  "redirect": "https://legitimate-site.com"
}
```

**Example redirect_chain JSONB:**

```json
[
  "https://bit.ly/abc123",
  "https://redirect-service.com/?url=evil.com",
  "https://evil.com/phishing"
]
```

---

### 2.6 Submission-URL Junction Table

Many-to-many relationship between submissions and URLs.

**SQL Schema:**

```sql
CREATE TABLE submission_urls (
    submission_id UUID REFERENCES submissions(submission_id) ON DELETE CASCADE,
    url_id UUID REFERENCES urls(url_id) ON DELETE CASCADE,

    -- Context in message
    url_position INT,  -- Order of appearance in message (1, 2, 3...)
    anchor_text TEXT,  -- Link text if available (e.g., "Click here")
    is_hidden BOOLEAN DEFAULT FALSE,  -- Hidden in HTML, zero-width characters, etc.

    PRIMARY KEY (submission_id, url_id)
);

CREATE INDEX idx_submission_urls_submission ON submission_urls(submission_id);
CREATE INDEX idx_submission_urls_url ON submission_urls(url_id);
CREATE INDEX idx_submission_urls_hidden ON submission_urls(is_hidden) WHERE is_hidden = TRUE;
```

---

### 2.7 Attachments Table

Metadata about file attachments. **Does NOT store actual file content** for security reasons.

**SQL Schema:**

```sql
CREATE TABLE attachments (
    attachment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES submissions(submission_id) ON DELETE CASCADE,

    -- File identification
    filename VARCHAR(500),  -- Original filename (may contain malicious chars)
    sanitized_filename VARCHAR(500),  -- Cleaned version
    file_hash BYTEA UNIQUE,  -- SHA-256 of file content for deduplication
    file_size_bytes BIGINT,

    -- File type analysis
    mime_type VARCHAR(100),
    declared_extension VARCHAR(20),  -- What filename claims (.pdf, .docx)
    actual_extension VARCHAR(20),  -- What magic bytes reveal
    extension_mismatch BOOLEAN DEFAULT FALSE,  -- Indicator of deception

    -- Threat indicators
    is_executable BOOLEAN DEFAULT FALSE,  -- .exe, .bat, .sh, .app
    is_archive BOOLEAN DEFAULT FALSE,  -- .zip, .rar, .7z
    is_encrypted BOOLEAN DEFAULT FALSE,  -- Password-protected archive
    has_macros BOOLEAN DEFAULT FALSE,  -- Office documents with macros

    -- Malware analysis
    malware_scan_result VARCHAR(20) CHECK (malware_scan_result IN ('clean', 'suspicious', 'malicious', 'unknown')),
    malware_family VARCHAR(100),  -- Trojan, Ransomware, etc.
    scan_timestamp TIMESTAMPTZ,

    -- Archive contents (if applicable)
    contains_files INT,  -- Number of files in archive
    nested_files JSONB,  -- List of files in archive

    -- Deduplication
    occurrence_count INT DEFAULT 1,
    first_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_attachments_submission ON attachments(submission_id);
CREATE INDEX idx_attachments_hash ON attachments(file_hash);
CREATE INDEX idx_attachments_mime_type ON attachments(mime_type);
CREATE INDEX idx_attachments_malware_result ON attachments(malware_scan_result);
CREATE INDEX idx_attachments_is_executable ON attachments(is_executable) WHERE is_executable = TRUE;
CREATE INDEX idx_attachments_extension_mismatch ON attachments(extension_mismatch) WHERE extension_mismatch = TRUE;
```

**Example nested_files JSONB:**

```json
{
  "archive_type": "zip",
  "files": [
    {
      "name": "invoice.pdf.exe",
      "size": 1024000,
      "extension_mismatch": true,
      "is_executable": true
    },
    {
      "name": "readme.txt",
      "size": 512,
      "is_executable": false
    }
  ]
}
```

---

### 2.8 Dataset Statistics Table

Pre-computed statistics for fast dashboard rendering. Materialized view approach.

**SQL Schema:**

```sql
CREATE TABLE dataset_statistics (
    statistic_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Time period
    period_type VARCHAR(20) CHECK (period_type IN ('daily', 'weekly', 'monthly', 'yearly', 'all_time')),
    period_start DATE,
    period_end DATE,

    -- Core metrics
    total_submissions BIGINT,
    total_emails BIGINT,
    total_sms BIGINT,
    total_messaging_apps BIGINT,

    -- Breakdown by threat
    threat_distribution JSONB,  -- {low: 1000, medium: 500, high: 200, critical: 50}

    -- Breakdown by attack type
    attack_type_distribution JSONB,  -- {phishing: 5000, smishing: 2000, BEC: 500}

    -- Geographic distribution
    country_distribution JSONB,  -- {US: 10000, GB: 5000, DE: 3000}

    -- Language distribution
    language_distribution JSONB,  -- {en: 50000, es: 10000, fr: 5000}

    -- Source distribution
    source_distribution JSONB,  -- {web_form: 30000, api: 15000, bulk_import: 5000}

    -- Unique indicators
    unique_domains INT,
    unique_urls INT,
    unique_attachments INT,

    -- Quality metrics
    verified_submissions INT,
    average_confidence_score DECIMAL(3,2),

    last_calculated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_statistics_period ON dataset_statistics(period_type, period_start);
CREATE INDEX idx_statistics_period_type ON dataset_statistics(period_type);
CREATE INDEX idx_statistics_last_calculated ON dataset_statistics(last_calculated);
```

**Go Service Refresh Function (to be implemented):**

```go
// RefreshStatistics calculates and stores dataset statistics
func (s *StatisticsService) RefreshStatistics(ctx context.Context, periodType string) error {
    var stats DatasetStatistics

    // Calculate statistics based on periodType
    // ... implementation in Go service layer

    // Upsert into dataset_statistics table
    return s.repo.UpsertStatistics(ctx, stats)
}
```

---

## 3. API Endpoints & OpenAPI Specification

### 3.1 OpenAPI Documentation Strategy

The Sting9 API will be fully documented using **OpenAPI 3.0** specification with interactive **Swagger UI** for testing and exploration.

**Documentation Approach:**
- Use `swaggo/swag` for Go annotation-based OpenAPI generation
- Annotations in handler code automatically generate OpenAPI spec
- Swagger UI served at `/api/docs` endpoint
- ReDoc alternative served at `/api/redoc` for better readability
- OpenAPI JSON/YAML available at `/api/openapi.json` and `/api/openapi.yaml`

### 3.2 Core API Endpoints

**Base URL:** `https://api.sting9.org/v1`

#### Submission Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/submissions` | Submit a suspicious message | No (public) |
| POST | `/submissions/bulk` | Bulk submit messages (CSV/JSON) | Yes (Partner/Researcher) |
| GET | `/submissions/:id` | Get submission details | Yes (Researcher) |
| GET | `/submissions` | List submissions with filters | Yes (Researcher) |
| DELETE | `/submissions/:id` | Soft delete submission (GDPR) | Yes (Admin) |

#### Statistics Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/stats` | Get public dataset statistics | No |
| GET | `/stats/daily` | Daily statistics | No |
| GET | `/stats/monthly` | Monthly statistics | No |
| GET | `/stats/breakdown` | Breakdown by type/threat/country | No |

#### Export Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/export/submissions` | Export filtered submissions (CSV/JSON) | Yes (Researcher) |
| GET | `/export/ml-features` | Export ML training features | Yes (Researcher) |
| GET | `/export/urls` | Export URL dataset | Yes (Researcher) |

#### User & Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register researcher/partner account | No |
| POST | `/auth/login` | Login and get JWT token | No |
| POST | `/auth/refresh` | Refresh JWT token | Yes |
| POST | `/auth/reset-password` | Request password reset | No |
| GET | `/users/me` | Get current user profile | Yes |
| PUT | `/users/me` | Update user profile | Yes |

#### Partner Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/partners` | Register partner organization | Yes (Admin) |
| GET | `/partners/:id` | Get partner details | Yes (Partner/Admin) |
| PUT | `/partners/:id` | Update partner details | Yes (Admin) |
| GET | `/partners/:id/submissions` | Partner submission history | Yes (Partner) |

### 3.3 OpenAPI Generation with swaggo/swag

**Installation:**

```bash
go install github.com/swaggo/swag/cmd/swag@latest
```

**Example Handler with Annotations:**

```go
package handlers

import (
    "github.com/gin-gonic/gin"
    "net/http"
)

// CreateSubmission godoc
// @Summary      Submit a suspicious message
// @Description  Submit a phishing, smishing, or scam message for analysis
// @Tags         submissions
// @Accept       json
// @Produce      json
// @Param        submission body CreateSubmissionRequest true "Submission data"
// @Success      201 {object} SubmissionResponse
// @Failure      400 {object} ErrorResponse
// @Failure      500 {object} ErrorResponse
// @Router       /submissions [post]
func (h *SubmissionHandler) CreateSubmission(c *gin.Context) {
    var req CreateSubmissionRequest

    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, ErrorResponse{
            Error: "Invalid request body",
            Message: err.Error(),
        })
        return
    }

    submission, err := h.service.Create(c.Request.Context(), req)
    if err != nil {
        c.JSON(http.StatusInternalServerError, ErrorResponse{
            Error: "Failed to create submission",
            Message: err.Error(),
        })
        return
    }

    c.JSON(http.StatusCreated, SubmissionResponse{
        SubmissionID: submission.ID,
        Status: submission.ProcessingStatus,
        CreatedAt: submission.CreatedAt,
    })
}

// GetStatistics godoc
// @Summary      Get dataset statistics
// @Description  Retrieve public statistics about the Sting9 dataset
// @Tags         statistics
// @Produce      json
// @Param        period query string false "Period type" Enums(daily, weekly, monthly, all_time)
// @Success      200 {object} StatisticsResponse
// @Failure      500 {object} ErrorResponse
// @Router       /stats [get]
func (h *StatsHandler) GetStatistics(c *gin.Context) {
    period := c.DefaultQuery("period", "all_time")

    stats, err := h.service.GetStatistics(c.Request.Context(), period)
    if err != nil {
        c.JSON(http.StatusInternalServerError, ErrorResponse{
            Error: "Failed to fetch statistics",
            Message: err.Error(),
        })
        return
    }

    c.JSON(http.StatusOK, stats)
}

// ExportSubmissions godoc
// @Summary      Export submissions dataset
// @Description  Export filtered submissions in CSV or JSON format
// @Tags         export
// @Security     BearerAuth
// @Produce      json,text/csv
// @Param        format query string false "Export format" Enums(json, csv) default(json)
// @Param        threat_level query string false "Filter by threat level"
// @Param        message_type query string false "Filter by message type"
// @Param        start_date query string false "Start date (RFC3339)"
// @Param        end_date query string false "End date (RFC3339)"
// @Param        limit query int false "Maximum records" default(1000)
// @Success      200 {file} file
// @Failure      401 {object} ErrorResponse
// @Failure      403 {object} ErrorResponse
// @Failure      500 {object} ErrorResponse
// @Router       /export/submissions [get]
func (h *ExportHandler) ExportSubmissions(c *gin.Context) {
    // Implementation...
}
```

**Request/Response Models:**

```go
// CreateSubmissionRequest represents a message submission
type CreateSubmissionRequest struct {
    MessageType      string            `json:"message_type" binding:"required" example:"email"`
    SubjectText      string            `json:"subject_text,omitempty" example:"Urgent: Verify your account"`
    BodyText         string            `json:"body_text" binding:"required" example:"Dear customer, please verify..."`
    SenderEmail      string            `json:"sender_email,omitempty" example:"phisher@evil.com"`
    MessageTimestamp string            `json:"message_timestamp,omitempty" example:"2025-01-15T10:30:00Z"`
    RawHeaders       map[string]string `json:"raw_headers,omitempty"`
    Attachments      []AttachmentInfo  `json:"attachments,omitempty"`
    URLs             []string          `json:"urls,omitempty"`
} // @name CreateSubmissionRequest

// SubmissionResponse represents a submission result
type SubmissionResponse struct {
    SubmissionID     string `json:"submission_id" example:"550e8400-e29b-41d4-a716-446655440000"`
    ProcessingStatus string `json:"processing_status" example:"completed"`
    CreatedAt        string `json:"created_at" example:"2025-01-15T10:30:00Z"`
} // @name SubmissionResponse

// ErrorResponse represents an error
type ErrorResponse struct {
    Error   string `json:"error" example:"Invalid request"`
    Message string `json:"message,omitempty" example:"Field 'body_text' is required"`
} // @name ErrorResponse

// StatisticsResponse represents dataset statistics
type StatisticsResponse struct {
    TotalSubmissions     int64             `json:"total_submissions" example:"1000000"`
    TotalEmails          int64             `json:"total_emails" example:"750000"`
    TotalSMS             int64             `json:"total_sms" example:"200000"`
    TotalMessagingApps   int64             `json:"total_messaging_apps" example:"50000"`
    ThreatDistribution   map[string]int64  `json:"threat_distribution"`
    AttackTypeDistribution map[string]int64 `json:"attack_type_distribution"`
    CountryDistribution  map[string]int64  `json:"country_distribution"`
    LanguageDistribution map[string]int64  `json:"language_distribution"`
    LastUpdated          string            `json:"last_updated" example:"2025-01-15T10:30:00Z"`
} // @name StatisticsResponse
```

### 3.4 Generate OpenAPI Specification

**Generate spec from annotations:**

```bash
# Navigate to project root
cd api.sting9.org

# Generate OpenAPI spec
swag init -g cmd/api/main.go -o docs --parseDependency --parseInternal

# Output:
# - docs/docs.go (embedded spec)
# - docs/swagger.json
# - docs/swagger.yaml
```

**Main.go setup:**

```go
package main

import (
    "github.com/gin-gonic/gin"
    swaggerFiles "github.com/swaggo/files"
    ginSwagger "github.com/swaggo/gin-swagger"
    _ "api.sting9.org/docs" // Import generated docs
)

// @title           Sting9 Research Initiative API
// @version         1.0
// @description     API for submitting and accessing phishing/smishing/scam message dataset
// @termsOfService  https://sting9.org/terms

// @contact.name   Sting9 Support
// @contact.url    https://sting9.org/support
// @contact.email  api@sting9.org

// @license.name  Creative Commons CC0
// @license.url   https://creativecommons.org/publicdomain/zero/1.0/

// @host      api.sting9.org
// @BasePath  /v1

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description JWT token in format: Bearer {token}

func main() {
    r := gin.Default()

    // API routes
    v1 := r.Group("/v1")
    {
        // Submission endpoints
        submissions := v1.Group("/submissions")
        {
            submissions.POST("", submissionHandler.CreateSubmission)
            submissions.GET("/:id", authMiddleware, submissionHandler.GetSubmission)
            submissions.GET("", authMiddleware, submissionHandler.ListSubmissions)
        }

        // Statistics endpoints
        v1.GET("/stats", statsHandler.GetStatistics)

        // Export endpoints
        export := v1.Group("/export")
        export.Use(authMiddleware)
        {
            export.GET("/submissions", exportHandler.ExportSubmissions)
            export.GET("/ml-features", exportHandler.ExportMLFeatures)
        }
    }

    // Swagger UI at /api/docs
    r.GET("/api/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

    // Alternative: ReDoc UI at /api/redoc
    r.GET("/api/redoc", func(c *gin.Context) {
        c.HTML(200, "redoc.html", gin.H{
            "specURL": "/api/docs/swagger.json",
        })
    })

    // Serve OpenAPI spec directly
    r.StaticFile("/api/openapi.json", "./docs/swagger.json")
    r.StaticFile("/api/openapi.yaml", "./docs/swagger.yaml")

    r.Run(":8080")
}
```

### 3.5 Accessing API Documentation

Once deployed:

- **Swagger UI**: `https://api.sting9.org/api/docs/index.html`
- **ReDoc**: `https://api.sting9.org/api/redoc`
- **OpenAPI JSON**: `https://api.sting9.org/api/openapi.json`
- **OpenAPI YAML**: `https://api.sting9.org/api/openapi.yaml`

**Development:**
- Local Swagger UI: `http://localhost:8080/api/docs/index.html`

### 3.6 CI/CD Integration

**Automated spec generation in CI:**

```yaml
# .github/workflows/api-docs.yml
name: Generate API Documentation

on:
  push:
    branches: [main]
    paths:
      - 'api.sting9.org/**/*.go'

jobs:
  generate-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Go
        uses: actions/setup-go@v4
        with:
          go-version: '1.23'

      - name: Install swag
        run: go install github.com/swaggo/swag/cmd/swag@latest

      - name: Generate OpenAPI spec
        run: |
          cd api.sting9.org
          swag init -g cmd/api/main.go -o docs --parseDependency --parseInternal

      - name: Commit updated docs
        run: |
          git config user.name github-actions
          git config user.email github-actions@github.com
          git add api.sting9.org/docs/
          git diff --quiet && git diff --staged --quiet || git commit -m "docs: update OpenAPI specification"
          git push
```

### 3.7 Example OpenAPI Spec Output

The generated `swagger.json` will look like:

```json
{
  "swagger": "2.0",
  "info": {
    "title": "Sting9 Research Initiative API",
    "description": "API for submitting and accessing phishing/smishing/scam message dataset",
    "version": "1.0",
    "contact": {
      "name": "Sting9 Support",
      "url": "https://sting9.org/support",
      "email": "api@sting9.org"
    },
    "license": {
      "name": "Creative Commons CC0",
      "url": "https://creativecommons.org/publicdomain/zero/1.0/"
    }
  },
  "host": "api.sting9.org",
  "basePath": "/v1",
  "schemes": ["https"],
  "paths": {
    "/submissions": {
      "post": {
        "tags": ["submissions"],
        "summary": "Submit a suspicious message",
        "description": "Submit a phishing, smishing, or scam message for analysis",
        "consumes": ["application/json"],
        "produces": ["application/json"],
        "parameters": [
          {
            "in": "body",
            "name": "submission",
            "required": true,
            "schema": {
              "$ref": "#/definitions/CreateSubmissionRequest"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "Created",
            "schema": {
              "$ref": "#/definitions/SubmissionResponse"
            }
          },
          "400": {
            "description": "Bad Request",
            "schema": {
              "$ref": "#/definitions/ErrorResponse"
            }
          }
        }
      }
    }
  },
  "definitions": {
    "CreateSubmissionRequest": {
      "type": "object",
      "required": ["message_type", "body_text"],
      "properties": {
        "message_type": {
          "type": "string",
          "example": "email"
        },
        "body_text": {
          "type": "string",
          "example": "Dear customer, please verify..."
        }
      }
    }
  },
  "securityDefinitions": {
    "BearerAuth": {
      "type": "apiKey",
      "name": "Authorization",
      "in": "header",
      "description": "JWT token in format: Bearer {token}"
    }
  }
}
```

---

## 4. User Management Tables

### 4.1 Users Table

Authentication and authorization for researchers, partners, and administrators.

**SQL Schema:**

```sql
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Identity
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,  -- bcrypt or argon2
    full_name VARCHAR(255),

    -- Role-based access
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'researcher', 'partner', 'contributor')),
    organization VARCHAR(255),

    -- Account status
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token TEXT,
    email_verification_expires TIMESTAMPTZ,

    -- Password reset
    password_reset_token TEXT,
    password_reset_expires TIMESTAMPTZ,

    -- API access
    api_key_hash TEXT UNIQUE,  -- For programmatic access
    api_rate_limit INT DEFAULT 1000,  -- Requests per hour

    -- Audit
    last_login TIMESTAMPTZ,
    login_count INT DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_api_key ON users(api_key_hash);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_organization ON users(organization);
CREATE INDEX idx_users_is_active ON users(is_active) WHERE is_active = TRUE;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Field Descriptions:**

| Field | Type | Description |
|-------|------|-------------|
| `user_id` | UUID | Primary key |
| `email` | VARCHAR(255) | Unique email address (login identifier) |
| `password_hash` | TEXT | bcrypt or argon2 hashed password |
| `full_name` | VARCHAR(255) | User's full name |
| `role` | VARCHAR(20) | admin, researcher, partner, contributor |
| `organization` | VARCHAR(255) | Organization/institution name |
| `is_active` | BOOLEAN | Account active status |
| `email_verified` | BOOLEAN | Has email been verified? |
| `email_verification_token` | TEXT | Token sent in verification email |
| `email_verification_expires` | TIMESTAMPTZ | Token expiration |
| `password_reset_token` | TEXT | Token for password reset |
| `password_reset_expires` | TIMESTAMPTZ | Reset token expiration |
| `api_key_hash` | TEXT | Hashed API key for programmatic access |
| `api_rate_limit` | INT | Requests per hour allowed |
| `last_login` | TIMESTAMPTZ | Last successful login time |
| `login_count` | INT | Total number of logins |

**Role Descriptions:**

- **admin**: Full system access, can manage users and partners
- **researcher**: Can access dataset exports, API, view all submissions
- **partner**: Can submit bulk data, view own organization's submissions
- **contributor**: Can submit individual messages via web form

---

### 3.2 Partners Table

Track organizations contributing bulk data or accessing datasets.

**SQL Schema:**

```sql
CREATE TABLE partners (
    partner_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Organization details
    organization_name VARCHAR(255) NOT NULL UNIQUE,
    organization_type VARCHAR(50),  -- academic, corporate, government, ngo
    contact_email VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    website VARCHAR(500),

    -- Partnership details
    partnership_level VARCHAR(20) CHECK (partnership_level IN ('contributor', 'collaborator', 'sponsor')),
    data_sharing_agreement_signed BOOLEAN DEFAULT FALSE,
    agreement_signed_date DATE,
    agreement_document_path TEXT,

    -- Access permissions
    can_submit_bulk BOOLEAN DEFAULT FALSE,
    can_export_data BOOLEAN DEFAULT FALSE,
    export_rate_limit INT,  -- Records per day

    -- Statistics
    total_submissions INT DEFAULT 0,
    total_exports INT DEFAULT 0,

    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_partners_organization_name ON partners(organization_name);
CREATE INDEX idx_partners_is_active ON partners(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_partners_partnership_level ON partners(partnership_level);

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

### 3.3 Import Batches Table

Track bulk dataset imports for auditability and error handling.

**SQL Schema:**

```sql
CREATE TABLE import_batches (
    batch_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Source information
    partner_id UUID REFERENCES partners(partner_id),
    source_name VARCHAR(255),  -- Dataset name or source identifier
    source_description TEXT,

    -- File details
    original_filename VARCHAR(500),
    file_hash BYTEA,  -- SHA-256 of import file
    file_size_bytes BIGINT,

    -- Processing status
    import_status VARCHAR(20) DEFAULT 'pending' CHECK (import_status IN ('pending', 'processing', 'completed', 'failed', 'partial')),
    records_total INT,
    records_processed INT DEFAULT 0,
    records_failed INT DEFAULT 0,
    error_log JSONB,  -- Array of error messages

    -- Timing
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    duration_seconds INT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_import_batches_partner ON import_batches(partner_id);
CREATE INDEX idx_import_batches_status ON import_batches(import_status);
CREATE INDEX idx_import_batches_created ON import_batches(created_at);
```

**Example error_log JSONB:**

```json
[
  {
    "row": 1523,
    "error": "Invalid email format in sender field",
    "data": "malformed@@@domain.com"
  },
  {
    "row": 2041,
    "error": "Missing required field: body_text",
    "data": null
  }
]
```

---

## 4. Advanced Tables - Phase 2+

### 4.1 Attack Patterns Table

Structured classification taxonomy for attack techniques.

**SQL Schema:**

```sql
CREATE TABLE attack_patterns (
    pattern_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Pattern identification
    pattern_name VARCHAR(100) NOT NULL UNIQUE,
    pattern_category VARCHAR(50),  -- credential_theft, financial_fraud, malware_delivery, etc.

    -- Description
    description TEXT,
    indicators JSONB,  -- List of indicators that define this pattern

    -- Prevalence
    occurrence_count INT DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_attack_patterns_name ON attack_patterns(pattern_name);
CREATE INDEX idx_attack_patterns_category ON attack_patterns(pattern_category);

CREATE TRIGGER update_attack_patterns_updated_at BEFORE UPDATE ON attack_patterns
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Example indicators JSONB:**

```json
{
  "keywords": ["verify", "account", "suspended", "click here"],
  "url_patterns": ["login", "verify", "secure"],
  "sender_patterns": ["security@", "noreply@", "support@"],
  "techniques": ["urgency", "authority", "scarcity"]
}
```

---

### 4.2 Submission-Attack Patterns Junction Table

Many-to-many relationship between submissions and attack patterns.

**SQL Schema:**

```sql
CREATE TABLE submission_attack_patterns (
    submission_id UUID REFERENCES submissions(submission_id) ON DELETE CASCADE,
    pattern_id UUID REFERENCES attack_patterns(pattern_id) ON DELETE CASCADE,
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),  -- 0.00-1.00
    detected_by VARCHAR(50),  -- manual, ml_model_v1, rule_engine, etc.
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (submission_id, pattern_id)
);

CREATE INDEX idx_submission_patterns_submission ON submission_attack_patterns(submission_id);
CREATE INDEX idx_submission_patterns_pattern ON submission_attack_patterns(pattern_id);
CREATE INDEX idx_submission_patterns_confidence ON submission_attack_patterns(confidence_score);
```

---

### 4.3 Audit Log Table

Track all data access and modifications for GDPR compliance.

**SQL Schema:**

```sql
CREATE TABLE audit_log (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Who
    user_id UUID REFERENCES users(user_id),
    user_email VARCHAR(255),
    user_role VARCHAR(20),
    ip_address INET,
    user_agent TEXT,

    -- What
    action VARCHAR(50) NOT NULL,  -- view, export, update, delete, bulk_import, login, logout
    resource_type VARCHAR(50),  -- submission, user, partner, etc.
    resource_id UUID,

    -- Details
    description TEXT,
    changed_fields JSONB,  -- Before/after values
    request_params JSONB,  -- Query parameters, filters used

    -- Result
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,

    -- When
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_timestamp ON audit_log(timestamp);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_resource ON audit_log(resource_type, resource_id);
```

---

### 4.4 Anonymization Versions Table

Track evolution of PII redaction algorithms.

**SQL Schema:**

```sql
CREATE TABLE anonymization_versions (
    version_id INT PRIMARY KEY,

    -- Version details
    version_name VARCHAR(50) NOT NULL,
    description TEXT,
    algorithm_details JSONB,  -- What this version does

    -- PII patterns detected
    email_pattern TEXT,
    phone_pattern TEXT,
    ssn_pattern TEXT,
    credit_card_pattern TEXT,
    custom_patterns JSONB,

    -- Effectiveness metrics
    false_positive_rate DECIMAL(5,4),  -- Rate of incorrect redactions
    false_negative_rate DECIMAL(5,4),  -- Rate of missed PII

    is_active BOOLEAN DEFAULT TRUE,
    activated_at TIMESTAMPTZ,
    deprecated_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_anonymization_active ON anonymization_versions(is_active) WHERE is_active = TRUE;
```

---

## 5. Relationships & Entity-Relationship Diagram

### 5.1 Table Relationships

**Core Submission Flow:**
```
submissions (1) � (0..1) email_details
submissions (1) � (0..1) sms_details
submissions (1) � (0..1) messaging_app_details
submissions (1) � (0..n) attachments
submissions (n) � (m) urls [via submission_urls]
submissions (n) � (m) attack_patterns [via submission_attack_patterns]
```

**User & Partner Management:**
```
users (n) � (1) partners [via organization field]
partners (1) � (n) import_batches
partners (1) � (n) submissions [via partner_id]
import_batches (1) � (n) submissions [via import_batch_id]
```

**Advanced Relationships:**
```
submissions (n) � (1) anonymization_versions [via anonymization_version]
users (1) � (n) audit_log [via user_id]
urls (1) � (n) urls [via redirects_to_url - self-referential]
```

### 5.2 ASCII Entity-Relationship Diagram

```
                     
    submissions      �         
  (partitioned by              
   timestamp)                  
      ,                        
                                
        1:0..1                  
                   ,            <            
                                           
       �            �            �            �
                                                  
email_       sms_       messaging_    attachments 
details      details    app_details    (1:n)      
                                                  

       
        n:m
       �
                                       
submission_urls   �       �   urls     
  (junction)                           
                                       
                                    
                                     self-ref
                                     (redirects)
                                        
                                         �

                     
    partners         
                     
      ,              
        1:n
                           ,                  
                                             
       �                    �                  �
                                                
submissions        import_            users     
(partner_id)       batches         (org field)  
                                         ,      
                                              
                             1:n               1:n
                            �                  �
                                                  
                     submissions       audit_log  
                     (batch_id)                   
                                                  

                     
  attack_patterns    
                     
      ,              
        n:m
       �
                          
submission_attack_patterns
       (junction)         
                          

                      
dataset_statistics    
  (materialized view) 
                      
```

### 5.3 Foreign Key Constraints

**ON DELETE CASCADE:** (child deleted when parent deleted)
- `email_details.submission_id � submissions.submission_id`
- `sms_details.submission_id � submissions.submission_id`
- `messaging_app_details.submission_id � submissions.submission_id`
- `attachments.submission_id � submissions.submission_id`
- `submission_urls.submission_id � submissions.submission_id`
- `submission_urls.url_id � urls.url_id`
- `submission_attack_patterns.submission_id � submissions.submission_id`
- `submission_attack_patterns.pattern_id � attack_patterns.pattern_id`

**ON DELETE SET NULL:** (child remains but reference nullified)
- `submissions.partner_id � partners.partner_id` (SET NULL)
- `submissions.import_batch_id � import_batches.batch_id` (SET NULL)
- `import_batches.partner_id � partners.partner_id` (SET NULL)

**ON DELETE RESTRICT:** (prevent deletion if children exist)
- Default behavior for `users`, `partners`, `anonymization_versions`

---

## 6. Anonymization Strategy

### 6.1 Application-Layer Implementation

**Design Decision:** Anonymization handled in Go service layer BEFORE database insert.

**Rationale:**
- More flexible than SQL regex patterns
- Can integrate advanced NER libraries (spaCy, Presidio)
- Easier to unit test
- Can add custom business logic
- Better error handling and logging

### 6.2 PII Patterns to Detect

| PII Type | Pattern | Example | Anonymization Strategy |
|----------|---------|---------|------------------------|
| **Email Address** | Regex | `john.doe@example.com` | Replace with `[EMAIL]@example.com` (preserve domain) |
| **Phone Number** | Regex + libphonenumber | `+1 (555) 123-4567` | Replace with `[PHONE]` or `+1 [REDACTED]` |
| **SSN (US)** | Regex | `123-45-6789` | Replace with `[SSN]` |
| **Credit Card** | Regex + Luhn check | `4532 1234 5678 9010` | Replace with `[CREDIT_CARD]` |
| **IP Address** | Regex | `192.168.1.1` | Replace with `192.168.[REDACTED]` |
| **Person Names** | NER (spaCy) | `John Doe` | Replace with `[NAME]` |
| **Addresses** | NER (spaCy) | `123 Main St, City` | Replace with `[ADDRESS]` |
| **Organization Names** | NER (spaCy) | `Acme Corp` | Keep (useful for analysis) |

### 6.3 Go Service Architecture

**Service Structure:**

```go
package anonymizer

import (
    "context"
    "crypto/sha256"
    "encoding/hex"
    "regexp"
)

// Anonymizer handles PII detection and redaction
type Anonymizer struct {
    version int
    emailRegex *regexp.Regexp
    phoneRegex *regexp.Regexp
    ssnRegex *regexp.Regexp
    creditCardRegex *regexp.Regexp
    ipRegex *regexp.Regexp
}

// NewAnonymizer creates a new anonymizer with specified version
func NewAnonymizer(version int) *Anonymizer {
    return &Anonymizer{
        version: version,
        emailRegex: regexp.MustCompile(`\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b`),
        phoneRegex: regexp.MustCompile(`(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}`),
        ssnRegex: regexp.MustCompile(`\b\d{3}-\d{2}-\d{4}\b`),
        creditCardRegex: regexp.MustCompile(`\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b`),
        ipRegex: regexp.MustCompile(`\b(\d{1,3}\.\d{1,3})\.\d{1,3}\.\d{1,3}\b`),
    }
}

// AnonymizeText redacts PII from text content
func (a *Anonymizer) AnonymizeText(ctx context.Context, text string) (string, error) {
    result := text

    // Email: preserve domain, redact local part
    result = a.emailRegex.ReplaceAllStringFunc(result, func(email string) string {
        parts := strings.Split(email, "@")
        if len(parts) == 2 {
            return "[EMAIL]@" + parts[1]
        }
        return "[EMAIL]"
    })

    // Phone numbers
    result = a.phoneRegex.ReplaceAllString(result, "[PHONE]")

    // SSN
    result = a.ssnRegex.ReplaceAllString(result, "[SSN]")

    // Credit cards (with Luhn validation to reduce false positives)
    result = a.creditCardRegex.ReplaceAllStringFunc(result, func(cc string) string {
        if a.isValidLuhn(cc) {
            return "[CREDIT_CARD]"
        }
        return cc // Keep if not valid credit card
    })

    // IP addresses: preserve first two octets
    result = a.ipRegex.ReplaceAllString(result, "$1.[REDACTED]")

    // TODO: Add NER for names, addresses (Phase 2)

    return result, nil
}

// HashEmail creates SHA-256 hash of email for deduplication
func (a *Anonymizer) HashEmail(email string) []byte {
    hash := sha256.Sum256([]byte(email))
    return hash[:]
}

// isValidLuhn validates credit card using Luhn algorithm
func (a *Anonymizer) isValidLuhn(cc string) bool {
    // Remove spaces and hyphens
    cc = regexp.MustCompile(`[-\s]`).ReplaceAllString(cc, "")

    // Luhn algorithm implementation
    sum := 0
    alt := false
    for i := len(cc) - 1; i >= 0; i-- {
        n := int(cc[i] - '0')
        if alt {
            n *= 2
            if n > 9 {
                n -= 9
            }
        }
        sum += n
        alt = !alt
    }
    return sum%10 == 0
}
```

### 6.4 Integration with Submission Handler

```go
package handlers

import (
    "context"
    "github.com/sting9/api/internal/anonymizer"
    "github.com/sting9/api/internal/models"
)

type SubmissionHandler struct {
    anonymizer *anonymizer.Anonymizer
    repo SubmissionRepository
}

func (h *SubmissionHandler) CreateSubmission(ctx context.Context, req CreateSubmissionRequest) (*models.Submission, error) {
    // 1. Anonymize content BEFORE storing
    anonymizedSubject, err := h.anonymizer.AnonymizeText(ctx, req.SubjectText)
    if err != nil {
        return nil, err
    }

    anonymizedBody, err := h.anonymizer.AnonymizeText(ctx, req.BodyText)
    if err != nil {
        return nil, err
    }

    // 2. Extract sender domain (preserve for analysis)
    senderDomain := extractDomain(req.SenderEmail)

    // 3. Hash full sender email for deduplication
    senderHash := h.anonymizer.HashEmail(req.SenderEmail)

    // 4. Create submission with anonymized data
    submission := &models.Submission{
        MessageType: req.MessageType,
        SubmissionSource: req.Source,
        SubjectText: anonymizedSubject,
        BodyText: anonymizedBody,
        SenderDomain: senderDomain,
        SenderDomainHash: senderHash,
        AnonymizationVersion: 1,
        ProcessingStatus: "completed",
    }

    // 5. Store in database
    return h.repo.Create(ctx, submission)
}
```

### 6.5 Field-by-Field Anonymization Rules

**submissions table:**

| Field | Anonymization Rule |
|-------|-------------------|
| `subject_text` | Run through anonymizer, redact all PII |
| `body_text` | Run through anonymizer, redact all PII |
| `raw_headers` | Remove `To`, `Cc`, `Bcc` headers entirely; redact PII from other headers |
| `sender_domain` | **Preserve** (useful for threat intelligence) |
| `sender_domain_hash` | SHA-256 hash of full sender email |
| `claimed_sender_name` | Keep if generic (e.g., "PayPal Security"); redact if personal name |

**email_details table:**
- All fields safe (no PII storage)

**urls table:**
- `full_url`: Redact any email/phone in query parameters
- `domain`: **Preserve** (threat intelligence)

**attachments table:**
- `filename`: May contain personal info; sanitize but keep structure
- `sanitized_filename`: Replace personal info with placeholders

### 6.6 Testing Anonymization

**Unit Test Example:**

```go
func TestAnonymizer_EmailRedaction(t *testing.T) {
    anon := anonymizer.NewAnonymizer(1)

    input := "Please contact john.doe@example.com for support"
    expected := "Please contact [EMAIL]@example.com for support"

    result, err := anon.AnonymizeText(context.Background(), input)

    assert.NoError(t, err)
    assert.Equal(t, expected, result)
}

func TestAnonymizer_PhoneRedaction(t *testing.T) {
    anon := anonymizer.NewAnonymizer(1)

    input := "Call us at +1 (555) 123-4567 today"
    expected := "Call us at [PHONE] today"

    result, err := anon.AnonymizeText(context.Background(), input)

    assert.NoError(t, err)
    assert.Equal(t, expected, result)
}
```

### 6.7 Future Enhancements (Phase 2)

**Advanced PII Detection:**

1. **Microsoft Presidio Integration:**
```go
import "github.com/microsoft/presidio/presidio-anonymizer-go"

// Use Presidio for advanced NER-based detection
func (a *Anonymizer) AnonymizeWithPresidio(text string) string {
    // Integrate Presidio analyzer
    // Supports 50+ PII types in multiple languages
}
```

2. **spaCy NER Integration:**
```python
# Python service for advanced NER (called via gRPC)
import spacy

nlp = spacy.load("en_core_web_lg")

def anonymize_with_ner(text):
    doc = nlp(text)
    for ent in doc.ents:
        if ent.label_ in ["PERSON", "GPE", "LOC"]:
            text = text.replace(ent.text, f"[{ent.label_}]")
    return text
```

3. **Multi-Language Support:**
- Language detection (using `github.com/pemistahl/lingua-go`)
- Language-specific regex patterns
- Multilingual NER models

---

## 7. Indexing Strategy

### 7.1 Index Types and Use Cases

**B-Tree Indexes** (default):
- Equality searches: `WHERE message_type = 'email'`
- Range queries: `WHERE submission_timestamp > '2025-01-01'`
- Sorting: `ORDER BY submission_timestamp DESC`
- Foreign keys (automatic indexing recommended)

**GIN Indexes** (Generalized Inverted Index):
- Full-text search: `WHERE body_text_search @@ to_tsquery('phishing')`
- JSONB containment: `WHERE raw_headers @> '{"spf": "fail"}'`
- Array overlap: `WHERE blocklist_sources && ARRAY['google-safe-browsing']`

**Partial Indexes:**
- Filtered queries: `WHERE processing_status != 'completed'`
- Reduces index size significantly
- Faster for specific use cases

**Composite Indexes:**
- Multi-column queries: `WHERE message_type = 'email' AND submission_timestamp > ...`
- Order matters: most selective column first

### 7.2 Primary Indexes (Already Created)

See sections 2.1-2.8 for primary indexes on each table.

### 7.3 Additional Strategic Indexes

**For Dashboard Queries:**

```sql
-- Fast counting by type and date
CREATE INDEX idx_submissions_type_date ON submissions(message_type, DATE(submission_timestamp));

-- Threat level summary
CREATE INDEX idx_submissions_threat_verified ON submissions(threat_level, verified)
WHERE threat_level IN ('high', 'critical');

-- Recent submissions
CREATE INDEX idx_submissions_recent ON submissions(submission_timestamp DESC)
WHERE processing_status = 'completed';
```

**For Search Functionality:**

```sql
-- Full-text search with language support
CREATE INDEX idx_submissions_search_en ON submissions USING GIN(to_tsvector('english', body_text));
CREATE INDEX idx_submissions_search_es ON submissions USING GIN(to_tsvector('spanish', body_text));

-- JSONB header searches
CREATE INDEX idx_submissions_headers_gin ON submissions USING GIN(raw_headers);

-- Example query:
-- SELECT * FROM submissions WHERE raw_headers @> '{"authentication_results": {"spf": "fail"}}';
```

**For URL Analysis:**

```sql
-- Find all submissions with specific domain
CREATE INDEX idx_urls_submissions ON submission_urls(url_id)
INCLUDE (submission_id, url_position);

-- Threat intelligence lookups
CREATE INDEX idx_urls_threat_domain ON urls(threat_status, domain)
WHERE threat_status IN ('suspicious', 'malicious');
```

### 7.4 Index Maintenance

**Monitor Index Usage:**

```sql
-- Find unused indexes
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan AS scans,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND indexname NOT LIKE '%_pkey'
ORDER BY pg_relation_size(indexrelid) DESC;
```

**Regular Maintenance (Cron Job):**

```sql
-- Rebuild indexes concurrently (no downtime)
REINDEX INDEX CONCURRENTLY idx_submissions_body_search;

-- Update statistics
ANALYZE submissions;

-- Vacuum to reclaim space
VACUUM ANALYZE submissions;
```

**Bloat Detection:**

```sql
-- Check index bloat
SELECT
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch,
    pg_size_pretty(pg_relation_size(indexrelid) - pg_relation_size(tablename::regclass)) AS bloat
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;
```

### 7.5 Index Size Estimates

For 50M submissions:

| Index | Estimated Size |
|-------|----------------|
| Primary keys (UUID) | ~2 GB |
| Foreign keys | ~1 GB |
| Timestamp indexes | ~3 GB |
| Full-text search (GIN) | ~15 GB |
| JSONB indexes | ~5 GB |
| Partial indexes | ~2 GB |
| **Total** | **~28 GB** |

**Rule of Thumb:** Indexes typically consume 30-50% of table size.

---

## 8. Future Scaling: Partitioning Strategy

**Current Status:** Based on current volume projections, partitioning is **not implemented** in the initial schema. The database will use standard tables for simplicity and ease of development.

**When to Consider Partitioning:**

Implement partitioning when any of these conditions are met:
- `submissions` table exceeds **10M rows** or **100 GB** in size
- Query performance degrades noticeably (dashboard queries > 500ms)
- Regular data archival/purging becomes operationally necessary
- Backup/restore operations take > 30 minutes

### 8.1 Benefits of Future Partitioning

**Performance Benefits:**
- **Query Performance:** Partition pruning excludes irrelevant data
- **Maintenance:** Easier to drop old partitions than DELETE rows
- **Parallel Queries:** PostgreSQL can query partitions in parallel
- **Index Size:** Smaller partition indexes are faster
- **Backup/Restore:** Can backup recent partitions more frequently

**Recommended Partitioning Strategy (When Needed):**
- **Partition Key:** `submission_timestamp` (time-series data)
- **Partition Type:** Range partitioning
- **Partition Size:** Monthly partitions (balance between too many/too few)
- **Retention:** Archive partitions older than 2 years to cold storage

### 8.2 Migration Path to Partitioning

When the decision is made to implement partitioning, follow this migration strategy:

**Step 1: Create Partitioned Table**

```sql
-- Rename existing table
ALTER TABLE submissions RENAME TO submissions_old;

-- Create new partitioned table
CREATE TABLE submissions (
    -- Same schema as submissions_old
    ...
) PARTITION BY RANGE (submission_timestamp);

-- Create partitions for historical data
CREATE TABLE submissions_2024 PARTITION OF submissions
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE submissions_2025_01 PARTITION OF submissions
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- Create monthly partitions going forward
-- ...
```

**Step 2: Migrate Data**

```sql
-- Copy data from old table to partitioned table
INSERT INTO submissions SELECT * FROM submissions_old;

-- Verify row counts match
SELECT COUNT(*) FROM submissions;
SELECT COUNT(*) FROM submissions_old;
```

**Step 3: Update Dependencies**

```sql
-- Recreate indexes (they don't transfer automatically)
CREATE INDEX idx_submissions_message_type ON submissions(message_type);
-- ...

-- Update foreign keys
ALTER TABLE email_details DROP CONSTRAINT email_details_submission_id_fkey;
ALTER TABLE email_details ADD CONSTRAINT email_details_submission_id_fkey
    FOREIGN KEY (submission_id) REFERENCES submissions(submission_id) ON DELETE CASCADE;
```

**Step 4: Cutover**

```sql
-- After verification, drop old table
DROP TABLE submissions_old;
```

### 8.3 Data Retention Without Partitioning

For current non-partitioned schema, use deletion with archival:

```sql
-- Archive old data to CSV before deletion
COPY (
    SELECT * FROM submissions
    WHERE submission_timestamp < NOW() - INTERVAL '2 years'
) TO '/archive/submissions_archive_2023.csv' WITH CSV HEADER;

-- Upload to S3
-- aws s3 cp /archive/submissions_archive_2023.csv s3://sting9-archive/

-- Delete old data
DELETE FROM submissions
WHERE submission_timestamp < NOW() - INTERVAL '2 years';

-- Vacuum to reclaim space
VACUUM FULL submissions;
```

### 8.4 Monitoring Table Growth

Monitor table size to determine when partitioning is needed:

```sql
-- Check submissions table size
SELECT
    pg_size_pretty(pg_total_relation_size('submissions')) AS total_size,
    pg_size_pretty(pg_relation_size('submissions')) AS table_size,
    pg_size_pretty(pg_indexes_size('submissions')) AS indexes_size,
    (SELECT COUNT(*) FROM submissions) AS row_count;

-- Track growth over time
CREATE TABLE table_size_history (
    table_name VARCHAR(50),
    total_size_bytes BIGINT,
    row_count BIGINT,
    measured_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert size snapshot (run weekly)
INSERT INTO table_size_history (table_name, total_size_bytes, row_count)
SELECT
    'submissions',
    pg_total_relation_size('submissions'),
    COUNT(*)
FROM submissions;
```

---

## 9. Query Patterns & Optimization

### 9.1 Common Query Patterns

**Dashboard Statistics (Fast):**

```sql
-- Use pre-computed statistics table
SELECT
    total_submissions,
    total_emails,
    total_sms,
    threat_distribution,
    attack_type_distribution
FROM dataset_statistics
WHERE period_type = 'all_time'
ORDER BY last_calculated DESC
LIMIT 1;

-- Performance: < 1ms (single row lookup)
```

**Recent Submissions (Paginated):**

```sql
-- With timestamp filter and index
SELECT
    submission_id,
    message_type,
    threat_level,
    subject_text,
    submission_timestamp
FROM submissions
WHERE submission_timestamp >= NOW() - INTERVAL '7 days'
  AND processing_status = 'completed'
ORDER BY submission_timestamp DESC
LIMIT 50 OFFSET 0;

-- Performance: < 50ms (index scan)
-- Uses: idx_submissions_submission_timestamp
```

**Full-Text Search:**

```sql
-- Search for "paypal" and "verify" in message body
SELECT
    submission_id,
    subject_text,
    ts_headline('english', body_text, q) AS snippet,
    ts_rank(body_text_search, q) AS rank
FROM submissions, to_tsquery('english', 'paypal & verify') q
WHERE body_text_search @@ q
  AND submission_timestamp >= '2024-01-01'
ORDER BY rank DESC
LIMIT 100;

-- Performance: < 200ms (GIN index scan)
-- Uses: idx_submissions_body_search
```

**Filter by Threat Level and Time:**

```sql
-- High-threat submissions in January 2025
SELECT
    submission_id,
    message_type,
    attack_type,
    subject_text,
    confidence_score
FROM submissions
WHERE threat_level IN ('high', 'critical')
  AND submission_timestamp BETWEEN '2025-01-01' AND '2025-02-01'
  AND verified = TRUE
ORDER BY submission_timestamp DESC;

-- Performance: < 100ms (composite index + partial index)
-- Uses: idx_submissions_threat_time
```

**Domain Analysis:**

```sql
-- Find all submissions from a specific domain
SELECT
    s.submission_id,
    s.subject_text,
    s.threat_level,
    s.submission_timestamp,
    COUNT(su.url_id) AS url_count
FROM submissions s
LEFT JOIN submission_urls su ON s.submission_id = su.submission_id
WHERE s.sender_domain = 'evil.com'
  AND s.submission_timestamp >= '2024-01-01'
GROUP BY s.submission_id
ORDER BY s.submission_timestamp DESC;

-- Performance: < 150ms (index scan on sender_domain)
-- Uses: idx_submissions_sender_domain
```

**URL Threat Intelligence:**

```sql
-- Find all malicious URLs submitted in past 30 days
SELECT
    u.domain,
    u.full_url,
    u.threat_status,
    u.blocklist_sources,
    COUNT(DISTINCT su.submission_id) AS submission_count,
    MAX(s.submission_timestamp) AS last_seen
FROM urls u
JOIN submission_urls su ON u.url_id = su.url_id
JOIN submissions s ON su.submission_id = s.submission_id
WHERE u.threat_status = 'malicious'
  AND s.submission_timestamp >= NOW() - INTERVAL '30 days'
GROUP BY u.url_id, u.domain, u.full_url, u.threat_status, u.blocklist_sources
ORDER BY submission_count DESC
LIMIT 100;

-- Performance: < 300ms (multiple index scans)
-- Uses: idx_urls_threat_status, idx_submission_urls_url, idx_submissions_submission_timestamp
```

**Attachment Analysis:**

```sql
-- Find executable attachments in phishing emails
SELECT
    s.submission_id,
    s.subject_text,
    a.filename,
    a.mime_type,
    a.malware_scan_result,
    a.malware_family
FROM submissions s
JOIN attachments a ON s.submission_id = a.submission_id
WHERE a.is_executable = TRUE
  AND s.message_type = 'email'
  AND s.threat_level IN ('high', 'critical')
  AND s.submission_timestamp >= '2025-01-01'
ORDER BY s.submission_timestamp DESC;

-- Performance: < 200ms (partial index on is_executable)
-- Uses: idx_attachments_is_executable, idx_submissions_type_time
```

### 9.2 Query Optimization Techniques

**1. EXPLAIN ANALYZE:**

```sql
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT * FROM submissions
WHERE message_type = 'email'
  AND submission_timestamp >= '2025-01-01'
LIMIT 100;

-- Analyze output:
-- - Seq Scan vs Index Scan
-- - Partition pruning
-- - Buffer hits (cache efficiency)
-- - Execution time
```

**2. Use Prepared Statements:**

```go
// In Go with pgx
func (r *SubmissionRepository) FindByType(ctx context.Context, msgType string, limit int) ([]*Submission, error) {
    // Prepared statement cached by pgx
    query := `
        SELECT submission_id, message_type, subject_text, submission_timestamp
        FROM submissions
        WHERE message_type = $1
          AND submission_timestamp >= NOW() - INTERVAL '30 days'
        ORDER BY submission_timestamp DESC
        LIMIT $2
    `

    rows, err := r.db.Query(ctx, query, msgType, limit)
    // ...
}
```

**3. Connection Pooling:**

```go
// Configure pgx connection pool
config, _ := pgxpool.ParseConfig("postgres://user:pass@localhost:5432/sting9")
config.MaxConns = 25
config.MinConns = 5
config.MaxConnLifetime = time.Hour
config.MaxConnIdleTime = 30 * time.Minute

pool, _ := pgxpool.NewWithConfig(context.Background(), config)
```

**4. Avoid N+1 Queries:**

```go
// Bad: N+1 query problem
for _, submission := range submissions {
    urls, _ := r.GetURLsForSubmission(ctx, submission.ID) // N queries
}

// Good: Join or batch query
query := `
    SELECT s.submission_id, s.subject_text, u.url_id, u.full_url
    FROM submissions s
    LEFT JOIN submission_urls su ON s.submission_id = su.submission_id
    LEFT JOIN urls u ON su.url_id = u.url_id
    WHERE s.submission_id = ANY($1)
`
rows, _ := r.db.Query(ctx, query, pgx.QueryResultFormats{pgx.BinaryFormatCode}, submissionIDs)
```

### 9.3 Performance Monitoring

**Slow Query Log:**

```sql
-- Enable slow query logging (postgresql.conf)
-- log_min_duration_statement = 1000  # Log queries > 1 second

-- View slow queries
SELECT
    query,
    calls,
    total_time,
    mean_time,
    max_time,
    stddev_time
FROM pg_stat_statements
WHERE mean_time > 100  -- Queries averaging > 100ms
ORDER BY total_time DESC
LIMIT 20;
```

**Cache Hit Ratio:**

```sql
-- Should be > 99%
SELECT
    sum(heap_blks_read) AS heap_read,
    sum(heap_blks_hit) AS heap_hit,
    (sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read))::FLOAT * 100) AS cache_hit_ratio
FROM pg_statio_user_tables;
```

**Active Connections:**

```sql
SELECT
    count(*) FILTER (WHERE state = 'active') AS active,
    count(*) FILTER (WHERE state = 'idle') AS idle,
    count(*) FILTER (WHERE state = 'idle in transaction') AS idle_in_transaction,
    count(*) AS total
FROM pg_stat_activity
WHERE datname = 'sting9';
```

---

## 10. ML Training Data Structure

### 10.1 Feature Extraction Materialized View

Create a view optimized for ML model training with pre-extracted features.

**SQL Schema:**

```sql
CREATE MATERIALIZED VIEW ml_training_features AS
SELECT
    -- Identifiers
    s.submission_id,
    s.message_type,

    -- Labels (target variables)
    s.threat_level,
    s.attack_type,
    (s.threat_level IN ('high', 'critical'))::INT AS is_malicious,
    s.verified::INT AS is_verified,

    -- Text features
    s.body_text,
    s.subject_text,
    LENGTH(s.body_text) AS body_length,
    LENGTH(s.subject_text) AS subject_length,
    LENGTH(s.body_text) / NULLIF(LENGTH(s.subject_text), 0) AS body_to_subject_ratio,

    -- Email-specific features
    e.spf_result,
    e.dkim_result,
    e.dmarc_result,
    CASE WHEN e.spf_result = 'fail' THEN 1 ELSE 0 END AS spf_failed,
    CASE WHEN e.dkim_result = 'fail' THEN 1 ELSE 0 END AS dkim_failed,
    CASE WHEN e.dmarc_result = 'fail' THEN 1 ELSE 0 END AS dmarc_failed,
    e.uses_url_shorteners::INT,
    e.uses_homoglyphs::INT,
    e.external_image_count,
    e.html_to_text_ratio,
    e.form_count,
    e.script_count,

    -- SMS-specific features
    sm.message_length,
    sm.is_multipart::INT,
    sm.contains_url::INT AS sms_contains_url,
    sm.urgency_keywords::INT,

    -- URL features
    (SELECT COUNT(*) FROM submission_urls su WHERE su.submission_id = s.submission_id) AS url_count,
    (SELECT COUNT(*)
     FROM submission_urls su
     JOIN urls u ON su.url_id = u.url_id
     WHERE su.submission_id = s.submission_id AND u.is_shortened = TRUE) AS shortened_url_count,
    (SELECT COUNT(*)
     FROM submission_urls su
     JOIN urls u ON su.url_id = u.url_id
     WHERE su.submission_id = s.submission_id AND u.uses_https = FALSE) AS http_url_count,
    (SELECT COUNT(*)
     FROM submission_urls su
     JOIN urls u ON su.url_id = u.url_id
     WHERE su.submission_id = s.submission_id AND u.uses_ip_address = TRUE) AS ip_url_count,
    (SELECT COUNT(*)
     FROM submission_urls su
     JOIN urls u ON su.url_id = u.url_id
     WHERE su.submission_id = s.submission_id AND u.threat_status = 'malicious') AS malicious_url_count,

    -- Attachment features
    (SELECT COUNT(*) FROM attachments a WHERE a.submission_id = s.submission_id) AS attachment_count,
    (SELECT COUNT(*) FROM attachments a WHERE a.submission_id = s.submission_id AND a.is_executable = TRUE) AS executable_attachment_count,
    (SELECT COUNT(*) FROM attachments a WHERE a.submission_id = s.submission_id AND a.extension_mismatch = TRUE) AS mismatch_attachment_count,

    -- Temporal features
    EXTRACT(HOUR FROM s.message_timestamp) AS hour_of_day,
    EXTRACT(DOW FROM s.message_timestamp) AS day_of_week,
    EXTRACT(MONTH FROM s.message_timestamp) AS month,

    -- Sender features
    s.sender_domain,
    LENGTH(s.sender_domain) AS sender_domain_length,
    (s.sender_domain ~ '\d+\.\d+\.\d+\.\d+')::INT AS sender_is_ip,
    (s.sender_domain ~ '\.(tk|ml|ga|cf|gq)$')::INT AS sender_suspicious_tld,

    -- Language
    s.detected_language,
    s.detected_country,

    -- Quality indicators
    s.confidence_score,

    -- Timestamps
    s.message_timestamp,
    s.submission_timestamp

FROM submissions s
LEFT JOIN email_details e ON s.submission_id = e.submission_id
LEFT JOIN sms_details sm ON s.submission_id = sm.submission_id
WHERE s.processing_status = 'completed'
  AND s.deleted_at IS NULL;

-- Indexes for fast refresh and queries
CREATE INDEX idx_ml_features_threat ON ml_training_features(threat_level);
CREATE INDEX idx_ml_features_malicious ON ml_training_features(is_malicious);
CREATE INDEX idx_ml_features_verified ON ml_training_features(is_verified);
CREATE INDEX idx_ml_features_message_type ON ml_training_features(message_type);

-- Refresh concurrently (non-blocking)
REFRESH MATERIALIZED VIEW CONCURRENTLY ml_training_features;
```

### 10.2 Export for ML Training

**Balanced Dataset Export:**

```sql
-- Export balanced dataset: 50k malicious, 50k benign
COPY (
    (SELECT * FROM ml_training_features WHERE is_malicious = 1 ORDER BY RANDOM() LIMIT 50000)
    UNION ALL
    (SELECT * FROM ml_training_features WHERE is_malicious = 0 ORDER BY RANDOM() LIMIT 50000)
) TO '/exports/balanced_training_set.csv' WITH CSV HEADER;
```

**Stratified by Attack Type:**

```sql
-- Export 10k samples per attack type
WITH ranked AS (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY attack_type ORDER BY RANDOM()) AS rn
    FROM ml_training_features
    WHERE attack_type IS NOT NULL AND is_verified = 1
)
SELECT * FROM ranked WHERE rn <= 10000;
```

**Time-Based Split (Train/Test):**

```sql
-- Training set: Jan-Oct 2025
COPY (
    SELECT * FROM ml_training_features
    WHERE message_timestamp BETWEEN '2025-01-01' AND '2025-10-31'
) TO '/exports/train_set.csv' WITH CSV HEADER;

-- Test set: Nov-Dec 2025
COPY (
    SELECT * FROM ml_training_features
    WHERE message_timestamp BETWEEN '2025-11-01' AND '2025-12-31'
) TO '/exports/test_set.csv' WITH CSV HEADER;
```

### 10.3 Feature Engineering Examples

**Text Features (TF-IDF Keywords):**

```sql
-- Extract top phishing keywords
SELECT
    word,
    COUNT(*) AS frequency,
    AVG(CASE WHEN threat_level IN ('high', 'critical') THEN 1.0 ELSE 0.0 END) AS malicious_rate
FROM (
    SELECT unnest(string_to_array(lower(body_text), ' ')) AS word
    FROM ml_training_features
) t
WHERE LENGTH(word) > 3
GROUP BY word
HAVING COUNT(*) > 100
ORDER BY malicious_rate DESC, frequency DESC
LIMIT 100;

-- Top keywords: verify, urgent, account, suspended, click, confirm, security, etc.
```

**URL Features:**

```sql
-- URL patterns in malicious vs benign
SELECT
    u.tld,
    COUNT(*) AS count,
    AVG(CASE WHEN s.threat_level IN ('high', 'critical') THEN 1.0 ELSE 0.0 END) AS malicious_rate
FROM urls u
JOIN submission_urls su ON u.url_id = su.url_id
JOIN submissions s ON su.submission_id = s.submission_id
GROUP BY u.tld
HAVING COUNT(*) > 50
ORDER BY malicious_rate DESC;

-- Suspicious TLDs: .tk, .ml, .ga have high malicious rates
```

### 10.4 Refresh Strategy

**Daily Refresh (Cron):**

```bash
#!/bin/bash
# /etc/cron.daily/refresh-ml-features.sh

psql -U sting9_user -d sting9 <<EOF
-- Refresh ML training view
REFRESH MATERIALIZED VIEW CONCURRENTLY ml_training_features;

-- Log refresh
INSERT INTO audit_log (action, description, timestamp)
VALUES ('refresh_ml_view', 'Refreshed ml_training_features materialized view', NOW());
EOF
```

**Incremental Updates (Advanced):**

Instead of full refresh, maintain an incremental table:

```sql
CREATE TABLE ml_training_features_incremental AS
SELECT * FROM ml_training_features WHERE FALSE;

-- Insert only new submissions
INSERT INTO ml_training_features_incremental
SELECT * FROM ml_training_features
WHERE submission_id > (SELECT MAX(submission_id) FROM ml_training_features_incremental);
```

---

## 11. Migration Strategy

### 11.1 golang-migrate Setup

**Installation:**

```bash
# Install golang-migrate
go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

# Verify
migrate -version
```

**Directory Structure:**

```
api.sting9.org/
   db/
      migrations/
         000001_create_core_tables.up.sql
         000001_create_core_tables.down.sql
         000002_create_user_tables.up.sql
         000002_create_user_tables.down.sql
         000003_create_advanced_tables.up.sql
         000003_create_advanced_tables.down.sql
         ...
      queries/  # sqlc queries
   ...
```

### 11.2 Migration Files

**Create Migration:**

```bash
# Create new migration
cd api.sting9.org
migrate create -ext sql -dir db/migrations -seq create_core_tables

# Generates:
# 000001_create_core_tables.up.sql
# 000001_create_core_tables.down.sql
```

**Migration 001: Core Tables (Up)**

`db/migrations/000001_create_core_tables.up.sql`:

```sql
BEGIN;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create submissions table (partitioned)
CREATE TABLE submissions (
    submission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('email', 'sms', 'whatsapp', 'telegram', 'signal', 'other')),
    threat_level VARCHAR(20) CHECK (threat_level IN ('low', 'medium', 'high', 'critical', 'unknown')),
    attack_type VARCHAR(50),
    submission_source VARCHAR(30) NOT NULL CHECK (submission_source IN ('web_form', 'email_forward', 'api', 'bulk_import', 'partner')),
    partner_id UUID,
    import_batch_id UUID,
    subject_text TEXT,
    body_text TEXT NOT NULL,
    body_text_search TSVECTOR,
    raw_headers JSONB,
    detected_language VARCHAR(10),
    detected_country VARCHAR(2),
    sender_domain VARCHAR(255),
    sender_domain_hash BYTEA,
    claimed_sender_name VARCHAR(255),
    message_timestamp TIMESTAMPTZ,
    submission_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processing_status VARCHAR(20) DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    anonymization_version INT NOT NULL DEFAULT 1,
    classification_version INT NOT NULL DEFAULT 1,
    verified BOOLEAN DEFAULT FALSE,
    verification_source VARCHAR(50),
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_submissions_message_type ON submissions(message_type);
CREATE INDEX idx_submissions_submission_timestamp ON submissions(submission_timestamp);
CREATE INDEX idx_submissions_threat_level ON submissions(threat_level) WHERE threat_level IS NOT NULL;
CREATE INDEX idx_submissions_body_search ON submissions USING GIN(body_text_search);

-- Triggers
CREATE TRIGGER tsvector_update BEFORE INSERT OR UPDATE ON submissions
FOR EACH ROW EXECUTE FUNCTION tsvector_update_trigger(body_text_search, 'pg_catalog.english', subject_text, body_text);

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create email_details table
CREATE TABLE email_details (
    email_detail_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL UNIQUE REFERENCES submissions(submission_id) ON DELETE CASCADE,
    received_hops INT,
    spf_result VARCHAR(20),
    dkim_result VARCHAR(20),
    dmarc_result VARCHAR(20),
    has_html_content BOOLEAN DEFAULT FALSE,
    has_plain_text BOOLEAN DEFAULT FALSE,
    html_to_text_ratio DECIMAL(5,2),
    uses_url_shorteners BOOLEAN DEFAULT FALSE,
    uses_homoglyphs BOOLEAN DEFAULT FALSE,
    mime_type VARCHAR(100),
    multipart_structure JSONB,
    external_image_count INT DEFAULT 0,
    form_count INT DEFAULT 0,
    script_count INT DEFAULT 0,
    is_reply BOOLEAN DEFAULT FALSE,
    is_forward BOOLEAN DEFAULT FALSE,
    in_reply_to_hash BYTEA,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_email_details_submission ON email_details(submission_id);

-- Create sms_details table
CREATE TABLE sms_details (
    sms_detail_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL UNIQUE REFERENCES submissions(submission_id) ON DELETE CASCADE,
    message_length INT,
    is_multipart BOOLEAN DEFAULT FALSE,
    part_number INT,
    total_parts INT,
    sender_type VARCHAR(20) CHECK (sender_type IN ('shortcode', 'longcode', 'alphanumeric', 'unknown')),
    sender_country_code VARCHAR(5),
    contains_url BOOLEAN DEFAULT FALSE,
    contains_phone BOOLEAN DEFAULT FALSE,
    contains_reply_code BOOLEAN DEFAULT FALSE,
    urgency_keywords BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sms_details_submission ON sms_details(submission_id);

-- Create messaging_app_details table
CREATE TABLE messaging_app_details (
    messaging_detail_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL UNIQUE REFERENCES submissions(submission_id) ON DELETE CASCADE,
    platform VARCHAR(30) NOT NULL,
    is_group_message BOOLEAN DEFAULT FALSE,
    group_size INT,
    is_broadcast BOOLEAN DEFAULT FALSE,
    has_image BOOLEAN DEFAULT FALSE,
    has_video BOOLEAN DEFAULT FALSE,
    has_audio BOOLEAN DEFAULT FALSE,
    has_document BOOLEAN DEFAULT FALSE,
    forward_count INT DEFAULT 0,
    sender_account_age_days INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messaging_details_submission ON messaging_app_details(submission_id);

-- Create urls table
CREATE TABLE urls (
    url_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_url TEXT NOT NULL,
    url_hash BYTEA NOT NULL UNIQUE,
    normalized_url TEXT,
    scheme VARCHAR(20),
    domain VARCHAR(255) NOT NULL,
    domain_hash BYTEA,
    path TEXT,
    query_params JSONB,
    fragment TEXT,
    tld VARCHAR(50),
    domain_age_days INT,
    is_suspicious_tld BOOLEAN DEFAULT FALSE,
    is_shortened BOOLEAN DEFAULT FALSE,
    shortener_service VARCHAR(50),
    uses_ip_address BOOLEAN DEFAULT FALSE,
    has_port BOOLEAN DEFAULT FALSE,
    port_number INT,
    uses_https BOOLEAN DEFAULT FALSE,
    redirects_to_url UUID REFERENCES urls(url_id),
    redirect_chain JSONB,
    threat_status VARCHAR(20) DEFAULT 'unknown' CHECK (threat_status IN ('safe', 'suspicious', 'malicious', 'unknown')),
    blocklist_sources TEXT[],
    occurrence_count INT DEFAULT 1,
    first_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_urls_hash ON urls(url_hash);
CREATE INDEX idx_urls_domain ON urls(domain);
CREATE TRIGGER update_urls_updated_at BEFORE UPDATE ON urls FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create submission_urls junction table
CREATE TABLE submission_urls (
    submission_id UUID REFERENCES submissions(submission_id) ON DELETE CASCADE,
    url_id UUID REFERENCES urls(url_id) ON DELETE CASCADE,
    url_position INT,
    anchor_text TEXT,
    is_hidden BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (submission_id, url_id)
);

CREATE INDEX idx_submission_urls_submission ON submission_urls(submission_id);
CREATE INDEX idx_submission_urls_url ON submission_urls(url_id);

-- Create attachments table
CREATE TABLE attachments (
    attachment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES submissions(submission_id) ON DELETE CASCADE,
    filename VARCHAR(500),
    sanitized_filename VARCHAR(500),
    file_hash BYTEA UNIQUE,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    declared_extension VARCHAR(20),
    actual_extension VARCHAR(20),
    extension_mismatch BOOLEAN DEFAULT FALSE,
    is_executable BOOLEAN DEFAULT FALSE,
    is_archive BOOLEAN DEFAULT FALSE,
    is_encrypted BOOLEAN DEFAULT FALSE,
    has_macros BOOLEAN DEFAULT FALSE,
    malware_scan_result VARCHAR(20) CHECK (malware_scan_result IN ('clean', 'suspicious', 'malicious', 'unknown')),
    malware_family VARCHAR(100),
    scan_timestamp TIMESTAMPTZ,
    contains_files INT,
    nested_files JSONB,
    occurrence_count INT DEFAULT 1,
    first_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_attachments_submission ON attachments(submission_id);

-- Create dataset_statistics table
CREATE TABLE dataset_statistics (
    statistic_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_type VARCHAR(20) CHECK (period_type IN ('daily', 'weekly', 'monthly', 'yearly', 'all_time')),
    period_start DATE,
    period_end DATE,
    total_submissions BIGINT,
    total_emails BIGINT,
    total_sms BIGINT,
    total_messaging_apps BIGINT,
    threat_distribution JSONB,
    attack_type_distribution JSONB,
    country_distribution JSONB,
    language_distribution JSONB,
    source_distribution JSONB,
    unique_domains INT,
    unique_urls INT,
    unique_attachments INT,
    verified_submissions INT,
    average_confidence_score DECIMAL(3,2),
    last_calculated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_statistics_period ON dataset_statistics(period_type, period_start);

COMMIT;
```

**Migration 001: Core Tables (Down)**

`db/migrations/000001_create_core_tables.down.sql`:

```sql
BEGIN;

DROP TABLE IF EXISTS dataset_statistics CASCADE;
DROP TABLE IF EXISTS attachments CASCADE;
DROP TABLE IF EXISTS submission_urls CASCADE;
DROP TABLE IF EXISTS urls CASCADE;
DROP TABLE IF EXISTS messaging_app_details CASCADE;
DROP TABLE IF EXISTS sms_details CASCADE;
DROP TABLE IF EXISTS email_details CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

COMMIT;
```

### 11.3 Running Migrations

**Up Migration:**

```bash
# Set database connection
export DATABASE_URL="postgresql://sting9_user:password@localhost:5432/sting9?sslmode=disable"

# Run all migrations
migrate -path db/migrations -database "$DATABASE_URL" up

# Run specific number of migrations
migrate -path db/migrations -database "$DATABASE_URL" up 1

# Check version
migrate -path db/migrations -database "$DATABASE_URL" version
```

**Down Migration:**

```bash
# Rollback last migration
migrate -path db/migrations -database "$DATABASE_URL" down 1

# Rollback all migrations (DANGER!)
migrate -path db/migrations -database "$DATABASE_URL" down
```

**Force Version (Recovery):**

```bash
# If migration fails mid-way, force version
migrate -path db/migrations -database "$DATABASE_URL" force 1
```

### 11.4 Zero-Downtime Schema Changes

**Adding a Column:**

```sql
-- Step 1: Add column with default (non-blocking)
ALTER TABLE submissions ADD COLUMN new_field VARCHAR(50) DEFAULT 'default_value';

-- Step 2: Backfill data in batches
DO $$
DECLARE
    batch_size INT := 10000;
    affected INT;
BEGIN
    LOOP
        UPDATE submissions
        SET new_field = 'computed_value'
        WHERE new_field = 'default_value'
          AND submission_id IN (
              SELECT submission_id FROM submissions
              WHERE new_field = 'default_value'
              LIMIT batch_size
          );

        GET DIAGNOSTICS affected = ROW_COUNT;
        EXIT WHEN affected = 0;

        -- Sleep to avoid overloading database
        PERFORM pg_sleep(1);
    END LOOP;
END $$;

-- Step 3: Add constraints (after backfill complete)
ALTER TABLE submissions ALTER COLUMN new_field SET NOT NULL;
```

**Creating Index Concurrently:**

```sql
-- Non-blocking index creation
CREATE INDEX CONCURRENTLY idx_submissions_new_field ON submissions(new_field);

-- If fails, drop and retry
DROP INDEX CONCURRENTLY IF EXISTS idx_submissions_new_field;
```

---

## 12. Bulk Import Support

### 12.1 CSV Import Format

**Standard CSV Structure:**

```csv
message_type,submission_source,subject_text,body_text,message_timestamp,sender_domain,detected_language,threat_level,attack_type
email,bulk_import,"Urgent: Verify your account","Dear customer, please verify...","2025-01-15 10:30:00",evil.com,en,high,phishing
sms,bulk_import,,"Your package delivery failed. Click here...","2025-01-15 11:45:00",,en,medium,smishing
```

### 12.2 PostgreSQL COPY Performance

**Preparation for Large Import:**

```sql
BEGIN;

-- Disable triggers temporarily (if safe)
ALTER TABLE submissions DISABLE TRIGGER anonymize_before_insert;

-- Drop indexes (rebuild after import)
DROP INDEX IF EXISTS idx_submissions_message_type;
DROP INDEX IF EXISTS idx_submissions_body_search;

-- Increase work memory
SET maintenance_work_mem = '2GB';
SET max_wal_size = '4GB';

-- Optionally make table unlogged (lose durability for speed)
-- ALTER TABLE submissions SET UNLOGGED;
```

**Import:**

```sql
COPY submissions (
    message_type,
    submission_source,
    subject_text,
    body_text,
    message_timestamp,
    sender_domain,
    detected_language,
    threat_level,
    attack_type
)
FROM '/path/to/import.csv'
WITH (
    FORMAT CSV,
    HEADER TRUE,
    DELIMITER ',',
    QUOTE '"',
    ESCAPE '\',
    NULL 'NULL',
    ENCODING 'UTF8'
);
```

**Post-Import:**

```sql
-- Re-enable logged mode
-- ALTER TABLE submissions SET LOGGED;

-- Recreate indexes
CREATE INDEX idx_submissions_message_type ON submissions(message_type);
CREATE INDEX idx_submissions_body_search ON submissions USING GIN(body_text_search);

-- Re-enable triggers
ALTER TABLE submissions ENABLE TRIGGER anonymize_before_insert;

-- Update statistics
ANALYZE submissions;

COMMIT;
```

**Performance:** Can import 1M rows in 5-10 seconds on modern hardware.

### 12.3 Go Bulk Import Service

```go
package handlers

import (
    "context"
    "encoding/csv"
    "io"
    "github.com/google/uuid"
    "github.com/jackc/pgx/v5/pgxpool"
)

type BulkImportService struct {
    db *pgxpool.Pool
    anonymizer *anonymizer.Anonymizer
}

func (s *BulkImportService) ImportCSV(ctx context.Context, csvPath string, batchID uuid.UUID) error {
    // 1. Create import batch record
    batch := &ImportBatch{
        BatchID: batchID,
        Status: "processing",
        StartedAt: time.Now(),
    }
    if err := s.createImportBatch(ctx, batch); err != nil {
        return err
    }

    // 2. Open CSV file
    file, err := os.Open(csvPath)
    if err != nil {
        return err
    }
    defer file.Close()

    reader := csv.NewReader(file)

    // 3. Begin transaction
    tx, err := s.db.Begin(ctx)
    if err != nil {
        return err
    }
    defer tx.Rollback(ctx)

    // 4. Use COPY protocol for bulk insert
    _, err = tx.Conn().PgConn().CopyFrom(
        ctx,
        pgx.Identifier{"submissions"},
        []string{"message_type", "submission_source", "subject_text", "body_text", "sender_domain", "detected_language", "threat_level", "attack_type", "import_batch_id"},
        &csvSource{reader: reader, anonymizer: s.anonymizer, batchID: batchID},
    )
    if err != nil {
        return err
    }

    // 5. Update batch status
    batch.Status = "completed"
    batch.CompletedAt = time.Now()
    if err := s.updateImportBatch(ctx, batch); err != nil {
        return err
    }

    // 6. Commit transaction
    return tx.Commit(ctx)
}

// csvSource implements pgx.CopyFromSource
type csvSource struct {
    reader *csv.Reader
    anonymizer *anonymizer.Anonymizer
    batchID uuid.UUID
    currentRow []string
    err error
}

func (s *csvSource) Next() bool {
    s.currentRow, s.err = s.reader.Read()
    return s.err == nil
}

func (s *csvSource) Values() ([]interface{}, error) {
    if s.err != nil {
        return nil, s.err
    }

    // Anonymize before inserting
    anonymizedSubject, _ := s.anonymizer.AnonymizeText(context.Background(), s.currentRow[2])
    anonymizedBody, _ := s.anonymizer.AnonymizeText(context.Background(), s.currentRow[3])

    return []interface{}{
        s.currentRow[0], // message_type
        s.currentRow[1], // submission_source
        anonymizedSubject,
        anonymizedBody,
        s.currentRow[5], // sender_domain
        s.currentRow[6], // detected_language
        s.currentRow[7], // threat_level
        s.currentRow[8], // attack_type
        s.batchID,
    }, nil
}

func (s *csvSource) Err() error {
    if s.err == io.EOF {
        return nil
    }
    return s.err
}
```

### 12.4 Validation and Error Handling

```go
func (s *BulkImportService) ValidateCSV(csvPath string) ([]ValidationError, error) {
    file, _ := os.Open(csvPath)
    defer file.Close()

    reader := csv.NewReader(file)

    var errors []ValidationError
    lineNum := 0

    for {
        record, err := reader.Read()
        if err == io.EOF {
            break
        }
        lineNum++

        // Validate message_type
        if !isValidMessageType(record[0]) {
            errors = append(errors, ValidationError{
                Line: lineNum,
                Field: "message_type",
                Value: record[0],
                Error: "Invalid message type. Must be: email, sms, whatsapp, telegram, signal, other",
            })
        }

        // Validate body_text not empty
        if len(record[3]) == 0 {
            errors = append(errors, ValidationError{
                Line: lineNum,
                Field: "body_text",
                Error: "body_text is required",
            })
        }

        // More validations...
    }

    return errors, nil
}
```

---

## 13. Security & Privacy

### 13.1 Row-Level Security (RLS)

**Enable RLS on submissions:**

```sql
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own organization's submissions
CREATE POLICY partner_isolation ON submissions
FOR SELECT
TO authenticated_users
USING (
    partner_id = (
        SELECT p.partner_id
        FROM users u
        JOIN partners p ON u.organization = p.organization_name
        WHERE u.user_id = current_setting('app.current_user_id')::UUID
    )
);

-- Policy: Researchers can see all verified submissions
CREATE POLICY researcher_access ON submissions
FOR SELECT
TO researchers
USING (verified = TRUE OR processing_status = 'completed');

-- Policy: Admins can see everything
CREATE POLICY admin_full_access ON submissions
FOR ALL
TO admins
USING (TRUE);
```

**Application-Level Usage:**

```go
// Set session variable before queries
func (r *SubmissionRepository) SetCurrentUser(ctx context.Context, userID uuid.UUID) error {
    _, err := r.db.Exec(ctx, "SET app.current_user_id = $1", userID)
    return err
}

// Queries automatically filtered by RLS
func (r *SubmissionRepository) FindAll(ctx context.Context) ([]*Submission, error) {
    // Only returns rows visible to current user
    rows, err := r.db.Query(ctx, "SELECT * FROM submissions WHERE processing_status = 'completed'")
    // ...
}
```

### 13.2 Data Access Auditing

**Log All Data Exports:**

```go
func (h *ExportHandler) ExportDataset(ctx context.Context, req ExportRequest) error {
    userID := ctx.Value("user_id").(uuid.UUID)

    // 1. Log export request
    auditLog := &AuditLog{
        UserID: userID,
        Action: "export",
        ResourceType: "dataset",
        Description: fmt.Sprintf("Exported %d submissions", req.Limit),
        RequestParams: req,
        Timestamp: time.Now(),
    }
    if err := h.auditRepo.Create(ctx, auditLog); err != nil {
        return err
    }

    // 2. Perform export
    submissions, err := h.repo.Export(ctx, req)
    if err != nil {
        return err
    }

    // 3. Generate CSV
    // ...

    return nil
}
```

### 13.3 API Rate Limiting

**Middleware in Go:**

```go
package middleware

import (
    "net/http"
    "golang.org/x/time/rate"
)

func RateLimitMiddleware(limiter *rate.Limiter) func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            if !limiter.Allow() {
                http.Error(w, "Rate limit exceeded", http.StatusTooManyRequests)
                return
            }
            next.ServeHTTP(w, r)
        })
    }
}

// Usage
limiter := rate.NewLimiter(rate.Limit(100), 200) // 100 req/sec, burst 200
router.Use(RateLimitMiddleware(limiter))
```

### 13.4 GDPR Compliance

**Right to Be Forgotten:**

```sql
-- Soft delete submission
UPDATE submissions
SET deleted_at = NOW(),
    body_text = '[DELETED]',
    subject_text = '[DELETED]'
WHERE submission_id = $1;

-- Hard delete after retention period
DELETE FROM submissions
WHERE deleted_at < NOW() - INTERVAL '90 days';
```

**Data Export for User:**

```go
func (h *GDPRHandler) ExportUserData(ctx context.Context, email string) ([]byte, error) {
    // 1. Find all submissions from this email (hashed)
    emailHash := h.anonymizer.HashEmail(email)

    submissions, err := h.repo.FindByEmailHash(ctx, emailHash)
    if err != nil {
        return nil, err
    }

    // 2. Export as JSON
    return json.Marshal(submissions)
}
```

---

## 14. Implementation Roadmap

### 14.1 Phase 1: MVP (Weeks 1-4)

**Week 1: Core Infrastructure**
- [ ] Set up PostgreSQL 16+ database
- [ ] Create migration 001: Core tables (submissions, email_details, sms_details, messaging_app_details)
- [ ] Set up pgx/v5 connection pooling in Go
- [ ] Configure sqlc for type-safe queries
- [ ] Install and configure swaggo/swag for OpenAPI generation
- [ ] Set up Swagger UI at /api/docs endpoint

**Week 2: Anonymization Service**
- [ ] Implement Go anonymization service with regex patterns
- [ ] Add email, phone, SSN, credit card detection
- [ ] Unit tests for anonymization (95% coverage)
- [ ] Integration with submission handler

**Week 3: URL and Attachment Tracking**
- [ ] Create migration 002: urls, submission_urls, attachments tables
- [ ] Implement URL extraction from message content
- [ ] Add URL deduplication logic (hash-based)
- [ ] Attachment metadata extraction

**Week 4: Statistics Dashboard & API Documentation**
- [ ] Create dataset_statistics table
- [ ] Implement statistics calculation service
- [ ] Scheduled refresh (daily cron job)
- [ ] API endpoint for dashboard data
- [ ] Add OpenAPI annotations to all handlers
- [ ] Generate OpenAPI spec with swag
- [ ] Test Swagger UI documentation

**Deliverable:** Basic submission API accepting email/SMS, storing with anonymization, displaying dashboard stats, and fully documented with Swagger UI.

---

### 14.2 Phase 2: User Management & Bulk Import (Weeks 5-8)

**Week 5: User Authentication**
- [ ] Create migration 003: users, partners tables
- [ ] Implement JWT-based authentication
- [ ] API key generation for programmatic access
- [ ] Password reset flow

**Week 6: Partner Management**
- [ ] Partner registration and approval workflow
- [ ] Data sharing agreement tracking
- [ ] Partner-specific submission quotas

**Week 7: Bulk Import Pipeline**
- [ ] Create import_batches table
- [ ] CSV validation and parsing
- [ ] PostgreSQL COPY integration
- [ ] Error handling and retry logic

**Week 8: Email Ingestion**
- [ ] Email forwarding endpoint (submit@sting9.org)
- [ ] MIME parsing and header extraction
- [ ] Attachment handling (metadata only)

**Deliverable:** Authenticated API access, partner portal, bulk import capability.

---

### 14.3 Phase 3: Advanced Features (Weeks 9-12)

**Week 9: Attack Pattern Classification**
- [ ] Create attack_patterns and junction tables
- [ ] Define initial attack pattern taxonomy
- [ ] Rule-based classification engine
- [ ] Pattern assignment to submissions

**Week 10: ML Training Views**
- [ ] Create ml_training_features materialized view
- [ ] Feature engineering (text, URL, attachment features)
- [ ] Export scripts for training datasets
- [ ] Stratified sampling

**Week 11: Audit Logging & RLS**
- [ ] Create audit_log table (partitioned)
- [ ] Implement Row-Level Security policies
- [ ] Data access logging middleware
- [ ] GDPR compliance endpoints

**Week 12: Monitoring & Optimization**
- [ ] Query performance monitoring
- [ ] Slow query identification and optimization
- [ ] Index usage analysis
- [ ] Automated partition management

**Deliverable:** Full-featured research platform with ML-ready data, audit compliance, and production monitoring.

---

## 15. Appendices

### 15.1 Capacity Planning

**Initial Scale (MVP - First Year):**

Estimated volume: **1M - 10M messages**

| Component | Average Size | Total (5M) | Total (10M) |
|-----------|--------------|------------|-------------|
| submissions.body_text | 2 KB | 10 GB | 20 GB |
| submissions.subject_text | 100 B | 500 MB | 1 GB |
| submissions.raw_headers (JSONB) | 500 B | 2.5 GB | 5 GB |
| email_details | 200 B | 1 GB | 2 GB |
| sms_details | 100 B | 500 MB | 1 GB |
| urls (deduplicated) | 500 B | 250 MB | 500 MB |
| submission_urls | 50 B | 250 MB | 500 MB |
| attachments (metadata only) | 300 B | 1.5 GB | 3 GB |
| Indexes | - | 5 GB | 10 GB |
| **Subtotal** | - | **~22 GB** | **~43 GB** |
| **Buffer (50%)** | - | **~33 GB** | **~65 GB** |

**Recommended Infrastructure (MVP):**

- **CPU:** 4-8 vCPU
- **RAM:** 16-32 GB
- **Storage:** 100-200 GB SSD
- **Database:** AWS RDS PostgreSQL 16 (db.t4g.xlarge or db.r6i.xlarge), Azure Database for PostgreSQL, or self-hosted

**Cost Estimate (AWS RDS - MVP):**
- Instance (db.t4g.xlarge): ~$170/month
- Storage (100 GB): ~$12/month
- Backups (automated): ~$10/month
- **Total: ~$192/month**

**Future Scale Planning (50M+ messages):**

When reaching 50M messages (~215 GB data + 50 GB indexes):
- Upgrade to db.r6i.2xlarge (16 vCPU, 64 GB RAM): ~$800/month
- Storage: 500 GB: ~$60/month
- Consider implementing partitioning (see Section 8)
- **Total: ~$890/month**

---

### 15.2 Sample Data Generation

**Generate 10K Test Submissions:**

```sql
INSERT INTO submissions (
    message_type,
    submission_source,
    subject_text,
    body_text,
    threat_level,
    attack_type,
    sender_domain,
    detected_language,
    submission_timestamp
)
SELECT
    (ARRAY['email', 'sms', 'whatsapp'])[floor(random() * 3 + 1)::INT],
    'api',
    'Test Phishing Email ' || n,
    'This is a test phishing message. Please verify your account at https://evil' || n || '[.]com/verify. This is test data for development purposes only.',
    (ARRAY['low', 'medium', 'high', 'critical'])[floor(random() * 4 + 1)::INT],
    (ARRAY['phishing', 'smishing', 'spear_phishing', 'BEC'])[floor(random() * 4 + 1)::INT],
    'evil' || n || '.com',
    'en',
    NOW() - (random() * INTERVAL '365 days')
FROM generate_series(1, 10000) AS n;
```

---

### 15.3 Monitoring Queries

**Database Size:**

```sql
SELECT
    pg_size_pretty(pg_database_size('sting9')) AS database_size;
```

**Table Sizes:**

```sql
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
    pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) AS indexes_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**Active Connections:**

```sql
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';
```

**Slow Queries:**

```sql
SELECT
    query,
    calls,
    total_time,
    mean_time,
    max_time
FROM pg_stat_statements
WHERE mean_time > 100
ORDER BY total_time DESC
LIMIT 20;
```

---

### 15.4 Backup and Recovery

**Automated Backup Script:**

```bash
#!/bin/bash
# /etc/cron.daily/backup-sting9.sh

BACKUP_DIR="/backups/sting9"
DATE=$(date +%Y%m%d_%H%M%S)

# Full database dump
pg_dump -U sting9_user -d sting9 -F c -f "$BACKUP_DIR/sting9_$DATE.dump"

# Compress
gzip "$BACKUP_DIR/sting9_$DATE.dump"

# Upload to S3
aws s3 cp "$BACKUP_DIR/sting9_$DATE.dump.gz" "s3://sting9-backups/daily/"

# Retain only last 30 days locally
find $BACKUP_DIR -name "*.dump.gz" -mtime +30 -delete

# Log
echo "$(date): Backup completed: sting9_$DATE.dump.gz" >> /var/log/sting9-backup.log
```

**Point-in-Time Recovery:**

```bash
# Restore to specific timestamp
pg_restore -U sting9_user -d sting9_restore -F c sting9_20250115.dump

# Apply WAL files to specific point in time
recovery_target_time = '2025-01-15 14:30:00 UTC'
```

---

## Conclusion

This comprehensive data model specification provides a robust, scalable, privacy-first foundation for the Sting9 Research Initiative. The design supports:

 **50M+ message capacity** with monthly partitioning
 **Multi-source submissions** (email, SMS, messaging apps, bulk import)
 **Privacy-first architecture** with application-layer anonymization
 **ML-ready data structure** with feature extraction views
 **Research-grade querying** with full-text search and threat intelligence
 **GDPR compliance** with audit logging and RLS policies
 **Production performance** with strategic indexing and query optimization

**Next Steps:**
1. Review this specification with the team
2. Create migration files in `api.sting9.org/db/migrations/`
3. Implement anonymization service in Go
4. Set up test database with synthetic data
5. Benchmark performance with 1M, 10M, 50M record simulations

---

**Document Version:** 1.0
**Last Updated:** 2025-01-15
**Maintainer:** Sting9 Development Team
**Contact:** dev@sting9.org
