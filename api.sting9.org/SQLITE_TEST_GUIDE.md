# SQLite Testing Quick Reference

**The Sting9 API uses in-memory SQLite databases for all tests - no PostgreSQL required!**

## Why SQLite for Tests?

- **Zero setup** - No database server needed
- **Fast** - In-memory databases are blazing fast
- **Isolated** - Each test gets its own database
- **Parallel-safe** - Tests can run concurrently
- **CI/CD friendly** - Works everywhere (GitHub Actions, GitLab CI, local dev)
- **Cross-platform** - Linux, macOS, Windows

## Quick Start

```bash
# Just run tests - that's it!
make test

# No PostgreSQL installation needed
# No database configuration required
# No migrations to run
# No cleanup necessary
```

## How It Works

### 1. Automatic Database Creation

Each test automatically creates a fresh in-memory SQLite database:

```go
func TestExample(t *testing.T) {
    // Setup - creates fresh database with full schema
    db := testutil.SetupTestDB(t)
    defer testutil.TeardownTestDB(t, db)  // Cleanup automatic

    // Your test code here
}
```

### 2. Schema Compatibility

The SQLite schema mirrors PostgreSQL production schema:

**PostgreSQL (Production):**
```sql
CREATE TYPE submission_type AS ENUM ('email', 'sms', 'whatsapp');
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type submission_type NOT NULL,
    metadata JSONB DEFAULT '{}'
);
```

**SQLite (Tests):**
```sql
CREATE TABLE submissions (
    id TEXT PRIMARY KEY,  -- UUID as string
    type TEXT NOT NULL CHECK(type IN ('email', 'sms', 'whatsapp')),
    metadata TEXT DEFAULT '{}'  -- JSON as string
);
```

### 3. Test Data Helpers

Create test data easily:

```go
// Create submission
submissionID := testutil.CreateTestSubmissionInDB(
    t, db,
    models.SubmissionTypeEmail,
    "Test phishing content"
)

// Create user
userID, email, password := testutil.CreateResearcherUser(t, db)

// Create with specific status
id := testutil.CreateTestSubmissionWithStatus(
    t, db,
    models.SubmissionTypeSMS,
    "Content",
    models.SubmissionStatusProcessed
)

// Query data
submission := testutil.GetSubmissionByID(t, db, submissionID)
user := testutil.GetUserByEmail(t, db, email)

// Count records
count := testutil.CountSubmissions(t, db)
```

## Example Tests

### Basic Repository Test

```go
func TestSubmissionRepository_Create(t *testing.T) {
    // Setup test database
    db := testutil.SetupTestDB(t)
    defer testutil.TeardownTestDB(t, db)

    // Create test submission
    id := testutil.CreateTestSubmissionInDB(
        t, db,
        models.SubmissionTypeEmail,
        "Test phishing email content"
    )

    // Verify creation
    submission := testutil.GetSubmissionByID(t, db, id)
    if submission == nil {
        t.Fatal("Submission not created")
    }

    if submission.Type != models.SubmissionTypeEmail {
        t.Errorf("Expected email type, got %v", submission.Type)
    }
}
```

### Handler Integration Test

```go
func TestSubmissionsHandler_Create(t *testing.T) {
    // Setup database
    db := testutil.SetupTestDB(t)
    defer testutil.TeardownTestDB(t, db)

    // Create request
    reqBody := models.CreateSubmissionRequest{
        Type:    models.SubmissionTypeEmail,
        Content: "Phishing email content",
    }

    bodyJSON, _ := json.Marshal(reqBody)
    req := httptest.NewRequest("POST", "/api/v1/submissions", bytes.NewBuffer(bodyJSON))
    req.Header.Set("Content-Type", "application/json")

    w := httptest.NewRecorder()

    // Call handler (when implemented)
    // handler.Create(w, req)

    // Verify database state
    count := testutil.CountSubmissions(t, db)
    if count != 1 {
        t.Errorf("Expected 1 submission, got %d", count)
    }
}
```

### Parallel Tests

Tests can safely run in parallel:

```go
func TestSubmissions_Parallel(t *testing.T) {
    t.Parallel()

    t.Run("Create", func(t *testing.T) {
        t.Parallel()
        db := testutil.SetupTestDB(t)  // Isolated database
        defer testutil.TeardownTestDB(t, db)

        // Test code
    })

    t.Run("List", func(t *testing.T) {
        t.Parallel()
        db := testutil.SetupTestDB(t)  // Another isolated database
        defer testutil.TeardownTestDB(t, db)

        // Test code
    })
}
```

## Database Helpers Reference

### Setup & Teardown

```go
// Create fresh database
db := testutil.SetupTestDB(t)

// Close database (automatic cleanup)
defer testutil.TeardownTestDB(t, db)

// Reset database (clear all data)
testutil.ResetDatabase(t, db)
```

### Creating Test Data

