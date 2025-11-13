package repository

import (
	"testing"

	"api.sting9.org/internal/models"
	"api.sting9.org/testutil"
	"golang.org/x/crypto/bcrypt"
)

func TestUserRepository_Create(t *testing.T) {
	db := testutil.SetupTestDB(t)
	defer testutil.TeardownTestDB(t, db)

	tests := []struct {
		name     string
		email    string
		password string
		role     models.UserRole
		wantErr  bool
	}{
		{
			name:     "valid researcher user",
			email:    "researcher@test.com",
			password: "SecurePassword123!",
			role:     models.UserRoleResearcher,
			wantErr:  false,
		},
		{
			name:     "valid partner user",
			email:    "partner@test.com",
			password: "PartnerPass456!",
			role:     models.UserRolePartner,
			wantErr:  false,
		},
		{
			name:     "valid admin user",
			email:    "admin@test.com",
			password: "AdminSecret789!",
			role:     models.UserRoleAdmin,
			wantErr:  false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			id := testutil.CreateTestUserInDB(t, db, tt.email, tt.password, tt.role, true, true)

			// Verify user was created
			user := testutil.GetUserByID(t, db, id)
			if user == nil {
				t.Fatal("User was not created")
			}

			if user.Email != tt.email {
				t.Errorf("Email mismatch: got %v, want %v", user.Email, tt.email)
			}

			if user.Role != tt.role {
				t.Errorf("Role mismatch: got %v, want %v", user.Role, tt.role)
			}
		})
	}
}

func TestUserRepository_CreateDuplicateEmail(t *testing.T) {
	db := testutil.SetupTestDB(t)
	defer testutil.TeardownTestDB(t, db)

	email := "duplicate@test.com"

	// Create first user
	testutil.CreateTestUserInDB(t, db, email, "password1", models.UserRoleResearcher, true, true)

	// Try to create second user with same email (should fail due to UNIQUE constraint)
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password2"), bcrypt.DefaultCost)
	_, err := db.Exec(`
		INSERT INTO users (id, email, password_hash, role, verified, approved, created_at, updated_at)
		VALUES (?, ?, ?, ?, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
	`, "test-id", email, string(hashedPassword), string(models.UserRoleResearcher))

	if err == nil {
		t.Error("Expected error when creating user with duplicate email, got nil")
	}
}

func TestUserRepository_GetByEmail(t *testing.T) {
	db := testutil.SetupTestDB(t)
	defer testutil.TeardownTestDB(t, db)

	email := "test@example.com"
	password := "TestPassword123!"

	// Create user
	id := testutil.CreateTestUserInDB(t, db, email, password, models.UserRoleResearcher, true, true)

	// Retrieve by email
	user := testutil.GetUserByEmail(t, db, email)

	if user == nil {
		t.Fatal("User not found by email")
	}

	if user.ID != id {
		t.Errorf("ID mismatch: got %v, want %v", user.ID, id)
	}

	if user.Email != email {
		t.Errorf("Email mismatch: got %v, want %v", user.Email, email)
	}
}

func TestUserRepository_GetByEmailNotFound(t *testing.T) {
	db := testutil.SetupTestDB(t)
	defer testutil.TeardownTestDB(t, db)

	// Try to get non-existent user
	user := testutil.GetUserByEmail(t, db, "nonexistent@test.com")

	if user != nil {
		t.Error("Expected nil for non-existent user, got a user")
	}
}

