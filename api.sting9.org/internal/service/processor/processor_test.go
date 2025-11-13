package processor

import (
	"testing"
)

func TestProcessor_DetectLanguage(t *testing.T) {
	tests := []struct {
		name     string
		content  string
		expected string
	}{
		// English
		{
			name:     "english simple",
			content:  "Hello, this is a test message",
			expected: "en",
		},
		{
			name:     "english phishing",
			content:  "Your account has been suspended. Click here to verify your identity.",
			expected: "en",
		},
		{
			name:     "english with keywords",
			content:  "The password for your account needs to be updated immediately.",
			expected: "en",
		},

		// Spanish
		{
			name:     "spanish simple",
			content:  "Hola, este es un mensaje de prueba",
			expected: "es",
		},
		{
			name:     "spanish phishing",
			content:  "Su cuenta ha sido suspendida. Haga clic aquí para verificar.",
			expected: "es",
		},

		// French
		{
			name:     "french simple",
			content:  "Bonjour, ceci est un message de test",
			expected: "fr",
		},
		{
			name:     "french phishing",
			content:  "Votre compte a été suspendu. Cliquez ici pour vérifier.",
			expected: "fr",
		},

		// German
		{
			name:     "german simple",
			content:  "Hallo, dies ist eine Testnachricht",
			expected: "de",
		},
		{
			name:     "german phishing",
			content:  "Ihr Konto wurde gesperrt. Klicken Sie hier zur Verifizierung.",
			expected: "de",
		},

		// Non-Latin scripts
		{
			name:     "chinese",
			content:  "你好，这是测试消息",
			expected: "other",
		},
		{
			name:     "arabic",
			content:  "مرحبا، هذه رسالة اختبار",
			expected: "other",
		},
		{
			name:     "russian",
			content:  "Привет, это тестовое сообщение",
			expected: "other",
		},

		// Edge cases
		{
			name:     "unknown - too short",
			content:  "Hi",
			expected: "unknown",
		},
		{
			name:     "unknown - no clear language",
			content:  "ABC 123 XYZ",
			expected: "unknown",
		},
		{
			name:     "empty string",
			content:  "",
			expected: "unknown",
		},
	}

	processor := New()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := processor.DetectLanguage(tt.content)
			if result != tt.expected {
				t.Errorf("DetectLanguage() failed\nContent:  %q\nExpected: %s\nGot:      %s", tt.content, tt.expected, result)
			}
		})
	}
}

func TestProcessor_ClassifyMessage(t *testing.T) {
	tests := []struct {
		name     string
		content  string
		expected string
	}{
		// Phishing
		{
			name:     "phishing - account suspension",
			content:  "Your account has been suspended. Click here to verify your identity immediately.",
			expected: "phishing",
		},
		{
			name:     "phishing - security alert",
			content:  "Security alert! Unusual activity detected. Verify your account now.",
			expected: "phishing",
		},
		{
			name:     "phishing - payment update",
			content:  "Update your payment information urgently or your account will be closed.",
			expected: "phishing",
		},
		{
			name:     "phishing - prize winner",
			content:  "Congratulations! You've won a prize. Click here to claim your reward.",
			expected: "phishing",
		},
		{
			name:     "phishing - inheritance",
			content:  "You have an inheritance waiting. Confirm your identity to receive funds.",
			expected: "phishing",
		},

		// Business Email Compromise (BEC)
		{
			name:     "BEC - wire transfer",
			content:  "This is the CEO. I need you to wire transfer funds to this vendor urgently.",
			expected: "bec",
		},
		{
			name:     "BEC - invoice",
			content:  "Invoice attached. Please update our vendor payment information confidentially.",
			expected: "bec",
		},
		{
			name:     "BEC - bank details change",
			content:  "Urgent: Change bank details for executive payment processing.",
			expected: "bec",
		},

		// Smishing
		{
			name:     "smishing - package delivery",
			content:  "Your package delivery failed. Click to track: http://fake-delivery.com",
			expected: "smishing",
		},
		{
			name:     "smishing - free gift",
			content:  "You've won a free gift! Reply STOP to opt out or CLAIM to receive.",
			expected: "smishing",
		},
		{
			name:     "smishing - subscription",
			content:  "Your subscription will renew. Text back to cancel or click here.",
			expected: "smishing",
		},

		// Tech Support Scam
		{
			name:     "tech support - microsoft",
			content:  "Microsoft Security: Your computer is infected with a virus. Call this number immediately.",
			expected: "tech_support_scam",
		},
		{
			name:     "tech support - apple",
			content:  "Apple support: Your iCloud account shows suspicious activity. Call us now.",
			expected: "tech_support_scam",
		},
		{
			name:     "tech support - refund",
			content:  "You're entitled to a tech support refund. Call to claim your subscription renewal refund.",
			expected: "tech_support_scam",
		},

		// Romance Scam
		{
			name:     "romance scam - money request",
			content:  "I've fallen in love with you. I need money to buy a plane ticket to meet in person.",
			expected: "romance_scam",
		},
		{
			name:     "romance scam - western union",
			content:  "My darling, please send money via Western Union. I'm lonely without you.",
			expected: "romance_scam",
		},
		{
			name:     "romance scam - gift card",
			content:  "I need a gift card to travel and meet you in person. I fell in love with you.",
			expected: "romance_scam",
		},

		// Generic Spam
		{
			name:     "spam - generic",
			content:  "Buy our product now! Limited time offer!",
			expected: "spam",
		},
		{
			name:     "spam - advertising",
			content:  "Great deals on electronics. Shop now and save big!",
			expected: "spam",
		},
		{
			name:     "spam - no clear category",
			content:  "This is a random message without clear phishing indicators.",
			expected: "spam",
		},
	}

	processor := New()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := processor.ClassifyMessage(tt.content)
			if result != tt.expected {
				t.Errorf("ClassifyMessage() failed\nContent:  %q\nExpected: %s\nGot:      %s", tt.content, tt.expected, result)
			}
		})
	}
}

