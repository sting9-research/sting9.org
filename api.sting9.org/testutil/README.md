# Test Utilities Package

This package provides utilities for testing the Sting9 API with **in-memory SQLite databases**.

## Features

- **Zero-setup testing** - No PostgreSQL required
- **Isolated databases** - Each test gets a fresh in-memory database
- **Helper functions** - Create test data easily
- **Assertions** - Custom assertion helpers
- **Fixtures** - Pre-defined test data

## Quick Example

```go
import (
    "testing"
    "api.sting9.org/testutil"
    "api.sting9.org/internal/models"
)

func TestExample(t *testing.T) {
    // Setup database
    db := testutil.SetupTestDB(t)
    defer testutil.TeardownTestDB(t, db)

    // Create test data
    submissionID := testutil.CreateTestSubmissionInDB(
        t, db,
        models.SubmissionTypeEmail,
        "Test phishing email"
    )

    // Verify
    submission := testutil.GetSubmissionByID(t, db, submissionID)
    testutil.AssertNotNil(t, submission)
    testutil.AssertEqual(t, submission.Type, models.SubmissionTypeEmail)
}
```

## Files

### testdb.go

Database setup and management:

```go
// Create fresh in-memory database
db := testutil.SetupTestDB(t)
defer testutil.TeardownTestDB(t, db)

// Reset database (clear all data)
testutil.ResetDatabase(t, db)

// Update statistics
testutil.UpdateStats(t, db)

// Get statistics
stats := testutil.GetStats(t, db)
```

### fixtures.go

Test data creation and retrieval:

**Submissions:**
```go
// Create submission
id := testutil.CreateTestSubmissionInDB(t, db, type, content)

// Create with specific status
id := testutil.CreateTestSubmissionWithStatus(t, db, type, content, status)

// Create processed submission
id := testutil.CreateProcessedSubmission(t, db, type, raw, anonymized, lang, category)

// Get submission
submission := testutil.GetSubmissionByID(t, db, id)

// Count submissions
count := testutil.CountSubmissions(t, db)
```

**Users:**
```go
// Create user
userID := testutil.CreateTestUserInDB(t, db, email, password, role, verified, approved)

// Create with organization
userID := testutil.CreateTestUserWithOrg(t, db, email, password, role, org, purpose, verified, approved)

// Convenience creators
adminID, email, password := testutil.CreateAdminUser(t, db)
researcherID, email, password := testutil.CreateResearcherUser(t, db)
partnerID, email, password := testutil.CreatePartnerUser(t, db)

// Get user
user := testutil.GetUserByID(t, db, userID)
user := testutil.GetUserByEmail(t, db, email)

// Count users
count := testutil.CountUsers(t, db)
```

**API Tokens:**
```go
tokenID := testutil.CreateAPIToken(t, db, userID, tokenHash, expiresAt)
```

**Sample Data:**
```go
// Phishing examples by category
phishing := testutil.GetPhishingExamples()
// Returns map[string][]string with categories:
// - "phishing"
// - "smishing"
// - "bec"
// - "tech_support_scam"
// - "romance_scam"

// PII examples by type
pii := testutil.GetPIIExamples()
// Returns map[string]string with types:
// - "email"
// - "phone"
// - "ssn"
// - "credit_card"
// - "ip_address"
// - "address"
// - "account"
// - "mixed"

// Clean examples (no PII)
clean := testutil.GetCleanExamples()

// Language examples
languages := testutil.LanguageExamples()
// Returns map[string]string with language codes

// Email examples
rawEmail := testutil.TestRawEmail()
htmlEmail := testutil.TestHTMLEmail()
headers := testutil.TestEmailHeaders()

// URL examples
urls := testutil.TestURLs()
```

### assertions.go

Custom assertion helpers:

**Status Codes:**
```go
testutil.AssertStatusCode(t, response.Code, http.StatusOK)
```

**JSON:**
```go
testutil.AssertJSONResponse(t, body, expectedStruct)
testutil.AssertErrorResponse(t, body, "expected error message")
```

**Strings:**
```go
testutil.AssertContains(t, got, "substring")
testutil.AssertNotContains(t, got, "unwanted")
```

**Comparisons:**
```go
testutil.AssertEqual(t, got, want)
testutil.AssertNotEqual(t, got, unwanted)
testutil.AssertNil(t, value)
testutil.AssertNotNil(t, value)
```

**Errors:**
```go
testutil.AssertNoError(t, err)
testutil.AssertError(t, err)
testutil.AssertErrorContains(t, err, "expected text")
```

**Slices:**
```go
testutil.AssertSliceContains(t, slice, element)
testutil.AssertSliceLength(t, slice, expectedLength)
```

**HTTP:**
```go
testutil.AssertHeader(t, response, "Content-Type", "application/json")
testutil.AssertContentType(t, response, "application/json")
```

**Time:**
```go
futureTime := testutil.GetFutureTime(24)  // 24 hours from now
pastTime := testutil.GetPastTime(24)      // 24 hours ago
```

