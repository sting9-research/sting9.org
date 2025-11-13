package testutil

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"testing"
	"time"

	"api.sting9.org/internal/models"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// Test data fixtures for consistent testing

var (
	// Test user data
	TestUserEmail    = "researcher@test.com"
	TestUserPassword = "Test123!@#"
	TestUserRole     = "researcher"

	TestAdminEmail    = "admin@test.com"
	TestAdminPassword = "Admin123!@#"
	TestAdminRole     = "admin"

	TestPartnerEmail    = "partner@test.com"
	TestPartnerPassword = "Partner123!@#"
	TestPartnerRole     = "partner"

	// Sample phishing messages
	PhishingEmailSamples = []string{
		"Your account has been suspended. Click here to verify your identity immediately.",
		"Unusual activity detected. Confirm your account details or we will close your account.",
		"Security alert! Your account will be limited. Update your payment information now.",
		"You've won a prize! Click this link to claim your $1000 gift card.",
		"URGENT: Your package delivery failed. Click to reschedule: http://fake-tracking.com",
	}

	// Sample smishing messages
	SmishingSamples = []string{
		"Your package delivery failed. Track here: http://fake-delivery.com",
		"You've won! Text CLAIM to 12345 to get your free iPhone",
		"USPS: Package delivery failed. Reschedule at http://fake-usps.com",
		"Your subscription will expire. Reply RENEW to continue service.",
		"Click to view your Amazon order: http://amaz0n-track.com",
	}

	// Sample BEC (Business Email Compromise) messages
	BECSamples = []string{
		"This is the CEO. I need you to wire transfer $50,000 to this vendor immediately. Confidential.",
		"Invoice attached. Please update our bank details for vendor payments going forward.",
		"Urgent wire transfer needed. Change payment information to new account.",
	}

	// Sample tech support scam messages
	TechSupportScamSamples = []string{
		"Microsoft Security Alert: Your computer has been infected with a virus. Call 1-800-FAKE-SUP",
		"Apple Support: Your iCloud account shows suspicious activity. Verify now.",
		"Your antivirus subscription has expired. Renew now or your computer is at risk.",
	}

	// Sample romance scam messages
	RomanceScamSamples = []string{
		"I've fallen in love with you. I need $5000 to buy a plane ticket to meet you.",
		"My darling, I'm stuck overseas. Please send money via Western Union so I can come home.",
		"I love you so much. Can you help me with $2000 for an emergency?",
	}

	// Messages with various PII types
	PIISamples = map[string]string{
		"email":         "Contact me at john.doe@example.com or jane@test.org for more information.",
		"phone":         "Call me at (555) 123-4567 or text 555-987-6543 anytime.",
		"ssn":           "My social security number is 123-45-6789 for verification.",
		"credit_card":   "Use card 4532-1234-5678-9010 or 5425233430109903 for payment.",
		"ip_address":    "Connect to server at 192.168.1.1 or 2001:0db8:85a3::8a2e:0370:7334",
		"address":       "Send mail to 123 Main Street, Anytown, CA 12345",
		"account":       "Account #123456789 or Account Number: 9876543210",
		"mixed":         "Email bob@test.com, call 555-1234, SSN 123-45-6789, card 4532123456789010",
		"international": "Call +1-555-123-4567 or +44 20 7946 0958 for support",
	}

	// Clean messages (no PII)
	CleanSamples = []string{
		"This is a test message with no personal information.",
		"The weather is nice today. How are you doing?",
		"Meeting scheduled for tomorrow at the office.",
	}
)

// CreateTestSubmissionRequest creates a test submission request
func CreateTestSubmissionRequest(submissionType models.SubmissionType, content string) models.CreateSubmissionRequest {
	return models.CreateSubmissionRequest{
		Type:    submissionType,
		Content: content,
		Metadata: models.SubmissionMetadata{
			Subject: "Test Subject",
			From:    "sender@example.com",
			To:      "receiver@example.com",
			URLs:    []string{"http://example.com"},
		},
	}
}

// CreateTestSubmission creates a test submission model
func CreateTestSubmission(submissionType models.SubmissionType, content string) models.SubmissionResponse {
	id := uuid.New()
	now := time.Now()
	anonymized := "[EMAIL_REDACTED] content"
	lang := "en"
	cat := "phishing"

	return models.SubmissionResponse{
		ID:                id,
		Type:              submissionType,
		Content:           content,
		AnonymizedContent: &anonymized,
		Language:          &lang,
		Category:          &cat,
		Status:            models.SubmissionStatusProcessed,
		CreatedAt:         now,
		ProcessedAt:       &now,
		Metadata: models.SubmissionMetadata{
			Subject: "Test Subject",
			From:    "sender@example.com",
			To:      "receiver@example.com",
		},
	}
}