```go
// Submissions
submissionID := testutil.CreateTestSubmissionInDB(t, db, type, content)
id := testutil.CreateTestSubmissionWithStatus(t, db, type, content, status)
id := testutil.CreateProcessedSubmission(t, db, type, rawContent, anonymized, lang, category)

// Users
userID := testutil.CreateTestUserInDB(t, db, email, password, role, verified, approved)
userID := testutil.CreateTestUserWithOrg(t, db, email, password, role, org, purpose, verified, approved)

// Convenience user creators
adminID, email, password := testutil.CreateAdminUser(t, db)
researcherID, email, password := testutil.CreateResearcherUser(t, db)
partnerID, email, password := testutil.CreatePartnerUser(t, db)

// API Tokens
tokenID := testutil.CreateAPIToken(t, db, userID, tokenHash, expiresAt)
```

### Querying Test Data

```go
// Get by ID
submission := testutil.GetSubmissionByID(t, db, submissionID)
user := testutil.GetUserByID(t, db, userID)

// Get by other fields
user := testutil.GetUserByEmail(t, db, email)

// Count records
submissionCount := testutil.CountSubmissions(t, db)
userCount := testutil.CountUsers(t, db)
```

### Time Helpers

```go
// Future time (for token expiration tests)
expiresAt := testutil.GetFutureTime(24)  // 24 hours from now

// Past time (for expired token tests)
expiredAt := testutil.GetPastTime(24)  // 24 hours ago
```

## Type Conversions

### UUIDs

```go
// PostgreSQL: UUID type
// SQLite: TEXT type

// In tests, UUIDs are strings
id := uuid.New()
query := "INSERT INTO table (id) VALUES (?)"
db.Exec(query, id.String())  // Convert to string for SQLite
```

### JSON/JSONB

```go
// PostgreSQL: JSONB type
// SQLite: TEXT type

metadata := models.SubmissionMetadata{
    Subject: "Test",
    From:    "sender@example.com",
}

// Convert to JSON string for SQLite
metadataJSON, _ := json.Marshal(metadata)
query := "INSERT INTO table (metadata) VALUES (?)"
db.Exec(query, string(metadataJSON))
```

### Booleans

```go
// PostgreSQL: BOOLEAN type
// SQLite: INTEGER (0 or 1)

verified := true
verifiedInt := 0
if verified {
    verifiedInt = 1
}

query := "INSERT INTO users (verified) VALUES (?)"
db.Exec(query, verifiedInt)
```

### Timestamps

```go
// PostgreSQL: TIMESTAMPTZ
// SQLite: DATETIME or CURRENT_TIMESTAMP

query := "INSERT INTO table (created_at) VALUES (CURRENT_TIMESTAMP)"
// SQLite automatically handles datetime
```

## SQL Query Differences

### Placeholders

```go
// PostgreSQL uses numbered placeholders
query := "SELECT * FROM users WHERE email = $1 AND role = $2"

// SQLite uses ? placeholders
query := "SELECT * FROM users WHERE email = ? AND role = ?"
```

### Returning Clauses

```go
// PostgreSQL: RETURNING supported
query := "INSERT INTO users (...) VALUES (...) RETURNING id, email"

// SQLite: RETURNING supported in SQLite 3.35+ (our version)
query := "INSERT INTO users (...) VALUES (...) RETURNING id, email"
```

### Type Casts

```go
// PostgreSQL: explicit casting
query := "SELECT type::text FROM submissions"

// SQLite: no explicit casting needed
query := "SELECT type FROM submissions"
```

## Testing Patterns

### Table-Driven Tests

```go
func TestSubmissionCreate(t *testing.T) {
    db := testutil.SetupTestDB(t)
    defer testutil.TeardownTestDB(t, db)

    tests := []struct {
        name    string
        subType models.SubmissionType
        content string
        wantErr bool
    }{
        {"valid email", models.SubmissionTypeEmail, "content", false},
        {"valid sms", models.SubmissionTypeSMS, "content", false},
        {"empty content", models.SubmissionTypeEmail, "", true},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            // Test logic
        })
    }
}
```

### Setup and Teardown

```go
func TestMain(m *testing.M) {
    // Global setup if needed

    code := m.Run()

    // Global teardown if needed

    os.Exit(code)
}
```

### Subtests with Cleanup

```go
func TestExample(t *testing.T) {
    db := testutil.SetupTestDB(t)
    defer testutil.TeardownTestDB(t, db)

    t.Run("subtest1", func(t *testing.T) {
        // Create data
        id := testutil.CreateTestSubmissionInDB(t, db, ...)

        // Test logic

        // No cleanup needed - parent cleanup handles it
    })

    t.Run("subtest2", func(t *testing.T) {
        // Fresh test - previous subtest data still exists
        // Use ResetDatabase if you need clean state
        testutil.ResetDatabase(t, db)

        // Test logic
    })
}
```

