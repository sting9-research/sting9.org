package testutil

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

// AssertStatusCode checks if HTTP status code matches expected value
func AssertStatusCode(t *testing.T, got, want int) {
	t.Helper()
	if got != want {
		t.Errorf("Status code mismatch: got %d, want %d", got, want)
	}
}

// AssertJSONResponse checks if response body matches expected JSON structure
func AssertJSONResponse(t *testing.T, body []byte, expected interface{}) {
	t.Helper()

	var got interface{}
	if err := json.Unmarshal(body, &got); err != nil {
		t.Fatalf("Failed to unmarshal response body: %v", err)
	}

	expectedJSON, err := json.Marshal(expected)
	if err != nil {
		t.Fatalf("Failed to marshal expected value: %v", err)
	}

	var want interface{}
	if err := json.Unmarshal(expectedJSON, &want); err != nil {
		t.Fatalf("Failed to unmarshal expected value: %v", err)
	}

	gotJSON, _ := json.MarshalIndent(got, "", "  ")
	wantJSON, _ := json.MarshalIndent(want, "", "  ")

	if string(gotJSON) != string(wantJSON) {
		t.Errorf("JSON mismatch:\nGot:\n%s\n\nWant:\n%s", gotJSON, wantJSON)
	}
}

// AssertErrorResponse checks if error response contains expected message
func AssertErrorResponse(t *testing.T, body []byte, expectedMsg string) {
	t.Helper()

	var errResp map[string]interface{}
	if err := json.Unmarshal(body, &errResp); err != nil {
		t.Fatalf("Failed to unmarshal error response: %v", err)
	}

	if msg, ok := errResp["error"].(string); ok {
		if msg != expectedMsg {
			t.Errorf("Error message mismatch: got %q, want %q", msg, expectedMsg)
		}
	} else {
		t.Errorf("Error response missing 'error' field")
	}
}

// AssertContains checks if a string contains a substring
func AssertContains(t *testing.T, got, want string) {
	t.Helper()
	if !bytes.Contains([]byte(got), []byte(want)) {
		t.Errorf("String does not contain expected substring:\nGot: %s\nWant substring: %s", got, want)
	}
}

// AssertNotContains checks if a string does not contain a substring
func AssertNotContains(t *testing.T, got, unwanted string) {
	t.Helper()
	if bytes.Contains([]byte(got), []byte(unwanted)) {
		t.Errorf("String contains unwanted substring:\nGot: %s\nUnwanted substring: %s", got, unwanted)
	}
}

// AssertEqual checks if two values are equal
func AssertEqual(t *testing.T, got, want interface{}) {
	t.Helper()
	if got != want {
		t.Errorf("Values not equal:\nGot:  %v\nWant: %v", got, want)
	}
}

// AssertNotEqual checks if two values are not equal
func AssertNotEqual(t *testing.T, got, unwanted interface{}) {
	t.Helper()
	if got == unwanted {
		t.Errorf("Values should not be equal:\nGot: %v", got)
	}
}

// AssertNil checks if a value is nil
func AssertNil(t *testing.T, got interface{}) {
	t.Helper()
	if got != nil {
		t.Errorf("Expected nil, got: %v", got)
	}
}

// AssertNotNil checks if a value is not nil
func AssertNotNil(t *testing.T, got interface{}) {
	t.Helper()
	if got == nil {
		t.Errorf("Expected non-nil value, got nil")
	}
}

// AssertNoError checks if an error is nil
func AssertNoError(t *testing.T, err error) {
	t.Helper()
	if err != nil {
		t.Errorf("Unexpected error: %v", err)
	}
}

// AssertError checks if an error is not nil
func AssertError(t *testing.T, err error) {
	t.Helper()
	if err == nil {
		t.Error("Expected error, got nil")
	}
}

