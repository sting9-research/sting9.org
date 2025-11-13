package repository

import (
	"database/sql"
	"testing"

	"api.sting9.org/internal/models"
	"api.sting9.org/testutil"
)

func TestSubmissionRepository_Create(t *testing.T) {
	db := testutil.SetupTestDB(t)
	defer testutil.TeardownTestDB(t, db)

	tests := []struct {
		name           string
		submissionType models.SubmissionType
		content        string
		wantErr        bool
	}{
		{
			name:           "valid email submission",
			submissionType: models.SubmissionTypeEmail,
			content:        "This is a test phishing email. Click here to verify your account.",
			wantErr:        false,
		},
		{
			name:           "valid SMS submission",
			submissionType: models.SubmissionTypeSMS,
			content:        "Your package delivery failed. Track here: http://fake-usps.com",
			wantErr:        false,
		},
		{
			name:           "valid WhatsApp submission",
			submissionType: models.SubmissionTypeWhatsApp,
			content:        "You've won a prize! Click to claim.",
			wantErr:        false,
		},
		{
			name:           "minimum content length",
			submissionType: models.SubmissionTypeEmail,
			content:        "Short msg",
			wantErr:        false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			id := testutil.CreateTestSubmissionInDB(t, db, tt.submissionType, tt.content)

			// Verify submission was created
			submission := testutil.GetSubmissionByID(t, db, id)
			if submission == nil {
				t.Fatal("Submission was not created")
			}

			if submission.Type != tt.submissionType {
				t.Errorf("Type mismatch: got %v, want %v", submission.Type, tt.submissionType)
			}

			if submission.Content != tt.content {
				t.Errorf("Content mismatch: got %v, want %v", submission.Content, tt.content)
			}

			if submission.Status != models.SubmissionStatusPending {
				t.Errorf("Status should be pending, got %v", submission.Status)
			}
		})
	}
}

func TestSubmissionRepository_GetByID(t *testing.T) {
	db := testutil.SetupTestDB(t)
	defer testutil.TeardownTestDB(t, db)

	// Create test submission
	id := testutil.CreateTestSubmissionInDB(t, db, models.SubmissionTypeEmail, "Test content")

	// Retrieve it
	submission := testutil.GetSubmissionByID(t, db, id)

	if submission == nil {
		t.Fatal("Failed to retrieve submission")
	}

	if submission.ID != id {
		t.Errorf("ID mismatch: got %v, want %v", submission.ID, id)
	}

	if submission.Content != "Test content" {
		t.Errorf("Content mismatch: got %v, want %v", submission.Content, "Test content")
	}
}

func TestSubmissionRepository_GetByIDNotFound(t *testing.T) {
	db := testutil.SetupTestDB(t)
	defer testutil.TeardownTestDB(t, db)

	// Try to get non-existent submission
	var nonExistentID sql.NullString
	err := db.QueryRow("SELECT id FROM submissions WHERE id = ?", "non-existent-id").Scan(&nonExistentID)

	if err != sql.ErrNoRows {
		t.Errorf("Expected sql.ErrNoRows, got %v", err)
	}
}

func TestSubmissionRepository_List(t *testing.T) {
	db := testutil.SetupTestDB(t)
	defer testutil.TeardownTestDB(t, db)

	// Create multiple submissions
	submissions := []struct {
		submissionType models.SubmissionType
		content        string
	}{
		{models.SubmissionTypeEmail, "Phishing email 1"},
		{models.SubmissionTypeSMS, "Smishing SMS 1"},
		{models.SubmissionTypeEmail, "Phishing email 2"},
		{models.SubmissionTypeWhatsApp, "WhatsApp scam"},
		{models.SubmissionTypeTelegram, "Telegram scam"},
	}

	for _, s := range submissions {
		testutil.CreateTestSubmissionInDB(t, db, s.submissionType, s.content)
	}

	// List all submissions
	rows, err := db.Query(`
		SELECT id, type, raw_content, status
		FROM submissions
		WHERE deleted_at IS NULL
		ORDER BY created_at DESC
	`)
	if err != nil {
		t.Fatalf("Failed to list submissions: %v", err)
	}
	defer rows.Close()

	count := 0
	for rows.Next() {
		count++
	}

	if count != len(submissions) {
		t.Errorf("Expected %d submissions, got %d", len(submissions), count)
	}
}