func TestUserRepository_PasswordHashing(t *testing.T) {
	db := testutil.SetupTestDB(t)
	defer testutil.TeardownTestDB(t, db)

	email := "test@example.com"
	password := "SecurePassword123!"

	// Create user
	id := testutil.CreateTestUserInDB(t, db, email, password, models.UserRoleResearcher, true, true)

	// Retrieve password hash
	var passwordHash string
	err := db.QueryRow("SELECT password_hash FROM users WHERE id = ?", id.String()).Scan(&passwordHash)
	if err != nil {
		t.Fatalf("Failed to retrieve password hash: %v", err)
	}

	// Verify password is hashed (not plaintext)
	if passwordHash == password {
		t.Error("Password should be hashed, not stored as plaintext")
	}

	// Verify password can be validated
	err = bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(password))
	if err != nil {
		t.Error("Password hash validation failed")
	}

	// Verify wrong password fails
	err = bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte("WrongPassword"))
	if err == nil {
		t.Error("Wrong password should not validate")
	}
}

func TestUserRepository_VerificationAndApproval(t *testing.T) {
	db := testutil.SetupTestDB(t)
	defer testutil.TeardownTestDB(t, db)

	tests := []struct {
		name     string
		verified bool
		approved bool
	}{
		{"unverified unapproved", false, false},
		{"verified unapproved", true, false},
		{"unverified approved", false, true},
		{"verified approved", true, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			email := "test-" + tt.name + "@example.com"
			id := testutil.CreateTestUserInDB(t, db, email, "password", models.UserRoleResearcher, tt.verified, tt.approved)

			user := testutil.GetUserByID(t, db, id)
			if user == nil {
				t.Fatal("User not found")
			}

			if user.Verified != tt.verified {
				t.Errorf("Verified mismatch: got %v, want %v", user.Verified, tt.verified)
			}

			if user.Approved != tt.approved {
				t.Errorf("Approved mismatch: got %v, want %v", user.Approved, tt.approved)
			}
		})
	}
}

func TestUserRepository_UpdateUser(t *testing.T) {
	db := testutil.SetupTestDB(t)
	defer testutil.TeardownTestDB(t, db)

	// Create user
	email := "test@example.com"
	id := testutil.CreateTestUserInDB(t, db, email, "password", models.UserRoleResearcher, false, false)

	// Update to verified and approved
	_, err := db.Exec(`
		UPDATE users
		SET verified = 1, approved = 1, updated_at = CURRENT_TIMESTAMP
		WHERE id = ?
	`, id.String())

	if err != nil {
		t.Fatalf("Failed to update user: %v", err)
	}

	// Verify update
	user := testutil.GetUserByID(t, db, id)
	if user == nil {
		t.Fatal("User not found")
	}

	if !user.Verified {
		t.Error("User should be verified")
	}

	if !user.Approved {
		t.Error("User should be approved")
	}
}

func TestUserRepository_SoftDelete(t *testing.T) {
	db := testutil.SetupTestDB(t)
	defer testutil.TeardownTestDB(t, db)

	// Create user
	email := "test@example.com"
	id := testutil.CreateTestUserInDB(t, db, email, "password", models.UserRoleResearcher, true, true)

	// Verify user exists
	if testutil.CountUsers(t, db) != 1 {
		t.Fatal("User was not created")
	}

	// Soft delete
	_, err := db.Exec("UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?", id.String())
	if err != nil {
		t.Fatalf("Failed to soft delete user: %v", err)
	}

	// Verify user is not counted
	if testutil.CountUsers(t, db) != 0 {
		t.Error("Soft deleted user should not be counted")
	}

	// Verify user still exists in database
	var exists bool
	err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE id = ?)", id.String()).Scan(&exists)
	if err != nil || !exists {
		t.Error("Soft deleted user should still exist in database")
	}

	// Verify GetByEmail doesn't return soft deleted user
	user := testutil.GetUserByEmail(t, db, email)
	if user != nil {
		t.Error("GetByEmail should not return soft deleted user")
	}
}

