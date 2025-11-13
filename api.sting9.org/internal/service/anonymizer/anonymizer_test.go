package anonymizer

import (
	"strings"
	"testing"
)

func TestAnonymizer_Anonymize(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
	}{
		// Email addresses
		{
			name:     "single email",
			input:    "Contact me at john.doe@example.com",
			expected: "Contact me at [EMAIL_REDACTED]",
		},
		{
			name:     "multiple emails",
			input:    "Email john.doe@example.com or jane@test.org",
			expected: "Email [EMAIL_REDACTED] or [EMAIL_REDACTED]",
		},
		{
			name:     "email with numbers",
			input:    "Support: support123@company.com",
			expected: "Support: [EMAIL_REDACTED]",
		},
		{
			name:     "email with plus sign",
			input:    "Use user+tag@example.com for registration",
			expected: "Use [EMAIL_REDACTED] for registration",
		},

		// Phone numbers - US formats
		{
			name:     "phone with parentheses",
			input:    "Call (555) 123-4567",
			expected: "Call [PHONE_REDACTED]",
		},
		{
			name:     "phone with dashes",
			input:    "Text 555-987-6543",
			expected: "Text [PHONE_REDACTED]",
		},
		{
			name:     "phone with dots",
			input:    "Contact 555.123.4567",
			expected: "Contact [PHONE_REDACTED]",
		},
		{
			name:     "phone no separator",
			input:    "Call 5551234567",
			expected: "Call [PHONE_REDACTED]",
		},
		{
			name:     "multiple phone numbers",
			input:    "Call (555) 123-4567 or 555-987-6543",
			expected: "Call [PHONE_REDACTED] or [PHONE_REDACTED]",
		},

		// Phone numbers - international
		{
			name:     "international with country code",
			input:    "Call +1-555-123-4567",
			expected: "Call [PHONE_REDACTED]",
		},
		{
			name:     "international with plus and spaces",
			input:    "Contact +1 555 123 4567",
			expected: "Contact [PHONE_REDACTED]",
		},

		// Social Security Numbers
		{
			name:     "SSN standard format",
			input:    "My SSN is 123-45-6789",
			expected: "My SSN is [SSN_REDACTED]",
		},
		{
			name:     "SSN in sentence",
			input:    "Please verify SSN 987-65-4321 for account",
			expected: "Please verify SSN [SSN_REDACTED] for account",
		},

		// Credit card numbers
		{
			name:     "credit card with dashes",
			input:    "Card: 4532-1234-5678-9010",
			expected: "Card: [CC_REDACTED]",
		},
		{
			name:     "credit card with spaces",
			input:    "Use 5425 2334 3010 9903",
			expected: "Use [CC_REDACTED]",
		},
		{
			name:     "credit card no separator",
			input:    "Card 4532123456789010",
			expected: "Card [CC_REDACTED]",
		},
		{
			name:     "multiple credit cards",
			input:    "Cards: 4532-1234-5678-9010 or 5425233430109903",
			expected: "Cards: [CC_REDACTED] or [CC_REDACTED]",
		},

		// IP addresses - IPv4
		{
			name:     "public IPv4",
			input:    "Server at 203.0.113.1",
			expected: "Server at [IP_REDACTED]",
		},
		{
			name:     "private IPv4 preserved (localhost)",
			input:    "Localhost 127.0.0.1",
			expected: "Localhost 127.0.0.1",
		},
		{
			name:     "private IPv4 preserved (192.168)",
			input:    "Local network 192.168.1.100",
			expected: "Local network 192.168.1.100",
		},
		{
			name:     "private IPv4 preserved (10.x)",
			input:    "Internal 10.0.0.1",
			expected: "Internal 10.0.0.1",
		},

		// IP addresses - IPv6
		{
			name:     "IPv6 full",
			input:    "IPv6: 2001:0db8:85a3:0000:0000:8a2e:0370:7334",
			expected: "IPv6: [IP_REDACTED]",
		},
		{
			name:     "IPv6 short",
			input:    "Connect to 2001:db8:85a3::8a2e:370:7334",
			expected: "Connect to [IP_REDACTED]",
		},

		// Physical addresses
		{
			name:     "address with Street",
			input:    "Live at 123 Main Street, Anytown",
			expected: "Live at [ADDRESS_REDACTED], Anytown",
		},
		{
			name:     "address with Ave",
			input:    "Address: 456 Oak Avenue",
			expected: "Address: [ADDRESS_REDACTED]",
		},
		{
			name:     "address with Rd",
			input:    "On 789 Elm Road",
			expected: "On [ADDRESS_REDACTED]",
		},
		{
			name:     "address with Blvd",
			input:    "Location: 321 Sunset Boulevard",
			expected: "Location: [ADDRESS_REDACTED]",
		},
		{
			name:     "address with Dr",
			input:    "Visit 654 Park Drive",
			expected: "Visit [ADDRESS_REDACTED]",
		},

		// Account numbers
		{
			name:     "account with Account",
			input:    "Account #123456789",
			expected: "[ACCOUNT_REDACTED]",
		},
		{
			name:     "account with Acct",
			input:    "Acct: 987654321012",
			expected: "[ACCOUNT_REDACTED]",
		},
		{
			name:     "account with Account Number",
			input:    "Account Number: 1234567890",
			expected: "[ACCOUNT_REDACTED]",
		},

		// Mixed PII
		{
			name:     "mixed PII types",
			input:    "Email bob@test.com, call 555-1234, SSN 123-45-6789",
			expected: "Email [EMAIL_REDACTED], call [PHONE_REDACTED], SSN [SSN_REDACTED]",
		},
		{
			name:     "comprehensive PII",
			input:    "Contact john@example.com at (555) 123-4567. Account #987654321, SSN 123-45-6789, Card 4532-1234-5678-9010",
			expected: "Contact [EMAIL_REDACTED] at [PHONE_REDACTED]. [ACCOUNT_REDACTED], SSN [SSN_REDACTED], Card [CC_REDACTED]",
		},

		// No PII
		{
			name:     "clean message",
			input:    "This is a clean message with no personal information",
			expected: "This is a clean message with no personal information",
		},
		{
			name:     "business message",
			input:    "Meeting scheduled for tomorrow at the office conference room",
			expected: "Meeting scheduled for tomorrow at the office conference room",
		},

		// Edge cases
		{
			name:     "empty string",
			input:    "",
			expected: "",
		},
		{
			name:     "only whitespace",
			input:    "   \n\t  ",
			expected: "   \n\t  ",
		},
	}

	anonymizer := New()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := anonymizer.Anonymize(tt.input)
			if result != tt.expected {
				t.Errorf("Anonymize() failed\nInput:    %q\nExpected: %q\nGot:      %q", tt.input, tt.expected, result)
			}
		})
	}
}

