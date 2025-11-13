package validator

import (
	"testing"
)

func TestValidator_ValidateEmail(t *testing.T) {
	tests := []struct {
		name        string
		email       string
		expectError bool
	}{
		// Valid emails
		{
			name:        "simple valid email",
			email:       "user@example.com",
			expectError: false,
		},
		{
			name:        "email with subdomain",
			email:       "user@mail.example.com",
			expectError: false,
		},
		{
			name:        "email with plus sign",
			email:       "user+tag@example.com",
			expectError: false,
		},
		{
			name:        "email with dots",
			email:       "first.last@example.com",
			expectError: false,
		},
		{
			name:        "email with numbers",
			email:       "user123@example.com",
			expectError: false,
		},
		{
			name:        "email with hyphen in domain",
			email:       "user@ex-ample.com",
			expectError: false,
		},

		// Invalid emails
		{
			name:        "empty email",
			email:       "",
			expectError: true,
		},
		{
			name:        "missing @ symbol",
			email:       "userexample.com",
			expectError: true,
		},
		{
			name:        "missing domain",
			email:       "user@",
			expectError: true,
		},
		{
			name:        "missing username",
			email:       "@example.com",
			expectError: true,
		},
		{
			name:        "missing TLD",
			email:       "user@example",
			expectError: true,
		},
		{
			name:        "multiple @ symbols",
			email:       "user@@example.com",
			expectError: true,
		},
		{
			name:        "spaces in email",
			email:       "user @example.com",
			expectError: true,
		},
	}

	validator := New()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := validator.ValidateEmail(tt.email)
			if (err != nil) != tt.expectError {
				t.Errorf("ValidateEmail(%q) error = %v, expectError %v", tt.email, err, tt.expectError)
			}
		})
	}
}

func TestValidator_ValidatePassword(t *testing.T) {
	tests := []struct {
		name        string
		password    string
		expectError bool
		errorMsg    string
	}{
		// Valid passwords
		{
			name:        "valid password with all requirements",
			password:    "Test123!@#",
			expectError: false,
		},
		{
			name:        "valid password simple",
			password:    "Password1",
			expectError: false,
		},
		{
			name:        "valid password longer",
			password:    "MySecurePassword123",
			expectError: false,
		},

		// Invalid passwords
		{
			name:        "too short",
			password:    "Test1",
			expectError: true,
			errorMsg:    "at least 8 characters",
		},
		{
			name:        "no number",
			password:    "TestPassword",
			expectError: true,
			errorMsg:    "at least one number",
		},
		{
			name:        "no uppercase",
			password:    "testpassword1",
			expectError: true,
			errorMsg:    "at least one uppercase",
		},
		{
			name:        "no lowercase",
			password:    "TESTPASSWORD1",
			expectError: true,
			errorMsg:    "at least one lowercase",
		},
		{
			name:        "only numbers",
			password:    "12345678",
			expectError: true,
		},
		{
			name:        "empty password",
			password:    "",
			expectError: true,
			errorMsg:    "at least 8 characters",
		},
	}

	validator := New()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := validator.ValidatePassword(tt.password)
			if (err != nil) != tt.expectError {
				t.Errorf("ValidatePassword(%q) error = %v, expectError %v", tt.password, err, tt.expectError)
			}

			if err != nil && tt.errorMsg != "" {
				if err.Error() != tt.errorMsg {
					t.Errorf("ValidatePassword(%q) error message = %q, want %q", tt.password, err.Error(), tt.errorMsg)
				}
			}
		})
	}
}

