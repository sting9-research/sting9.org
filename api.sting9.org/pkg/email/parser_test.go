package email

import (
	"strings"
	"testing"
)

func TestParser_Parse(t *testing.T) {
	tests := []struct {
		name            string
		rawEmail        string
		expectedSubject string
		expectedFrom    string
		expectedTo      string
		expectedBody    string
	}{
		{
			name: "simple email",
			rawEmail: `From: sender@example.com
To: receiver@example.com
Subject: Test Email
Date: Mon, 12 Nov 2025 10:00:00 -0800

This is the email body.
It has multiple lines.`,
			expectedSubject: "Test Email",
			expectedFrom:    "sender@example.com",
			expectedTo:      "receiver@example.com",
			expectedBody:    "This is the email body.\nIt has multiple lines.",
		},
		{
			name: "email with multiple headers",
			rawEmail: `From: John Doe <john@example.com>
To: Jane Smith <jane@example.com>
Subject: Important Message
Date: Mon, 12 Nov 2025 10:00:00 -0800
Message-ID: <12345@example.com>
Content-Type: text/plain; charset=utf-8
MIME-Version: 1.0

Email body content here.`,
			expectedSubject: "Important Message",
			expectedFrom:    "John Doe <john@example.com>",
			expectedTo:      "Jane Smith <jane@example.com>",
			expectedBody:    "Email body content here.",
		},
		{
			name: "phishing email",
			rawEmail: `From: security@fake-bank.com
To: victim@example.com
Subject: Urgent: Account Verification Required
Date: Mon, 12 Nov 2025 10:00:00 -0800

Your account has been suspended.

Click here to verify: http://fake-bank.com/verify

Failure to verify will result in account closure.`,
			expectedSubject: "Urgent: Account Verification Required",
			expectedFrom:    "security@fake-bank.com",
			expectedTo:      "victim@example.com",
			expectedBody:    "Your account has been suspended.\n\nClick here to verify: http://fake-bank.com/verify\n\nFailure to verify will result in account closure.",
		},
		{
			name: "email with no body",
			rawEmail: `From: sender@example.com
To: receiver@example.com
Subject: No Body

`,
			expectedSubject: "No Body",
			expectedFrom:    "sender@example.com",
			expectedTo:      "receiver@example.com",
			expectedBody:    "",
		},
		{
			name: "email with extra whitespace in headers",
			rawEmail: `From:    sender@example.com
To:   receiver@example.com
Subject:   Test   Subject
Date: Mon, 12 Nov 2025 10:00:00 -0800

Body content`,
			expectedSubject: "Test   Subject",
			expectedFrom:    "sender@example.com",
			expectedTo:      "receiver@example.com",
			expectedBody:    "Body content",
		},
		{
			name:            "empty email",
			rawEmail:        "",
			expectedSubject: "",
			expectedFrom:    "",
			expectedTo:      "",
			expectedBody:    "",
		},
	}

	parser := New()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := parser.Parse(tt.rawEmail)

			if result.Subject != tt.expectedSubject {
				t.Errorf("Parse() Subject = %q, want %q", result.Subject, tt.expectedSubject)
			}

			if result.From != tt.expectedFrom {
				t.Errorf("Parse() From = %q, want %q", result.From, tt.expectedFrom)
			}

			if result.To != tt.expectedTo {
				t.Errorf("Parse() To = %q, want %q", result.To, tt.expectedTo)
			}

			if result.Body != tt.expectedBody {
				t.Errorf("Parse() Body = %q, want %q", result.Body, tt.expectedBody)
			}

			// Verify headers are parsed
			if result.Headers == nil {
				t.Error("Parse() Headers should not be nil")
			}
		})
	}
}

func TestParser_ParseHeaders(t *testing.T) {
	rawEmail := `From: sender@example.com
To: receiver@example.com
Subject: Test
Date: Mon, 12 Nov 2025 10:00:00 -0800
Message-ID: <12345@example.com>
X-Custom-Header: Custom Value
Reply-To: reply@example.com

Body`

	parser := New()
	result := parser.Parse(rawEmail)

	expectedHeaders := map[string]string{
		"From":            "sender@example.com",
		"To":              "receiver@example.com",
		"Subject":         "Test",
		"Date":            "Mon, 12 Nov 2025 10:00:00 -0800",
		"Message-ID":      "<12345@example.com>",
		"X-Custom-Header": "Custom Value",
		"Reply-To":        "reply@example.com",
	}

	for key, expectedValue := range expectedHeaders {
		if result.Headers[key] != expectedValue {
			t.Errorf("Parse() Header[%s] = %q, want %q", key, result.Headers[key], expectedValue)
		}
	}
}