func TestProcessor_Process(t *testing.T) {
	tests := []struct {
		name             string
		content          string
		urls             []string
		expectedLang     string
		expectedCategory string
	}{
		{
			name:             "english phishing with URL",
			content:          "Your account is suspended. Verify here immediately.",
			urls:             []string{"http://fake-bank.com/verify"},
			expectedLang:     "en",
			expectedCategory: "phishing",
		},
		{
			name:             "spanish phishing",
			content:          "Su cuenta ha sido suspendida. Haga clic aquí.",
			urls:             []string{"http://banco-falso.com"},
			expectedLang:     "es",
			expectedCategory: "phishing",
		},
		{
			name:             "BEC no URLs",
			content:          "CEO here. Wire transfer needed urgently. Confidential vendor payment.",
			urls:             []string{},
			expectedLang:     "en",
			expectedCategory: "bec",
		},
		{
			name:             "smishing with multiple URLs",
			content:          "Package delivery failed. Click to track or reply STOP.",
			urls:             []string{"http://fake-usps.com", "http://track.fake.com"},
			expectedLang:     "en",
			expectedCategory: "smishing",
		},
	}

	processor := New()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := processor.Process(tt.content, tt.urls)

			if result.Language != tt.expectedLang {
				t.Errorf("Process() language mismatch\nExpected: %s\nGot:      %s", tt.expectedLang, result.Language)
			}

			if result.Category != tt.expectedCategory {
				t.Errorf("Process() category mismatch\nExpected: %s\nGot:      %s", tt.expectedCategory, result.Category)
			}

			if len(result.URLs) != len(tt.urls) {
				t.Errorf("Process() URLs length mismatch\nExpected: %d\nGot:      %d", len(tt.urls), len(result.URLs))
			}

			for i, expectedURL := range tt.urls {
				if i < len(result.URLs) && result.URLs[i] != expectedURL {
					t.Errorf("Process() URL mismatch at index %d\nExpected: %s\nGot:      %s", i, expectedURL, result.URLs[i])
				}
			}
		})
	}
}

func TestProcessor_ExtractKeywords(t *testing.T) {
	tests := []struct {
		name           string
		content        string
		expectedKeywords []string // Keywords that should be present
		minKeywords    int        // Minimum number of keywords expected
	}{
		{
			name:           "phishing with repeated keywords",
			content:        "Your account account has been suspended suspended. Verify verify your account account now.",
			expectedKeywords: []string{"account", "suspended", "verify"},
			minKeywords:    3,
		},
		{
			name:           "normal message",
			content:        "The meeting is scheduled for tomorrow. The meeting location is the office.",
			expectedKeywords: []string{"meeting"},
			minKeywords:    1,
		},
		{
			name:           "short message",
			content:        "Hi there",
			expectedKeywords: []string{},
			minKeywords:    0,
		},
		{
			name:           "spam with repeated words",
			content:        "Buy now! Buy our product! Buy today! Limited time offer offer offer!",
			expectedKeywords: []string{"offer"},
			minKeywords:    1,
		},
	}

	processor := New()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := processor.ExtractKeywords(tt.content)

			if len(result) < tt.minKeywords {
				t.Errorf("ExtractKeywords() returned too few keywords\nExpected at least: %d\nGot:               %d\nKeywords:          %v",
					tt.minKeywords, len(result), result)
			}

			// Check for expected keywords
			for _, expectedKeyword := range tt.expectedKeywords {
				found := false
				for _, keyword := range result {
					if keyword == expectedKeyword {
						found = true
						break
					}
				}
				if !found {
					t.Errorf("ExtractKeywords() missing expected keyword\nExpected: %s\nGot:      %v", expectedKeyword, result)
				}
			}
		})
	}
}

