# Testing Guide for Sting9 Email Worker

This guide explains how to test the email worker locally before deploying to production.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Send a test email:**
   ```bash
   curl -X POST 'http://localhost:8787/cdn-cgi/handler/email' \
     --url-query 'from=test@example.com' \
     --url-query 'to=submit@sting9.org' \
     --data-binary @test/fixtures/gmail-forward.eml
   ```

## Test Fixtures

Three sample email files are provided in `test/fixtures/`:

### 1. Gmail Forward (`gmail-forward.eml`)
- **Format**: Gmail-style forward with "---------- Forwarded message ---------"
- **Content**: Fake PayPal phishing email
- **URLs**: 2 suspicious links
- **Attachments**: None

**Test:**
```bash
curl -X POST 'http://localhost:8787/cdn-cgi/handler/email' \
  --url-query 'from=john.doe@example.com' \
  --url-query 'to=submit@sting9.org' \
  --data-binary @test/fixtures/gmail-forward.eml
```

**Expected Output:**
```
📧 Received email: { from: 'john.doe@example.com', to: 'submit@sting9.org', size: ... }
📖 Parsing email...
📝 Parsed email: { subject: 'Fwd: Urgent: Your Account Has Been Compromised', ... }
🔍 Extracting phishing email...
✅ Extracted phishing email: { isForwarded: true, from: 'security@paypaI.com <noreply@suspicious-domain.xyz>', urlCount: 2 }
📤 Submitting to API...
✅ Submission successful: { submissionId: 'sub_...', processingTime: ... }
```

### 2. Outlook Forward (`outlook-forward.eml`)
- **Format**: Outlook/Apple Mail style with "Begin forwarded message:"
- **Content**: Fake UPS delivery failure
- **URLs**: 2 suspicious links
- **Attachments**: None

**Test:**
```bash
curl -X POST 'http://localhost:8787/cdn-cgi/handler/email' \
  --url-query 'from=jane.smith@company.com' \
  --url-query 'to=submit@sting9.org' \
  --data-binary @test/fixtures/outlook-forward.eml
```

### 3. Simple Phishing (`simple-phishing.eml`)
- **Format**: Direct phishing email (not forwarded)
- **Content**: Fake Apple ID lock notification (HTML)
- **URLs**: 1 suspicious link
- **Attachments**: None

**Test:**
```bash
curl -X POST 'http://localhost:8787/cdn-cgi/handler/email' \
  --url-query 'from=user@example.com' \
  --url-query 'to=submit@sting9.org' \
  --data-binary @test/fixtures/simple-phishing.eml
```

## Test Scenarios

### Scenario 1: Successful Submission
**Steps:**
1. Start dev server: `npm run dev`
2. Send test email (any fixture)
3. Check console for success message
4. Verify submission ID is returned

**Expected:**
- ✅ Status code 201 from API
- ✅ Submission ID generated
- ✅ Processing time logged

### Scenario 2: Rate Limiting
**Steps:**
1. Send 10+ emails from the same sender within an hour
2. Check for rate limit warning

**Expected:**
- ⚠️ After 10th submission: "Rate limit exceeded for: [email]"
- Email processing stops silently
- No API call made

**Test:**
```bash
for i in {1..12}; do
  curl -X POST 'http://localhost:8787/cdn-cgi/handler/email' \
    --url-query 'from=same-sender@example.com' \
    --url-query 'to=submit@sting9.org' \
    --data-binary @test/fixtures/gmail-forward.eml
  echo "Sent email $i"
done
```

### Scenario 3: Email Too Large
**Steps:**
1. Create a large test file: `dd if=/dev/zero of=large.eml bs=1M count=15`
2. Send it to the worker

**Expected:**
- ❌ "Email too large" error
- Processing stops before parsing
- No API call made

**Test:**
```bash
dd if=/dev/zero of=test/large.eml bs=1M count=15
curl -X POST 'http://localhost:8787/cdn-cgi/handler/email' \
  --url-query 'from=test@example.com' \
  --url-query 'to=submit@sting9.org' \
  --data-binary @test/large.eml
```

### Scenario 4: Malformed Email
**Steps:**
1. Create invalid email: `echo "This is not a valid email" > test/invalid.eml`
2. Send it to the worker

**Expected:**
- 💥 Parsing error logged
- Error message includes details
- Worker doesn't crash

**Test:**
```bash
echo "This is not a valid email format" > test/invalid.eml
curl -X POST 'http://localhost:8787/cdn-cgi/handler/email' \
  --url-query 'from=test@example.com' \
  --url-query 'to=submit@sting9.org' \
  --data-binary @test/invalid.eml
```

