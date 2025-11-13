package testutil

import (
	"database/sql"
	"fmt"
	"testing"

	_ "github.com/mattn/go-sqlite3"
)

// SetupTestDB creates a fresh in-memory SQLite database for testing
// Each test gets an isolated database that's automatically cleaned up
func SetupTestDB(t *testing.T) *sql.DB {
	t.Helper()

	// Create in-memory SQLite database
	// Using ":memory:" gives each connection its own isolated database
	db, err := sql.Open("sqlite3", ":memory:")
	if err != nil {
		t.Fatalf("Failed to create test database: %v", err)
	}

	// Enable foreign keys (disabled by default in SQLite)
	_, err = db.Exec("PRAGMA foreign_keys = ON")
	if err != nil {
		t.Fatalf("Failed to enable foreign keys: %v", err)
	}

	// Set other pragmas for better performance in tests
	_, err = db.Exec("PRAGMA journal_mode = MEMORY")
	if err != nil {
		t.Fatalf("Failed to set journal mode: %v", err)
	}

	_, err = db.Exec("PRAGMA synchronous = OFF")
	if err != nil {
		t.Fatalf("Failed to set synchronous mode: %v", err)
	}

	// Run migrations to create schema
	if err := runMigrations(db); err != nil {
		db.Close()
		t.Fatalf("Failed to run migrations: %v", err)
	}

	return db
}

// TeardownTestDB closes the test database
func TeardownTestDB(t *testing.T, db *sql.DB) {
	t.Helper()
	if err := db.Close(); err != nil {
		t.Errorf("Failed to close test database: %v", err)
	}
}

// runMigrations creates the SQLite schema (SQLite-compatible version of PostgreSQL schema)
func runMigrations(db *sql.DB) error {
	migrations := []string{
		createSubmissionsTable,
		createUsersTable,
		createAPITokensTable,
		createStatisticsTable,
	}

	for i, migration := range migrations {
		if _, err := db.Exec(migration); err != nil {
			return fmt.Errorf("migration %d failed: %w", i+1, err)
		}
	}

	return nil
}

// SQLite-compatible schema definitions
// Differences from PostgreSQL:
// - UUID -> TEXT (store as string)
// - JSONB -> TEXT (store as JSON string)
// - TIMESTAMPTZ -> DATETIME
// - ENUM -> TEXT with CHECK constraints
// - gen_random_uuid() -> handled in Go code
// - NOW() -> CURRENT_TIMESTAMP
// - No triggers (handle updated_at in application code for tests)

const createSubmissionsTable = `
CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK(type IN ('email', 'sms', 'whatsapp', 'telegram', 'signal', 'social_media', 'other')),
    raw_content TEXT NOT NULL,
    anonymized_content TEXT,
    metadata TEXT DEFAULT '{}',
    language TEXT,
    category TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'processed', 'flagged', 'approved', 'rejected')),
    submitter_ip TEXT,
    user_agent TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at DATETIME,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

CREATE INDEX idx_submissions_type ON submissions(type) WHERE deleted_at IS NULL;
CREATE INDEX idx_submissions_status ON submissions(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_submissions_category ON submissions(category) WHERE deleted_at IS NULL;
CREATE INDEX idx_submissions_language ON submissions(language) WHERE deleted_at IS NULL;
CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);
`

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'researcher' CHECK(role IN ('researcher', 'partner', 'admin')),
    organization TEXT,
    purpose TEXT,
    verified INTEGER NOT NULL DEFAULT 0,
    approved INTEGER NOT NULL DEFAULT 0,
    verification_token TEXT,
    verification_expires_at DATETIME,
    reset_token TEXT,
    reset_expires_at DATETIME,
    last_login_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_verified ON users(verified) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_approved ON users(approved) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_verification_token ON users(verification_token) WHERE verification_token IS NOT NULL;