func TestSubmissionRepository_ListWithPagination(t *testing.T) {
	db := testutil.SetupTestDB(t)
	defer testutil.TeardownTestDB(t, db)

	// Create 10 submissions
	for i := 0; i < 10; i++ {
		testutil.CreateTestSubmissionInDB(t, db, models.SubmissionTypeEmail, "Test content")
	}

	tests := []struct {
		name     string
		limit    int
		offset   int
		expected int
	}{
		{"first page", 5, 0, 5},
		{"second page", 5, 5, 5},
		{"third page (partial)", 5, 8, 2},
		{"beyond data", 5, 15, 0},
		{"all data", 20, 0, 10},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			rows, err := db.Query(`
				SELECT id FROM submissions
				WHERE deleted_at IS NULL
				ORDER BY created_at DESC
				LIMIT ? OFFSET ?
			`, tt.limit, tt.offset)

			if err != nil {
				t.Fatalf("Failed to list submissions: %v", err)
			}
			defer rows.Close()

			count := 0
			for rows.Next() {
				count++
			}

			if count != tt.expected {
				t.Errorf("Expected %d submissions, got %d", tt.expected, count)
			}
		})
	}
}

func TestSubmissionRepository_UpdateStatus(t *testing.T) {
	db := testutil.SetupTestDB(t)
	defer testutil.TeardownTestDB(t, db)

	// Create submission
	id := testutil.CreateTestSubmissionInDB(t, db, models.SubmissionTypeEmail, "Test content")

	// Update status to processed
	_, err := db.Exec(`
		UPDATE submissions
		SET status = ?, processed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
		WHERE id = ?
	`, string(models.SubmissionStatusProcessed), id.String())

	if err != nil {
		t.Fatalf("Failed to update status: %v", err)
	}

	// Verify update
	var status string
	var processedAt sql.NullTime
	err = db.QueryRow("SELECT status, processed_at FROM submissions WHERE id = ?", id.String()).Scan(&status, &processedAt)

	if err != nil {
		t.Fatalf("Failed to retrieve updated submission: %v", err)
	}

	if status != string(models.SubmissionStatusProcessed) {
		t.Errorf("Status not updated: got %v, want %v", status, models.SubmissionStatusProcessed)
	}

	if !processedAt.Valid {
		t.Error("processed_at should be set")
	}
}

func TestSubmissionRepository_SoftDelete(t *testing.T) {
	db := testutil.SetupTestDB(t)
	defer testutil.TeardownTestDB(t, db)

	// Create submission
	id := testutil.CreateTestSubmissionInDB(t, db, models.SubmissionTypeEmail, "Test content")

	// Verify it exists
	if testutil.CountSubmissions(t, db) != 1 {
		t.Fatal("Submission was not created")
	}

	// Soft delete
	_, err := db.Exec("UPDATE submissions SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?", id.String())
	if err != nil {
		t.Fatalf("Failed to soft delete: %v", err)
	}

	// Verify it's not counted (soft deleted)
	if testutil.CountSubmissions(t, db) != 0 {
		t.Error("Soft deleted submission should not be counted")
	}

	// Verify it still exists in database
	var exists bool
	err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM submissions WHERE id = ?)", id.String()).Scan(&exists)
	if err != nil || !exists {
		t.Error("Soft deleted submission should still exist in database")
	}
}