func TestUserRepository_FilterByRole(t *testing.T) {
	db := testutil.SetupTestDB(t)
	defer testutil.TeardownTestDB(t, db)

	// Create users with different roles
	testutil.CreateTestUserInDB(t, db, "researcher1@test.com", "password", models.UserRoleResearcher, true, true)
	testutil.CreateTestUserInDB(t, db, "researcher2@test.com", "password", models.UserRoleResearcher, true, true)
	testutil.CreateTestUserInDB(t, db, "partner1@test.com", "password", models.UserRolePartner, true, true)
	testutil.CreateTestUserInDB(t, db, "admin1@test.com", "password", models.UserRoleAdmin, true, true)

	tests := []struct {
		role     models.UserRole
		expected int
	}{
		{models.UserRoleResearcher, 2},
		{models.UserRolePartner, 1},
		{models.UserRoleAdmin, 1},
	}

	for _, tt := range tests {
		t.Run(string(tt.role), func(t *testing.T) {
			var count int
			err := db.QueryRow(`
				SELECT COUNT(*) FROM users
				WHERE role = ? AND deleted_at IS NULL
			`, string(tt.role)).Scan(&count)

			if err != nil {
				t.Fatalf("Failed to count users: %v", err)
			}

			if count != tt.expected {
				t.Errorf("Expected %d %s users, got %d", tt.expected, tt.role, count)
			}
		})
	}
}

func TestUserRepository_ListUsers(t *testing.T) {
	db := testutil.SetupTestDB(t)
	defer testutil.TeardownTestDB(t, db)

	// Create multiple users
	for i := 0; i < 5; i++ {
		email := "user" + string(rune(i+'0')) + "@test.com"
		testutil.CreateTestUserInDB(t, db, email, "password", models.UserRoleResearcher, true, true)
	}

	// List all users
	rows, err := db.Query(`
		SELECT id, email, role
		FROM users
		WHERE deleted_at IS NULL
		ORDER BY created_at DESC
	`)
	if err != nil {
		t.Fatalf("Failed to list users: %v", err)
	}
	defer rows.Close()

	count := 0
	for rows.Next() {
		count++
	}

	if count != 5 {
		t.Errorf("Expected 5 users, got %d", count)
	}
}

func TestUserRepository_Organization(t *testing.T) {
	db := testutil.SetupTestDB(t)
	defer testutil.TeardownTestDB(t, db)

	// Create user with organization
	email := "researcher@university.edu"
	organization := "Test University"
	purpose := "Research on phishing detection algorithms"

	id := testutil.CreateTestUserWithOrg(t, db, email, "password", models.UserRoleResearcher, organization, purpose, true, true)

	// Verify organization was saved
	user := testutil.GetUserByID(t, db, id)
	if user == nil {
		t.Fatal("User not found")
	}

	if user.Organization == nil {
		t.Fatal("Organization should not be nil")
	}

	if *user.Organization != organization {
		t.Errorf("Organization mismatch: got %v, want %v", *user.Organization, organization)
	}

	// Verify purpose was saved
	var savedPurpose string
	err := db.QueryRow("SELECT purpose FROM users WHERE id = ?", id.String()).Scan(&savedPurpose)
	if err != nil {
		t.Fatalf("Failed to retrieve purpose: %v", err)
	}

	if savedPurpose != purpose {
		t.Errorf("Purpose mismatch: got %v, want %v", savedPurpose, purpose)
	}
}

// Benchmark tests
func BenchmarkUserRepository_Create(b *testing.B) {
	db := testutil.SetupTestDB(&testing.T{})
	defer testutil.TeardownTestDB(&testing.T{}, db)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		email := "bench" + string(rune(i)) + "@test.com"
		testutil.CreateTestUserInDB(&testing.T{}, db, email, "password", models.UserRoleResearcher, true, true)
	}
}

func BenchmarkUserRepository_GetByEmail(b *testing.B) {
	db := testutil.SetupTestDB(&testing.T{})
	defer testutil.TeardownTestDB(&testing.T{}, db)

	email := "benchmark@test.com"
	testutil.CreateTestUserInDB(&testing.T{}, db, email, "password", models.UserRoleResearcher, true, true)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		testutil.GetUserByEmail(&testing.T{}, db, email)
	}
}
