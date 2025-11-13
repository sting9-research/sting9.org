package anonymizer

import (
	"regexp"
	"strings"
)

// Anonymizer handles PII detection and redaction
type Anonymizer struct {
	emailPattern       *regexp.Regexp
	phonePattern       *regexp.Regexp
	ssnPattern         *regexp.Regexp
	ccPattern          *regexp.Regexp
	ipv4Pattern        *regexp.Regexp
	ipv6Pattern        *regexp.Regexp
	addressPattern     *regexp.Regexp
	accountPattern     *regexp.Regexp
	urlPattern         *regexp.Regexp
}

// New creates a new Anonymizer instance
func New() *Anonymizer {
	return &Anonymizer{
		// Email addresses
		emailPattern: regexp.MustCompile(`\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b`),

		// Phone numbers (various formats)
		// Matches 10-digit: +1-234-567-8900, (234) 567-8900, 234-567-8900, 234.567.8900
		// Matches 7-digit: 555-1234, 555.1234
		// Match entire pattern including optional prefix
		phonePattern: regexp.MustCompile(`(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b|\b[0-9]{3}[-.\s][0-9]{4}\b`),

		// Social Security Numbers
		ssnPattern: regexp.MustCompile(`\b\d{3}-\d{2}-\d{4}\b`),

		// Credit Card Numbers (various formats) - 13-19 digits
		// Must handle both formatted (with spaces/dashes) and unformatted
		ccPattern: regexp.MustCompile(`\b(?:\d{4}[-\s]?){3}\d{4}(?:\d{0,3})?\b|\b\d{13,19}\b`),

		// IPv4 addresses
		ipv4Pattern: regexp.MustCompile(`\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b`),

		// IPv6 addresses (including shortened notation with ::)
		ipv6Pattern: regexp.MustCompile(`(?i)\b(?:[0-9a-f]{1,4}:){7}[0-9a-f]{1,4}\b|(?:[0-9a-f]{1,4}:)*:(?:[0-9a-f]{1,4}:)*[0-9a-f]{1,4}\b`),

		// Street addresses (basic pattern)
		addressPattern: regexp.MustCompile(`\b\d+\s+[A-Za-z0-9\s,]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Circle|Cir|Way)\b`),

		// Account numbers (8-16 digits with Account/Acct prefix)
		accountPattern: regexp.MustCompile(`(?:Account|Acct|Account\s*#|Acct\s*#|Account\s*Number|A/C)\s*:?\s*\d{8,16}\b`),

		// URLs (preserve for analysis but mark them)
		urlPattern: regexp.MustCompile(`https?://[^\s<>"{}|\\^` + "`" + `\[\]]+`),
	}
}

// Anonymize removes all PII from the content
func (a *Anonymizer) Anonymize(content string) string {
	result := content

	// Order matters! Redact longer/more specific patterns first to avoid conflicts

	// Redact SSNs (very specific format)
	result = a.ssnPattern.ReplaceAllString(result, "[SSN_REDACTED]")

	// Redact credit card numbers (before phone numbers to avoid partial matches)
	result = a.ccPattern.ReplaceAllString(result, "[CC_REDACTED]")

	// Redact account numbers (before phone numbers)
	result = a.accountPattern.ReplaceAllString(result, "[ACCOUNT_REDACTED]")

	// Redact emails
	result = a.emailPattern.ReplaceAllString(result, "[EMAIL_REDACTED]")

	// Redact phone numbers (after longer numeric patterns)
	result = a.phonePattern.ReplaceAllString(result, "[PHONE_REDACTED]")

	// Redact IPv6 addresses (before IPv4 to handle :: notation)
	result = a.ipv6Pattern.ReplaceAllString(result, "[IP_REDACTED]")

	// Redact IPv4 addresses
	result = a.ipv4Pattern.ReplaceAllStringFunc(result, func(match string) string {
		// Preserve common non-PII IPs
		if match == "127.0.0.1" || match == "0.0.0.0" || strings.HasPrefix(match, "192.168.") || strings.HasPrefix(match, "10.") {
			return match
		}
		return "[IP_REDACTED]"
	})

	// Redact street addresses
	result = a.addressPattern.ReplaceAllString(result, "[ADDRESS_REDACTED]")

	return result
}

// ExtractURLs extracts all URLs from content for analysis
func (a *Anonymizer) ExtractURLs(content string) []string {
	matches := a.urlPattern.FindAllString(content, -1)
	// Deduplicate
	seen := make(map[string]bool)
	var urls []string
	for _, url := range matches {
		if !seen[url] {
			seen[url] = true
			urls = append(urls, url)
		}
	}
	return urls
}

// DetectPIITypes returns the types of PII found in content
func (a *Anonymizer) DetectPIITypes(content string) []string {
	var piiTypes []string

	if a.emailPattern.MatchString(content) {
		piiTypes = append(piiTypes, "email")
	}
	if a.phonePattern.MatchString(content) {
		piiTypes = append(piiTypes, "phone")
	}
	if a.ssnPattern.MatchString(content) {
		piiTypes = append(piiTypes, "ssn")
	}
	if a.ccPattern.MatchString(content) {
		piiTypes = append(piiTypes, "credit_card")
	}
	if a.ipv4Pattern.MatchString(content) || a.ipv6Pattern.MatchString(content) {
		piiTypes = append(piiTypes, "ip_address")
	}
	if a.addressPattern.MatchString(content) {
		piiTypes = append(piiTypes, "address")
	}
	if a.accountPattern.MatchString(content) {
		piiTypes = append(piiTypes, "account_number")
	}

	return piiTypes
}

// AnonymizeMetadata anonymizes PII in metadata fields
func (a *Anonymizer) AnonymizeMetadata(metadata map[string]string) map[string]string {
	result := make(map[string]string)
	for key, value := range metadata {
		result[key] = a.Anonymize(value)
	}
	return result
}