## Usage Patterns

### Basic Test

```go
func TestBasic(t *testing.T) {
    db := testutil.SetupTestDB(t)
    defer testutil.TeardownTestDB(t, db)

    // Test code
}
```

### Table-Driven Test

```go
func TestTableDriven(t *testing.T) {
    db := testutil.SetupTestDB(t)
    defer testutil.TeardownTestDB(t, db)

    tests := []struct {
        name    string
        input   string
        wantErr bool
    }{
        {"valid", "content", false},
        {"invalid", "", true},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            // Test logic
        })
    }
}
```

### Parallel Tests

```go
func TestParallel(t *testing.T) {
    t.Parallel()

    t.Run("Test1", func(t *testing.T) {
        t.Parallel()
        db := testutil.SetupTestDB(t)
        defer testutil.TeardownTestDB(t, db)
        // Each gets isolated database
    })

    t.Run("Test2", func(t *testing.T) {
        t.Parallel()
        db := testutil.SetupTestDB(t)
        defer testutil.TeardownTestDB(t, db)
        // Another isolated database
    })
}
```

### Integration Test

```go
func TestIntegration(t *testing.T) {
    db := testutil.SetupTestDB(t)
    defer testutil.TeardownTestDB(t, db)

    // Create user
    userID, email, password := testutil.CreateResearcherUser(t, db)

    // Create submission
    submissionID := testutil.CreateTestSubmissionInDB(
        t, db,
        models.SubmissionTypeEmail,
        "Phishing content"
    )

    // Test API endpoint
    req := httptest.NewRequest("GET", "/api/v1/submissions/"+submissionID.String(), nil)
    req.Header.Set("Authorization", "Bearer "+generateToken(userID))

    w := httptest.NewRecorder()
    handler.GetSubmission(w, req)

    testutil.AssertStatusCode(t, w.Code, http.StatusOK)
}
```

## Best Practices

1. **Always use Setup/Teardown:**
   ```go
   db := testutil.SetupTestDB(t)
   defer testutil.TeardownTestDB(t, db)
   ```

2. **Use helper functions instead of raw SQL:**
   ```go
   // Good
   id := testutil.CreateTestSubmissionInDB(t, db, type, content)

   // Avoid
   db.Exec("INSERT INTO submissions ...")
   ```

3. **Reset between subtests if needed:**
   ```go
   t.Run("subtest1", func(t *testing.T) {
       testutil.ResetDatabase(t, db)
       // Clean state
   })
   ```

4. **Use assertions for clarity:**
   ```go
   // Good
   testutil.AssertEqual(t, got, want)

   // Less clear
   if got != want {
       t.Errorf("got %v, want %v", got, want)
   }
   ```

5. **Leverage fixtures for realistic data:**
   ```go
   phishing := testutil.GetPhishingExamples()
   for category, examples := range phishing {
       for _, example := range examples {
           testutil.CreateTestSubmissionInDB(t, db, type, example)
       }
   }
   ```

## SQLite vs PostgreSQL

The test database uses SQLite for speed and simplicity, while production uses PostgreSQL. Key differences are handled automatically:

| Feature | SQLite (Tests) | PostgreSQL (Production) |
|---------|----------------|-------------------------|
| UUIDs | TEXT strings | UUID type |
| JSONB | TEXT (JSON string) | JSONB type |
| Booleans | INTEGER (0/1) | BOOLEAN |
| Timestamps | DATETIME | TIMESTAMPTZ |
| Enums | CHECK constraints | ENUM types |
| Placeholders | `?` | `$1, $2` |

## Troubleshooting

### Foreign Keys Not Enforced

Ensure foreign keys are enabled (automatically done in SetupTestDB):
```go
db.Exec("PRAGMA foreign_keys = ON")
```

### CGo Build Errors

Install build tools or use pure Go driver:
```bash
# Ubuntu/Debian
sudo apt-get install build-essential

# macOS
xcode-select --install

# Or use pure Go driver
go get modernc.org/sqlite
```

### Test Isolation Issues

Each test should create its own database:
```go
// Good - isolated
func TestA(t *testing.T) {
    db := testutil.SetupTestDB(t)
    defer testutil.TeardownTestDB(t, db)
}

func TestB(t *testing.T) {
    db := testutil.SetupTestDB(t)
    defer testutil.TeardownTestDB(t, db)
}

// Bad - shared state
var globalDB *sql.DB

func TestA(t *testing.T) {
    // Uses globalDB
}
```

## Examples

See these files for complete examples:
- `testutil/testdb_test.go` - Database helper tests
- `internal/repository/submission_repository_test.go` - Repository tests
- `internal/repository/user_repository_test.go` - User repository tests
- `internal/handlers/submissions_integration_test.go` - Integration tests

## Resources

- [SQLite Testing Guide](../SQLITE_TEST_GUIDE.md)
- [Testing Guide](../TESTING.md)
- [Go Testing Documentation](https://pkg.go.dev/testing)
