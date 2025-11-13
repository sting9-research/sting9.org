package exporter

import (
	"bytes"
	"encoding/csv"
	"encoding/json"
	"strings"
	"testing"
	"time"

	"api.sting9.org/internal/models"
	"github.com/google/uuid"
)

func createTestSubmissions() []ExportSubmission {
	now := time.Now()
	return []ExportSubmission{
		{
			ID:                uuid.New(),
			Type:              "email",
			AnonymizedContent: "Your account has been [EMAIL_REDACTED]. Click here.",
			Language:          "en",
			Category:          "phishing",
			Status:            "approved",
			Metadata: models.SubmissionMetadata{
				Subject: "Account Alert",
				URLs:    []string{"http://fake-bank.com"},
			},
			CreatedAt: now,
		},
		{
			ID:                uuid.New(),
			Type:              "sms",
			AnonymizedContent: "Package delivery failed. Call [PHONE_REDACTED]",
			Language:          "en",
			Category:          "smishing",
			Status:            "approved",
			Metadata: models.SubmissionMetadata{
				PhoneNumber: "[PHONE_REDACTED]",
				URLs:        []string{"http://fake-delivery.com"},
			},
			CreatedAt: now.Add(-1 * time.Hour),
		},
		{
			ID:                uuid.New(),
			Type:              "whatsapp",
			AnonymizedContent: "Urgent transfer needed. CEO requests [ACCOUNT_REDACTED]",
			Language:          "en",
			Category:          "bec",
			Status:            "approved",
			Metadata: models.SubmissionMetadata{
				URLs: []string{},
			},
			CreatedAt: now.Add(-2 * time.Hour),
		},
	}
}

func TestExporter_ExportToJSON(t *testing.T) {
	tests := []struct {
		name        string
		submissions []ExportSubmission
		expectError bool
	}{
		{
			name:        "export multiple submissions",
			submissions: createTestSubmissions(),
			expectError: false,
		},
		{
			name:        "export single submission",
			submissions: createTestSubmissions()[:1],
			expectError: false,
		},
		{
			name:        "export empty list",
			submissions: []ExportSubmission{},
			expectError: false,
		},
	}

	exporter := New()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var buf bytes.Buffer
			err := exporter.ExportToJSON(&buf, tt.submissions)

			if (err != nil) != tt.expectError {
				t.Errorf("ExportToJSON() error = %v, expectError %v", err, tt.expectError)
				return
			}

			if err != nil {
				return
			}

			// Verify valid JSON
			var result []ExportSubmission
			if err := json.Unmarshal(buf.Bytes(), &result); err != nil {
				t.Errorf("ExportToJSON() produced invalid JSON: %v", err)
				return
			}

			// Verify count
			if len(result) != len(tt.submissions) {
				t.Errorf("ExportToJSON() count mismatch: got %d, want %d", len(result), len(tt.submissions))
			}

			// Verify data integrity
			for i, submission := range tt.submissions {
				if i < len(result) {
					if result[i].ID != submission.ID {
						t.Errorf("ExportToJSON() ID mismatch at index %d: got %v, want %v",
							i, result[i].ID, submission.ID)
					}
					if result[i].Type != submission.Type {
						t.Errorf("ExportToJSON() Type mismatch at index %d: got %s, want %s",
							i, result[i].Type, submission.Type)
					}
					if result[i].Category != submission.Category {
						t.Errorf("ExportToJSON() Category mismatch at index %d: got %s, want %s",
							i, result[i].Category, submission.Category)
					}
				}
			}

			// Verify pretty printing (indented JSON)
			jsonStr := buf.String()
			if !strings.Contains(jsonStr, "\n") {
				t.Error("ExportToJSON() should produce indented JSON")
			}
		})
	}
}