func TestCountPatterns(t *testing.T) {
	tests := []struct {
		name     string
		content  string
		patterns []string
		expected int
	}{
		{
			name:     "all patterns match",
			content:  "verify your account and click here",
			patterns: []string{"verify", "account", "click"},
			expected: 3,
		},
		{
			name:     "some patterns match",
			content:  "your account needs verification",
			patterns: []string{"account", "verify", "password", "login"},
			expected: 1,
		},
		{
			name:     "no patterns match",
			content:  "hello world",
			patterns: []string{"account", "verify", "click"},
			expected: 0,
		},
		{
			name:     "case insensitive",
			content:  "Your ACCOUNT has been SUSPENDED",
			patterns: []string{"account", "suspended"},
			expected: 2,
		},
		{
			name:     "duplicate patterns in content",
			content:  "account account account",
			patterns: []string{"account"},
			expected: 1, // Should count pattern only once, not occurrences
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := countPatterns(tt.content, tt.patterns)
			if result != tt.expected {
				t.Errorf("countPatterns() failed\nContent:  %q\nPatterns: %v\nExpected: %d\nGot:      %d", tt.content, tt.patterns, tt.expected, result)
			}
		})
	}
}

// Benchmark tests
func BenchmarkProcessor_DetectLanguage(b *testing.B) {
	processor := New()
	content := "Your account has been suspended. Click here to verify your identity and password."

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = processor.DetectLanguage(content)
	}
}

func BenchmarkProcessor_ClassifyMessage(b *testing.B) {
	processor := New()
	content := "Your account has been suspended. Click here to verify your identity urgently."

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = processor.ClassifyMessage(content)
	}
}

func BenchmarkProcessor_ExtractKeywords(b *testing.B) {
	processor := New()
	content := "Your account account has been suspended suspended. Verify verify your account immediately immediately."

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = processor.ExtractKeywords(content)
	}
}

func BenchmarkProcessor_Process(b *testing.B) {
	processor := New()
	content := "Your account has been suspended. Click here to verify your identity."
	urls := []string{"http://fake-bank.com/verify"}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = processor.Process(content, urls)
	}
}

// Test real-world examples
func TestProcessor_RealWorldScams(t *testing.T) {
	realWorldExamples := []struct {
		name             string
		content          string
		expectedCategory string
		expectedLang     string
	}{
		{
			name: "PayPal phishing",
			content: `Dear Customer,

We've noticed unusual activity on your PayPal account.
Please verify your account immediately by clicking the link below.

Your account will be limited until verified.

Thank you,
PayPal Security Team`,
			expectedCategory: "phishing",
			expectedLang:     "en",
		},
		{
			name: "Amazon delivery smishing",
			content: `Amazon: Your package delivery failed.
Track your order: http://amaz0n-track.com
Reply STOP to unsubscribe`,
			expectedCategory: "smishing",
			expectedLang:     "en",
		},
		{
			name: "CEO fraud BEC",
			content: `This is the CEO.

I need you to wire $50,000 to our new vendor immediately.
This is confidential - don't discuss with anyone.

Change the payment information to the new account details I'll send.`,
			expectedCategory: "bec",
			expectedLang:     "en",
		},
		{
			name: "Microsoft tech support scam",
			content: `Microsoft Security Alert

Your computer has been infected with a virus.
Call our tech support team immediately: 1-800-555-FAKE

Your antivirus subscription has expired.
Refund available.`,
			expectedCategory: "tech_support_scam",
			expectedLang:     "en",
		},
	}

	processor := New()
	for _, tt := range realWorldExamples {
		t.Run(tt.name, func(t *testing.T) {
			category := processor.ClassifyMessage(tt.content)
			language := processor.DetectLanguage(tt.content)

			if category != tt.expectedCategory {
				t.Errorf("ClassifyMessage() failed\nContent:  %q\nExpected: %s\nGot:      %s",
					tt.content, tt.expectedCategory, category)
			}

			if language != tt.expectedLang {
				t.Errorf("DetectLanguage() failed\nContent:  %q\nExpected: %s\nGot:      %s",
					tt.content, tt.expectedLang, language)
			}
		})
	}
}