// GetPhishingExamples returns various phishing examples for testing
func GetPhishingExamples() map[string][]string {
	return map[string][]string{
		"phishing":            PhishingEmailSamples,
		"smishing":            SmishingSamples,
		"bec":                 BECSamples,
		"tech_support_scam":   TechSupportScamSamples,
		"romance_scam":        RomanceScamSamples,
	}
}

// GetPIIExamples returns various PII examples for testing anonymization
func GetPIIExamples() map[string]string {
	return PIISamples
}

// GetCleanExamples returns messages without PII
func GetCleanExamples() []string {
	return CleanSamples
}

// TestEmailHeaders returns sample email headers for testing
func TestEmailHeaders() map[string]string {
	return map[string]string{
		"From":                      "sender@example.com",
		"To":                        "receiver@example.com",
		"Subject":                   "Test Email Subject",
		"Date":                      "Mon, 12 Nov 2025 10:00:00 -0800",
		"Message-ID":                "<test@example.com>",
		"Content-Type":              "text/plain; charset=utf-8",
		"MIME-Version":              "1.0",
		"X-Mailer":                  "Test Mailer",
		"Return-Path":               "sender@example.com",
		"Received":                  "from mail.example.com",
	}
}

// TestRawEmail returns a sample raw email for parsing tests
func TestRawEmail() string {
	return `From: sender@example.com
To: receiver@example.com
Subject: Urgent Account Verification Required
Date: Mon, 12 Nov 2025 10:00:00 -0800
Message-ID: <test@example.com>
Content-Type: text/plain; charset=utf-8

Dear Customer,

Your account has been suspended due to unusual activity.

Please click the link below to verify your identity:
http://fake-bank.com/verify

Failure to verify within 24 hours will result in permanent account closure.

Thank you,
Security Team
`
}

// TestHTMLEmail returns a sample HTML email for parsing tests
func TestHTMLEmail() string {
	return `<html>
<head>
<style>
body { font-family: Arial; }
</style>
<script>
// Some tracking script
</script>
</head>
<body>
<h1>Account Alert</h1>
<p>Your account needs verification.</p>
<p>Click <a href="http://phishing.com">here</a> to verify.</p>
<br/>
<p>Thank you</p>
</body>
</html>`
}

// TestURLs returns various URLs for testing
func TestURLs() []string {
	return []string{
		"http://example.com",
		"https://secure.example.com/path?param=value",
		"http://fake-bank.com/verify",
		"https://phishing-site.com/login",
		"http://192.168.1.1:8080/admin",
	}
}

// LanguageExamples returns text in different languages for testing
func LanguageExamples() map[string]string {
	return map[string]string{
		"en": "Hello, this is a test message in English. Your account has been suspended.",
		"es": "Hola, este es un mensaje de prueba en español. Su cuenta ha sido suspendida.",
		"fr": "Bonjour, ceci est un message de test en français. Votre compte a été suspendu.",
		"de": "Hallo, dies ist eine Testnachricht auf Deutsch. Ihr Konto wurde gesperrt.",
		"zh": "你好，这是中文测试消息。您的帐户已被暂停。",
		"ar": "مرحبا، هذه رسالة اختبار باللغة العربية. تم تعليق حسابك.",
		"ru": "Привет, это тестовое сообщение на русском языке. Ваш аккаунт заблокирован.",
	}
}

// Database fixture functions for SQLite

// CreateTestSubmissionInDB inserts a test submission into the SQLite database
func CreateTestSubmissionInDB(t *testing.T, db *sql.DB, submissionType models.SubmissionType, content string) uuid.UUID {
	t.Helper()

	id := uuid.New()
	metadata, _ := json.Marshal(models.SubmissionMetadata{
		Subject: "Test Subject",
		From:    "sender@example.com",
		To:      "receiver@example.com",
		URLs:    []string{"http://example.com"},
	})

	query := `
		INSERT INTO submissions (id, type, raw_content, metadata, status, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
	`

	_, err := db.Exec(query, id.String(), string(submissionType), content, string(metadata), string(models.SubmissionStatusPending))
	if err != nil {
		t.Fatalf("Failed to create test submission: %v", err)
	}

	return id
}

