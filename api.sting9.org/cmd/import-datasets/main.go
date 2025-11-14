package main

import (
	"context"
	"encoding/csv"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"log/slog"
	"os"
	"strings"
	"time"

	"api.sting9.org/config"
	"api.sting9.org/internal/database"
	"api.sting9.org/internal/models"
	"api.sting9.org/internal/service/anonymizer"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/text/encoding/charmap"
)

var (
	analysisDatasetPath = flag.String("analysis", "", "Path to analysisdataset.csv")
	dataset5971Path     = flag.String("dataset5971", "", "Path to Dataset_5971.csv")
	dryRun              = flag.Bool("dry-run", false, "Perform dry run without database insertion")
	verbose             = flag.Bool("verbose", false, "Enable verbose logging")
	batchSize           = flag.Int("batch-size", 100, "Number of records to insert per batch")
)

type ImportStats struct {
	TotalRecords     int
	Imported         int
	Skipped          int
	Failed           int
	URLsExtracted    int
	PIIDetected      int
	StartTime        time.Time
	EndTime          time.Time
}

func main() {
	flag.Parse()

	// Setup logging
	logLevel := slog.LevelInfo
	if *verbose {
		logLevel = slog.LevelDebug
	}
	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
		Level: logLevel,
	}))
	slog.SetDefault(logger)

	logger.Info("Sting9 Dataset Import Tool")
	logger.Info("Configuration",
		slog.Bool("dry_run", *dryRun),
		slog.Int("batch_size", *batchSize),
	)

	if *analysisDatasetPath == "" && *dataset5971Path == "" {
		log.Fatal("At least one dataset path must be provided (-analysis or -dataset5971)")
	}

	ctx := context.Background()
	var dbPool *pgxpool.Pool

	// Initialize database connection unless in dry-run mode
	if !*dryRun {
		// Check for DATABASE_URL first (standard convention)
		databaseURL := os.Getenv("DATABASE_URL")

		if databaseURL != "" {
			// Use DATABASE_URL directly
			poolConfig, err := pgxpool.ParseConfig(databaseURL)
			if err != nil {
				log.Fatalf("Failed to parse DATABASE_URL: %v", err)
			}

			dbPool, err = pgxpool.NewWithConfig(ctx, poolConfig)
			if err != nil {
				log.Fatalf("Failed to connect to database: %v", err)
			}
			logger.Info("Database connection established", slog.String("source", "DATABASE_URL"))
		} else {
			// Fall back to individual config variables
			cfg, err := config.Load()
			if err != nil {
				log.Fatalf("Failed to load configuration: %v", err)
			}

			dbPool, err = database.NewPool(ctx, &database.Config{
				Host:     cfg.Database.Host,
				Port:     cfg.Database.Port,
				User:     cfg.Database.User,
				Password: cfg.Database.Password,
				DBName:   cfg.Database.DBName,
				SSLMode:  cfg.Database.SSLMode,
				MaxConns: cfg.Database.MaxConns,
				MinConns: cfg.Database.MinConns,
			})
			if err != nil {
				log.Fatalf("Failed to connect to database: %v", err)
			}
			logger.Info("Database connection established", slog.String("source", "config"))
		}
		defer dbPool.Close()
	} else {
		logger.Warn("DRY RUN MODE - No database operations will be performed")
	}

	// Initialize anonymizer
	anon := anonymizer.New()

	var totalStats ImportStats
	totalStats.StartTime = time.Now()

	// Import analysisdataset.csv
	if *analysisDatasetPath != "" {
		logger.Info("Processing analysisdataset.csv", slog.String("path", *analysisDatasetPath))
		stats, err := importAnalysisDataset(ctx, dbPool, anon, *analysisDatasetPath, *dryRun, *batchSize, logger)
		if err != nil {
			log.Fatalf("Failed to import analysisdataset.csv: %v", err)
		}
		mergeStats(&totalStats, stats)
	}

	// Import Dataset_5971.csv
	if *dataset5971Path != "" {
		logger.Info("Processing Dataset_5971.csv", slog.String("path", *dataset5971Path))
		stats, err := importDataset5971(ctx, dbPool, anon, *dataset5971Path, *dryRun, *batchSize, logger)
		if err != nil {
			log.Fatalf("Failed to import Dataset_5971.csv: %v", err)
		}
		mergeStats(&totalStats, stats)
	}

	totalStats.EndTime = time.Now()
	printFinalStats(totalStats, logger)
}

