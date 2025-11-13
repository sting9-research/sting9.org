package processor

import (
	"strings"
	"unicode"
)

// Processor handles message classification and metadata extraction
type Processor struct{}

// New creates a new Processor instance
func New() *Processor {
	return &Processor{}
}

// ProcessResult holds the results of message processing
type ProcessResult struct {
	Language string
	Category string
	URLs     []string
}

// Process analyzes message content and returns processing results
func (p *Processor) Process(content string, urls []string) ProcessResult {
	return ProcessResult{
		Language: p.DetectLanguage(content),
		Category: p.ClassifyMessage(content),
		URLs:     urls,
	}
}

// DetectLanguage performs basic language detection
func (p *Processor) DetectLanguage(content string) string {
	// Simple heuristic-based language detection
	// In production, consider using a proper language detection library

	content = strings.ToLower(content)

	// Check for common English words (with word boundaries)
	englishWords := []string{"the", "and", "you", "your", "account", "click", "verify", "update", "login", "password", "has", "been", "this", "that", "have", "need", "urgent", "please", "from", "with"}
	englishCount := countWordMatches(content, englishWords)

	// Check for common Spanish words (more specific to avoid false positives)
	spanishWords := []string{"su cuenta", "haga clic", "contraseña", "verificar", "español", "por favor", "usted", "correo", "hola", "este", "mensaje"}
	spanishCount := countWordMatches(content, spanishWords)

	// Check for common French words
	frenchWords := []string{"vous", "votre", "compte", "cliquez", "connexion", "français", "bonjour", "ceci"}
	frenchCount := countWordMatches(content, frenchWords)

	// Check for common German words
	germanWords := []string{"ihr", "konto", "klicken", "sie", "deutsch", "dies", "hallo"}
	germanCount := countWordMatches(content, germanWords)

	// Check for non-Latin scripts
	hasNonLatin := false
	for _, r := range content {
		if !unicode.In(r, unicode.Latin, unicode.Common) {
			hasNonLatin = true
			break
		}
	}

	if hasNonLatin {
		// Could be Chinese, Japanese, Arabic, Cyrillic, etc.
		// For now, return "other"
		return "other"
	}

	// Return the language with the highest count
	max := englishCount
	lang := "en"

	if spanishCount > max {
		max = spanishCount
		lang = "es"
	}
	if frenchCount > max {
		max = frenchCount
		lang = "fr"
	}
	if germanCount > max {
		max = germanCount
		lang = "de"
	}

	// If no clear language detected, default to unknown
	// Lower threshold to 1 for short messages
	if max < 1 {
		return "unknown"
	}

	return lang
}

// countWordMatches counts how many words/phrases from the list are found in content
func countWordMatches(content string, words []string) int {
	count := 0
	for _, word := range words {
		if strings.Contains(content, word) {
			count++
		}
	}
	return count
}

// ClassifyMessage categorizes the message based on content patterns
func (p *Processor) ClassifyMessage(content string) string {
	content = strings.ToLower(content)

	// Phishing indicators (focus on account/security threats)
	phishingPatterns := []string{
		"verify your account",
		"confirm your identity",
		"suspend",
		"suspended",
		"unusual activity",
		"click here immediately",
		"update your payment",
		"verify your information",
		"security alert",
		"urgent action required",
		"account will be closed",
		"confirm",
		"verify",
		"identity",
		"suspended",
		"prize",
		"winner",
		"you've won",
		"congratulations",
	}

	// BEC (Business Email Compromise) indicators
	becPatterns := []string{
		"wire transfer",
		"invoice attached",
		"payment urgent",
		"ceo",
		"executive",
		"confidential",
		"vendor payment",
		"change bank details",
		"update payment information",
	}

	// Smishing (SMS phishing) indicators
	smishingPatterns := []string{
		"package delivery",
		"delivery failed",
		"click to track",
		"text back",
		"reply stop",
		"free gift",
		"you've won",
		"claim your",
		"subscription",
	}

	// Tech support scam indicators
	techSupportPatterns := []string{
		"microsoft",
		"apple support",
		"virus detected",
		"computer infected",
		"call this number",
		"tech support",
		"refund",
		"subscription renewal",
	}

	// Romance scam indicators
	romancePatterns := []string{
		"fell in love",
		"meet in person",
		"need money",
		"western union",
		"moneygram",
		"gift card",
		"lonely",
	}

	// Count pattern matches
	phishingScore := countPatterns(content, phishingPatterns)
	becScore := countPatterns(content, becPatterns)
	smishingScore := countPatterns(content, smishingPatterns)
	techSupportScore := countPatterns(content, techSupportPatterns)
	romanceScore := countPatterns(content, romancePatterns)

	// Determine category based on highest score
	maxScore := phishingScore
	category := "phishing"

	if becScore > maxScore {
		maxScore = becScore
		category = "bec"
	}
	if smishingScore > maxScore {
		maxScore = smishingScore
		category = "smishing"
	}
	if techSupportScore > maxScore {
		maxScore = techSupportScore
		category = "tech_support_scam"
	}
	if romanceScore > maxScore {
		maxScore = romanceScore
		category = "romance_scam"
	}

	// If no clear category, mark as general spam
	if maxScore == 0 {
		return "spam"
	}

	return category
}

// countPatterns counts how many patterns are found in content (case-insensitive)
func countPatterns(content string, patterns []string) int {
	content = strings.ToLower(content)
	count := 0
	for _, pattern := range patterns {
		if strings.Contains(content, strings.ToLower(pattern)) {
			count++
		}
	}
	return count
}

// ExtractKeywords extracts important keywords from content
func (p *Processor) ExtractKeywords(content string) []string {
	// Simple keyword extraction
	// In production, consider using NLP libraries for better results

	words := strings.Fields(strings.ToLower(content))
	wordCount := make(map[string]int)

	// Count word frequency
	for _, word := range words {
		// Remove punctuation
		word = strings.Trim(word, ".,!?;:\"'()[]{}")
		if len(word) > 3 { // Only words longer than 3 characters
			wordCount[word]++
		}
	}

	// Get top keywords
	var keywords []string
	for word, count := range wordCount {
		if count >= 2 { // Words that appear at least twice
			keywords = append(keywords, word)
		}
	}

	return keywords
}