## Common Test Scenarios

### Testing CRUD Operations

```go
func TestSubmissionCRUD(t *testing.T) {
    db := testutil.SetupTestDB(t)
    defer testutil.TeardownTestDB(t, db)

    // Create
    id := testutil.CreateTestSubmissionInDB(t, db, models.SubmissionTypeEmail, "Test")

    // Read
    submission := testutil.GetSubmissionByID(t, db, id)
    if submission == nil {
        t.Fatal("Failed to read submission")
    }

    // Update
    _, err := db.Exec(`
        UPDATE submissions
        SET status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `, string(models.SubmissionStatusProcessed), id.String())
    if err != nil {
        t.Fatalf("Failed to update: %v", err)
    }

    // Delete (soft delete)
    _, err = db.Exec(`
        UPDATE submissions
        SET deleted_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `, id.String())
    if err != nil {
        t.Fatalf("Failed to delete: %v", err)
    }

    // Verify soft delete
    if testutil.CountSubmissions(t, db) != 0 {
        t.Error("Soft deleted submission should not be counted")
    }
}
```

### Testing Foreign Keys

```go
func TestForeignKeyConstraints(t *testing.T) {
    db := testutil.SetupTestDB(t)
    defer testutil.TeardownTestDB(t, db)

    // Create user
    userID, _, _ := testutil.CreateResearcherUser(t, db)

    // Create API token
    tokenID := testutil.CreateAPIToken(t, db, userID, "hash", testutil.GetFutureTime(24))

    // Delete user (should cascade to tokens)
    _, err := db.Exec("DELETE FROM users WHERE id = ?", userID.String())
    if err != nil {
        t.Fatalf("Failed to delete user: %v", err)
    }

    // Verify token was deleted
    var count int
    db.QueryRow("SELECT COUNT(*) FROM api_tokens WHERE id = ?", tokenID.String()).Scan(&count)
    if count != 0 {
        t.Error("API token should have been deleted via cascade")
    }
}
```

### Testing Pagination

```go
func TestPagination(t *testing.T) {
    db := testutil.SetupTestDB(t)
    defer testutil.TeardownTestDB(t, db)

    // Create 25 submissions
    for i := 0; i < 25; i++ {
        testutil.CreateTestSubmissionInDB(t, db, models.SubmissionTypeEmail, "Test")
    }

    // Test pagination
    tests := []struct {
        limit    int
        offset   int
        expected int
    }{
        {10, 0, 10},   // First page
        {10, 10, 10},  // Second page
        {10, 20, 5},   // Third page (partial)
        {10, 30, 0},   // Beyond data
    }

    for _, tt := range tests {
        rows, _ := db.Query(`
            SELECT id FROM submissions
            WHERE deleted_at IS NULL
            LIMIT ? OFFSET ?
        `, tt.limit, tt.offset)

        count := 0
        for rows.Next() {
            count++
        }
        rows.Close()

        if count != tt.expected {
            t.Errorf("Limit %d, Offset %d: expected %d, got %d",
                tt.limit, tt.offset, tt.expected, count)
        }
    }
}
```

## Best Practices

1. **Always use testutil helpers** - Don't write raw SQL in tests
2. **Setup/Teardown pattern** - Use defer for cleanup
3. **Isolated tests** - Each test should create its own data
4. **Reset between subtests** - Use ResetDatabase() if needed
5. **Test in parallel** - Use t.Parallel() for independent tests
6. **Use table-driven tests** - Cover multiple cases efficiently
7. **Test error cases** - Don't just test happy paths
8. **Check database state** - Verify data was actually created/updated

## Troubleshooting

### CGo Errors

If you get CGo errors with go-sqlite3:

```bash
# Install build tools (Ubuntu/Debian)
sudo apt-get install build-essential

# Install build tools (macOS)
xcode-select --install

# Alternative: Use pure Go SQLite (no CGo)
go get modernc.org/sqlite
```

### Foreign Key Issues

```go
// Always enable foreign keys for tests
_, err := db.Exec("PRAGMA foreign_keys = ON")
```

### Time Zone Issues

```go
// SQLite uses local time by default
// Use CURRENT_TIMESTAMP for consistency
query := "INSERT INTO table (created_at) VALUES (CURRENT_TIMESTAMP)"
```

### Query Performance

```go
// SQLite in-memory is very fast, but you can optimize:
db.Exec("PRAGMA journal_mode = MEMORY")
db.Exec("PRAGMA synchronous = OFF")
db.Exec("PRAGMA temp_store = MEMORY")
```

## Resources

- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [go-sqlite3 Driver](https://github.com/mattn/go-sqlite3)
- [Go Testing Package](https://pkg.go.dev/testing)
- [Table-Driven Tests](https://dave.cheney.net/2019/05/07/prefer-table-driven-tests)

---

**Remember:** Tests should be fast, isolated, and require zero setup. That's why we use SQLite!
