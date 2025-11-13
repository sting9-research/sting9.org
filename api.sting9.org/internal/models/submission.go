package models

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

// SubmissionType represents the type of message submitted
type SubmissionType string

const (
	SubmissionTypeEmail       SubmissionType = "email"
	SubmissionTypeSMS         SubmissionType = "sms"
	SubmissionTypeWhatsApp    SubmissionType = "whatsapp"
	SubmissionTypeTelegram    SubmissionType = "telegram"
	SubmissionTypeSignal      SubmissionType = "signal"
	SubmissionTypeSocialMedia SubmissionType = "social_media"
	SubmissionTypeOther       SubmissionType = "other"
)

// SubmissionStatus represents the processing status
type SubmissionStatus string

const (
	SubmissionStatusPending    SubmissionStatus = "pending"
	SubmissionStatusProcessing SubmissionStatus = "processing"
	SubmissionStatusProcessed  SubmissionStatus = "processed"
	SubmissionStatusFlagged    SubmissionStatus = "flagged"
	SubmissionStatusApproved   SubmissionStatus = "approved"
	SubmissionStatusRejected   SubmissionStatus = "rejected"
)

// SubmissionMetadata holds additional information about the submission
type SubmissionMetadata struct {
	Subject     string            `json:"subject,omitempty"`
	From        string            `json:"from,omitempty"`
	To          string            `json:"to,omitempty"`
	Date        string            `json:"date,omitempty"`
	Headers     map[string]string `json:"headers,omitempty"`
	URLs        []string          `json:"urls,omitempty"`
	Attachments []string          `json:"attachments,omitempty"`
	PhoneNumber string            `json:"phone_number,omitempty"`
}

// CreateSubmissionRequest represents the request to create a new submission
type CreateSubmissionRequest struct {
	Type     SubmissionType     `json:"type" validate:"required,oneof=email sms whatsapp telegram signal social_media other"`
	Content  string             `json:"content" validate:"required,min=10"`
	Metadata SubmissionMetadata `json:"metadata,omitempty"`
}

// BulkSubmissionRequest represents a bulk submission request
type BulkSubmissionRequest struct {
	Submissions []CreateSubmissionRequest `json:"submissions" validate:"required,min=1,max=100,dive"`
}

// SubmissionResponse represents the response for a submission
type SubmissionResponse struct {
	ID                 uuid.UUID          `json:"id"`
	Type               SubmissionType     `json:"type"`
	Content            string             `json:"content,omitempty"`
	AnonymizedContent  *string            `json:"anonymized_content,omitempty"`
	Metadata           SubmissionMetadata `json:"metadata"`
	Language           *string            `json:"language,omitempty"`
	Category           *string            `json:"category,omitempty"`
	Status             SubmissionStatus   `json:"status"`
	CreatedAt          time.Time          `json:"created_at"`
	ProcessedAt        *time.Time         `json:"processed_at,omitempty"`
}

// ListSubmissionsResponse represents a paginated list of submissions
type ListSubmissionsResponse struct {
	Submissions []SubmissionResponse `json:"submissions"`
	Total       int64                `json:"total"`
	Page        int                  `json:"page"`
	PageSize    int                  `json:"page_size"`
	TotalPages  int                  `json:"total_pages"`
}

// ParseMetadata converts JSONB string to SubmissionMetadata
func ParseMetadata(jsonbData json.RawMessage) (SubmissionMetadata, error) {
	var metadata SubmissionMetadata
	if len(jsonbData) == 0 || string(jsonbData) == "{}" {
		return metadata, nil
	}
	err := json.Unmarshal(jsonbData, &metadata)
	return metadata, err
}

// ToJSON converts SubmissionMetadata to JSON bytes
func (m SubmissionMetadata) ToJSON() ([]byte, error) {
	return json.Marshal(m)
}