func TestParser_ExtractPlainText(t *testing.T) {
	tests := []struct {
		name     string
		html     string
		expected string
	}{
		{
			name:     "simple HTML",
			html:     "<p>Hello World</p>",
			expected: "Hello World",
		},
		{
			name:     "HTML with br tags",
			html:     "Line 1<br>Line 2<br/>Line 3<br />Line 4",
			expected: "Line 1\nLine 2\nLine 3\nLine 4",
		},
		{
			name:     "HTML with paragraphs",
			html:     "<p>Paragraph 1</p><p>Paragraph 2</p>",
			expected: "Paragraph 1\n\nParagraph 2",
		},
		{
			name: "HTML with script tags",
			html: `<html>
<head><script>alert('XSS')</script></head>
<body>Content</body>
</html>`,
			expected: "Content",
		},
		{
			name: "HTML with style tags",
			html: `<html>
<head><style>body { color: red; }</style></head>
<body>Content</body>
</html>`,
			expected: "Content",
		},
		{
			name:     "HTML with links",
			html:     `<a href="http://example.com">Click here</a>`,
			expected: "Click here",
		},
		{
			name:     "complex phishing HTML",
			html: `<html>
<head>
<style>
body { font-family: Arial; }
</style>
<script>
// Tracking code
</script>
</head>
<body>
<h1>Security Alert</h1>
<p>Your account has been suspended.</p>
<br/>
<a href="http://fake-bank.com">Click here to verify</a>
</body>
</html>`,
			expected: "Security Alert\nYour account has been suspended.\n\nClick here to verify",
		},
		{
			name:     "HTML entities",
			html:     "<p>AT&amp;T &copy; 2025</p>",
			expected: "AT&amp;T &copy; 2025", // Basic parser doesn't decode entities
		},
		{
			name:     "nested tags",
			html:     "<div><p><strong>Bold</strong> text</p></div>",
			expected: "Bold text",
		},
		{
			name:     "plain text (no HTML)",
			html:     "Just plain text",
			expected: "Just plain text",
		},
		{
			name:     "empty string",
			html:     "",
			expected: "",
		},
		{
			name:     "whitespace only",
			html:     "   \n\t  ",
			expected: "",
		},
	}

	parser := New()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := parser.ExtractPlainText(tt.html)
			// Normalize whitespace for comparison
			result = strings.TrimSpace(result)
			expected := strings.TrimSpace(tt.expected)

			if result != expected {
				t.Errorf("ExtractPlainText() = %q, want %q", result, expected)
			}
		})
	}
}

func TestRemoveTagContent(t *testing.T) {
	tests := []struct {
		name     string
		html     string
		tag      string
		expected string
	}{
		{
			name:     "remove script tag",
			html:     "<html><script>alert('test')</script><body>Content</body></html>",
			tag:      "script",
			expected: "<html><body>Content</body></html>",
		},
		{
			name:     "remove style tag",
			html:     "<html><style>body { color: red; }</style><body>Content</body></html>",
			tag:      "style",
			expected: "<html><body>Content</body></html>",
		},
		{
			name:     "remove multiple script tags",
			html:     "<html><script>code1</script><body>Content</body><script>code2</script></html>",
			tag:      "script",
			expected: "<html><body>Content</body></html>",
		},
		{
			name:     "no matching tags",
			html:     "<html><body>Content</body></html>",
			tag:      "script",
			expected: "<html><body>Content</body></html>",
		},
		{
			name:     "case insensitive",
			html:     "<html><SCRIPT>code</SCRIPT><body>Content</body></html>",
			tag:      "script",
			expected: "<html><body>Content</body></html>",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := removeTagContent(tt.html, tt.tag)
			if result != tt.expected {
				t.Errorf("removeTagContent() = %q, want %q", result, tt.expected)
			}
		})
	}
}

