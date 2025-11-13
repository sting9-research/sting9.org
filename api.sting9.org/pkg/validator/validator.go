package validator

import (
	"fmt"
	"net/mail"
	"strings"
)

// Validator provides input validation utilities
type Validator struct{}

// New creates a new Validator instance
func New() *Validator {
	return &Validator{}
}

// ValidateEmail checks if an email address is valid
func (v *Validator) ValidateEmail(email string) error {
	if email == "" {
		return fmt.Errorf("email is required")
	}

	_, err := mail.ParseAddress(email)
	if err != nil {
		return fmt.Errorf("invalid email address")
	}

	// Check for TLD (top-level domain)
	parts := strings.Split(email, "@")
	if len(parts) != 2 {
		return fmt.Errorf("invalid email address")
	}

	domain := parts[1]
	if !strings.Contains(domain, ".") {
		return fmt.Errorf("invalid email address: missing top-level domain")
	}

	return nil
}

// ValidatePassword checks password strength
func (v *Validator) ValidatePassword(password string) error {
	if len(password) < 8 {
		return fmt.Errorf("at least 8 characters")
	}

	// Check for at least one number, one uppercase, one lowercase
	hasNumber := false
	hasUpper := false
	hasLower := false

	for _, char := range password {
		switch {
		case char >= '0' && char <= '9':
			hasNumber = true
		case char >= 'A' && char <= 'Z':
			hasUpper = true
		case char >= 'a' && char <= 'z':
			hasLower = true
		}
	}

	if !hasNumber {
		return fmt.Errorf("at least one number")
	}
	if !hasUpper {
		return fmt.Errorf("at least one uppercase")
	}
	if !hasLower {
		return fmt.Errorf("at least one lowercase")
	}

	return nil
}

// ValidateSubmissionType checks if submission type is valid
func (v *Validator) ValidateSubmissionType(submissionType string) error {
	validTypes := map[string]bool{
		"email":        true,
		"sms":          true,
		"whatsapp":     true,
		"telegram":     true,
		"signal":       true,
		"social_media": true,
		"other":        true,
	}

	if !validTypes[submissionType] {
		return fmt.Errorf("invalid submission type: %s", submissionType)
	}

	return nil
}

// ValidateFileExtension checks if file extension is allowed
func (v *Validator) ValidateFileExtension(filename string, allowedExtensions []string) error {
	if filename == "" {
		return fmt.Errorf("filename is required")
	}

	// Check if file has an extension
	lastDot := strings.LastIndex(filename, ".")
	if lastDot == -1 || lastDot == len(filename)-1 {
		return fmt.Errorf("filename has no extension")
	}

	ext := strings.ToLower(filename[lastDot:])

	for _, allowed := range allowedExtensions {
		if ext == strings.ToLower(allowed) {
			return nil
		}
	}

	return fmt.Errorf("file extension %s is not allowed", ext)
}

// ValidateFileSize checks if file size is within limits
func (v *Validator) ValidateFileSize(size int64, maxSize int64) error {
	if size > maxSize {
		return fmt.Errorf("file size %d bytes exceeds maximum of %d bytes", size, maxSize)
	}
	return nil
}

// SanitizeString removes potentially dangerous characters
func (v *Validator) SanitizeString(input string) string {
	// Remove null bytes and control characters
	result := strings.Map(func(r rune) rune {
		if r == 0 || (r < 32 && r != '\n' && r != '\r' && r != '\t') {
			return -1
		}
		return r
	}, input)

	return strings.TrimSpace(result)
}