// importAnalysisDataset processes analysisdataset.csv (Latin-1 encoding)
func importAnalysisDataset(ctx context.Context, dbPool *pgxpool.Pool, anon *anonymizer.Anonymizer, path string, dryRun bool, batchSize int, logger *slog.Logger) (ImportStats, error) {
	stats := ImportStats{StartTime: time.Now()}

	file, err := os.Open(path)
	if err != nil {
		return stats, fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	// Decode Latin-1 (ISO-8859-1) to UTF-8
	decoder := charmap.ISO8859_1.NewDecoder()
	reader := csv.NewReader(decoder.Reader(file))
	reader.LazyQuotes = true
	reader.TrimLeadingSpace = true

	// Read header
	header, err := reader.Read()
	if err != nil {
		return stats, fmt.Errorf("failed to read header: %w", err)
	}

	// Create column index map
	colIdx := make(map[string]int)
	for i, col := range header {
		colIdx[col] = i
	}

	// Verify required columns exist
	requiredCols := []string{"MainText", "Sender", "SenderType", "timeReceived"}
	for _, col := range requiredCols {
		if _, ok := colIdx[col]; !ok {
			logger.Warn("Missing column", slog.String("column", col))
		}
	}

	var batch []Submission
	lineNum := 1

	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			logger.Warn("Failed to read row", slog.Int("line", lineNum), slog.Any("error", err))
			stats.Failed++
			lineNum++
			continue
		}

		lineNum++
		stats.TotalRecords++

		// Extract main text
		mainText := getColumn(record, colIdx, "MainText")
		if mainText == "" {
			logger.Debug("Skipping empty MainText", slog.Int("line", lineNum))
			stats.Skipped++
			continue
		}

		// Extract URLs before anonymization
		urls := anon.ExtractURLs(mainText)
		if len(urls) > 0 {
			stats.URLsExtracted += len(urls)
		}

		// Detect PII types
		piiTypes := anon.DetectPIITypes(mainText)
		if len(piiTypes) > 0 {
			stats.PIIDetected++
		}

		// Anonymize content
		anonymizedText := anon.Anonymize(mainText)

		// Build metadata
		sender := getColumn(record, colIdx, "Sender")
		senderType := getColumn(record, colIdx, "SenderType")
		timeReceived := getColumn(record, colIdx, "timeReceived")
		brand := getColumn(record, colIdx, "Brand")
		category := getColumn(record, colIdx, "Message Categories")

		// Normalize sender type
		normalizedSenderType := ""
		if strings.Contains(strings.ToLower(senderType), "phone") {
			normalizedSenderType = "phone"
		} else if strings.Contains(strings.ToLower(senderType), "short") {
			normalizedSenderType = "shortcode"
		}

		// Indicators
		indicators := []string{}
		if len(urls) > 0 {
			indicators = append(indicators, "url")
		}
		if strings.Contains(strings.Join(piiTypes, ","), "phone") {
			indicators = append(indicators, "phone")
		}
		if strings.Contains(strings.Join(piiTypes, ","), "email") {
			indicators = append(indicators, "email")
		}

		metadata := models.SubmissionMetadata{
			Date:           parseTimeReceived(timeReceived),
			URLs:           urls,
			Brand:          brand,
			SenderType:     normalizedSenderType,
			OriginalSender: sender,
			Indicators:     indicators,
		}

		// Normalize category
		normalizedCategory := normalizeCategory(category)

		// Parse timestamp
		var createdAt time.Time
		if timeReceived != "" {
			createdAt = parseAnalysisDatasetTime(timeReceived)
		}
		if createdAt.IsZero() {
			createdAt = time.Now()
		}

		submission := Submission{
			ID:                uuid.New(),
			Type:              models.SubmissionTypeSMS,
			RawContent:        mainText,
			AnonymizedContent: anonymizedText,
			Metadata:          metadata,
			Language:          detectLanguage(mainText),
			Category:          normalizedCategory,
			Status:            models.SubmissionStatusProcessed,
			CreatedAt:         createdAt,
			ProcessedAt:       time.Now(),
		}

		batch = append(batch, submission)

		// Insert batch when size reached
		if len(batch) >= batchSize {
			if err := insertBatch(ctx, dbPool, batch, dryRun, logger); err != nil {
				logger.Error("Failed to insert batch", slog.Any("error", err))
				stats.Failed += len(batch)
			} else {
				stats.Imported += len(batch)
			}
			batch = nil
		}

		if stats.TotalRecords%100 == 0 {
			logger.Info("Progress",
				slog.Int("processed", stats.TotalRecords),
				slog.Int("imported", stats.Imported),
				slog.Int("skipped", stats.Skipped),
			)
		}
	}

	// Insert remaining batch
	if len(batch) > 0 {
		if err := insertBatch(ctx, dbPool, batch, dryRun, logger); err != nil {
			logger.Error("Failed to insert final batch", slog.Any("error", err))
			stats.Failed += len(batch)
		} else {
			stats.Imported += len(batch)
		}
	}

	stats.EndTime = time.Now()
	return stats, nil
}