func TestValidator_ValidateSubmissionType(t *testing.T) {
	tests := []struct {
		name           string
		submissionType string
		expectError    bool
	}{
		// Valid types
		{
			name:           "email type",
			submissionType: "email",
			expectError:    false,
		},
		{
			name:           "sms type",
			submissionType: "sms",
			expectError:    false,
		},
		{
			name:           "whatsapp type",
			submissionType: "whatsapp",
			expectError:    false,
		},
		{
			name:           "telegram type",
			submissionType: "telegram",
			expectError:    false,
		},
		{
			name:           "signal type",
			submissionType: "signal",
			expectError:    false,
		},
		{
			name:           "social_media type",
			submissionType: "social_media",
			expectError:    false,
		},
		{
			name:           "other type",
			submissionType: "other",
			expectError:    false,
		},

		// Invalid types
		{
			name:           "invalid type",
			submissionType: "invalid",
			expectError:    true,
		},
		{
			name:           "uppercase type",
			submissionType: "EMAIL",
			expectError:    true,
		},
		{
			name:           "empty type",
			submissionType: "",
			expectError:    true,
		},
		{
			name:           "random string",
			submissionType: "random",
			expectError:    true,
		},
	}

	validator := New()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := validator.ValidateSubmissionType(tt.submissionType)
			if (err != nil) != tt.expectError {
				t.Errorf("ValidateSubmissionType(%q) error = %v, expectError %v", tt.submissionType, err, tt.expectError)
			}
		})
	}
}

func TestValidator_ValidateFileExtension(t *testing.T) {
	tests := []struct {
		name               string
		filename           string
		allowedExtensions  []string
		expectError        bool
	}{
		// Valid files
		{
			name:              "valid .txt file",
			filename:          "message.txt",
			allowedExtensions: []string{".txt", ".pdf", ".doc"},
			expectError:       false,
		},
		{
			name:              "valid .pdf file",
			filename:          "document.pdf",
			allowedExtensions: []string{".txt", ".pdf", ".doc"},
			expectError:       false,
		},
		{
			name:              "case insensitive extension",
			filename:          "FILE.TXT",
			allowedExtensions: []string{".txt"},
			expectError:       false,
		},
		{
			name:              "filename with multiple dots",
			filename:          "my.file.name.txt",
			allowedExtensions: []string{".txt"},
			expectError:       false,
		},

		// Invalid files
		{
			name:              "not allowed extension",
			filename:          "malware.exe",
			allowedExtensions: []string{".txt", ".pdf"},
			expectError:       true,
		},
		{
			name:              "no extension",
			filename:          "filename",
			allowedExtensions: []string{".txt"},
			expectError:       true,
		},
		{
			name:              "empty filename",
			filename:          "",
			allowedExtensions: []string{".txt"},
			expectError:       true,
		},
	}

	validator := New()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := validator.ValidateFileExtension(tt.filename, tt.allowedExtensions)
			if (err != nil) != tt.expectError {
				t.Errorf("ValidateFileExtension(%q) error = %v, expectError %v", tt.filename, err, tt.expectError)
			}
		})
	}
}

func TestValidator_ValidateFileSize(t *testing.T) {
	tests := []struct {
		name        string
		size        int64
		maxSize     int64
		expectError bool
	}{
		// Valid sizes
		{
			name:        "size within limit",
			size:        1024,
			maxSize:     2048,
			expectError: false,
		},
		{
			name:        "size exactly at limit",
			size:        2048,
			maxSize:     2048,
			expectError: false,
		},
		{
			name:        "zero size",
			size:        0,
			maxSize:     2048,
			expectError: false,
		},

		// Invalid sizes
		{
			name:        "size exceeds limit",
			size:        3000,
			maxSize:     2048,
			expectError: true,
		},
		{
			name:        "very large file",
			size:        10 * 1024 * 1024, // 10 MB
			maxSize:     5 * 1024 * 1024,  // 5 MB max
			expectError: true,
		},
	}

	validator := New()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := validator.ValidateFileSize(tt.size, tt.maxSize)
			if (err != nil) != tt.expectError {
				t.Errorf("ValidateFileSize(%d, %d) error = %v, expectError %v", tt.size, tt.maxSize, err, tt.expectError)
			}
		})
	}
}