func TestExporter_ExportToJSONL(t *testing.T) {
	tests := []struct {
		name        string
		submissions []ExportSubmission
		expectError bool
	}{
		{
			name:        "export multiple submissions",
			submissions: createTestSubmissions(),
			expectError: false,
		},
		{
			name:        "export single submission",
			submissions: createTestSubmissions()[:1],
			expectError: false,
		},
		{
			name:        "export empty list",
			submissions: []ExportSubmission{},
			expectError: false,
		},
	}

	exporter := New()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var buf bytes.Buffer
			err := exporter.ExportToJSONL(&buf, tt.submissions)

			if (err != nil) != tt.expectError {
				t.Errorf("ExportToJSONL() error = %v, expectError %v", err, tt.expectError)
				return
			}

			if err != nil {
				return
			}

			// Verify JSONL format (one JSON object per line)
			lines := strings.Split(strings.TrimSpace(buf.String()), "\n")
			if len(tt.submissions) > 0 && len(lines) != len(tt.submissions) {
				t.Errorf("ExportToJSONL() line count mismatch: got %d, want %d", len(lines), len(tt.submissions))
			}

			// Verify each line is valid JSON
			for i, line := range lines {
				if line == "" {
					continue
				}
				var submission ExportSubmission
				if err := json.Unmarshal([]byte(line), &submission); err != nil {
					t.Errorf("ExportToJSONL() line %d is invalid JSON: %v", i, err)
				}
			}

			// Verify data integrity
			for i, line := range lines {
				if line == "" {
					continue
				}
				var result ExportSubmission
				json.Unmarshal([]byte(line), &result)

				if i < len(tt.submissions) {
					if result.ID != tt.submissions[i].ID {
						t.Errorf("ExportToJSONL() ID mismatch at line %d: got %v, want %v",
							i, result.ID, tt.submissions[i].ID)
					}
				}
			}
		})
	}
}

func TestExporter_ExportToCSV(t *testing.T) {
	tests := []struct {
		name        string
		submissions []ExportSubmission
		expectError bool
	}{
		{
			name:        "export multiple submissions",
			submissions: createTestSubmissions(),
			expectError: false,
		},
		{
			name:        "export single submission",
			submissions: createTestSubmissions()[:1],
			expectError: false,
		},
		{
			name:        "export empty list",
			submissions: []ExportSubmission{},
			expectError: false,
		},
	}

	exporter := New()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var buf bytes.Buffer
			err := exporter.ExportToCSV(&buf, tt.submissions)

			if (err != nil) != tt.expectError {
				t.Errorf("ExportToCSV() error = %v, expectError %v", err, tt.expectError)
				return
			}

			if err != nil {
				return
			}

			// Parse CSV
			reader := csv.NewReader(&buf)
			records, err := reader.ReadAll()
			if err != nil {
				t.Errorf("ExportToCSV() produced invalid CSV: %v", err)
				return
			}

			// Verify header
			if len(records) < 1 {
				t.Error("ExportToCSV() should include header row")
				return
			}

			header := records[0]
			expectedHeaders := []string{"id", "type", "anonymized_content", "language", "category", "status", "urls", "created_at"}
			if len(header) != len(expectedHeaders) {
				t.Errorf("ExportToCSV() header count mismatch: got %d, want %d", len(header), len(expectedHeaders))
			}

			for i, expectedHeader := range expectedHeaders {
				if i < len(header) && header[i] != expectedHeader {
					t.Errorf("ExportToCSV() header mismatch at index %d: got %s, want %s",
						i, header[i], expectedHeader)
				}
			}

			// Verify row count (header + data rows)
			expectedRows := len(tt.submissions) + 1
			if len(records) != expectedRows {
				t.Errorf("ExportToCSV() row count mismatch: got %d, want %d", len(records), expectedRows)
			}

			// Verify data rows
			for i, submission := range tt.submissions {
				rowIndex := i + 1 // Skip header
				if rowIndex >= len(records) {
					continue
				}

				row := records[rowIndex]
				if len(row) < 8 {
					t.Errorf("ExportToCSV() row %d has insufficient columns: got %d", rowIndex, len(row))
					continue
				}

				// Verify ID
				if row[0] != submission.ID.String() {
					t.Errorf("ExportToCSV() ID mismatch at row %d: got %s, want %s",
						rowIndex, row[0], submission.ID.String())
				}

				// Verify type
				if row[1] != submission.Type {
					t.Errorf("ExportToCSV() Type mismatch at row %d: got %s, want %s",
						rowIndex, row[1], submission.Type)
				}

				// Verify category
				if row[4] != submission.Category {
					t.Errorf("ExportToCSV() Category mismatch at row %d: got %s, want %s",
						rowIndex, row[4], submission.Category)
				}
			}
		})
	}
}