// importDataset5971 processes Dataset_5971.csv (UTF-8 encoding)
func importDataset5971(ctx context.Context, dbPool *pgxpool.Pool, anon *anonymizer.Anonymizer, path string, dryRun bool, batchSize int, logger *slog.Logger) (ImportStats, error) {
	stats := ImportStats{StartTime: time.Now()}

	file, err := os.Open(path)
	if err != nil {
		return stats, fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	reader := csv.NewReader(file)
	reader.LazyQuotes = true
	reader.TrimLeadingSpace = true

	// Read header
	header, err := reader.Read()
	if err != nil {
		return stats, fmt.Errorf("failed to read header: %w", err)
	}

	// Create column index map
	colIdx := make(map[string]int)
	for i, col := range header {
		colIdx[col] = i
	}

	var batch []Submission
	lineNum := 1

	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			logger.Warn("Failed to read row", slog.Int("line", lineNum), slog.Any("error", err))
			stats.Failed++
			lineNum++
			continue
		}

		lineNum++
		stats.TotalRecords++

		// Extract label and filter
		label := strings.ToLower(strings.TrimSpace(getColumn(record, colIdx, "LABEL")))

		// Skip "ham" messages (legitimate messages)
		if label == "ham" {
			stats.Skipped++
			continue
		}

		// Extract text
		text := getColumn(record, colIdx, "TEXT")
		if text == "" {
			logger.Debug("Skipping empty TEXT", slog.Int("line", lineNum))
			stats.Skipped++
			continue
		}

		// Extract URLs before anonymization
		urls := anon.ExtractURLs(text)
		if len(urls) > 0 {
			stats.URLsExtracted += len(urls)
		}

		// Detect PII types
		piiTypes := anon.DetectPIITypes(text)
		if len(piiTypes) > 0 {
			stats.PIIDetected++
		}

		// Anonymize content
		anonymizedText := anon.Anonymize(text)

		// Build indicators from dataset flags
		indicators := []string{}
		if strings.ToLower(getColumn(record, colIdx, "URL")) == "yes" {
			indicators = append(indicators, "url")
		}
		if strings.ToLower(getColumn(record, colIdx, "EMAIL")) == "yes" {
			indicators = append(indicators, "email")
		}
		if strings.ToLower(getColumn(record, colIdx, "PHONE")) == "yes" {
			indicators = append(indicators, "phone")
		}

		metadata := models.SubmissionMetadata{
			URLs:       urls,
			Indicators: indicators,
		}

		// Normalize category from label
		var category string
		if label == "smishing" {
			category = "smishing"
		} else if label == "spam" {
			category = "spam"
		} else {
			category = label
		}

		submission := Submission{
			ID:                uuid.New(),
			Type:              models.SubmissionTypeSMS,
			RawContent:        text,
			AnonymizedContent: anonymizedText,
			Metadata:          metadata,
			Language:          detectLanguage(text),
			Category:          category,
			Status:            models.SubmissionStatusProcessed,
			CreatedAt:         time.Now(),
			ProcessedAt:       time.Now(),
		}

		batch = append(batch, submission)

		// Insert batch when size reached
		if len(batch) >= batchSize {
			if err := insertBatch(ctx, dbPool, batch, dryRun, logger); err != nil {
				logger.Error("Failed to insert batch", slog.Any("error", err))
				stats.Failed += len(batch)
			} else {
				stats.Imported += len(batch)
			}
			batch = nil
		}

		if stats.TotalRecords%100 == 0 {
			logger.Info("Progress",
				slog.Int("processed", stats.TotalRecords),
				slog.Int("imported", stats.Imported),
				slog.Int("skipped", stats.Skipped),
			)
		}
	}

	// Insert remaining batch
	if len(batch) > 0 {
		if err := insertBatch(ctx, dbPool, batch, dryRun, logger); err != nil {
			logger.Error("Failed to insert final batch", slog.Any("error", err))
			stats.Failed += len(batch)
		} else {
			stats.Imported += len(batch)
		}
	}

	stats.EndTime = time.Now()
	return stats, nil
}

// Submission represents a database submission record
type Submission struct {
	ID                uuid.UUID
	Type              models.SubmissionType
	RawContent        string
	AnonymizedContent string
	Metadata          models.SubmissionMetadata
	Language          string
	Category          string
	Status            models.SubmissionStatus
	CreatedAt         time.Time
	ProcessedAt       time.Time
}