// AssertErrorContains checks if error message contains expected text
func AssertErrorContains(t *testing.T, err error, want string) {
	t.Helper()
	if err == nil {
		t.Error("Expected error, got nil")
		return
	}
	if !bytes.Contains([]byte(err.Error()), []byte(want)) {
		t.Errorf("Error message does not contain expected text:\nGot:  %s\nWant: %s", err.Error(), want)
	}
}

// AssertSliceContains checks if a slice contains a specific element
func AssertSliceContains(t *testing.T, slice []string, element string) {
	t.Helper()
	for _, item := range slice {
		if item == element {
			return
		}
	}
	t.Errorf("Slice does not contain element:\nSlice: %v\nElement: %s", slice, element)
}

// AssertSliceLength checks if a slice has expected length
func AssertSliceLength(t *testing.T, slice interface{}, expectedLen int) {
	t.Helper()
	var actualLen int

	switch v := slice.(type) {
	case []string:
		actualLen = len(v)
	case []int:
		actualLen = len(v)
	case []interface{}:
		actualLen = len(v)
	default:
		t.Fatalf("Unsupported slice type: %T", slice)
	}

	if actualLen != expectedLen {
		t.Errorf("Slice length mismatch: got %d, want %d", actualLen, expectedLen)
	}
}

// MakeRequest creates an HTTP test request with optional body and auth token
func MakeRequest(t *testing.T, method, url string, body interface{}, token string) *httptest.ResponseRecorder {
	t.Helper()

	var bodyReader io.Reader
	if body != nil {
		jsonBody, err := json.Marshal(body)
		if err != nil {
			t.Fatalf("Failed to marshal request body: %v", err)
		}
		bodyReader = bytes.NewReader(jsonBody)
	}

	req := httptest.NewRequest(method, url, bodyReader)
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}

	return httptest.NewRecorder()
}

// MakeRequestWithHeaders creates an HTTP test request with custom headers
func MakeRequestWithHeaders(t *testing.T, method, url string, body interface{}, headers map[string]string) *httptest.ResponseRecorder {
	t.Helper()

	var bodyReader io.Reader
	if body != nil {
		jsonBody, err := json.Marshal(body)
		if err != nil {
			t.Fatalf("Failed to marshal request body: %v", err)
		}
		bodyReader = bytes.NewReader(jsonBody)
	}

	req := httptest.NewRequest(method, url, bodyReader)
	for key, value := range headers {
		req.Header.Set(key, value)
	}

	return httptest.NewRecorder()
}

// ParseJSONResponse parses JSON response body into target struct
func ParseJSONResponse(t *testing.T, body []byte, target interface{}) {
	t.Helper()
	if err := json.Unmarshal(body, target); err != nil {
		t.Fatalf("Failed to parse JSON response: %v\nBody: %s", err, string(body))
	}
}

// GetResponseBody reads the response body as string
func GetResponseBody(t *testing.T, resp *http.Response) string {
	t.Helper()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		t.Fatalf("Failed to read response body: %v", err)
	}
	return string(body)
}

// AssertHeader checks if response has expected header value
func AssertHeader(t *testing.T, resp *httptest.ResponseRecorder, header, expectedValue string) {
	t.Helper()
	got := resp.Header().Get(header)
	if got != expectedValue {
		t.Errorf("Header %s mismatch: got %q, want %q", header, got, expectedValue)
	}
}

// AssertContentType checks if response has expected content type
func AssertContentType(t *testing.T, resp *httptest.ResponseRecorder, expectedType string) {
	t.Helper()
	got := resp.Header().Get("Content-Type")
	if got != expectedType {
		t.Errorf("Content-Type mismatch: got %q, want %q", got, expectedType)
	}
}

// GetFutureTime returns a time.Time object in the future by the specified number of hours
func GetFutureTime(hours int) time.Time {
	return time.Now().Add(time.Duration(hours) * time.Hour)
}

// GetPastTime returns a time.Time object in the past by the specified number of hours
func GetPastTime(hours int) time.Time {
	return time.Now().Add(-time.Duration(hours) * time.Hour)
}