func TestValidator_SanitizeString(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
	}{
		// Clean strings
		{
			name:     "normal string",
			input:    "Hello, World!",
			expected: "Hello, World!",
		},
		{
			name:     "string with spaces",
			input:    "This is a test",
			expected: "This is a test",
		},

		// Strings with control characters
		{
			name:     "string with null bytes",
			input:    "Hello\x00World",
			expected: "HelloWorld",
		},
		{
			name:     "string with control characters",
			input:    "Test\x01\x02\x03Message",
			expected: "TestMessage",
		},
		{
			name:     "preserve newlines",
			input:    "Line 1\nLine 2",
			expected: "Line 1\nLine 2",
		},
		{
			name:     "preserve tabs",
			input:    "Column1\tColumn2",
			expected: "Column1\tColumn2",
		},
		{
			name:     "preserve carriage return",
			input:    "Line 1\r\nLine 2",
			expected: "Line 1\r\nLine 2",
		},

		// Strings with whitespace
		{
			name:     "trim leading whitespace",
			input:    "   Hello",
			expected: "Hello",
		},
		{
			name:     "trim trailing whitespace",
			input:    "Hello   ",
			expected: "Hello",
		},
		{
			name:     "trim both sides",
			input:    "   Hello   ",
			expected: "Hello",
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
			expected: "",
		},
		{
			name:     "only control characters",
			input:    "\x00\x01\x02",
			expected: "",
		},
	}

	validator := New()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := validator.SanitizeString(tt.input)
			if result != tt.expected {
				t.Errorf("SanitizeString(%q) = %q, want %q", tt.input, result, tt.expected)
			}
		})
	}
}

// Benchmark tests
func BenchmarkValidator_ValidateEmail(b *testing.B) {
	validator := New()
	email := "user@example.com"

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = validator.ValidateEmail(email)
	}
}

func BenchmarkValidator_ValidatePassword(b *testing.B) {
	validator := New()
	password := "SecurePassword123"

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = validator.ValidatePassword(password)
	}
}

func BenchmarkValidator_SanitizeString(b *testing.B) {
	validator := New()
	input := "Hello\x00World\x01Test\x02Message"

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = validator.SanitizeString(input)
	}
}

// Test password strength with common weak passwords
func TestValidator_WeakPasswords(t *testing.T) {
	weakPasswords := []string{
		"password",
		"12345678",
		"qwerty",
		"abc12345",
		"Password",  // missing number
		"password1", // missing uppercase
		"PASSWORD1", // missing lowercase
	}

	validator := New()
	for _, password := range weakPasswords {
		t.Run(password, func(t *testing.T) {
			err := validator.ValidatePassword(password)
			if err == nil {
				t.Errorf("ValidatePassword(%q) should reject weak password", password)
			}
		})
	}
}

// Test email validation with common invalid formats
func TestValidator_InvalidEmails(t *testing.T) {
	invalidEmails := []string{
		"plaintext",
		"@example.com",
		"user@",
		"user @example.com",
		"user@example",
		"user..name@example.com",
		"user@.example.com",
	}

	validator := New()
	for _, email := range invalidEmails {
		t.Run(email, func(t *testing.T) {
			err := validator.ValidateEmail(email)
			if err == nil {
				t.Errorf("ValidateEmail(%q) should reject invalid email", email)
			}
		})
	}
}

// Test file validation with malicious extensions
func TestValidator_MaliciousExtensions(t *testing.T) {
	maliciousFiles := []struct {
		filename string
		allowed  []string
	}{
		{"virus.exe", []string{".txt", ".pdf"}},
		{"malware.bat", []string{".txt", ".pdf"}},
		{"script.js", []string{".txt", ".pdf"}},
		{"payload.php", []string{".txt", ".pdf"}},
		{"trojan.scr", []string{".txt", ".pdf"}},
	}

	validator := New()
	for _, test := range maliciousFiles {
		t.Run(test.filename, func(t *testing.T) {
			err := validator.ValidateFileExtension(test.filename, test.allowed)
			if err == nil {
				t.Errorf("ValidateFileExtension(%q) should reject malicious file", test.filename)
			}
		})
	}
}
