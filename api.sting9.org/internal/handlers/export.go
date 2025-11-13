package handlers

import (
	"fmt"
	"log/slog"
	"net/http"
	"strconv"
	"time"

	"api.sting9.org/internal/models"
	"api.sting9.org/internal/service/exporter"
	"github.com/jackc/pgx/v5/pgxpool"
)

// ExportHandler handles dataset export endpoints
type ExportHandler struct {
	db       *pgxpool.Pool
	exporter *exporter.Exporter
	logger   *slog.Logger
}

// NewExportHandler creates a new ExportHandler
func NewExportHandler(db *pgxpool.Pool, logger *slog.Logger) *ExportHandler {
	return &ExportHandler{
		db:       db,
		exporter: exporter.New(),
		logger:   logger,
	}
}

// ExportDataset godoc
// @Summary Export dataset
// @Description Export submissions in various formats (requires researcher or partner role)
// @Tags export
// @Accept json
// @Produce json,text/csv
// @Param format query string false "Export format: json, csv, jsonl" default(json)
// @Param page query int false "Page number" default(1)
// @Param page_size query int false "Page size (max 1000)" default(100)
// @Param start_date query string false "Start date (RFC3339 format)"
// @Param end_date query string false "End date (RFC3339 format)"
// @Param type query string false "Filter by submission type"
// @Param category query string false "Filter by category"
// @Security BearerAuth
// @Success 200 {file} file
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 403 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /export [get]
func (h *ExportHandler) ExportDataset(w http.ResponseWriter, r *http.Request) {
	// Parse query parameters
	formatStr := r.URL.Query().Get("format")
	if formatStr == "" {
		formatStr = "json"
	}

	format := exporter.Format(formatStr)
	if format != exporter.FormatJSON && format != exporter.FormatCSV && format != exporter.FormatJSONL {
		respondError(w, http.StatusBadRequest, "Invalid format. Supported formats: json, csv, jsonl")
		return
	}

	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	if page < 1 {
		page = 1
	}

	pageSize, _ := strconv.Atoi(r.URL.Query().Get("page_size"))
	if pageSize < 1 || pageSize > 1000 {
		pageSize = 100
	}

	offset := (page - 1) * pageSize

	// Build query
	query := `
		SELECT id, type, anonymized_content, language, category, status, metadata, created_at
		FROM submissions
		WHERE deleted_at IS NULL AND status = 'processed'
	`
	args := []interface{}{}
	argCount := 1

	// Add filters
	submissionType := r.URL.Query().Get("type")
	if submissionType != "" {
		query += fmt.Sprintf(" AND type = $%d", argCount)
		args = append(args, submissionType)
		argCount++
	}

	category := r.URL.Query().Get("category")
	if category != "" {
		query += fmt.Sprintf(" AND category = $%d", argCount)
		args = append(args, category)
		argCount++
	}

	startDate := r.URL.Query().Get("start_date")
	if startDate != "" {
		parsedDate, err := time.Parse(time.RFC3339, startDate)
		if err != nil {
			respondError(w, http.StatusBadRequest, "Invalid start_date format. Use RFC3339.")
			return
		}
		query += fmt.Sprintf(" AND created_at >= $%d", argCount)
		args = append(args, parsedDate)
		argCount++
	}

	endDate := r.URL.Query().Get("end_date")
	if endDate != "" {
		parsedDate, err := time.Parse(time.RFC3339, endDate)
		if err != nil {
			respondError(w, http.StatusBadRequest, "Invalid end_date format. Use RFC3339.")
			return
		}
		query += fmt.Sprintf(" AND created_at <= $%d", argCount)
		args = append(args, parsedDate)
		argCount++
	}

	query += fmt.Sprintf(" ORDER BY created_at DESC LIMIT $%d OFFSET $%d", argCount, argCount+1)
	args = append(args, pageSize, offset)

	// Execute query
	rows, err := h.db.Query(r.Context(), query, args...)
	if err != nil {
		h.logger.Error("Failed to query submissions for export", slog.Any("error", err))
		respondError(w, http.StatusInternalServerError, "Failed to retrieve data for export")
		return
	}
	defer rows.Close()

	// Collect submissions
	var submissions []exporter.ExportSubmission
	for rows.Next() {
		var sub exporter.ExportSubmission
		var metadataStr []byte
		var language, category *string

		err := rows.Scan(
			&sub.ID,
			&sub.Type,
			&sub.AnonymizedContent,
			&language,
			&category,
			&sub.Status,
			&metadataStr,
			&sub.CreatedAt,
		)

		if err != nil {
			h.logger.Error("Failed to scan submission", slog.Any("error", err))
			continue
		}

		if language != nil {
			sub.Language = *language
		}
		if category != nil {
			sub.Category = *category
		}

		// Parse metadata
		sub.Metadata, _ = models.ParseMetadata(metadataStr)
		submissions = append(submissions, sub)
	}

	// Set response headers
	w.Header().Set("Content-Type", exporter.GetContentType(format))
	filename := fmt.Sprintf("sting9_dataset_%s%s", time.Now().Format("20060102_150405"), exporter.GetFileExtension(format))
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))

	// Export data
	if err := h.exporter.Export(w, format, submissions); err != nil {
		h.logger.Error("Failed to export data", slog.Any("error", err))
		// Can't send error response here as headers are already sent
		return
	}

	h.logger.Info("Dataset exported",
		slog.String("format", formatStr),
		slog.Int("count", len(submissions)),
		slog.Int("page", page),
	)
}
