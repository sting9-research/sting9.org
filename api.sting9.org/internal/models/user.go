package models

import (
	"time"

	"github.com/google/uuid"
)

// UserRole represents the role of a user
type UserRole string

const (
	UserRoleResearcher UserRole = "researcher"
	UserRolePartner    UserRole = "partner"
	UserRoleAdmin      UserRole = "admin"
)

// RegisterRequest represents a user registration request
type RegisterRequest struct {
	Email        string   `json:"email" validate:"required,email"`
	Password     string   `json:"password" validate:"required,min=8"`
	Organization string   `json:"organization" validate:"required,min=2"`
	Purpose      string   `json:"purpose" validate:"required,min=20"`
	Role         UserRole `json:"role" validate:"omitempty,oneof=researcher partner"`
}

// LoginRequest represents a login request
type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

// LoginResponse represents the login response with JWT token
type LoginResponse struct {
	Token     string       `json:"token"`
	ExpiresAt time.Time    `json:"expires_at"`
	User      UserResponse `json:"user"`
}

// UserResponse represents a user in API responses
type UserResponse struct {
	ID           uuid.UUID `json:"id"`
	Email        string    `json:"email"`
	Role         UserRole  `json:"role"`
	Organization *string   `json:"organization,omitempty"`
	Verified     bool      `json:"verified"`
	Approved     bool      `json:"approved"`
	CreatedAt    time.Time `json:"created_at"`
}

// JWTClaims represents the claims in a JWT token
type JWTClaims struct {
	UserID uuid.UUID `json:"user_id"`
	Email  string    `json:"email"`
	Role   UserRole  `json:"role"`
}