func TestAnonymizer_ExtractURLs(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected []string
	}{
		{
			name:     "single HTTP URL",
			input:    "Click here: http://example.com",
			expected: []string{"http://example.com"},
		},
		{
			name:     "single HTTPS URL",
			input:    "Visit https://secure.example.com/path",
			expected: []string{"https://secure.example.com/path"},
		},
		{
			name:     "multiple URLs",
			input:    "Go to http://site1.com or https://site2.com/page",
			expected: []string{"http://site1.com", "https://site2.com/page"},
		},
		{
			name:     "URL with query parameters",
			input:    "Track at https://example.com/track?id=123&ref=email",
			expected: []string{"https://example.com/track?id=123&ref=email"},
		},
		{
			name:     "duplicate URLs",
			input:    "Visit http://example.com and http://example.com again",
			expected: []string{"http://example.com"},
		},
		{
			name:     "no URLs",
			input:    "This message has no URLs",
			expected: []string{},
		},
		{
			name:     "URL with port",
			input:    "Access http://localhost:8080/admin",
			expected: []string{"http://localhost:8080/admin"},
		},
		{
			name:     "phishing URL",
			input:    "Verify at http://paypa1.com/verify or https://amaz0n.com/login",
			expected: []string{"http://paypa1.com/verify", "https://amaz0n.com/login"},
		},
	}

	anonymizer := New()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := anonymizer.ExtractURLs(tt.input)

			// Handle nil vs empty slice
			if len(tt.expected) == 0 && len(result) == 0 {
				return
			}

			if len(result) != len(tt.expected) {
				t.Errorf("ExtractURLs() length mismatch\nExpected: %v (%d)\nGot:      %v (%d)",
					tt.expected, len(tt.expected), result, len(result))
				return
			}

			// Check each URL
			for i, expectedURL := range tt.expected {
				found := false
				for _, resultURL := range result {
					if resultURL == expectedURL {
						found = true
						break
					}
				}
				if !found {
					t.Errorf("ExtractURLs() missing expected URL at index %d\nExpected: %s\nGot:      %v",
						i, expectedURL, result)
				}
			}
		})
	}
}

