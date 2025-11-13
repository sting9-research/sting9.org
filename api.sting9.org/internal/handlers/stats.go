package handlers

import (
	"log/slog"
	"net/http"

	"api.sting9.org/internal/models"
	"github.com/jackc/pgx/v5/pgxpool"
)

// StatsHandler handles statistics endpoints
type StatsHandler struct {
	db     *pgxpool.Pool
	logger *slog.Logger
}

// NewStatsHandler creates a new StatsHandler
func NewStatsHandler(db *pgxpool.Pool, logger *slog.Logger) *StatsHandler {
	return &StatsHandler{
		db:     db,
		logger: logger,
	}
}

// GetStatistics godoc
// @Summary Get dataset statistics
// @Description Get aggregated statistics about the submission dataset
// @Tags statistics
// @Accept json
// @Produce json
// @Success 200 {object} models.StatsResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /stats [get]
func (h *StatsHandler) GetStatistics(w http.ResponseWriter, r *http.Request) {
	query := `
		SELECT total_submissions, submissions_by_type, submissions_by_category,
		       submissions_by_status, languages_detected, submissions_by_date, updated_at
		FROM statistics
		WHERE id = 1
	`

	var stats models.Statistics
	var byType, byCategory, byStatus, languages, byDate []byte

	err := h.db.QueryRow(r.Context(), query).Scan(
		&stats.TotalSubmissions,
		&byType,
		&byCategory,
		&byStatus,
		&languages,
		&byDate,
		&stats.UpdatedAt,
	)

	if err != nil {
		h.logger.Error("Failed to get statistics", slog.Any("error", err))
		respondError(w, http.StatusInternalServerError, "Failed to retrieve statistics")
		return
	}

	// Parse JSONB fields
	stats.SubmissionsByType, _ = models.ParseJSONBMap(byType)
	stats.SubmissionsByCategory, _ = models.ParseJSONBMap(byCategory)
	stats.SubmissionsByStatus, _ = models.ParseJSONBMap(byStatus)
	stats.LanguagesDetected, _ = models.ParseJSONBMap(languages)
	stats.SubmissionsByDate, _ = models.ParseJSONBMap(byDate)

	response := models.StatsResponse{
		Statistics: stats,
		Message:    "Dataset statistics retrieved successfully",
	}

	respondJSON(w, http.StatusOK, response)
}

// RefreshStatistics godoc
// @Summary Refresh statistics
// @Description Manually trigger statistics refresh (admin only)
// @Tags statistics
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} models.StatsResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 403 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /stats/refresh [post]
func (h *StatsHandler) RefreshStatistics(w http.ResponseWriter, r *http.Request) {
	// Update statistics
	_, err := h.db.Exec(r.Context(), "SELECT update_statistics()")
	if err != nil {
		h.logger.Error("Failed to refresh statistics", slog.Any("error", err))
		respondError(w, http.StatusInternalServerError, "Failed to refresh statistics")
		return
	}

	h.logger.Info("Statistics refreshed")

	// Return updated statistics
	h.GetStatistics(w, r)
}
