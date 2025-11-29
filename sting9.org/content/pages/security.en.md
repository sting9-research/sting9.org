# Security

## Protecting users from phishing and protecting our platform from abuse

Security is at the core of everything we do. Learn how to protect yourself from phishing and how we secure the Sting9 platform.

---

## Quick Statistics

| Statistic | Impact |
|-----------|--------|
| **5.3B** | Phishing emails sent daily |
| **$10.3B** | Lost to scams annually |
| **1 in 3** | People fall for phishing |
| **87%** | Smishing attacks bypass filters |

---

## Protecting Yourself from Phishing

Learn how to identify and avoid phishing, smishing, and scam attempts.

### How to Spot Phishing

#### Red Flags in Emails

- **Urgent or threatening language:** "Your account will be closed!", "Immediate action required!"
- **Suspicious sender addresses:** paypal-secure@service-verify.com instead of @paypal.com
- **Generic greetings:** "Dear Customer" instead of your actual name
- **Suspicious links:** Hover over links to see where they really go (don't click!)
- **Unexpected attachments:** Especially .exe, .zip, or .doc files you weren't expecting
- **Poor grammar and spelling:** Professional companies proofread their emails
- **Requests for sensitive information:** Legitimate companies never ask for passwords via email

#### Red Flags in Text Messages (Smishing)

- **Unknown senders:** Messages from numbers you don't recognize claiming to be your bank
- **Shortened URLs:** bit.ly, tinyurl.com links that hide the real destination
- **Prize or lottery notifications:** "Congratulations! You've won!" (you didn't enter anything)
- **Delivery notifications:** Fake UPS/FedEx/Amazon messages when you haven't ordered anything
- **Account verification requests:** "Click here to verify your account" from services you don't use

### What to Do If You Receive a Suspicious Message

1. **Don't click any links or download attachments**
   - Even hovering can sometimes trigger malicious scripts in some contexts

2. **Verify independently**
   - Contact the company directly using their official website or phone number (not the one in the message)

3. **Report it to Sting9**
   - Submit the message to us at [sting9.org/submit](/submit) or forward to [submit@sting9.org](mailto:submit@sting9.org)

4. **Delete the message**
   - Remove it from your inbox or phone to avoid accidentally clicking later

5. **Warn others**
   - If it's a widespread scam, alert friends, family, and colleagues

### Security Best Practices

#### Email Security

-  Enable two-factor authentication (2FA)
-  Use strong, unique passwords
-  Keep software and antivirus updated
-  Use a password manager

#### Mobile Security

-  Don't reply to unknown text messages
-  Verify sender before clicking SMS links
-  Enable spam filtering on your phone
-  Keep your OS and apps updated

---

## How We Secure Sting9

Our commitment to protecting your privacy and securing the platform.

### Infrastructure Security

- **Swiss Hosting:** All data hosted on Upsun infrastructure in Switzerland, benefiting from strong data protection laws
- **Encryption in Transit:** TLS 1.3 encryption for all connections (HTTPS only, no HTTP)
- **Encryption at Rest:** PostgreSQL database with full-disk encryption and encrypted backups
- **Network Security:** Firewall protection, DDoS mitigation, and intrusion detection systems
- **Regular Backups:** Automated encrypted backups with 30-day retention and point-in-time recovery

### Application Security

- **Automatic PII Redaction:** All submitted messages pass through anonymization pipeline before storage (emails, phone numbers, names, addresses, SSNs, credit cards, IPs)
- **SQL Injection Prevention:** Parameterized queries with sqlc (type-safe, prepared statements only)
- **Input Validation:** Strict validation on all user inputs with Go's validator library
- **Rate Limiting:** Prevents abuse of submission endpoints and API flooding
- **CORS Protection:** Strict origin checking to prevent unauthorized cross-origin requests
- **Content Security Policy:** Prevents XSS attacks and unauthorized script execution
- **Secure File Uploads:** File type validation, size limits, and malware scanning

### Access Control & Authentication

- **JWT Authentication:** Secure token-based authentication for researcher and partner API access
- **Password Security:** Bcrypt hashing with high cost factor for all stored passwords
- **Row-Level Security:** PostgreSQL RLS policies ensure users can only access authorized data
- **Audit Logging:** All data access and modifications logged with timestamps and user IDs
- **Principle of Least Privilege:** Database users and API roles have minimal permissions required

### Monitoring & Incident Response

- **24/7 Monitoring:** Automated monitoring of infrastructure, application, and security events
- **Security Scanning:** Regular vulnerability scans with automated and manual penetration testing
- **Dependency Updates:** Automated security patches and dependency vulnerability tracking (Dependabot/Snyk)
- **Incident Response Plan:** Documented procedures for security incidents with defined escalation paths
- **Breach Notification:** Commitment to notify affected parties within 72 hours of confirmed breach

---

## Responsible Disclosure Policy

We take security vulnerabilities seriously and appreciate the security research community's efforts to help keep Sting9 and our users safe. If you discover a security vulnerability, please follow our responsible disclosure process.

> **  Responsible Disclosure Guidelines**
>
> Please report vulnerabilities privately to our security team. Do NOT publicly disclose until we've had time to address the issue. We commit to responding within 48 hours.

### How to Report a Security Vulnerability

1. **Email our security team:**
   - [security@sting9.org](mailto:security@sting9.org) (PGP key available upon request)

2. **Include detailed information:**
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact and severity
   - Any proof-of-concept code or screenshots
   - Your contact information for follow-up

3. **Wait for our response:**
   - We will acknowledge receipt within 48 hours and provide a timeline for resolution

### What We Promise

-  Acknowledge your report within 48 hours
-  Keep you informed of our progress
-  Credit you in our security acknowledgments (if desired)
-  Work with you to understand and address the issue
-  Not pursue legal action against good-faith security researchers

### Scope

**In Scope:**
- sting9.org website
- api.sting9.org API
- submit@sting9.org email endpoint
- Authentication systems
- Data processing pipelines

**Out of Scope:**
- Social engineering attacks
- Physical security
- DoS/DDoS attacks
- Third-party services
- Spam or content issues

### Hall of Fame

Security researchers who responsibly disclose vulnerabilities will be acknowledged on our Security Hall of Fame page (coming soon). Thank you for helping keep Sting9 secure!

---

## Security Contact

For security concerns, vulnerability reports, or questions about our security practices:

**Security Team:** [security@sting9.org](mailto:security@sting9.org)
**General Inquiries:** [hello@sting9.org](mailto:hello@sting9.org)

*PGP public key available upon request for encrypted communications*