// insertBatch inserts a batch of submissions into the database
func insertBatch(ctx context.Context, dbPool *pgxpool.Pool, submissions []Submission, dryRun bool, logger *slog.Logger) error {
	if dryRun {
		logger.Debug("DRY RUN: Would insert batch", slog.Int("count", len(submissions)))

		// In dry run, show first record as example
		if len(submissions) > 0 {
			metadataJSON, _ := json.MarshalIndent(submissions[0].Metadata, "", "  ")
			logger.Debug("Sample record",
				slog.String("id", submissions[0].ID.String()),
				slog.String("type", string(submissions[0].Type)),
				slog.String("category", submissions[0].Category),
				slog.String("language", submissions[0].Language),
				slog.String("raw_content_preview", truncate(submissions[0].RawContent, 100)),
				slog.String("anonymized_content_preview", truncate(submissions[0].AnonymizedContent, 100)),
				slog.String("metadata", string(metadataJSON)),
			)
		}
		return nil
	}

	// Begin transaction
	tx, err := dbPool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	// Insert each submission
	for _, sub := range submissions {
		metadataJSON, err := json.Marshal(sub.Metadata)
		if err != nil {
			return fmt.Errorf("failed to marshal metadata: %w", err)
		}

		query := `
			INSERT INTO submissions (
				id, type, raw_content, anonymized_content, metadata,
				language, category, status, created_at, processed_at, updated_at
			) VALUES (
				$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
			)
		`

		_, err = tx.Exec(ctx, query,
			sub.ID,
			sub.Type,
			sub.RawContent,
			sub.AnonymizedContent,
			metadataJSON,
			sub.Language,
			sub.Category,
			sub.Status,
			sub.CreatedAt,
			sub.ProcessedAt,
			time.Now(),
		)
		if err != nil {
			return fmt.Errorf("failed to insert submission %s: %w", sub.ID, err)
		}
	}

	// Commit transaction
	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	logger.Debug("Batch inserted successfully", slog.Int("count", len(submissions)))
	return nil
}

// Helper functions

func getColumn(record []string, colIdx map[string]int, colName string) string {
	if idx, ok := colIdx[colName]; ok && idx < len(record) {
		return strings.TrimSpace(record[idx])
	}
	return ""
}

func parseTimeReceived(timeStr string) string {
	if timeStr == "" {
		return ""
	}
	// Format: "03/31/2022, 21:58:50"
	t := parseAnalysisDatasetTime(timeStr)
	if !t.IsZero() {
		return t.Format(time.RFC3339)
	}
	return timeStr
}

func parseAnalysisDatasetTime(timeStr string) time.Time {
	if timeStr == "" {
		return time.Time{}
	}

	// Try format: "MM/DD/YYYY, HH:MM:SS"
	layouts := []string{
		"01/02/2006, 15:04:05",
		"1/2/2006, 15:04:05",
		"01/02/2006 15:04:05",
		"1/2/2006 15:04:05",
	}

	for _, layout := range layouts {
		if t, err := time.Parse(layout, timeStr); err == nil {
			return t
		}
	}

	return time.Time{}
}

func normalizeCategory(category string) string {
	if category == "" {
		return ""
	}
	// Convert to lowercase and replace spaces with underscores
	normalized := strings.ToLower(category)
	normalized = strings.ReplaceAll(normalized, " ", "_")
	normalized = strings.ReplaceAll(normalized, "/", "_")
	return normalized
}

func detectLanguage(text string) string {
	// Simple heuristic: assume English for now
	// Could be enhanced with a proper language detection library
	return "en"
}

func truncate(s string, maxLen int) string {
	if len(s) <= maxLen {
		return s
	}
	return s[:maxLen] + "..."
}

func mergeStats(total *ImportStats, stats ImportStats) {
	total.TotalRecords += stats.TotalRecords
	total.Imported += stats.Imported
	total.Skipped += stats.Skipped
	total.Failed += stats.Failed
	total.URLsExtracted += stats.URLsExtracted
	total.PIIDetected += stats.PIIDetected
}

func printFinalStats(stats ImportStats, logger *slog.Logger) {
	duration := stats.EndTime.Sub(stats.StartTime)

	logger.Info("═══════════════════════════════════════════")
	logger.Info("Import Complete!")
	logger.Info("═══════════════════════════════════════════")
	logger.Info("Statistics",
		slog.Int("total_records", stats.TotalRecords),
		slog.Int("imported", stats.Imported),
		slog.Int("skipped", stats.Skipped),
		slog.Int("failed", stats.Failed),
		slog.Int("urls_extracted", stats.URLsExtracted),
		slog.Int("pii_detected", stats.PIIDetected),
		slog.Duration("duration", duration),
	)
	logger.Info("═══════════════════════════════════════════")

	successRate := float64(stats.Imported) / float64(stats.TotalRecords) * 100
	logger.Info(fmt.Sprintf("Success Rate: %.2f%%", successRate))
}
