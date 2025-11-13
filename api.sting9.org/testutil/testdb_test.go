package testutil

import (
	"testing"

	"api.sting9.org/internal/models"
)

// TestSetupTestDB verifies that the test database can be created successfully
func TestSetupTestDB(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(t, db)

	// Verify database is accessible
	err := db.Ping()
	if err != nil {
		t.Errorf("Failed to ping database: %v", err)
	}

	// Verify tables exist
	tables := []string{"submissions", "users", "api_tokens", "statistics"}
	for _, table := range tables {
		var name string
		err := db.QueryRow("SELECT name FROM sqlite_master WHERE type='table' AND name=?", table).Scan(&name)
		if err != nil {
			t.Errorf("Table %s does not exist: %v", table, err)
		}
	}
}

// TestCreateTestSubmissionInDB verifies fixture creation
func TestCreateTestSubmissionInDB(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(t, db)

	// Create test submission
	id := CreateTestSubmissionInDB(t, db, models.SubmissionTypeEmail, "Test phishing email")

	// Verify it was created
	submission := GetSubmissionByID(t, db, id)
	if submission == nil {
		t.Fatal("Submission not found")
	}

	if submission.ID != id {
		t.Errorf("ID mismatch: got %v, want %v", submission.ID, id)
	}

	if submission.Type != models.SubmissionTypeEmail {
		t.Errorf("Type mismatch: got %v, want %v", submission.Type, models.SubmissionTypeEmail)
	}

	if submission.Content != "Test phishing email" {
		t.Errorf("Content mismatch: got %v, want %v", submission.Content, "Test phishing email")
	}

	if submission.Status != models.SubmissionStatusPending {
		t.Errorf("Status mismatch: got %v, want %v", submission.Status, models.SubmissionStatusPending)
	}
}

// TestCreateTestUserInDB verifies user fixture creation
func TestCreateTestUserInDB(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(t, db)

	// Create test user
	email := "test@example.com"
	password := "TestPassword123!"
	id := CreateTestUserInDB(t, db, email, password, models.UserRoleResearcher, true, true)

	// Verify it was created
	user := GetUserByID(t, db, id)
	if user == nil {
		t.Fatal("User not found")
	}

	if user.Email != email {
		t.Errorf("Email mismatch: got %v, want %v", user.Email, email)
	}

	if user.Role != models.UserRoleResearcher {
		t.Errorf("Role mismatch: got %v, want %v", user.Role, models.UserRoleResearcher)
	}

	if !user.Verified {
		t.Error("User should be verified")
	}

	if !user.Approved {
		t.Error("User should be approved")
	}
}

// TestResetDatabase verifies database reset functionality
func TestResetDatabase(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(t, db)

	// Create some data
	CreateTestSubmissionInDB(t, db, models.SubmissionTypeEmail, "Test 1")
	CreateTestSubmissionInDB(t, db, models.SubmissionTypeSMS, "Test 2")
	CreateTestUserInDB(t, db, "user1@test.com", "password", models.UserRoleResearcher, true, true)

	// Verify data exists
	if CountSubmissions(t, db) != 2 {
		t.Errorf("Expected 2 submissions, got %d", CountSubmissions(t, db))
	}

	if CountUsers(t, db) != 1 {
		t.Errorf("Expected 1 user, got %d", CountUsers(t, db))
	}

	// Reset database
	ResetDatabase(t, db)

	// Verify data is cleared
	if CountSubmissions(t, db) != 0 {
		t.Errorf("Expected 0 submissions after reset, got %d", CountSubmissions(t, db))
	}

	if CountUsers(t, db) != 0 {
		t.Errorf("Expected 0 users after reset, got %d", CountUsers(t, db))
	}
}

// TestParallelDatabases verifies that parallel tests get isolated databases
func TestParallelDatabases(t *testing.T) {
	t.Parallel()

	t.Run("Test1", func(t *testing.T) {
		t.Parallel()
		db := SetupTestDB(t)
		defer TeardownTestDB(t, db)

		CreateTestSubmissionInDB(t, db, models.SubmissionTypeEmail, "Test 1")

		if CountSubmissions(t, db) != 1 {
			t.Errorf("Test1: Expected 1 submission, got %d", CountSubmissions(t, db))
		}
	})

	t.Run("Test2", func(t *testing.T) {
		t.Parallel()
		db := SetupTestDB(t)
		defer TeardownTestDB(t, db)

		CreateTestSubmissionInDB(t, db, models.SubmissionTypeSMS, "Test 2")
		CreateTestSubmissionInDB(t, db, models.SubmissionTypeSMS, "Test 3")

		if CountSubmissions(t, db) != 2 {
			t.Errorf("Test2: Expected 2 submissions, got %d", CountSubmissions(t, db))
		}
	})

	t.Run("Test3", func(t *testing.T) {
		t.Parallel()
		db := SetupTestDB(t)
		defer TeardownTestDB(t, db)

		// Empty database
		if CountSubmissions(t, db) != 0 {
			t.Errorf("Test3: Expected 0 submissions, got %d", CountSubmissions(t, db))
		}
	})
}

// TestForeignKeyConstraints verifies foreign key enforcement
func TestForeignKeyConstraints(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(t, db)

	// Create user
	userID, _, _ := CreateResearcherUser(t, db)

	// Create API token
	tokenHash := "test_token_hash"
	expiresAt := GetFutureTime(24)
	tokenID := CreateAPIToken(t, db, userID, tokenHash, expiresAt)

	// Verify token was created
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM api_tokens WHERE id = ?", tokenID.String()).Scan(&count)
	if err != nil || count != 1 {
		t.Error("API token was not created")
	}

	// Delete user (should cascade to tokens)
	_, err = db.Exec("DELETE FROM users WHERE id = ?", userID.String())
	if err != nil {
		t.Fatalf("Failed to delete user: %v", err)
	}

	// Verify token was deleted due to cascade
	err = db.QueryRow("SELECT COUNT(*) FROM api_tokens WHERE id = ?", tokenID.String()).Scan(&count)
	if err != nil || count != 0 {
		t.Error("API token should have been deleted via cascade")
	}
}

// TestCheckConstraints verifies CHECK constraints on enum-like fields
func TestCheckConstraints(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(t, db)

	// Valid submission type should work
	_, err := db.Exec(`
		INSERT INTO submissions (id, type, raw_content, metadata, status, created_at, updated_at)
		VALUES (?, 'email', 'test', '{}', 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
	`, "test-id-1")

	if err != nil {
		t.Errorf("Valid submission type failed: %v", err)
	}

	// Invalid submission type should fail
	_, err = db.Exec(`
		INSERT INTO submissions (id, type, raw_content, metadata, status, created_at, updated_at)
		VALUES (?, 'invalid_type', 'test', '{}', 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
	`, "test-id-2")

	if err == nil {
		t.Error("Invalid submission type should have failed CHECK constraint")
	}

	// Invalid status should fail
	_, err = db.Exec(`
		INSERT INTO submissions (id, type, raw_content, metadata, status, created_at, updated_at)
		VALUES (?, 'email', 'test', '{}', 'invalid_status', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
	`, "test-id-3")

	if err == nil {
		t.Error("Invalid status should have failed CHECK constraint")
	}
}