### Scenario 5: API Failure
**Steps:**
1. Edit `wrangler.toml` to use invalid API URL
2. Send test email

**Expected:**
- ❌ API submission failure
- Retry attempts (up to 2)
- Final error logged
- Worker doesn't crash

## Testing with Real Email Clients

### Testing with Gmail

1. Forward a real phishing email to `submit@sting9.org` (use local endpoint)
2. Configure your email server to route to local worker
3. Or export the email as `.eml` and use curl

**Export from Gmail:**
1. Open the email
2. Click three dots → "Download message"
3. Save as `.eml` file
4. Test with curl

### Testing with Outlook

1. Forward email to test address
2. Or save as `.eml`: File → Save As → `.eml` format
3. Test with curl

### Testing with Apple Mail

1. Select email
2. File → Save As → Select Raw Source
3. Test with curl

## Manual Verification Checklist

After sending test emails, verify:

- [ ] Email is parsed without errors
- [ ] Forwarded content is extracted correctly
- [ ] URLs are identified and listed
- [ ] Attachment names are captured (if any)
- [ ] API submission succeeds
- [ ] Submission ID is logged
- [ ] Processing time is reasonable (< 2 seconds)
- [ ] No reply email is sent
- [ ] Rate limiting works after 10 submissions
- [ ] Large emails are rejected
- [ ] Errors are logged but don't crash worker

## Debugging Tips

### Enable Verbose Logging

Edit `src/index.ts` and add more console.log statements:

```typescript
console.log('Raw email size:', message.rawSize);
console.log('Parsed headers:', Array.from(parsed.headers.entries()));
console.log('Extracted content:', phishingEmail.content.slice(0, 200));
```

### Inspect Request/Response

View full API request:
```typescript
console.log('API Request:', JSON.stringify(payload, null, 2));
```

View full API response:
```typescript
console.log('API Response:', JSON.stringify(responseData, null, 2));
```

### Test Extraction Logic Separately

Create a minimal test script:

```typescript
import { parseEmail } from './src/parser';
import { extractPhishingEmail } from './src/extractor';
import fs from 'fs';

const emailContent = fs.readFileSync('test/fixtures/gmail-forward.eml');
const parsed = await parseEmail(emailContent);
const extracted = await extractPhishingEmail(parsed);

console.log('Extracted:', extracted);
```

## Production Testing

Before deploying to production:

1. **Deploy to staging:**
   ```bash
   npx wrangler deploy --env staging
   ```

2. **Test with staging environment:**
   - Configure email route to staging worker
   - Send real test emails
   - Monitor Cloudflare logs: `npx wrangler tail --env staging`

3. **Verify API integration:**
   - Check staging API receives submissions
   - Verify anonymization works
   - Check submission IDs are valid

4. **Load testing:**
   - Send 100+ emails over time
   - Verify rate limiting works
   - Check for memory leaks
   - Monitor worker performance

5. **Deploy to production:**
   ```bash
   npx wrangler deploy --env production
   ```

## Common Issues

### Issue: "Failed to parse email"
**Cause:** Malformed email content
**Solution:** Check email format, ensure it's valid MIME

### Issue: "Submission failed - VALIDATION_ERROR"
**Cause:** Email content too short or empty
**Solution:** Verify extracted content has minimum 10 characters

### Issue: "API submission failed - NETWORK_ERROR"
**Cause:** API unreachable or network issue
**Solution:** Check API_BASE_URL in wrangler.toml, verify API is running

### Issue: "Rate limit exceeded"
**Cause:** Too many submissions from same sender
**Solution:** Expected behavior, wait 1 hour or adjust RATE_LIMIT_PER_HOUR

## Monitoring in Production

Use Cloudflare's real-time logs:

```bash
# Tail live logs
npx wrangler tail

# Filter for errors only
npx wrangler tail | grep "❌\|💥"

# Filter for successes only
npx wrangler tail | grep "✅"
```

## Performance Benchmarks

Target metrics:
- **Parsing time**: < 100ms for typical email
- **Extraction time**: < 50ms
- **API submission**: < 500ms
- **Total processing**: < 1 second
- **Memory usage**: < 50MB per request

Check actual performance in logs:
```
✅ Submission successful: { submissionId: 'sub_...', processingTime: 245 }
```

## Need Help?

- Check README.md for detailed documentation
- Review source code comments
- File an issue: github.com/sting9org/email-worker
- Contact: support@sting9.org
