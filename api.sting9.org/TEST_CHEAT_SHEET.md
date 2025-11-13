# Testing Cheat Sheet

Quick reference for testing the Sting9 API with SQLite.

## Run Tests

```bash
make test              # All tests
make test-coverage     # With coverage report
make test-repository   # Repository layer only
make test-handlers     # HTTP handlers only
```

## Basic Test Template

```go
func TestExample(t *testing.T) {
    db := testutil.SetupTestDB(t)
    defer testutil.TeardownTestDB(t, db)

    // Your test code here
}
```

## Create Test Data

```go
// Submission
id := testutil.CreateTestSubmissionInDB(t, db,
    models.SubmissionTypeEmail,
    "Test content")

// User
userID, email, password := testutil.CreateResearcherUser(t, db)

// With status
id := testutil.CreateTestSubmissionWithStatus(t, db,
    models.SubmissionTypeSMS,
    "Content",
    models.SubmissionStatusProcessed)
```

## Query Test Data

```go
// Get by ID
submission := testutil.GetSubmissionByID(t, db, id)
user := testutil.GetUserByID(t, db, userID)

// Get by email
user := testutil.GetUserByEmail(t, db, "test@example.com")

// Count
count := testutil.CountSubmissions(t, db)
count := testutil.CountUsers(t, db)
```

## Assertions

```go
testutil.AssertEqual(t, got, want)
testutil.AssertNotNil(t, value)
testutil.AssertNoError(t, err)
testutil.AssertContains(t, text, "substring")
testutil.AssertStatusCode(t, response.Code, 200)
```

## Sample Data

```go
// Phishing examples
phishing := testutil.GetPhishingExamples()
// Returns: map[string][]string

// PII examples
pii := testutil.GetPIIExamples()
// Returns: map[string]string

// Clean messages
clean := testutil.GetCleanExamples()
// Returns: []string
```

## Time Helpers

```go
future := testutil.GetFutureTime(24)  // 24 hours from now
past := testutil.GetPastTime(24)      // 24 hours ago
```

## Table-Driven Tests

```go
func TestExample(t *testing.T) {
    db := testutil.SetupTestDB(t)
    defer testutil.TeardownTestDB(t, db)

    tests := []struct {
        name    string
        input   string
        want    string
    }{
        {"case 1", "input1", "output1"},
        {"case 2", "input2", "output2"},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            // Test logic
        })
    }
}
```

## Parallel Tests

```go
func TestParallel(t *testing.T) {
    t.Parallel()

    t.Run("test1", func(t *testing.T) {
        t.Parallel()
        db := testutil.SetupTestDB(t)
        defer testutil.TeardownTestDB(t, db)
        // Isolated database
    })
}
```

## Integration Test

```go
func TestHandler(t *testing.T) {
    db := testutil.SetupTestDB(t)
    defer testutil.TeardownTestDB(t, db)

    // Create test data
    userID, _, _ := testutil.CreateResearcherUser(t, db)

    // Create request
    req := httptest.NewRequest("GET", "/api/v1/resource", nil)
    w := httptest.NewRecorder()

    // Call handler
    handler.ServeHTTP(w, req)

    // Assert response
    testutil.AssertStatusCode(t, w.Code, 200)

    // Verify database state
    count := testutil.CountSubmissions(t, db)
    testutil.AssertEqual(t, count, 1)
}
```

## Common Patterns

### CRUD Test
```go
// Create
id := testutil.CreateTestSubmissionInDB(t, db, type, content)

// Read
submission := testutil.GetSubmissionByID(t, db, id)

// Update
db.Exec("UPDATE submissions SET status = ? WHERE id = ?", status, id)

// Delete (soft)
db.Exec("UPDATE submissions SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?", id)

// Verify soft delete
count := testutil.CountSubmissions(t, db)  // Should not count deleted
```

### Foreign Key Test
```go
userID, _, _ := testutil.CreateResearcherUser(t, db)
tokenID := testutil.CreateAPIToken(t, db, userID, "hash", expiresAt)

// Delete user (cascade to tokens)
db.Exec("DELETE FROM users WHERE id = ?", userID)

// Verify cascade
var count int
db.QueryRow("SELECT COUNT(*) FROM api_tokens WHERE id = ?", tokenID).Scan(&count)
testutil.AssertEqual(t, count, 0)  // Token deleted
```

### Pagination Test
```go
// Create 25 records
for i := 0; i < 25; i++ {
    testutil.CreateTestSubmissionInDB(t, db, type, content)
}

// Page 1
rows, _ := db.Query("SELECT id FROM submissions LIMIT 10 OFFSET 0")
count := countRows(rows)
testutil.AssertEqual(t, count, 10)

// Page 2
rows, _ = db.Query("SELECT id FROM submissions LIMIT 10 OFFSET 10")
count = countRows(rows)
testutil.AssertEqual(t, count, 10)

// Page 3
rows, _ = db.Query("SELECT id FROM submissions LIMIT 10 OFFSET 20")
count = countRows(rows)
testutil.AssertEqual(t, count, 5)  // Partial page
```

## Type Conversions

```go
// UUID: Store as string
id := uuid.New()
db.Exec("INSERT INTO table (id) VALUES (?)", id.String())

// JSON: Marshal to string
metadata, _ := json.Marshal(struct{})
db.Exec("INSERT INTO table (metadata) VALUES (?)", string(metadata))

// Boolean: Use 0/1
verified := true
verifiedInt := 0
if verified { verifiedInt = 1 }
db.Exec("INSERT INTO users (verified) VALUES (?)", verifiedInt)

// Timestamp: Use CURRENT_TIMESTAMP
db.Exec("INSERT INTO table (created_at) VALUES (CURRENT_TIMESTAMP)")
```

## Debugging

```bash
# Verbose output
go test -v ./path/to/package

# Single test
go test -v -run TestName ./path/to/package

# With logging
# Use t.Logf() in tests for debug output
```

## Resources

- Full guide: `SQLITE_TEST_GUIDE.md`
- Testing docs: `TESTING.md`
- Package docs: `testutil/README.md`
- Summary: `SQLITE_MIGRATION_SUMMARY.md`