// CreateTestSubmissionWithStatus inserts a test submission with specific status
func CreateTestSubmissionWithStatus(t *testing.T, db *sql.DB, submissionType models.SubmissionType, content string, status models.SubmissionStatus) uuid.UUID {
	t.Helper()

	id := uuid.New()
	metadata, _ := json.Marshal(models.SubmissionMetadata{
		Subject: "Test Subject",
	})

	query := `
		INSERT INTO submissions (id, type, raw_content, metadata, status, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
	`

	_, err := db.Exec(query, id.String(), string(submissionType), content, string(metadata), string(status))
	if err != nil {
		t.Fatalf("Failed to create test submission with status: %v", err)
	}

	return id
}

// CreateProcessedSubmission inserts a processed submission with anonymized content
func CreateProcessedSubmission(t *testing.T, db *sql.DB, submissionType models.SubmissionType, rawContent, anonymizedContent string, language, category *string) uuid.UUID {
	t.Helper()

	id := uuid.New()
	metadata, _ := json.Marshal(models.SubmissionMetadata{})

	query := `
		INSERT INTO submissions (id, type, raw_content, anonymized_content, metadata, language, category, status, processed_at, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
	`

	_, err := db.Exec(query, id.String(), string(submissionType), rawContent, anonymizedContent, string(metadata), language, category, string(models.SubmissionStatusProcessed))
	if err != nil {
		t.Fatalf("Failed to create processed submission: %v", err)
	}

	return id
}

// CreateTestUser inserts a test user into the SQLite database
func CreateTestUserInDB(t *testing.T, db *sql.DB, email, password string, role models.UserRole, verified, approved bool) uuid.UUID {
	t.Helper()

	id := uuid.New()

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		t.Fatalf("Failed to hash password: %v", err)
	}

	query := `
		INSERT INTO users (id, email, password_hash, role, verified, approved, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
	`

	verifiedInt := 0
	if verified {
		verifiedInt = 1
	}
	approvedInt := 0
	if approved {
		approvedInt = 1
	}

	_, err = db.Exec(query, id.String(), email, string(hashedPassword), string(role), verifiedInt, approvedInt)
	if err != nil {
		t.Fatalf("Failed to create test user: %v", err)
	}

	return id
}

// CreateTestUserWithOrg inserts a test user with organization details
func CreateTestUserWithOrg(t *testing.T, db *sql.DB, email, password string, role models.UserRole, organization, purpose string, verified, approved bool) uuid.UUID {
	t.Helper()

	id := uuid.New()

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		t.Fatalf("Failed to hash password: %v", err)
	}

	query := `
		INSERT INTO users (id, email, password_hash, role, organization, purpose, verified, approved, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
	`

	verifiedInt := 0
	if verified {
		verifiedInt = 1
	}
	approvedInt := 0
	if approved {
		approvedInt = 1
	}

	_, err = db.Exec(query, id.String(), email, string(hashedPassword), string(role), organization, purpose, verifiedInt, approvedInt)
	if err != nil {
		t.Fatalf("Failed to create test user with organization: %v", err)
	}

	return id
}

// CreateAdminUser creates an admin user (verified and approved)
func CreateAdminUser(t *testing.T, db *sql.DB) (uuid.UUID, string, string) {
	t.Helper()

	email := fmt.Sprintf("admin-%s@test.com", uuid.New().String()[:8])
	password := "AdminPassword123!"
	id := CreateTestUserInDB(t, db, email, password, models.UserRoleAdmin, true, true)

	return id, email, password
}

// CreateResearcherUser creates a researcher user (verified and approved)
func CreateResearcherUser(t *testing.T, db *sql.DB) (uuid.UUID, string, string) {
	t.Helper()

	email := fmt.Sprintf("researcher-%s@test.com", uuid.New().String()[:8])
	password := "ResearcherPassword123!"
	id := CreateTestUserWithOrg(t, db, email, password, models.UserRoleResearcher, "Test University", "Research on phishing detection", true, true)

	return id, email, password
}

// CreatePartnerUser creates a partner user (verified and approved)
func CreatePartnerUser(t *testing.T, db *sql.DB) (uuid.UUID, string, string) {
	t.Helper()

	email := fmt.Sprintf("partner-%s@test.com", uuid.New().String()[:8])
	password := "PartnerPassword123!"
	id := CreateTestUserWithOrg(t, db, email, password, models.UserRolePartner, "Security Corp", "Contribute phishing data from our customers", true, true)

	return id, email, password
}