func TestExporter_Export(t *testing.T) {
	submissions := createTestSubmissions()

	tests := []struct {
		name        string
		format      Format
		expectError bool
	}{
		{
			name:        "export as JSON",
			format:      FormatJSON,
			expectError: false,
		},
		{
			name:        "export as JSONL",
			format:      FormatJSONL,
			expectError: false,
		},
		{
			name:        "export as CSV",
			format:      FormatCSV,
			expectError: false,
		},
		{
			name:        "invalid format",
			format:      Format("invalid"),
			expectError: true,
		},
	}

	exporter := New()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var buf bytes.Buffer
			err := exporter.Export(&buf, tt.format, submissions)

			if (err != nil) != tt.expectError {
				t.Errorf("Export() error = %v, expectError %v", err, tt.expectError)
				return
			}

			if !tt.expectError && buf.Len() == 0 {
				t.Error("Export() produced empty output")
			}
		})
	}
}

func TestGetContentType(t *testing.T) {
	tests := []struct {
		format   Format
		expected string
	}{
		{FormatJSON, "application/json"},
		{FormatJSONL, "application/json"},
		{FormatCSV, "text/csv"},
		{Format("invalid"), "application/octet-stream"},
	}

	for _, tt := range tests {
		t.Run(string(tt.format), func(t *testing.T) {
			result := GetContentType(tt.format)
			if result != tt.expected {
				t.Errorf("GetContentType() = %s, want %s", result, tt.expected)
			}
		})
	}
}

func TestGetFileExtension(t *testing.T) {
	tests := []struct {
		format   Format
		expected string
	}{
		{FormatJSON, ".json"},
		{FormatJSONL, ".jsonl"},
		{FormatCSV, ".csv"},
		{Format("invalid"), ".txt"},
	}

	for _, tt := range tests {
		t.Run(string(tt.format), func(t *testing.T) {
			result := GetFileExtension(tt.format)
			if result != tt.expected {
				t.Errorf("GetFileExtension() = %s, want %s", result, tt.expected)
			}
		})
	}
}

// Test CSV escaping with special characters
func TestExporter_CSVEscaping(t *testing.T) {
	submissions := []ExportSubmission{
		{
			ID:                uuid.New(),
			Type:              "email",
			AnonymizedContent: `Content with "quotes" and, commas`,
			Language:          "en",
			Category:          "phishing",
			Status:            "approved",
			Metadata: models.SubmissionMetadata{
				URLs: []string{"http://example.com", "http://test.com"},
			},
			CreatedAt: time.Now(),
		},
	}

	exporter := New()
	var buf bytes.Buffer
	err := exporter.ExportToCSV(&buf, submissions)
	if err != nil {
		t.Fatalf("ExportToCSV() error: %v", err)
	}

	// Parse CSV
	reader := csv.NewReader(&buf)
	records, err := reader.ReadAll()
	if err != nil {
		t.Fatalf("Failed to parse CSV: %v", err)
	}

	if len(records) < 2 {
		t.Fatal("Expected at least 2 rows (header + data)")
	}

	// Verify special characters are properly escaped
	dataRow := records[1]
	if !strings.Contains(dataRow[2], "quotes") {
		t.Error("CSV escaping failed: quotes not preserved")
	}
	if !strings.Contains(dataRow[2], "commas") {
		t.Error("CSV escaping failed: commas not preserved")
	}
}

