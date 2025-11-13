package models

import (
	"encoding/json"
	"time"
)

// Statistics represents aggregated statistics about submissions
type Statistics struct {
	TotalSubmissions     int64                  `json:"total_submissions"`
	SubmissionsByType    map[string]int64       `json:"submissions_by_type"`
	SubmissionsByCategory map[string]int64      `json:"submissions_by_category"`
	SubmissionsByStatus  map[string]int64       `json:"submissions_by_status"`
	LanguagesDetected    map[string]int64       `json:"languages_detected"`
	SubmissionsByDate    map[string]int64       `json:"submissions_by_date"`
	UpdatedAt            time.Time              `json:"updated_at"`
}

// StatsResponse represents the statistics API response
type StatsResponse struct {
	Statistics Statistics `json:"statistics"`
	Message    string     `json:"message,omitempty"`
}

// ParseJSONBMap converts JSONB to map[string]int64
func ParseJSONBMap(data json.RawMessage) (map[string]int64, error) {
	if len(data) == 0 || string(data) == "{}" {
		return make(map[string]int64), nil
	}

	var result map[string]interface{}
	if err := json.Unmarshal(data, &result); err != nil {
		return nil, err
	}

	converted := make(map[string]int64)
	for k, v := range result {
		switch val := v.(type) {
		case float64:
			converted[k] = int64(val)
		case int64:
			converted[k] = val
		case int:
			converted[k] = int64(val)
		}
	}

	return converted, nil
}