func TestAnonymizer_DetectPIITypes(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected []string
	}{
		{
			name:     "email only",
			input:    "Contact john@example.com",
			expected: []string{"email"},
		},
		{
			name:     "phone only",
			input:    "Call 555-123-4567",
			expected: []string{"phone"},
		},
		{
			name:     "SSN only",
			input:    "SSN: 123-45-6789",
			expected: []string{"ssn"},
		},
		{
			name:     "credit card only",
			input:    "Card 4532-1234-5678-9010",
			expected: []string{"credit_card"},
		},
		{
			name:     "IP address only",
			input:    "Server at 203.0.113.1",
			expected: []string{"ip_address"},
		},
		{
			name:     "address only",
			input:    "123 Main Street",
			expected: []string{"address"},
		},
		{
			name:     "account number only",
			input:    "Account #123456789",
			expected: []string{"account_number"},
		},
		{
			name:     "multiple PII types",
			input:    "Email: test@example.com, Phone: 555-1234, SSN: 123-45-6789",
			expected: []string{"email", "phone", "ssn"},
		},
		{
			name:     "all PII types",
			input:    "Email test@example.com, Phone 555-1234, SSN 123-45-6789, Card 4532-1234-5678-9010, IP 203.0.113.1, 123 Main Street, Account #987654321",
			expected: []string{"email", "phone", "ssn", "credit_card", "ip_address", "address", "account_number"},
		},
		{
			name:     "no PII",
			input:    "This is a clean message",
			expected: []string{},
		},
	}

	anonymizer := New()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := anonymizer.DetectPIITypes(tt.input)

			// Handle nil vs empty slice
			if len(tt.expected) == 0 && len(result) == 0 {
				return
			}

			if len(result) != len(tt.expected) {
				t.Errorf("DetectPIITypes() length mismatch\nInput:    %q\nExpected: %v (%d)\nGot:      %v (%d)",
					tt.input, tt.expected, len(tt.expected), result, len(result))
				return
			}

			// Check each PII type is present
			for _, expectedType := range tt.expected {
				found := false
				for _, resultType := range result {
					if resultType == expectedType {
						found = true
						break
					}
				}
				if !found {
					t.Errorf("DetectPIITypes() missing expected type\nInput:    %q\nExpected: %s\nGot:      %v",
						tt.input, expectedType, result)
				}
			}
		})
	}
}

