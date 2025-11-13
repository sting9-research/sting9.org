# Testing Guide

This document provides comprehensive guidance on testing the Sting9 API.

## Table of Contents

- [Quick Start](#quick-start)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Writing Tests](#writing-tests)
- [Test Utilities](#test-utilities)
- [Continuous Integration](#continuous-integration)
- [Best Practices](#best-practices)

## Quick Start

**Zero setup required!** Tests use in-memory SQLite databases automatically.

```bash
# Run all tests (no PostgreSQL needed!)
make test

# Run tests with coverage
make test-coverage

# Run specific package tests
make test-anonymizer      # PII anonymization tests
make test-processor       # Message classification tests
make test-repository      # Database layer tests
make test-handlers        # API endpoint tests
```

### Key Features

- **No external dependencies** - Tests run with just `go test`
- **In-memory databases** - Each test gets a fresh SQLite database
- **Parallel execution** - Tests run safely in parallel
- **CI/CD ready** - Works in any environment (GitHub Actions, GitLab CI, etc.)
- **Fast** - In-memory SQLite is faster than PostgreSQL for tests
- **Cross-platform** - Works on Linux, macOS, Windows

## Test Structure

The test suite is organized as follows:

```
api.sting9.org/
├── internal/
│   ├── service/
│   │   ├── anonymizer/
│   │   │   └── anonymizer_test.go      # PII detection & redaction tests
│   │   ├── processor/
│   │   │   └── processor_test.go       # Message classification tests
│   │   └── exporter/
│   │       └── exporter_test.go        # Dataset export tests
│   ├── handlers/
│   │   ├── auth_test.go                # Authentication endpoint tests
│   │   ├── submissions_test.go         # Submission endpoint tests
│   │   ├── stats_test.go               # Statistics endpoint tests
│   │   ├── export_test.go              # Export endpoint tests
│   │   └── health_test.go              # Health check tests
│   ├── middleware/
│   │   ├── auth_test.go                # JWT auth middleware tests
│   │   ├── ratelimit_test.go           # Rate limiting tests
│   │   ├── cors_test.go                # CORS middleware tests
│   │   └── logger_test.go              # Logging middleware tests
│   └── database/
│       └── db_test.go                  # Database connection tests
├── pkg/
│   ├── validator/
│   │   └── validator_test.go           # Input validation tests
│   └── email/
│       └── parser_test.go              # Email parsing tests
└── testutil/
    ├── fixtures.go                     # Test data and fixtures
    ├── assertions.go                   # Custom test assertions
    ├── testdb.go                       # Test database helpers
    └── mocks.go                        # Mock implementations
```

## Running Tests

### All Tests

```bash
# Run all tests with verbose output
make test

# Run all tests without verbose output
make test-short

# Run tests in parallel (faster)
make test-parallel
```

### By Package

```bash
# Service layer tests
make test-anonymizer      # PII anonymization
make test-processor       # Message classification
make test-exporter        # Dataset export

# Package tests
make test-validator       # Input validation
make test-email          # Email parsing

# Handler tests (when implemented)
make test-handlers       # API endpoint tests

# Middleware tests (when implemented)
make test-middleware     # Middleware tests
```

### By Type

```bash
# Unit tests only (no integration tests)
make test-unit

# Run with race detector (detect race conditions)
make test-race

# Run benchmark tests
make test-bench

# Run specific benchmarks
make test-bench-anonymizer
make test-bench-processor
```

### Watch Mode

```bash
# Auto-run tests on file changes (requires gotestsum)
make test-watch
```

### Individual Test

```bash
# Run specific test file
go test -v ./internal/service/anonymizer/

# Run specific test function
go test -v -run TestAnonymizer_Anonymize ./internal/service/anonymizer/

# Run tests matching pattern
go test -v -run "TestAnonymizer_.*" ./internal/service/anonymizer/
```

## Test Coverage

### Generate Coverage Reports

```bash
# Generate HTML coverage report
make test-coverage

# View detailed coverage by function
make test-coverage-report

# Generate coverage with verbose output
make test-verbose
```

### Coverage Output

After running `make test-coverage`, you'll get:

1. **Terminal Output**: Function-by-function coverage percentages
2. **coverage.html**: Interactive HTML report (opens in browser)
3. **coverage.out**: Raw coverage data

### Coverage Goals

| Component | Current | Target |
|-----------|---------|--------|
| Anonymizer | TBD | 90%+ |
| Processor | TBD | 85%+ |
| Exporter | TBD | 85%+ |
| Validator | TBD | 90%+ |
| Email Parser | TBD | 85%+ |
| Handlers | TBD | 80%+ |
| Middleware | TBD | 80%+ |

## Writing Tests

### Test File Naming

- Test files must end with `_test.go`
- Place test files in the same package as the code being tested
- Example: `anonymizer.go` → `anonymizer_test.go`

### Table-Driven Tests

Use table-driven tests for comprehensive coverage:

```go
func TestAnonymizer_Anonymize(t *testing.T) {
    tests := []struct {
        name     string
        input    string
        expected string
    }{
        {
            name:     "email address",
            input:    "Contact john@example.com",
            expected: "Contact [EMAIL_REDACTED]",
        },
        {
            name:     "phone number",
            input:    "Call 555-123-4567",
            expected: "Call [PHONE_REDACTED]",
        },
        // ... more test cases
    }

    anonymizer := New()
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := anonymizer.Anonymize(tt.input)
            if result != tt.expected {
                t.Errorf("got %q, want %q", result, tt.expected)
            }
        })
    }
}
```

### Test Naming Convention

Use descriptive test names:

```go
// Good
TestAnonymizer_Anonymize
TestProcessor_ClassifyMessage
TestValidator_ValidateEmail

// With subtests
t.Run("valid email", func(t *testing.T) { ... })
t.Run("empty email", func(t *testing.T) { ... })
t.Run("invalid format", func(t *testing.T) { ... })
```

### Using Test Utilities

```go
import (
    "testing"
    "api.sting9.org/testutil"
)

func TestExample(t *testing.T) {
    // Use test fixtures
    submissions := testutil.CreateTestSubmissions()

    // Use assertions
    testutil.AssertEqual(t, got, want)
    testutil.AssertNoError(t, err)
    testutil.AssertContains(t, result, "expected substring")
}
```

### Benchmark Tests

```go
func BenchmarkAnonymizer_Anonymize(b *testing.B) {
    anonymizer := New()
    input := "Email: test@example.com, Phone: 555-1234"

    b.ResetTimer()
    for i := 0; i < b.N; i++ {
        _ = anonymizer.Anonymize(input)
    }
}
```

Run benchmarks:

```bash
make test-bench
# Output shows ops/sec and memory allocations
```

## Test Utilities

### Fixtures (`testutil/fixtures.go`)

Pre-defined test data:

```go
// PII examples
piiExamples := testutil.GetPIIExamples()
// Returns map of PII types with example data

// Phishing examples
phishingExamples := testutil.GetPhishingExamples()
// Returns map of categories with example messages

// Create test submission
submission := testutil.CreateTestSubmission("email", "content")
```

### Assertions (`testutil/assertions.go`)

Custom assertion helpers:

```go
// Status code
testutil.AssertStatusCode(t, response.Code, 200)

// JSON response
testutil.AssertJSONResponse(t, body, expectedStruct)

// Error messages
testutil.AssertErrorResponse(t, body, "expected error")

// String operations
testutil.AssertContains(t, got, "substring")
testutil.AssertNotContains(t, got, "unwanted")

// Comparisons
testutil.AssertEqual(t, got, want)
testutil.AssertNotNil(t, value)
testutil.AssertNoError(t, err)
```

### Test Database (`testutil/testdb.go`)

**In-memory SQLite database helpers** - no PostgreSQL required!

```go
// Setup test database (creates fresh in-memory SQLite DB)
db := testutil.SetupTestDB(t)
defer testutil.TeardownTestDB(t, db)

// Create test data
submissionID := testutil.CreateTestSubmissionInDB(t, db, models.SubmissionTypeEmail, "Test content")
userID, email, password := testutil.CreateResearcherUser(t, db)

// Query test data
submission := testutil.GetSubmissionByID(t, db, submissionID)
user := testutil.GetUserByEmail(t, db, email)

// Reset database between tests
testutil.ResetDatabase(t, db)

// Count records
count := testutil.CountSubmissions(t, db)
```

**Database Features:**
- Fresh in-memory SQLite for each test
- Automatic schema creation (SQLite-compatible migrations)
- Foreign key enforcement
- Full isolation between tests
- No cleanup needed (database deleted when connection closes)

## Test Categories

### 1. Unit Tests

Test individual functions/methods in isolation:

```bash
make test-unit
```

**Covered Components:**
- Anonymizer service (PII detection)
- Processor service (classification)
- Exporter service (format conversion)
- Validator package
- Email parser package

### 2. Integration Tests

Test components working together (when implemented):

```bash
make test-handlers    # API endpoints with real HTTP
```

**Will Cover:**
- HTTP handlers
- Database operations
- Middleware chain
- End-to-end flows

### 3. Benchmark Tests

Performance testing:

```bash
make test-bench
```

**Benchmarked Operations:**
- PII anonymization
- Message classification
- Language detection
- Export formatting

## Continuous Integration

### GitHub Actions (Recommended)

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-go@v4
        with:
          go-version: '1.23'
      - name: Run tests
        run: make test-coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage.out
```

### Pre-commit Hooks

```bash
# .git/hooks/pre-commit
#!/bin/sh
make test-short
if [ $? -ne 0 ]; then
    echo "Tests failed. Commit aborted."
    exit 1
fi
```

## Best Practices

### 1. Test Independence

Each test should be independent and not rely on other tests:

```go
// Good - creates its own data
func TestExample(t *testing.T) {
    anonymizer := New()
    result := anonymizer.Anonymize("test")
    // ...
}

// Bad - depends on global state
var globalAnonymizer *Anonymizer

func TestExample(t *testing.T) {
    result := globalAnonymizer.Anonymize("test")
    // ...
}
```

### 2. Clean Up Resources

Use `defer` to ensure cleanup:

```go
func TestExample(t *testing.T) {
    db := setupTestDB(t)
    defer teardownTestDB(t, db)

    // Test code here
}
```

### 3. Test Error Cases

Always test error conditions:

```go
func TestValidator_ValidateEmail(t *testing.T) {
    tests := []struct {
        name        string
        email       string
        expectError bool
    }{
        {"valid email", "user@example.com", false},
        {"empty email", "", true},
        {"invalid format", "not-an-email", true},
    }
    // ...
}
```

### 4. Use t.Helper()

Mark helper functions:

```go
func assertNoError(t *testing.T, err error) {
    t.Helper() // Better error reporting
    if err != nil {
        t.Fatalf("unexpected error: %v", err)
    }
}
```

### 5. Parallel Tests

Use `t.Parallel()` for independent tests:

```go
func TestExample(t *testing.T) {
    t.Parallel() // Can run in parallel with other tests
    // Test code
}
```

### 6. Test Names

Use descriptive names that explain what's being tested:

```go
// Good
t.Run("returns error for invalid email format", func(t *testing.T) { ... })

// Less clear
t.Run("test1", func(t *testing.T) { ... })
```

### 7. Edge Cases

Test boundary conditions:

```go
tests := []struct {
    name  string
    input string
}{
    {"empty string", ""},
    {"very long string", strings.Repeat("a", 10000)},
    {"unicode characters", "Hello 世界"},
    {"special characters", "!@#$%^&*()"},
}
```

## Debugging Tests

### Verbose Output

```bash
# See detailed test output
go test -v ./internal/service/anonymizer/

# See what test is currently running
go test -v -run TestAnonymizer_Anonymize ./internal/service/anonymizer/
```

### Print Debugging

```go
func TestExample(t *testing.T) {
    result := doSomething()
    t.Logf("Result: %+v", result) // Printed only if test fails
    // Use t.Log() or t.Logf() instead of fmt.Println()
}
```

### Run Single Test

```bash
# Run specific test function
go test -v -run TestAnonymizer_Anonymize ./internal/service/anonymizer/

# Run tests matching pattern
go test -v -run "TestAnonymizer_.*Email" ./internal/service/anonymizer/
```

### Test Timeout

```bash
# Set test timeout (default 10 minutes)
go test -timeout 30s ./...
```

## Common Issues

### 1. Test Failures

```bash
# Run with verbose output to see details
make test-verbose

# Run specific failing test
go test -v -run TestName ./path/to/package
```

### 2. Coverage Not Generated

```bash
# Ensure coverage.out is generated
go test -coverprofile=coverage.out ./...

# View coverage
go tool cover -html=coverage.out
```

### 3. Race Conditions

```bash
# Detect race conditions
make test-race

# If races detected, fix before committing
```

## Next Steps

### Planned Test Additions

- [ ] Handler integration tests (HTTP endpoints)
- [ ] Middleware tests (auth, rate limiting, CORS)
- [ ] Database repository tests
- [ ] End-to-end API tests
- [ ] Load/stress tests
- [ ] Security tests (SQL injection, XSS, etc.)

### SQLite vs PostgreSQL

**Tests use SQLite, Production uses PostgreSQL**

| Feature | SQLite (Tests) | PostgreSQL (Production) |
|---------|----------------|-------------------------|
| Setup | Zero - in-memory | Requires server |
| Speed | Very fast | Fast |
| Isolation | Perfect (each test isolated) | Requires careful cleanup |
| CI/CD | Works everywhere | Requires service |
| UUIDs | TEXT (strings) | UUID type |
| JSONB | TEXT (JSON strings) | Native JSONB |
| Timestamps | DATETIME | TIMESTAMPTZ |
| Enums | CHECK constraints | ENUM types |
| Placeholders | `?` | `$1, $2` |

**Schema Compatibility:**

The test database uses SQLite-compatible schema definitions that mirror the PostgreSQL production schema. Key differences are handled automatically:

- UUIDs stored as TEXT strings
- JSONB stored as JSON TEXT
- Enum types replaced with CHECK constraints
- Timestamps use SQLite DATETIME format
- Foreign keys enabled with PRAGMA

## Resources

- [Go Testing Documentation](https://golang.org/pkg/testing/)
- [Table-Driven Tests in Go](https://dave.cheney.net/2019/05/07/prefer-table-driven-tests)
- [Testing Best Practices](https://github.com/golang/go/wiki/TestComments)
- [Testify Assert Library](https://github.com/stretchr/testify) (optional enhancement)

## Getting Help

If tests fail or you need assistance:

1. Check test output for specific error messages
2. Review this guide for examples
3. Look at existing tests for patterns
4. Run tests with `-v` flag for verbose output

---

**Remember**: Good tests are the foundation of reliable software. Write tests first, and your code will be better designed and more maintainable.
