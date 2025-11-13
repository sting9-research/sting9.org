package exporter

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"strings"
	"time"

	"api.sting9.org/internal/models"
	"github.com/google/uuid"
)

// Format represents export format types
type Format string

const (
	FormatJSON  Format = "json"
	FormatCSV   Format = "csv"
	FormatJSONL Format = "jsonl"
)

// Exporter handles dataset exports
type Exporter struct{}

// New creates a new Exporter instance
func New() *Exporter {
	return &Exporter{}
}

// ExportSubmission represents a submission for export
type ExportSubmission struct {
	ID                uuid.UUID          `json:"id"`
	Type              string             `json:"type"`
	AnonymizedContent string             `json:"anonymized_content"`
	Language          string             `json:"language"`
	Category          string             `json:"category"`
	Status            string             `json:"status"`
	Metadata          models.SubmissionMetadata `json:"metadata"`
	CreatedAt         time.Time          `json:"created_at"`
}

// ExportToJSON exports submissions as JSON
func (e *Exporter) ExportToJSON(writer io.Writer, submissions []ExportSubmission) error {
	encoder := json.NewEncoder(writer)
	encoder.SetIndent("", "  ")
	return encoder.Encode(submissions)
}

// ExportToJSONL exports submissions as JSON Lines (one JSON object per line)
func (e *Exporter) ExportToJSONL(writer io.Writer, submissions []ExportSubmission) error {
	encoder := json.NewEncoder(writer)
	for _, submission := range submissions {
		if err := encoder.Encode(submission); err != nil {
			return fmt.Errorf("error encoding submission %s: %w", submission.ID, err)
		}
	}
	return nil
}

// ExportToCSV exports submissions as CSV
func (e *Exporter) ExportToCSV(writer io.Writer, submissions []ExportSubmission) error {
	csvWriter := csv.NewWriter(writer)
	defer csvWriter.Flush()

	// Write header
	header := []string{
		"id",
		"type",
		"anonymized_content",
		"language",
		"category",
		"status",
		"urls",
		"created_at",
	}
	if err := csvWriter.Write(header); err != nil {
		return fmt.Errorf("error writing CSV header: %w", err)
	}

	// Write rows
	for _, submission := range submissions {
		urls := strings.Join(submission.Metadata.URLs, "|")

		row := []string{
			submission.ID.String(),
			submission.Type,
			submission.AnonymizedContent,
			submission.Language,
			submission.Category,
			submission.Status,
			urls,
			submission.CreatedAt.Format(time.RFC3339),
		}

		if err := csvWriter.Write(row); err != nil {
			return fmt.Errorf("error writing CSV row for submission %s: %w", submission.ID, err)
		}
	}

	return nil
}

// Export exports submissions in the specified format
func (e *Exporter) Export(writer io.Writer, format Format, submissions []ExportSubmission) error {
	switch format {
	case FormatJSON:
		return e.ExportToJSON(writer, submissions)
	case FormatJSONL:
		return e.ExportToJSONL(writer, submissions)
	case FormatCSV:
		return e.ExportToCSV(writer, submissions)
	default:
		return fmt.Errorf("unsupported export format: %s", format)
	}
}

// GetContentType returns the appropriate Content-Type header for the format
func GetContentType(format Format) string {
	switch format {
	case FormatJSON, FormatJSONL:
		return "application/json"
	case FormatCSV:
		return "text/csv"
	default:
		return "application/octet-stream"
	}
}

// GetFileExtension returns the appropriate file extension for the format
func GetFileExtension(format Format) string {
	switch format {
	case FormatJSON:
		return ".json"
	case FormatJSONL:
		return ".jsonl"
	case FormatCSV:
		return ".csv"
	default:
		return ".txt"
	}
}
