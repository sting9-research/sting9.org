package handlers

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"log/slog"
	"net/http"
	"time"

	"api.sting9.org/internal/models"
	"api.sting9.org/pkg/validator"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

// AuthHandler handles authentication endpoints
type AuthHandler struct {
	db        *pgxpool.Pool
	validator *validator.Validator
	logger    *slog.Logger
	jwtSecret string
	jwtExpiry time.Duration
}

// NewAuthHandler creates a new AuthHandler
func NewAuthHandler(db *pgxpool.Pool, jwtSecret string, jwtExpiry time.Duration, logger *slog.Logger) *AuthHandler {
	return &AuthHandler{
		db:        db,
		validator: validator.New(),
		logger:    logger,
		jwtSecret: jwtSecret,
		jwtExpiry: jwtExpiry,
	}
}

// Register godoc
// @Summary Register a new user
// @Description Register a new researcher or partner account
// @Tags auth
// @Accept json
// @Produce json
// @Param user body models.RegisterRequest true "Registration data"
// @Success 201 {object} models.UserResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 409 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /auth/register [post]
func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req models.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Validate email
	if err := h.validator.ValidateEmail(req.Email); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	// Validate password
	if err := h.validator.ValidatePassword(req.Password); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	// Check if email already exists
	var exists bool
	err := h.db.QueryRow(r.Context(),
		"SELECT EXISTS(SELECT 1 FROM users WHERE email = $1 AND deleted_at IS NULL)",
		req.Email,
	).Scan(&exists)

	if err != nil {
		h.logger.Error("Failed to check email existence", slog.Any("error", err))
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	if exists {
		respondError(w, http.StatusConflict, "Email already registered")
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		h.logger.Error("Failed to hash password", slog.Any("error", err))
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	// Generate verification token
	verificationToken := generateToken()
	verificationExpiry := time.Now().Add(24 * time.Hour)

	// Default role to researcher if not specified
	role := req.Role
	if role == "" {
		role = models.UserRoleResearcher
	}

	// Create user
	query := `
		INSERT INTO users (email, password_hash, role, organization, purpose, verification_token, verification_expires_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, email, role, organization, verified, approved, created_at
	`

	var user models.UserResponse
	err = h.db.QueryRow(r.Context(), query,
		req.Email,
		string(hashedPassword),
		role,
		req.Organization,
		req.Purpose,
		verificationToken,
		verificationExpiry,
	).Scan(
		&user.ID,
		&user.Email,
		&user.Role,
		&user.Organization,
		&user.Verified,
		&user.Approved,
		&user.CreatedAt,
	)

	if err != nil {
		h.logger.Error("Failed to create user", slog.Any("error", err))
		respondError(w, http.StatusInternalServerError, "Failed to create user")
		return
	}

	h.logger.Info("User registered",
		slog.String("user_id", user.ID.String()),
		slog.String("email", user.Email),
		slog.String("role", string(user.Role)),
	)

	// In production, send verification email here
	// For now, log the verification token
	h.logger.Info("Verification token generated",
		slog.String("email", user.Email),
		slog.String("token", verificationToken),
	)

	respondJSON(w, http.StatusCreated, user)
}

// Login godoc
// @Summary Login user
// @Description Login with email and password to get JWT token
// @Tags auth
// @Accept json
// @Produce json
// @Param credentials body models.LoginRequest true "Login credentials"
// @Success 200 {object} models.LoginResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 403 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /auth/login [post]
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req models.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Get user by email
	query := `
		SELECT id, email, password_hash, role, organization, verified, approved
		FROM users
		WHERE email = $1 AND deleted_at IS NULL
	`

	var user struct {
		ID           uuid.UUID
		Email        string
		PasswordHash string
		Role         models.UserRole
		Organization *string
		Verified     bool
		Approved     bool
	}

	err := h.db.QueryRow(r.Context(), query, req.Email).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.Role,
		&user.Organization,
		&user.Verified,
		&user.Approved,
	)

	if err != nil {
		respondError(w, http.StatusUnauthorized, "Invalid email or password")
		return
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		respondError(w, http.StatusUnauthorized, "Invalid email or password")
		return
	}

	// Check if verified
	if !user.Verified {
		respondError(w, http.StatusForbidden, "Email not verified. Please check your email for verification link.")
		return
	}

	// Check if approved (for researchers)
	if !user.Approved && user.Role == models.UserRoleResearcher {
		respondError(w, http.StatusForbidden, "Account pending approval. You will be notified when approved.")
		return
	}

	// Generate JWT token
	expiresAt := time.Now().Add(h.jwtExpiry)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID.String(),
		"email":   user.Email,
		"role":    string(user.Role),
		"exp":     expiresAt.Unix(),
		"iat":     time.Now().Unix(),
	})

	tokenString, err := token.SignedString([]byte(h.jwtSecret))
	if err != nil {
		h.logger.Error("Failed to sign token", slog.Any("error", err))
		respondError(w, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	// Update last login
	_, err = h.db.Exec(r.Context(), "UPDATE users SET last_login_at = NOW() WHERE id = $1", user.ID)
	if err != nil {
		h.logger.Error("Failed to update last login", slog.Any("error", err))
	}

	h.logger.Info("User logged in",
		slog.String("user_id", user.ID.String()),
		slog.String("email", user.Email),
	)

	response := models.LoginResponse{
		Token:     tokenString,
		ExpiresAt: expiresAt,
		User: models.UserResponse{
			ID:           user.ID,
			Email:        user.Email,
			Role:         user.Role,
			Organization: user.Organization,
			Verified:     user.Verified,
			Approved:     user.Approved,
			CreatedAt:    time.Now(), // This should come from DB in production
		},
	}

	respondJSON(w, http.StatusOK, response)
}

// generateToken generates a random token for verification
func generateToken() string {
	b := make([]byte, 32)
	rand.Read(b)
	return hex.EncodeToString(b)
}
