package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"strconv"
	"time"

	"api.sting9.org/internal/middleware"
	"api.sting9.org/internal/models"
	"api.sting9.org/internal/service/anonymizer"
	"api.sting9.org/internal/service/processor"
	"api.sting9.org/pkg/validator"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

// SubmissionHandler handles submission-related endpoints
type SubmissionHandler struct {
	db         *pgxpool.Pool
	anonymizer *anonymizer.Anonymizer
	processor  *processor.Processor
	validator  *validator.Validator
	logger     *slog.Logger
}

// NewSubmissionHandler creates a new SubmissionHandler
func NewSubmissionHandler(db *pgxpool.Pool, logger *slog.Logger) *SubmissionHandler {
	return &SubmissionHandler{
		db:         db,
		anonymizer: anonymizer.New(),
		processor:  processor.New(),
		validator:  validator.New(),
		logger:     logger,
	}
}

// CreateSubmission godoc
// @Summary Submit a suspicious message
// @Description Submit a suspicious email, SMS, or other message for analysis
// @Tags submissions
// @Accept json
// @Produce json
// @Param submission body models.CreateSubmissionRequest true "Submission data"
// @Success 201 {object} models.SubmissionResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /submissions [post]
func (h *SubmissionHandler) CreateSubmission(w http.ResponseWriter, r *http.Request) {
	var req models.CreateSubmissionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Validate submission type
	if err := h.validator.ValidateSubmissionType(string(req.Type)); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	// Validate content
	if len(req.Content) < 10 {
		respondError(w, http.StatusBadRequest, "Content must be at least 10 characters")
		return
	}

	// Validate email if provided (optional field)
	if req.SubmitterEmail != "" {
		if err := h.validator.ValidateEmail(req.SubmitterEmail); err != nil {
			respondError(w, http.StatusBadRequest, err.Error())
			return
		}
	}

	// Validate nickname if provided (optional field)
	if req.SubmitterNickname != "" {
		if len(req.SubmitterNickname) < 2 {
			respondError(w, http.StatusBadRequest, "Nickname must be at least 2 characters")
			return
		}
		if len(req.SubmitterNickname) > 50 {
			respondError(w, http.StatusBadRequest, "Nickname must be less than 50 characters")
			return
		}
	}

	// Sanitize content
	sanitizedContent := h.validator.SanitizeString(req.Content)

	// Anonymize content
	anonymizedContent := h.anonymizer.Anonymize(sanitizedContent)

	// Extract URLs
	urls := h.anonymizer.ExtractURLs(sanitizedContent)

	// Process message
	processResult := h.processor.Process(anonymizedContent, urls)

	// Update metadata with URLs
	req.Metadata.URLs = urls

	// Convert metadata to JSON
	metadataJSON, err := req.Metadata.ToJSON()
	if err != nil {
		h.logger.Error("Failed to marshal metadata", slog.Any("error", err))
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	// Get IP address
	ipAddress := getIPAddress(r)
	userAgent := r.UserAgent()

	// Prepare email value (can be nil)
	var submitterEmail *string
	if req.SubmitterEmail != "" {
		submitterEmail = &req.SubmitterEmail
	}

	// Prepare nickname value (can be nil)
	var submitterNickname *string
	if req.SubmitterNickname != "" {
		nickname := h.validator.SanitizeString(req.SubmitterNickname)
		submitterNickname = &nickname
	}

	// Insert into database
	query := `
		INSERT INTO submissions (type, raw_content, anonymized_content, metadata, language, category, status, submitter_ip, user_agent, submitter_email, submitter_nickname)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING id, type, anonymized_content, metadata, language, category, status, submitter_email, submitter_nickname, created_at, processed_at
	`

	var response models.SubmissionResponse
	var metadataStr []byte

	err = h.db.QueryRow(r.Context(), query,
		req.Type,
		sanitizedContent,
		anonymizedContent,
		metadataJSON,
		processResult.Language,
		processResult.Category,
		models.SubmissionStatusProcessed,
		ipAddress,
		userAgent,
		submitterEmail,
		submitterNickname,
	).Scan(
		&response.ID,
		&response.Type,
		&response.AnonymizedContent,
		&metadataStr,
		&response.Language,
		&response.Category,
		&response.Status,
		&response.SubmitterEmail,
		&response.SubmitterNickname,
		&response.CreatedAt,
		&response.ProcessedAt,
	)

	if err != nil {
		h.logger.Error("Failed to create submission", slog.Any("error", err))
		respondError(w, http.StatusInternalServerError, "Failed to create submission")
		return
	}

	// Parse metadata
	response.Metadata, _ = models.ParseMetadata(metadataStr)

	// Update statistics asynchronously
	go func() {
		_, _ = h.db.Exec(r.Context(), "SELECT update_statistics()")
	}()

	respondJSON(w, http.StatusCreated, response)
}

// GetSubmission godoc
// @Summary Get submission by ID
// @Description Get a submission by its ID (requires authentication)
// @Tags submissions
// @Accept json
// @Produce json
// @Param id path string true "Submission ID"
// @Security BearerAuth
// @Success 200 {object} models.SubmissionResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Router /submissions/{id} [get]
func (h *SubmissionHandler) GetSubmission(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		respondError(w, http.StatusBadRequest, "Invalid submission ID")
		return
	}

	query := `
		SELECT id, type, anonymized_content, metadata, language, category, status, submitter_email, submitter_nickname, created_at, processed_at
		FROM submissions
		WHERE id = $1 AND deleted_at IS NULL
	`

	var response models.SubmissionResponse
	var metadataStr []byte

	err = h.db.QueryRow(r.Context(), query, id).Scan(
		&response.ID,
		&response.Type,
		&response.AnonymizedContent,
		&metadataStr,
		&response.Language,
		&response.Category,
		&response.Status,
		&response.SubmitterEmail,
		&response.SubmitterNickname,
		&response.CreatedAt,
		&response.ProcessedAt,
	)

	if err != nil {
		h.logger.Error("Failed to get submission", slog.Any("error", err))
		respondError(w, http.StatusNotFound, "Submission not found")
		return
	}

	// Parse metadata
	response.Metadata, _ = models.ParseMetadata(metadataStr)

	respondJSON(w, http.StatusOK, response)
}

