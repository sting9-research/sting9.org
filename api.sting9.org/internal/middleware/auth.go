package middleware

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"api.sting9.org/internal/models"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type contextKey string

const (
	UserIDContextKey   contextKey = "user_id"
	UserRoleContextKey contextKey = "user_role"
	UserEmailContextKey contextKey = "user_email"
)

// JWTAuth middleware validates JWT tokens
func JWTAuth(jwtSecret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				respondJSON(w, http.StatusUnauthorized, models.NewErrorResponse(http.StatusUnauthorized, "Missing authorization header"))
				return
			}

			// Extract token from "Bearer <token>"
			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				respondJSON(w, http.StatusUnauthorized, models.NewErrorResponse(http.StatusUnauthorized, "Invalid authorization format"))
				return
			}

			tokenString := parts[1]

			// Parse and validate token
			token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
				// Validate signing method
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, jwt.ErrSignatureInvalid
				}
				return []byte(jwtSecret), nil
			})

			if err != nil || !token.Valid {
				respondJSON(w, http.StatusUnauthorized, models.NewErrorResponse(http.StatusUnauthorized, "Invalid or expired token"))
				return
			}

			// Extract claims
			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				respondJSON(w, http.StatusUnauthorized, models.NewErrorResponse(http.StatusUnauthorized, "Invalid token claims"))
				return
			}

			// Check expiration
			if exp, ok := claims["exp"].(float64); ok {
				if time.Now().Unix() > int64(exp) {
					respondJSON(w, http.StatusUnauthorized, models.NewErrorResponse(http.StatusUnauthorized, "Token expired"))
					return
				}
			}

			// Extract user information
			userIDStr, _ := claims["user_id"].(string)
			userID, err := uuid.Parse(userIDStr)
			if err != nil {
				respondJSON(w, http.StatusUnauthorized, models.NewErrorResponse(http.StatusUnauthorized, "Invalid user ID in token"))
				return
			}

			email, _ := claims["email"].(string)
			role, _ := claims["role"].(string)

			// Add to context
			ctx := r.Context()
			ctx = context.WithValue(ctx, UserIDContextKey, userID)
			ctx = context.WithValue(ctx, UserEmailContextKey, email)
			ctx = context.WithValue(ctx, UserRoleContextKey, models.UserRole(role))

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// RequireRole middleware ensures user has required role
func RequireRole(allowedRoles ...models.UserRole) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			role, ok := r.Context().Value(UserRoleContextKey).(models.UserRole)
			if !ok {
				respondJSON(w, http.StatusForbidden, models.NewErrorResponse(http.StatusForbidden, "Role information not found"))
				return
			}

			// Check if user has one of the allowed roles
			hasRole := false
			for _, allowedRole := range allowedRoles {
				if role == allowedRole {
					hasRole = true
					break
				}
			}

			if !hasRole {
				respondJSON(w, http.StatusForbidden, models.NewErrorResponse(http.StatusForbidden, "Insufficient permissions"))
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

// GetUserID extracts user ID from context
func GetUserID(ctx context.Context) (uuid.UUID, bool) {
	userID, ok := ctx.Value(UserIDContextKey).(uuid.UUID)
	return userID, ok
}

// GetUserRole extracts user role from context
func GetUserRole(ctx context.Context) (models.UserRole, bool) {
	role, ok := ctx.Value(UserRoleContextKey).(models.UserRole)
	return role, ok
}

// GetUserEmail extracts user email from context
func GetUserEmail(ctx context.Context) (string, bool) {
	email, ok := ctx.Value(UserEmailContextKey).(string)
	return email, ok
}

func respondJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}
