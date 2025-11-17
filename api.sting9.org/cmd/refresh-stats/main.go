package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"log/slog"
	"os"
	"time"

	"api.sting9.org/config"
	"api.sting9.org/internal/database"
	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	verbose = flag.Bool("verbose", false, "Enable verbose logging")
	quiet   = flag.Bool("quiet", false, "Suppress all output except errors")
)

func main() {
	flag.Parse()

	// Setup logging
	logLevel := slog.LevelInfo
	if *verbose {
		logLevel = slog.LevelDebug
	}
	if *quiet {
		logLevel = slog.LevelError
	}

	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
		Level: logLevel,
	}))
	slog.SetDefault(logger)

	startTime := time.Now()
	logger.Info("Sting9 Statistics Refresh Tool")

	ctx := context.Background()

	// Check for DATABASE_URL first (standard convention)
	databaseURL := os.Getenv("DATABASE_URL")

	var dbPool *pgxpool.Pool
	var err error

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
		logger.Debug("Database connection established", slog.String("source", "DATABASE_URL"))
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
		logger.Debug("Database connection established", slog.String("source", "config"))
	}
	defer dbPool.Close()

	// Call the update_statistics() function
	logger.Info("Refreshing statistics...")

	_, err = dbPool.Exec(ctx, "SELECT update_statistics()")
	if err != nil {
		log.Fatalf("Failed to refresh statistics: %v", err)
	}

	// Get the updated statistics to verify and report
	var totalSubmissions int64
	var updatedAt time.Time

	query := `SELECT total_submissions, updated_at FROM statistics WHERE id = 1`
	err = dbPool.QueryRow(ctx, query).Scan(&totalSubmissions, &updatedAt)
	if err != nil {
		log.Fatalf("Failed to retrieve updated statistics: %v", err)
	}

	duration := time.Since(startTime)

	logger.Info("Statistics refreshed successfully",
		slog.Int64("total_submissions", totalSubmissions),
		slog.Time("updated_at", updatedAt),
		slog.Duration("duration", duration),
	)

	if !*quiet {
		fmt.Printf("\n✓ Statistics updated successfully\n")
		fmt.Printf("  Total submissions: %d\n", totalSubmissions)
		fmt.Printf("  Updated at: %s\n", updatedAt.Format(time.RFC3339))
		fmt.Printf("  Duration: %v\n\n", duration)
	}
}