// Test multiple URLs in CSV
func TestExporter_CSVMultipleURLs(t *testing.T) {
	submissions := []ExportSubmission{
		{
			ID:                uuid.New(),
			Type:              "email",
			AnonymizedContent: "Phishing content",
			Language:          "en",
			Category:          "phishing",
			Status:            "approved",
			Metadata: models.SubmissionMetadata{
				URLs: []string{"http://url1.com", "http://url2.com", "http://url3.com"},
			},
			CreatedAt: time.Now(),
		},
	}

	exporter := New()
	var buf bytes.Buffer
	err := exporter.ExportToCSV(&buf, submissions)
	if err != nil {
		t.Fatalf("ExportToCSV() error: %v", err)
	}

	// Parse CSV
	reader := csv.NewReader(&buf)
	records, err := reader.ReadAll()
	if err != nil {
		t.Fatalf("Failed to parse CSV: %v", err)
	}

	if len(records) < 2 {
		t.Fatal("Expected at least 2 rows")
	}

	// Verify URLs are pipe-separated
	urlsField := records[1][6] // URLs column
	expectedURLs := "http://url1.com|http://url2.com|http://url3.com"
	if urlsField != expectedURLs {
		t.Errorf("URLs not properly formatted: got %s, want %s", urlsField, expectedURLs)
	}
}

// Benchmark tests
func BenchmarkExporter_JSON(b *testing.B) {
	exporter := New()
	submissions := createTestSubmissions()

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		var buf bytes.Buffer
		_ = exporter.ExportToJSON(&buf, submissions)
	}
}

func BenchmarkExporter_JSONL(b *testing.B) {
	exporter := New()
	submissions := createTestSubmissions()

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		var buf bytes.Buffer
		_ = exporter.ExportToJSONL(&buf, submissions)
	}
}

func BenchmarkExporter_CSV(b *testing.B) {
	exporter := New()
	submissions := createTestSubmissions()

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		var buf bytes.Buffer
		_ = exporter.ExportToCSV(&buf, submissions)
	}
}

// Test large dataset export
func TestExporter_LargeDataset(t *testing.T) {
	// Create 1000 submissions
	submissions := make([]ExportSubmission, 1000)
	now := time.Now()
	for i := 0; i < 1000; i++ {
		submissions[i] = ExportSubmission{
			ID:                uuid.New(),
			Type:              "email",
			AnonymizedContent: "Phishing content with [EMAIL_REDACTED]",
			Language:          "en",
			Category:          "phishing",
			Status:            "approved",
			Metadata:          models.SubmissionMetadata{URLs: []string{"http://fake.com"}},
			CreatedAt:         now.Add(time.Duration(-i) * time.Hour),
		}
	}

	exporter := New()

	// Test JSON export
	t.Run("large JSON export", func(t *testing.T) {
		var buf bytes.Buffer
		err := exporter.ExportToJSON(&buf, submissions)
		if err != nil {
			t.Errorf("Large JSON export failed: %v", err)
		}
		if buf.Len() == 0 {
			t.Error("Large JSON export produced empty output")
		}
	})

	// Test JSONL export
	t.Run("large JSONL export", func(t *testing.T) {
		var buf bytes.Buffer
		err := exporter.ExportToJSONL(&buf, submissions)
		if err != nil {
			t.Errorf("Large JSONL export failed: %v", err)
		}
		lines := strings.Split(strings.TrimSpace(buf.String()), "\n")
		if len(lines) != 1000 {
			t.Errorf("Large JSONL export line count: got %d, want 1000", len(lines))
		}
	})

	// Test CSV export
	t.Run("large CSV export", func(t *testing.T) {
		var buf bytes.Buffer
		err := exporter.ExportToCSV(&buf, submissions)
		if err != nil {
			t.Errorf("Large CSV export failed: %v", err)
		}
		reader := csv.NewReader(&buf)
		records, err := reader.ReadAll()
		if err != nil {
			t.Errorf("Failed to parse large CSV: %v", err)
		}
		// Should have 1001 rows (header + 1000 data rows)
		if len(records) != 1001 {
			t.Errorf("Large CSV export row count: got %d, want 1001", len(records))
		}
	})
}
