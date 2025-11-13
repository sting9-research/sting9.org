package email

import (
	"bufio"
	"strings"
)

// Parser handles email parsing
type Parser struct{}

// New creates a new email Parser
func New() *Parser {
	return &Parser{}
}

// ParsedEmail represents a parsed email message
type ParsedEmail struct {
	Headers map[string]string
	Subject string
	From    string
	To      string
	Date    string
	Body    string
}

// Parse extracts email headers and body from raw email content
func (p *Parser) Parse(rawEmail string) ParsedEmail {
	parsed := ParsedEmail{
		Headers: make(map[string]string),
	}

	scanner := bufio.NewScanner(strings.NewReader(rawEmail))
	inHeaders := true
	var bodyLines []string

	for scanner.Scan() {
		line := scanner.Text()

		if inHeaders {
			// Empty line marks end of headers
			if strings.TrimSpace(line) == "" {
				inHeaders = false
				continue
			}

			// Parse header line
			if strings.Contains(line, ":") {
				parts := strings.SplitN(line, ":", 2)
				if len(parts) == 2 {
					key := strings.TrimSpace(parts[0])
					value := strings.TrimSpace(parts[1])
					parsed.Headers[key] = value

					// Extract common headers
					switch strings.ToLower(key) {
					case "subject":
						parsed.Subject = value
					case "from":
						parsed.From = value
					case "to":
						parsed.To = value
					case "date":
						parsed.Date = value
					}
				}
			}
		} else {
			// Collect body lines
			bodyLines = append(bodyLines, line)
		}
	}

	parsed.Body = strings.Join(bodyLines, "\n")

	return parsed
}

// ExtractPlainText attempts to extract plain text from HTML email
func (p *Parser) ExtractPlainText(html string) string {
	// Very basic HTML stripping - in production use a proper HTML parser
	result := html

	// Remove script and style tags
	result = removeTagContent(result, "script")
	result = removeTagContent(result, "style")

	// Remove HTML tags
	result = strings.ReplaceAll(result, "<br>", "\n")
	result = strings.ReplaceAll(result, "<br/>", "\n")
	result = strings.ReplaceAll(result, "<br />", "\n")
	result = strings.ReplaceAll(result, "</p>", "\n\n")

	// Remove remaining tags
	inTag := false
	var plainText strings.Builder
	for _, char := range result {
		if char == '<' {
			inTag = true
		} else if char == '>' {
			inTag = false
		} else if !inTag {
			plainText.WriteRune(char)
		}
	}

	// Collapse multiple newlines to maximum 2
	text := plainText.String()
	for strings.Contains(text, "\n\n\n") {
		text = strings.ReplaceAll(text, "\n\n\n", "\n\n")
	}

	return strings.TrimSpace(text)
}

// removeTagContent removes HTML tags and their content
func removeTagContent(html, tag string) string {
	openTag := "<" + tag
	closeTag := "</" + tag + ">"

	for {
		startIdx := strings.Index(strings.ToLower(html), openTag)
		if startIdx == -1 {
			break
		}

		endIdx := strings.Index(strings.ToLower(html[startIdx:]), closeTag)
		if endIdx == -1 {
			break
		}

		html = html[:startIdx] + html[startIdx+endIdx+len(closeTag):]
	}

	return html
}