// CreateAPIToken inserts an API token for a user
func CreateAPIToken(t *testing.T, db *sql.DB, userID uuid.UUID, tokenHash string, expiresAt time.Time) uuid.UUID {
	t.Helper()

	id := uuid.New()

	query := `
		INSERT INTO api_tokens (id, user_id, token_hash, expires_at, revoked, created_at)
		VALUES (?, ?, ?, ?, 0, CURRENT_TIMESTAMP)
	`

	_, err := db.Exec(query, id.String(), userID.String(), tokenHash, expiresAt.Format(time.RFC3339))
	if err != nil {
		t.Fatalf("Failed to create API token: %v", err)
	}

	return id
}

// GetSubmissionByID retrieves a submission from the database
func GetSubmissionByID(t *testing.T, db *sql.DB, id uuid.UUID) *models.SubmissionResponse {
	t.Helper()

	var submission models.SubmissionResponse
	var submissionType, status, metadataJSON string
	var anonymizedContent, language, category sql.NullString
	var processedAt sql.NullTime

	query := `
		SELECT id, type, raw_content, anonymized_content, metadata, language, category, status, created_at, processed_at
		FROM submissions
		WHERE id = ? AND deleted_at IS NULL
	`

	err := db.QueryRow(query, id.String()).Scan(
		&submission.ID, &submissionType, &submission.Content, &anonymizedContent,
		&metadataJSON, &language, &category, &status, &submission.CreatedAt, &processedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil
		}
		t.Fatalf("Failed to get submission: %v", err)
	}

	submission.Type = models.SubmissionType(submissionType)
	submission.Status = models.SubmissionStatus(status)

	if anonymizedContent.Valid {
		submission.AnonymizedContent = &anonymizedContent.String
	}
	if language.Valid {
		submission.Language = &language.String
	}
	if category.Valid {
		submission.Category = &category.String
	}
	if processedAt.Valid {
		submission.ProcessedAt = &processedAt.Time
	}

	json.Unmarshal([]byte(metadataJSON), &submission.Metadata)

	return &submission
}

// GetUserByID retrieves a user from the database
func GetUserByID(t *testing.T, db *sql.DB, id uuid.UUID) *models.UserResponse {
	t.Helper()

	var user models.UserResponse
	var role string
	var organization sql.NullString
	var verified, approved int

	query := `
		SELECT id, email, role, organization, verified, approved, created_at
		FROM users
		WHERE id = ? AND deleted_at IS NULL
	`

	err := db.QueryRow(query, id.String()).Scan(
		&user.ID, &user.Email, &role, &organization, &verified, &approved, &user.CreatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil
		}
		t.Fatalf("Failed to get user: %v", err)
	}

	user.Role = models.UserRole(role)
	user.Verified = verified == 1
	user.Approved = approved == 1

	if organization.Valid {
		user.Organization = &organization.String
	}

	return &user
}

// GetUserByEmail retrieves a user by email
func GetUserByEmail(t *testing.T, db *sql.DB, email string) *models.UserResponse {
	t.Helper()

	var user models.UserResponse
	var role string
	var organization sql.NullString
	var verified, approved int

	query := `
		SELECT id, email, role, organization, verified, approved, created_at
		FROM users
		WHERE email = ? AND deleted_at IS NULL
	`

	err := db.QueryRow(query, email).Scan(
		&user.ID, &user.Email, &role, &organization, &verified, &approved, &user.CreatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil
		}
		t.Fatalf("Failed to get user by email: %v", err)
	}

	user.Role = models.UserRole(role)
	user.Verified = verified == 1
	user.Approved = approved == 1

	if organization.Valid {
		user.Organization = &organization.String
	}

	return &user
}

// CountSubmissions counts submissions in the database
func CountSubmissions(t *testing.T, db *sql.DB) int {
	t.Helper()

	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM submissions WHERE deleted_at IS NULL").Scan(&count)
	if err != nil {
		t.Fatalf("Failed to count submissions: %v", err)
	}
	return count
}

// CountUsers counts users in the database
func CountUsers(t *testing.T, db *sql.DB) int {
	t.Helper()

	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM users WHERE deleted_at IS NULL").Scan(&count)
	if err != nil {
		t.Fatalf("Failed to count users: %v", err)
	}
	return count
}
