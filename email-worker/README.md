# Sting9 Email Worker

Cloudflare Email Worker that receives phishing emails forwarded to `submit@sting9.org`, extracts the original phishing content, and submits it to the Sting9 API.

## Features

- ✉️ **Email Parsing**: Uses `postal-mime` to parse complex email structures
- 🔍 **Smart Extraction**: Detects and extracts original phishing emails from forwarded messages
- 🛡️ **Multiple Formats**: Handles Gmail, Outlook, Apple Mail, and generic forwarding styles
- 📎 **Attachment Support**: Processes `.eml` attachments and lists attachment names
- 🔗 **URL Extraction**: Automatically finds and reports suspicious URLs
- ⚡ **Rate Limiting**: In-memory rate limiting (10 submissions/hour per sender)
- 🔄 **Retry Logic**: Automatic retry with exponential backoff for transient failures
- 📝 **No Replies**: Silent processing - no confirmation emails sent

## Architecture

```
┌─────────────┐
│   User      │
│  Forwards   │
│   Email     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│  Cloudflare Email Worker │
│  (submit@sting9.org)    │
├─────────────────────────┤
│ 1. Receive Email        │
│ 2. Parse with postal-mime│
│ 3. Extract Phishing      │
│ 4. Submit to API        │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│   Sting9 API            │
│   /api/v1/submissions   │
└─────────────────────────┘
```

## Project Structure

```
email-worker/
├── src/
│   ├── index.ts          # Main worker handler
│   ├── parser.ts         # Email parsing with postal-mime
│   ├── extractor.ts      # Forwarded email extraction logic
│   ├── api-client.ts     # Sting9 API submission client
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # Helper utilities
├── test/
│   └── fixtures/         # Sample .eml files for testing
│       ├── gmail-forward.eml
│       ├── outlook-forward.eml
│       └── simple-phishing.eml
├── wrangler.toml         # Cloudflare Worker configuration
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── README.md            # This file
```

## Installation

### Prerequisites

- Node.js 18+
- npm or pnpm
- Cloudflare account (for deployment)

### Setup

1. **Install dependencies:**

```bash
cd email-worker
npm install
```

2. **Configure environment variables:**

Edit `wrangler.toml` if needed to customize:
- `API_BASE_URL`: Sting9 API endpoint (default: `https://api.sting9.org`)
- `MAX_EMAIL_SIZE_MB`: Maximum email size in MB (default: `10`)
- `RATE_LIMIT_PER_HOUR`: Max submissions per sender per hour (default: `10`)

3. **Authenticate with Cloudflare:**

```bash
npx wrangler login
```

## Local Development & Testing

### Start Development Server

```bash
npm run dev
```

This starts a local server at `http://localhost:8787` that simulates the Cloudflare Email Worker environment.

### Test with Sample Emails

Use `curl` to send test emails to the local worker:

**Test 1: Gmail-style forward**
```bash
curl -X POST 'http://localhost:8787/cdn-cgi/handler/email' \
  --url-query 'from=user@example.com' \
  --url-query 'to=submit@sting9.org' \
  --data-binary @test/fixtures/gmail-forward.eml
```

**Test 2: Outlook-style forward**
```bash
curl -X POST 'http://localhost:8787/cdn-cgi/handler/email' \
  --url-query 'from=jane@company.com' \
  --url-query 'to=submit@sting9.org' \
  --data-binary @test/fixtures/outlook-forward.eml
```

**Test 3: Simple phishing email**
```bash
curl -X POST 'http://localhost:8787/cdn-cgi/handler/email' \
  --url-query 'from=victim@example.com' \
  --url-query 'to=submit@sting9.org' \
  --data-binary @test/fixtures/simple-phishing.eml
```

### Check Logs

Watch the console output for detailed processing logs:

```
📧 Received email: { from: 'user@example.com', to: 'submit@sting9.org', size: 1234 }
📖 Parsing email...
📝 Parsed email: { subject: 'Fwd: Urgent...', from: 'user@example.com', hasAttachments: false }
🔍 Extracting phishing email...
✅ Extracted phishing email: { isForwarded: true, from: 'security@paypaI.com', urlCount: 2 }
📤 Submitting to API...
✅ Submission successful: { submissionId: 'sub_abc123', processingTime: 245 }
```

## Deployment

### Deploy to Cloudflare

```bash
npm run deploy
```

Or deploy to a specific environment:

```bash
# Deploy to staging
npx wrangler deploy --env staging

# Deploy to production
npx wrangler deploy --env production
```

### Configure Email Routing

After deployment, configure email routing in your Cloudflare dashboard:

1. Go to **Email Routing** in your Cloudflare dashboard
2. Enable Email Routing for your domain (`sting9.org`)
3. Add a custom address: `submit@sting9.org`
4. Route it to your deployed worker: `sting9-email-worker`

## Email Forwarding Formats Supported

The worker intelligently detects and extracts original phishing emails from various forwarding formats:

### Gmail
```
---------- Forwarded message ---------
From: scammer@phish.com
Date: Mon, Jan 14, 2025 at 9:15 AM
Subject: Phishing Subject
To: victim@example.com

[Email body...]
```

### Outlook / Apple Mail
```
Begin forwarded message:

From: scammer@phish.com
Date: January 15, 2025 at 2:05:15 PM GMT
Subject: Phishing Subject
To: victim@example.com

[Email body...]
```

### .eml Attachments
Some email clients attach the original email as a `.eml` file. The worker detects and parses these automatically.

### Generic Format
The worker also attempts to extract emails with standard headers:
```
From: scammer@phish.com
Subject: Phishing Subject
Date: Mon, 14 Jan 2025 10:00:00 -0500

[Email body...]
```

## Rate Limiting

Built-in rate limiting prevents abuse:

- **Limit**: 10 submissions per hour per sender email address
- **Storage**: In-memory (resets on worker restart)
- **Behavior**: Silently drops emails exceeding the limit

To adjust the limit, modify `RATE_LIMIT_PER_HOUR` in `wrangler.toml`.

## Error Handling

The worker handles errors gracefully:

- **Parsing errors**: Logged and skipped
- **API failures**: Retried up to 2 times with exponential backoff
- **Network timeouts**: Retried automatically
- **Validation errors**: Logged but not retried
- **Rate limits**: Silently dropped (no retry)

All errors are logged to Cloudflare Workers logs for debugging.

## API Integration

The worker submits to the Sting9 API endpoint:

**Endpoint:** `POST /api/v1/submissions`

**Payload:**
```json
{
  "type": "email",
  "content": "Full email content including headers...",
  "metadata": {
    "from": "scammer@phish.com",
    "subject": "Phishing Subject",
    "date": "2025-01-14T14:30:00Z",
    "urls": ["https://suspicious-link.com"],
    "attachments": ["invoice.pdf"]
  },
  "client_info": {
    "platform": "Cloudflare Email Worker",
    "app_version": "1.0.0"
  }
}
```

## Monitoring

### View Logs

**Development:**
```bash
npm run dev
# Logs appear in console
```

**Production:**
```bash
npx wrangler tail
# Live tail production logs
```

**Cloudflare Dashboard:**
1. Go to Workers & Pages
2. Select `sting9-email-worker`
3. Click "Logs" tab for real-time logs

### Key Metrics to Monitor

- ✅ Successful submissions: Look for `✅ Submission successful`
- ❌ Failed submissions: Look for `❌ Submission failed`
- ⚠️ Rate limits: Look for `⚠️ Rate limit exceeded`
- 💥 Processing errors: Look for `💥 Email processing error`

## Troubleshooting

### Email not being processed

**Check:**
1. Email routing is configured correctly in Cloudflare
2. Worker is deployed and running
3. Sender hasn't exceeded rate limit
4. Email size is under 10MB
5. Check worker logs for errors

### API submission failing

**Check:**
1. `API_BASE_URL` is correct in `wrangler.toml`
2. API is healthy: https://api.sting9.org/api/v1/health
3. Check worker logs for API error details
4. Verify email content meets minimum length (10 chars)

### Forwarded email not extracted correctly

**Debug:**
1. Check the raw email format in logs
2. Test locally with the actual .eml file
3. Check if it matches supported forwarding patterns
4. File an issue with the email format example

## Development

### Type Checking

```bash
npm run type-check
```

### Format Code

```bash
npm run format
```

### Lint Code

```bash
npm run lint
```

## Environment Variables

Configure in `wrangler.toml`:

| Variable | Default | Description |
|----------|---------|-------------|
| `API_BASE_URL` | `https://api.sting9.org` | Sting9 API base URL |
| `MAX_EMAIL_SIZE_MB` | `10` | Maximum email size in MB |
| `RATE_LIMIT_PER_HOUR` | `10` | Max submissions per sender per hour |

## Security Considerations

- **No Reply Emails**: Worker never sends replies to protect against spoofing
- **URL Safety**: URLs are extracted but never visited/fetched
- **Attachment Handling**: Only filenames extracted, files not downloaded
- **Rate Limiting**: Prevents spam and abuse
- **Input Validation**: All inputs validated before API submission
- **Size Limits**: Large emails rejected automatically

## Dependencies

- **postal-mime** (^2.3.2): Email parsing library
- **@cloudflare/workers-types** (^4.x): TypeScript types for Workers
- **wrangler** (^3.x): Cloudflare Workers CLI
- **typescript** (^5.x): TypeScript compiler

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm run dev`
5. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

- **Issues**: GitHub Issues
- **Email**: support@sting9.org
- **Documentation**: https://sting9.org/docs

## Related Projects

- **Sting9 API**: Backend submission API
- **Sting9 Web**: Public submission portal
- **Sting9 iOS**: Mobile submission app

---

**Built with ❤️ by the Sting9 Research Initiative**

*Making digital deception obsolete, one submission at a time.*
