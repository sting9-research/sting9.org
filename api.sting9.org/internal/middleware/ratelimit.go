package middleware

import (
	"net/http"
	"sync"
	"time"

	"api.sting9.org/internal/models"
	"golang.org/x/time/rate"
)

// RateLimiter implements token bucket rate limiting
type RateLimiter struct {
	limiters map[string]*rate.Limiter
	mu       sync.RWMutex
	rate     int
	burst    int
}

// NewRateLimiter creates a new rate limiter
func NewRateLimiter(requestsPerMinute int) *RateLimiter {
	return &RateLimiter{
		limiters: make(map[string]*rate.Limiter),
		rate:     requestsPerMinute,
		burst:    requestsPerMinute, // Allow burst up to the per-minute limit
	}
}

// getLimiter gets or creates a limiter for an IP address
func (rl *RateLimiter) getLimiter(ip string) *rate.Limiter {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	limiter, exists := rl.limiters[ip]
	if !exists {
		// Create new limiter: rate per minute converted to per second
		limiter = rate.NewLimiter(rate.Limit(float64(rl.rate)/60.0), rl.burst)
		rl.limiters[ip] = limiter
	}

	return limiter
}

// Cleanup removes old limiters periodically
func (rl *RateLimiter) Cleanup() {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		rl.mu.Lock()
		// In production, track last access time and remove stale entries
		// For simplicity, we'll keep all limiters for now
		rl.mu.Unlock()
	}
}

// RateLimit middleware applies rate limiting based on IP address
func (rl *RateLimiter) RateLimit(next http.Handler) http.Handler {
	// Start cleanup goroutine
	go rl.Cleanup()

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := getIPAddress(r)
		limiter := rl.getLimiter(ip)

		if !limiter.Allow() {
			w.Header().Set("X-RateLimit-Limit", string(rune(rl.rate)))
			w.Header().Set("X-RateLimit-Remaining", "0")
			w.Header().Set("Retry-After", "60")

			respondJSON(w, http.StatusTooManyRequests, models.NewErrorResponse(
				http.StatusTooManyRequests,
				"Rate limit exceeded. Please try again later.",
			))
			return
		}

		next.ServeHTTP(w, r)
	})
}

// RoleBased RateLimiter applies different limits based on user role
type RoleBasedRateLimiter struct {
	publicLimiter     *RateLimiter
	researcherLimiter *RateLimiter
	partnerLimiter    *RateLimiter
}

// NewRoleBasedRateLimiter creates a new role-based rate limiter
func NewRoleBasedRateLimiter(publicRate, researcherRate, partnerRate int) *RoleBasedRateLimiter {
	return &RoleBasedRateLimiter{
		publicLimiter:     NewRateLimiter(publicRate),
		researcherLimiter: NewRateLimiter(researcherRate),
		partnerLimiter:    NewRateLimiter(partnerRate),
	}
}

// RateLimit applies rate limiting based on user role
func (rbrl *RoleBasedRateLimiter) RateLimit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Check if user is authenticated
		role, hasRole := GetUserRole(r.Context())

		var limiter *RateLimiter
		if hasRole {
			// Authenticated user - use role-based limiter
			switch role {
			case models.UserRolePartner, models.UserRoleAdmin:
				limiter = rbrl.partnerLimiter
			case models.UserRoleResearcher:
				limiter = rbrl.researcherLimiter
			default:
				limiter = rbrl.publicLimiter
			}
		} else {
			// Unauthenticated user - use public limiter
			limiter = rbrl.publicLimiter
		}

		limiter.RateLimit(next).ServeHTTP(w, r)
	})
}

// getIPAddress extracts the real IP address from the request
func getIPAddress(r *http.Request) string {
	// Check X-Forwarded-For header (set by proxies)
	forwarded := r.Header.Get("X-Forwarded-For")
	if forwarded != "" {
		return forwarded
	}

	// Check X-Real-IP header
	realIP := r.Header.Get("X-Real-IP")
	if realIP != "" {
		return realIP
	}

	// Fall back to RemoteAddr
	return r.RemoteAddr
}