func TestAnonymizer_AnonymizeMetadata(t *testing.T) {
	tests := []struct {
		name     string
		input    map[string]string
		expected map[string]string
	}{
		{
			name: "metadata with emails",
			input: map[string]string{
				"from":    "sender@example.com",
				"to":      "receiver@test.org",
				"subject": "Important message",
			},
			expected: map[string]string{
				"from":    "[EMAIL_REDACTED]",
				"to":      "[EMAIL_REDACTED]",
				"subject": "Important message",
			},
		},
		{
			name: "metadata with phone",
			input: map[string]string{
				"contact": "Call 555-123-4567",
				"message": "Clean message",
			},
			expected: map[string]string{
				"contact": "Call [PHONE_REDACTED]",
				"message": "Clean message",
			},
		},
		{
			name: "metadata with mixed PII",
			input: map[string]string{
				"info": "Email: test@example.com, Phone: 555-1234, Account #123456789",
			},
			expected: map[string]string{
				"info": "Email: [EMAIL_REDACTED], Phone: [PHONE_REDACTED], [ACCOUNT_REDACTED]",
			},
		},
		{
			name:     "empty metadata",
			input:    map[string]string{},
			expected: map[string]string{},
		},
		{
			name: "metadata with no PII",
			input: map[string]string{
				"status":  "pending",
				"message": "No personal info",
			},
			expected: map[string]string{
				"status":  "pending",
				"message": "No personal info",
			},
		},
	}

	anonymizer := New()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := anonymizer.AnonymizeMetadata(tt.input)

			if len(result) != len(tt.expected) {
				t.Errorf("AnonymizeMetadata() length mismatch\nExpected: %v\nGot:      %v", tt.expected, result)
				return
			}

			for key, expectedValue := range tt.expected {
				if result[key] != expectedValue {
					t.Errorf("AnonymizeMetadata() value mismatch for key %q\nExpected: %q\nGot:      %q",
						key, expectedValue, result[key])
				}
			}
		})
	}
}

// Benchmark tests
func BenchmarkAnonymizer_Anonymize(b *testing.B) {
	anonymizer := New()
	input := "Email: test@example.com, Phone: (555) 123-4567, SSN: 123-45-6789, Card: 4532-1234-5678-9010"

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = anonymizer.Anonymize(input)
	}
}

func BenchmarkAnonymizer_ExtractURLs(b *testing.B) {
	anonymizer := New()
	input := "Visit http://example.com or https://test.com/path?param=value for more info"

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = anonymizer.ExtractURLs(input)
	}
}

func BenchmarkAnonymizer_DetectPIITypes(b *testing.B) {
	anonymizer := New()
	input := "Email: test@example.com, Phone: 555-1234, SSN: 123-45-6789"

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = anonymizer.DetectPIITypes(input)
	}
}

// Test real-world phishing examples
func TestAnonymizer_RealWorldPhishing(t *testing.T) {
	phishingExamples := []struct {
		name  string
		input string
	}{
		{
			name: "bank phishing",
			input: `Dear Customer,

Your account has been suspended. Please verify your identity by clicking below:
http://fake-bank.com/verify

Contact us at support@fake-bank.com or call 1-800-555-0123.

Account #987654321`,
		},
		{
			name: "package delivery scam",
			input: `Your package delivery failed.

Track your package: http://fake-usps.com/track?id=123
Contact: 555-123-4567

Delivery address: 123 Main Street
`,
		},
		{
			name: "tech support scam",
			input: `Microsoft Security Alert

Your computer at IP 203.0.113.5 is infected.
Call our support: 1-800-555-TECH
Email: support@fake-microsoft.com

License key: XXXX-YYYY-ZZZZ-1234
`,
		},
	}

	anonymizer := New()
	for _, tt := range phishingExamples {
		t.Run(tt.name, func(t *testing.T) {
			result := anonymizer.Anonymize(tt.input)

			// Verify no PII remains
			piiTypes := anonymizer.DetectPIITypes(result)
			if len(piiTypes) > 0 {
				t.Errorf("Anonymize() failed to remove all PII\nRemaining PII types: %v\nResult:\n%s",
					piiTypes, result)
			}

			// Verify redaction markers are present
			if !strings.Contains(result, "[EMAIL_REDACTED]") && strings.Contains(tt.input, "@") {
				t.Error("Expected [EMAIL_REDACTED] marker in anonymized content")
			}
		})
	}
}