// Test real-world phishing emails
func TestParser_RealWorldPhishing(t *testing.T) {
	realWorldExamples := []struct {
		name     string
		rawEmail string
	}{
		{
			name: "PayPal phishing",
			rawEmail: `From: service@paypa1.com
To: victim@example.com
Subject: Your PayPal Account Has Been Limited
Date: Mon, 12 Nov 2025 10:00:00 -0800

Dear PayPal Customer,

We've noticed unusual activity on your account.

Please verify your account by clicking here: http://paypa1.com/verify

Your account will be suspended if you don't verify within 24 hours.

Thank you,
PayPal Security Team`,
		},
		{
			name: "Bank phishing with HTML",
			rawEmail: `From: security@fake-bank.com
To: customer@example.com
Subject: Urgent Security Alert
Content-Type: text/html

<html>
<body>
<h2>Security Alert</h2>
<p>Your account has been compromised.</p>
<a href="http://fake-bank.com/login">Click here to secure your account</a>
</body>
</html>`,
		},
		{
			name: "Package delivery scam",
			rawEmail: `From: delivery@fake-usps.com
To: recipient@example.com
Subject: Package Delivery Failed

Your package could not be delivered.

Track your package: http://fake-usps.com/track?id=123456

USPS Team`,
		},
	}

	parser := New()
	for _, tt := range realWorldExamples {
		t.Run(tt.name, func(t *testing.T) {
			result := parser.Parse(tt.rawEmail)

			// Verify parsing doesn't crash
			if result.Headers == nil {
				t.Error("Parse() should initialize Headers map")
			}

			// Verify key fields are extracted
			if result.From == "" {
				t.Error("Parse() should extract From field")
			}

			if result.Subject == "" {
				t.Error("Parse() should extract Subject field")
			}

			// For HTML emails, test plain text extraction
			if strings.Contains(tt.rawEmail, "<html>") {
				plainText := parser.ExtractPlainText(result.Body)
				if plainText == "" {
					t.Error("ExtractPlainText() should extract text from HTML")
				}

				// Verify HTML tags are removed
				if strings.Contains(plainText, "<") || strings.Contains(plainText, ">") {
					t.Error("ExtractPlainText() should remove all HTML tags")
				}
			}
		})
	}
}

// Benchmark tests
func BenchmarkParser_Parse(b *testing.B) {
	parser := New()
	rawEmail := `From: sender@example.com
To: receiver@example.com
Subject: Test Email
Date: Mon, 12 Nov 2025 10:00:00 -0800

This is the email body.
It has multiple lines.`

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = parser.Parse(rawEmail)
	}
}

func BenchmarkParser_ExtractPlainText(b *testing.B) {
	parser := New()
	html := `<html>
<head><style>body { color: red; }</style></head>
<body>
<h1>Title</h1>
<p>Paragraph 1</p>
<p>Paragraph 2</p>
<a href="http://example.com">Link</a>
</body>
</html>`

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = parser.ExtractPlainText(html)
	}
}

// Test edge cases
func TestParser_EdgeCases(t *testing.T) {
	parser := New()

	t.Run("email with only headers", func(t *testing.T) {
		rawEmail := `From: sender@example.com
To: receiver@example.com
Subject: Test`

		result := parser.Parse(rawEmail)
		if result.Body != "" {
			t.Errorf("Parse() Body should be empty, got %q", result.Body)
		}
	})

	t.Run("email with malformed headers", func(t *testing.T) {
		rawEmail := `From sender@example.com
To: receiver@example.com
Subject

Body content`

		result := parser.Parse(rawEmail)
		// Should not crash, should handle gracefully
		if result.Headers == nil {
			t.Error("Parse() should initialize Headers even with malformed input")
		}
	})

	t.Run("very large email", func(t *testing.T) {
		// Create a large email body
		largeBody := strings.Repeat("This is a line of text.\n", 10000)
		rawEmail := `From: sender@example.com
To: receiver@example.com
Subject: Large Email

` + largeBody

		result := parser.Parse(rawEmail)
		if result.Body == "" {
			t.Error("Parse() should handle large emails")
		}
	})

	t.Run("HTML with XSS attempt", func(t *testing.T) {
		html := `<script>alert('XSS')</script><img src=x onerror="alert('XSS')">Content`
		result := parser.ExtractPlainText(html)

		// Should remove script tags
		if strings.Contains(result, "script") {
			t.Error("ExtractPlainText() should remove script tags")
		}
	})
}
