package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	JWT      JWTConfig
	RateLimit RateLimitConfig
	CORS     CORSConfig
	Upload   UploadConfig
}

type ServerConfig struct {
	Port        int
	Environment string
}

type DatabaseConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	DBName   string
	SSLMode  string
	MaxConns int32
	MinConns int32
}

type JWTConfig struct {
	Secret     string
	Expiration time.Duration
}

type RateLimitConfig struct {
	Public     int
	Researcher int
	Partner    int
}

type CORSConfig struct {
	AllowedOrigins []string
}

type UploadConfig struct {
	MaxFileSize      int64
	AllowedFileTypes []string
}

// Load reads configuration from environment variables
func Load() (*Config, error) {
	// Load .env file if it exists (not required in production)
	_ = godotenv.Load()

	cfg := &Config{}

	// Server configuration
	port, err := strconv.Atoi(getEnv("PORT", "8080"))
	if err != nil {
		return nil, fmt.Errorf("invalid PORT: %w", err)
	}
	cfg.Server.Port = port
	cfg.Server.Environment = getEnv("ENVIRONMENT", "development")

	// Database configuration
	dbPort, err := strconv.Atoi(getEnv("DB_PORT", "5432"))
	if err != nil {
		return nil, fmt.Errorf("invalid DB_PORT: %w", err)
	}
	maxConns, err := strconv.Atoi(getEnv("DB_MAX_CONNS", "25"))
	if err != nil {
		return nil, fmt.Errorf("invalid DB_MAX_CONNS: %w", err)
	}
	minConns, err := strconv.Atoi(getEnv("DB_MIN_CONNS", "5"))
	if err != nil {
		return nil, fmt.Errorf("invalid DB_MIN_CONNS: %w", err)
	}

	cfg.Database = DatabaseConfig{
		Host:     getEnv("DB_HOST", "localhost"),
		Port:     dbPort,
		User:     getEnv("DB_USER", "sting9"),
		Password: getEnv("DB_PASSWORD", ""),
		DBName:   getEnv("DB_NAME", "sting9"),
		SSLMode:  getEnv("DB_SSL_MODE", "disable"),
		MaxConns: int32(maxConns),
		MinConns: int32(minConns),
	}

	// JWT configuration
	jwtSecret := getEnv("JWT_SECRET", "")
	if jwtSecret == "" {
		return nil, fmt.Errorf("JWT_SECRET is required")
	}
	jwtExpiration, err := time.ParseDuration(getEnv("JWT_EXPIRATION", "168h"))
	if err != nil {
		return nil, fmt.Errorf("invalid JWT_EXPIRATION: %w", err)
	}
	cfg.JWT = JWTConfig{
		Secret:     jwtSecret,
		Expiration: jwtExpiration,
	}

	// Rate limit configuration
	rateLimitPublic, err := strconv.Atoi(getEnv("RATE_LIMIT_PUBLIC", "10"))
	if err != nil {
		return nil, fmt.Errorf("invalid RATE_LIMIT_PUBLIC: %w", err)
	}
	rateLimitResearcher, err := strconv.Atoi(getEnv("RATE_LIMIT_RESEARCHER", "100"))
	if err != nil {
		return nil, fmt.Errorf("invalid RATE_LIMIT_RESEARCHER: %w", err)
	}
	rateLimitPartner, err := strconv.Atoi(getEnv("RATE_LIMIT_PARTNER", "1000"))
	if err != nil {
		return nil, fmt.Errorf("invalid RATE_LIMIT_PARTNER: %w", err)
	}
	cfg.RateLimit = RateLimitConfig{
		Public:     rateLimitPublic,
		Researcher: rateLimitResearcher,
		Partner:    rateLimitPartner,
	}

	// CORS configuration
	allowedOrigins := strings.Split(getEnv("ALLOWED_ORIGINS", "http://localhost:3000"), ",")
	cfg.CORS = CORSConfig{
		AllowedOrigins: allowedOrigins,
	}

	// Upload configuration
	maxFileSize, err := strconv.ParseInt(getEnv("MAX_FILE_SIZE", "10485760"), 10, 64)
	if err != nil {
		return nil, fmt.Errorf("invalid MAX_FILE_SIZE: %w", err)
	}
	allowedFileTypes := strings.Split(getEnv("ALLOWED_FILE_TYPES", ".txt,.eml,.msg,.pdf,.png,.jpg,.jpeg"), ",")
	cfg.Upload = UploadConfig{
		MaxFileSize:      maxFileSize,
		AllowedFileTypes: allowedFileTypes,
	}

	return cfg, nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
