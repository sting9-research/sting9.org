package models

import "net/http"

// ErrorResponse represents an API error response
type ErrorResponse struct {
	Error   string                 `json:"error"`
	Message string                 `json:"message"`
	Details map[string]interface{} `json:"details,omitempty"`
}

// NewErrorResponse creates a new error response
func NewErrorResponse(statusCode int, message string) ErrorResponse {
	return ErrorResponse{
		Error:   http.StatusText(statusCode),
		Message: message,
	}
}

// NewErrorResponseWithDetails creates a new error response with additional details
func NewErrorResponseWithDetails(statusCode int, message string, details map[string]interface{}) ErrorResponse {
	return ErrorResponse{
		Error:   http.StatusText(statusCode),
		Message: message,
		Details: details,
	}
}