CREATE INDEX idx_users_reset_token ON users(reset_token) WHERE reset_token IS NOT NULL;
`

const createAPITokensTable = `
CREATE TABLE IF NOT EXISTS api_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token_hash TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    revoked INTEGER NOT NULL DEFAULT 0,
    revoked_at DATETIME,
    last_used_at DATETIME,
    user_agent TEXT,
    ip_address TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_api_tokens_user_id ON api_tokens(user_id);
CREATE INDEX idx_api_tokens_token_hash ON api_tokens(token_hash) WHERE NOT revoked;
CREATE INDEX idx_api_tokens_expires_at ON api_tokens(expires_at);
CREATE INDEX idx_api_tokens_revoked ON api_tokens(revoked);
`

const createStatisticsTable = `
CREATE TABLE IF NOT EXISTS statistics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    total_submissions INTEGER NOT NULL DEFAULT 0,
    submissions_by_type TEXT DEFAULT '{}',
    submissions_by_category TEXT DEFAULT '{}',
    submissions_by_status TEXT DEFAULT '{}',
    languages_detected TEXT DEFAULT '{}',
    submissions_by_date TEXT DEFAULT '{}',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial row
INSERT INTO statistics (total_submissions) VALUES (0);
`

// ResetDatabase clears all data from the database (useful for cleanup between tests)
func ResetDatabase(t *testing.T, db *sql.DB) {
	t.Helper()

	tables := []string{"api_tokens", "submissions", "users"}
	for _, table := range tables {
		_, err := db.Exec(fmt.Sprintf("DELETE FROM %s", table))
		if err != nil {
			t.Errorf("Failed to clear table %s: %v", table, err)
		}
	}

	// Reset statistics
	_, err := db.Exec("UPDATE statistics SET total_submissions = 0, submissions_by_type = '{}', submissions_by_category = '{}', submissions_by_status = '{}', languages_detected = '{}', submissions_by_date = '{}', updated_at = CURRENT_TIMESTAMP WHERE id = 1")
	if err != nil {
		t.Errorf("Failed to reset statistics: %v", err)
	}
}

// GetStats returns the current statistics from the database
func GetStats(t *testing.T, db *sql.DB) map[string]interface{} {
	t.Helper()

	var totalSubmissions int64
	var submissionsByType, submissionsByCategory, submissionsByStatus, languagesDetected, submissionsByDate string

	err := db.QueryRow(`
		SELECT total_submissions, submissions_by_type, submissions_by_category,
		       submissions_by_status, languages_detected, submissions_by_date
		FROM statistics WHERE id = 1
	`).Scan(&totalSubmissions, &submissionsByType, &submissionsByCategory,
		&submissionsByStatus, &languagesDetected, &submissionsByDate)

	if err != nil {
		t.Fatalf("Failed to get statistics: %v", err)
	}

	return map[string]interface{}{
		"total_submissions":        totalSubmissions,
		"submissions_by_type":      submissionsByType,
		"submissions_by_category":  submissionsByCategory,
		"submissions_by_status":    submissionsByStatus,
		"languages_detected":       languagesDetected,
		"submissions_by_date":      submissionsByDate,
	}
}

// UpdateStats manually updates statistics (simulating the PostgreSQL function)
func UpdateStats(t *testing.T, db *sql.DB) {
	t.Helper()

	// Count total submissions
	var totalSubmissions int64
	err := db.QueryRow("SELECT COUNT(*) FROM submissions WHERE deleted_at IS NULL").Scan(&totalSubmissions)
	if err != nil {
		t.Fatalf("Failed to count submissions: %v", err)
	}

	// For simplicity in tests, we'll just update the total
	// Full aggregation can be done in application code or more complex test helpers
	_, err = db.Exec(`
		UPDATE statistics
		SET total_submissions = ?, updated_at = CURRENT_TIMESTAMP
		WHERE id = 1
	`, totalSubmissions)

	if err != nil {
		t.Fatalf("Failed to update statistics: %v", err)
	}
}
