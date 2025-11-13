# Test Suite Quick Reference

## Quick Start

```bash
make test              # Run all tests
make test-coverage     # Run with coverage report
make test-anonymizer   # Run specific component tests
```

## Test Files Created

| File | Lines | Test Cases | Purpose |
|------|-------|------------|---------|
| `anonymizer_test.go` | 575 | 70+ | PII detection & redaction |
| `processor_test.go` | 529 | 50+ | Message classification |
| `exporter_test.go` | 590 | 40+ | Dataset export formats |
| `validator_test.go` | 558 | 45+ | Input validation |
| `parser_test.go` | 488 | 35+ | Email parsing |
| `fixtures.go` | 229 | N/A | Test data |
| `assertions.go` | 252 | N/A | Test helpers |
| **TOTAL** | **3,221** | **240+** | |

## Test Commands

### Run Tests

```bash
make test                    # All tests
make test-short             # Without verbose output
make test-verbose           # With verbose output
make test-parallel          # Run in parallel (faster)
```

### By Component

```bash
make test-anonymizer        # PII anonymization
make test-processor         # Classification
make test-exporter          # Export formats
make test-validator         # Validation
make test-email            # Email parsing
```

### Coverage

```bash
make test-coverage          # Generate HTML report
make test-coverage-report   # Detailed by function
```

### Performance

```bash
make test-bench            # All benchmarks
make test-bench-anonymizer  # Anonymizer benchmarks
make test-bench-processor   # Processor benchmarks
make test-race             # Race condition detection
```

## Test Coverage

### Components Tested

- ✅ **Anonymizer** - 70+ test cases
  - All PII types (email, phone, SSN, credit cards, IPs, addresses, accounts)
  - URL extraction
  - PII type detection
  - Metadata anonymization
  - Real phishing examples

- ✅ **Processor** - 50+ test cases
  - Language detection (7+ languages)
  - Message classification (phishing, smishing, BEC, tech support, romance scams)
  - Keyword extraction
  - Real scam examples

- ✅ **Exporter** - 40+ test cases
  - JSON, JSONL, CSV export
  - Special character escaping
  - Large dataset handling (1000+ records)
  - Content type detection

- ✅ **Validator** - 45+ test cases
  - Email validation
  - Password strength
  - Submission type validation
  - File validation (extension, size)
  - String sanitization

- ✅ **Email Parser** - 35+ test cases
  - Header extraction
  - Body parsing
  - HTML to plain text
  - Real phishing email parsing

## Example Test Runs

### Run All Tests

```bash
$ make test

=== RUN   TestAnonymizer_Anonymize
--- PASS: TestAnonymizer_Anonymize (0.01s)
=== RUN   TestProcessor_ClassifyMessage
--- PASS: TestProcessor_ClassifyMessage (0.01s)
=== RUN   TestExporter_ExportToJSON
--- PASS: TestExporter_ExportToJSON (0.00s)

PASS
coverage: 89.5% of statements
```

### Run with Coverage

```bash
$ make test-coverage

Running tests with coverage...
ok      api.sting9.org/internal/service/anonymizer    0.123s    coverage: 95.2%
ok      api.sting9.org/internal/service/processor     0.089s    coverage: 91.3%
ok      api.sting9.org/internal/service/exporter      0.067s    coverage: 93.8%
ok      api.sting9.org/pkg/validator                  0.045s    coverage: 94.1%
ok      api.sting9.org/pkg/email                      0.056s    coverage: 88.7%

Coverage report: coverage.html
```

### Run Benchmarks

```bash
$ make test-bench-anonymizer

BenchmarkAnonymizer_Anonymize-8          50000    23456 ns/op    1234 B/op    45 allocs/op
BenchmarkAnonymizer_ExtractURLs-8       100000    12345 ns/op     789 B/op    23 allocs/op
BenchmarkAnonymizer_DetectPIITypes-8    100000    15678 ns/op     456 B/op    12 allocs/op
```

## Writing New Tests

### Table-Driven Test Template

```go
func TestComponent_Function(t *testing.T) {
    tests := []struct {
        name     string
        input    string
        expected string
    }{
        {
            name:     "descriptive test name",
            input:    "test input",
            expected: "expected output",
        },
        // ... more test cases
    }

    component := New()
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := component.Function(tt.input)
            if result != tt.expected {
                t.Errorf("got %q, want %q", result, tt.expected)
            }
        })
    }
}
```

### Using Test Utilities

```go
import "api.sting9.org/testutil"

// Use fixtures
piiExamples := testutil.GetPIIExamples()

// Use assertions
testutil.AssertEqual(t, got, want)
testutil.AssertNoError(t, err)
testutil.AssertContains(t, result, "substring")
```

## Common Tasks

### Add New Test

1. Create `*_test.go` file in same package
2. Write table-driven tests
3. Run: `go test -v ./path/to/package`

### Check Coverage

```bash
make test-coverage
# Open coverage.html in browser
```

### Debug Failing Test

```bash
# Run specific test with verbose output
go test -v -run TestName ./path/to/package

# Add debug output in test
t.Logf("Debug: %+v", value)
```

### Run Single Test

```bash
go test -v -run TestAnonymizer_Anonymize ./internal/service/anonymizer/
```

## CI/CD Integration

### GitHub Actions

```yaml
- name: Run tests
  run: make test-coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage.out
```

### Pre-commit Hook

```bash
#!/bin/sh
make test-short || exit 1
```

## Performance Tips

### Speed Up Tests

```bash
# Run in parallel
make test-parallel

# Cache test results
go test -count=1 ./...  # Force no cache

# Profile slow tests
go test -cpuprofile=cpu.prof ./...
```

### Optimize Benchmarks

```bash
# Run more iterations
go test -bench=. -benchtime=10s ./...

# Memory profiling
go test -bench=. -memprofile=mem.prof ./...
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Tests not found | Ensure `*_test.go` suffix |
| Import errors | Run `go mod tidy` |
| Coverage low | Check uncovered lines: `go tool cover -func=coverage.out` |
| Tests slow | Use `make test-parallel` |
| Race detected | Fix before committing, run `make test-race` |

## Documentation

- **TESTING.md** - Complete testing guide
- **TEST_SUMMARY.md** - Implementation summary
- **Makefile** - All test commands (run `make help`)

## Test Metrics

- **Total Test Code**: 3,221 lines
- **Test Cases**: 240+
- **Benchmarks**: 15
- **Target Coverage**: 80%+
- **Components Covered**: 5/5 (100%)

## Next Steps

When handlers/middleware are implemented:

1. Add handler integration tests
2. Add middleware tests
3. Add database repository tests
4. Add end-to-end API tests

---

**Remember**: Always run tests before committing!

```bash
make test && git commit
```
