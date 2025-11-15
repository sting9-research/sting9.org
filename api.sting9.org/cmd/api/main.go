package main

import (
	"context"
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"api.sting9.org/config"
	"api.sting9.org/internal/database"
	"api.sting9.org/internal/handlers"
	"api.sting9.org/internal/middleware"
	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
)

// @title Sting9 API
// @version 1.0
// @description REST API for the Sting9 Research Initiative - collecting phishing and smishing messages for AI training
// @termsOfService https://sting9.org/terms

// @contact.name Sting9 Support
// @contact.email support@sting9.org

// @license.name Creative Commons CC0
// @license.url https://creativecommons.org/publicdomain/zero/1.0/

// @host api.sting9.org
// @BasePath /api/v1

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token.

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Setup structured logging
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}))
	slog.SetDefault(logger)

	logger.Info("Starting Sting9 API", slog.String("environment", cfg.Server.Environment))

	// Initialize database connection
	ctx := context.Background()
	dbPool, err := database.NewPool(ctx, &database.Config{
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
	defer dbPool.Close()

	logger.Info("Database connection established")

	// Initialize handlers
	healthHandler := handlers.NewHealthHandler(dbPool)
	authHandler := handlers.NewAuthHandler(dbPool, cfg.JWT.Secret, cfg.JWT.Expiration, logger)
	submissionHandler := handlers.NewSubmissionHandler(dbPool, logger)
	statsHandler := handlers.NewStatsHandler(dbPool, logger)
	exportHandler := handlers.NewExportHandler(dbPool, logger)

	// Initialize middleware
	rateLimiter := middleware.NewRoleBasedRateLimiter(
		cfg.RateLimit.Public,
		cfg.RateLimit.Researcher,
		cfg.RateLimit.Partner,
	)

	// Setup router
	r := chi.NewRouter()

	// Global middleware
	r.Use(chimiddleware.RequestID)
	r.Use(chimiddleware.RealIP)
	r.Use(middleware.Logger(logger))
	r.Use(chimiddleware.Recoverer)
	r.Use(middleware.SecureHeaders)
	r.Use(middleware.CORS(cfg.CORS.AllowedOrigins))
	r.Use(chimiddleware.Timeout(60 * time.Second))

	// Health checks (no auth, no rate limit)
	r.Get("/health", healthHandler.Health)
	r.Get("/ready", healthHandler.Ready)

	// API v1 routes
	r.Route("/api/v1", func(r chi.Router) {
		// Apply rate limiting to all API routes
		r.Use(rateLimiter.RateLimit)
		r.Use(middleware.AllowContentType("application/json"))

		// Public routes
		r.Group(func(r chi.Router) {
			// Authentication
			r.Post("/auth/register", authHandler.Register)
			r.Post("/auth/login", authHandler.Login)

			// Public submission endpoint
			r.Post("/submissions", submissionHandler.CreateSubmission)

			// Public statistics
			r.Get("/stats", statsHandler.GetStatistics)

			// Public leaderboard
			r.Get("/leaderboard", submissionHandler.GetLeaderboard)
		})

		// Protected routes (requires authentication)
		r.Group(func(r chi.Router) {
			r.Use(middleware.JWTAuth(cfg.JWT.Secret))

			// Submissions
			r.Get("/submissions", submissionHandler.ListSubmissions)
			r.Get("/submissions/{id}", submissionHandler.GetSubmission)

			// Bulk submission (authenticated users)
			r.Post("/submissions/bulk", submissionHandler.BulkCreate)

			// Dataset export (researchers and partners only)
			r.With(middleware.RequireRole("researcher", "partner", "admin")).Get("/export", exportHandler.ExportDataset)

			// Admin-only routes
			r.Group(func(r chi.Router) {
				r.Use(middleware.RequireRole("admin"))

				// Refresh statistics
				r.Post("/stats/refresh", statsHandler.RefreshStatistics)
			})
		})
	})

	// Setup HTTP server
	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.Server.Port),
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start server in goroutine
	go func() {
		logger.Info("Server starting", slog.Int("port", cfg.Server.Port))
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Error("Server failed", slog.Any("error", err))
			os.Exit(1)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logger.Info("Server shutting down...")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		logger.Error("Server forced to shutdown", slog.Any("error", err))
		os.Exit(1)
	}

	logger.Info("Server exited cleanly")
}