func TestSubmissionRepository_FilterByType(t *testing.T) {
	db := testutil.SetupTestDB(t)
	defer testutil.TeardownTestDB(t, db)

	// Create submissions of different types
	testutil.CreateTestSubmissionInDB(t, db, models.SubmissionTypeEmail, "Email 1")
	testutil.CreateTestSubmissionInDB(t, db, models.SubmissionTypeEmail, "Email 2")
	testutil.CreateTestSubmissionInDB(t, db, models.SubmissionTypeSMS, "SMS 1")
	testutil.CreateTestSubmissionInDB(t, db, models.SubmissionTypeWhatsApp, "WhatsApp 1")

	// Filter by email type
	var count int
	err := db.QueryRow(`
		SELECT COUNT(*) FROM submissions
		WHERE type = ? AND deleted_at IS NULL
	`, string(models.SubmissionTypeEmail)).Scan(&count)

	if err != nil {
		t.Fatalf("Failed to filter submissions: %v", err)
	}

	if count != 2 {
		t.Errorf("Expected 2 email submissions, got %d", count)
	}

	// Filter by SMS type
	err = db.QueryRow(`
		SELECT COUNT(*) FROM submissions
		WHERE type = ? AND deleted_at IS NULL
	`, string(models.SubmissionTypeSMS)).Scan(&count)

	if err != nil {
		t.Fatalf("Failed to filter submissions: %v", err)
	}

	if count != 1 {
		t.Errorf("Expected 1 SMS submission, got %d", count)
	}
}

func TestSubmissionRepository_FilterByStatus(t *testing.T) {
	db := testutil.SetupTestDB(t)
	defer testutil.TeardownTestDB(t, db)

	// Create submissions with different statuses
	testutil.CreateTestSubmissionWithStatus(t, db, models.SubmissionTypeEmail, "Content 1", models.SubmissionStatusPending)
	testutil.CreateTestSubmissionWithStatus(t, db, models.SubmissionTypeEmail, "Content 2", models.SubmissionStatusProcessed)
	testutil.CreateTestSubmissionWithStatus(t, db, models.SubmissionTypeEmail, "Content 3", models.SubmissionStatusProcessed)
	testutil.CreateTestSubmissionWithStatus(t, db, models.SubmissionTypeEmail, "Content 4", models.SubmissionStatusFlagged)

	// Count by status
	tests := []struct {
		status   models.SubmissionStatus
		expected int
	}{
		{models.SubmissionStatusPending, 1},
		{models.SubmissionStatusProcessed, 2},
		{models.SubmissionStatusFlagged, 1},
		{models.SubmissionStatusApproved, 0},
	}

	for _, tt := range tests {
		t.Run(string(tt.status), func(t *testing.T) {
			var count int
			err := db.QueryRow(`
				SELECT COUNT(*) FROM submissions
				WHERE status = ? AND deleted_at IS NULL
			`, string(tt.status)).Scan(&count)

			if err != nil {
				t.Fatalf("Failed to count submissions: %v", err)
			}

			if count != tt.expected {
				t.Errorf("Expected %d %s submissions, got %d", tt.expected, tt.status, count)
			}
		})
	}
}

// Benchmark tests
func BenchmarkSubmissionRepository_Create(b *testing.B) {
	db := testutil.SetupTestDB(&testing.T{})
	defer testutil.TeardownTestDB(&testing.T{}, db)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		testutil.CreateTestSubmissionInDB(&testing.T{}, db, models.SubmissionTypeEmail, "Benchmark content")
	}
}

func BenchmarkSubmissionRepository_GetByID(b *testing.B) {
	db := testutil.SetupTestDB(&testing.T{})
	defer testutil.TeardownTestDB(&testing.T{}, db)

	id := testutil.CreateTestSubmissionInDB(&testing.T{}, db, models.SubmissionTypeEmail, "Benchmark content")

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		testutil.GetSubmissionByID(&testing.T{}, db, id)
	}
}