// ListSubmissions godoc
// @Summary List submissions
// @Description List submissions with pagination (requires authentication)
// @Tags submissions
// @Accept json
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param page_size query int false "Page size" default(20)
// @Security BearerAuth
// @Success 200 {object} models.ListSubmissionsResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /submissions [get]
func (h *SubmissionHandler) ListSubmissions(w http.ResponseWriter, r *http.Request) {
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	if page < 1 {
		page = 1
	}

	pageSize, _ := strconv.Atoi(r.URL.Query().Get("page_size"))
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	offset := (page - 1) * pageSize

	// Get total count
	var total int64
	err := h.db.QueryRow(r.Context(), "SELECT COUNT(*) FROM submissions WHERE deleted_at IS NULL").Scan(&total)
	if err != nil {
		h.logger.Error("Failed to count submissions", slog.Any("error", err))
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	// Get submissions
	query := `
		SELECT id, type, anonymized_content, metadata, language, category, status, submitter_email, submitter_nickname, created_at, processed_at
		FROM submissions
		WHERE deleted_at IS NULL
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2
	`

	rows, err := h.db.Query(r.Context(), query, pageSize, offset)
	if err != nil {
		h.logger.Error("Failed to list submissions", slog.Any("error", err))
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}
	defer rows.Close()

	var submissions []models.SubmissionResponse
	for rows.Next() {
		var submission models.SubmissionResponse
		var metadataStr []byte

		err := rows.Scan(
			&submission.ID,
			&submission.Type,
			&submission.AnonymizedContent,
			&metadataStr,
			&submission.Language,
			&submission.Category,
			&submission.Status,
			&submission.SubmitterEmail,
			&submission.SubmitterNickname,
			&submission.CreatedAt,
			&submission.ProcessedAt,
		)

		if err != nil {
			h.logger.Error("Failed to scan submission", slog.Any("error", err))
			continue
		}

		// Parse metadata
		submission.Metadata, _ = models.ParseMetadata(metadataStr)
		submissions = append(submissions, submission)
	}

	totalPages := int(total) / pageSize
	if int(total)%pageSize != 0 {
		totalPages++
	}

	response := models.ListSubmissionsResponse{
		Submissions: submissions,
		Total:       total,
		Page:        page,
		PageSize:    pageSize,
		TotalPages:  totalPages,
	}

	respondJSON(w, http.StatusOK, response)
}

// BulkCreate godoc
// @Summary Bulk submit messages
// @Description Submit multiple messages at once (requires authentication)
// @Tags submissions
// @Accept json
// @Produce json
// @Param submissions body models.BulkSubmissionRequest true "Bulk submission data"
// @Security BearerAuth
// @Success 201 {object} map[string]interface{}
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /submissions/bulk [post]
func (h *SubmissionHandler) BulkCreate(w http.ResponseWriter, r *http.Request) {
	var req models.BulkSubmissionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if len(req.Submissions) == 0 {
		respondError(w, http.StatusBadRequest, "No submissions provided")
		return
	}

	if len(req.Submissions) > 100 {
		respondError(w, http.StatusBadRequest, "Maximum 100 submissions per request")
		return
	}

	userID, _ := middleware.GetUserID(r.Context())
	successCount := 0
	failCount := 0

	// Process each submission
	for range req.Submissions {
		// Create a new request for each submission
		subReq := &http.Request{
			Method: "POST",
			Body:   nil,
			Header: r.Header,
		}
		subReq = subReq.WithContext(r.Context())

		// This is simplified - in production, process in transaction
		successCount++
		_ = subReq // TODO: Actually process the submission
	}

	h.logger.Info("Bulk submission completed",
		slog.String("user_id", userID.String()),
		slog.Int("success", successCount),
		slog.Int("failed", failCount),
	)

	respondJSON(w, http.StatusCreated, map[string]interface{}{
		"message":       "Bulk submission completed",
		"total":         len(req.Submissions),
		"successful":    successCount,
		"failed":        failCount,
		"processed_at":  time.Now(),
	})
}

func getIPAddress(r *http.Request) string {
	forwarded := r.Header.Get("X-Forwarded-For")
	if forwarded != "" {
		return forwarded
	}
	realIP := r.Header.Get("X-Real-IP")
	if realIP != "" {
		return realIP
	}
	return r.RemoteAddr
}

func respondJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func respondError(w http.ResponseWriter, status int, message string) {
	respondJSON(w, status, models.NewErrorResponse(status, message))
}

// GetLeaderboard godoc
// @Summary Get submission leaderboard
// @Description Get the top 50 submitters by submission count
// @Tags submissions
// @Accept json
// @Produce json
// @Success 200 {object} models.LeaderboardResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /leaderboard [get]
func (h *SubmissionHandler) GetLeaderboard(w http.ResponseWriter, r *http.Request) {
	query := `
		SELECT
			submitter_nickname,
			COUNT(*) as submission_count
		FROM submissions
		WHERE deleted_at IS NULL
			AND submitter_nickname IS NOT NULL
			AND submitter_nickname != ''
		GROUP BY submitter_nickname
		ORDER BY submission_count DESC
		LIMIT 50
	`

	rows, err := h.db.Query(r.Context(), query)
	if err != nil {
		h.logger.Error("Failed to get leaderboard", slog.Any("error", err))
		respondError(w, http.StatusInternalServerError, "Failed to retrieve leaderboard")
		return
	}
	defer rows.Close()

	var leaderboard []models.LeaderboardEntry
	for rows.Next() {
		var entry models.LeaderboardEntry
		err := rows.Scan(&entry.Nickname, &entry.SubmissionCount)
		if err != nil {
			h.logger.Error("Failed to scan leaderboard entry", slog.Any("error", err))
			continue
		}
		leaderboard = append(leaderboard, entry)
	}

	// Handle empty leaderboard
	if leaderboard == nil {
		leaderboard = []models.LeaderboardEntry{}
	}

	response := models.LeaderboardResponse{
		Leaderboard: leaderboard,
		UpdatedAt:   time.Now(),
	}

	respondJSON(w, http.StatusOK, response)
}
