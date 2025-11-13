# API Documentation Setup

## Overview

This guide explains how to set up and display Swagger/OpenAPI documentation for the Sting9 API.

## Quick Setup (Development)

### 1. Generate Swagger Documentation

```bash
cd api.sting9.org
make swagger
```

This creates:
- `docs/docs.go` - Go code for serving docs
- `docs/swagger.json` - OpenAPI 3.0 specification
- `docs/swagger.yaml` - YAML format

### 2. Install Swagger UI Handler

```bash
/usr/local/go/bin/go get -u github.com/swaggo/http-swagger
```

### 3. Update main.go

Add to your `cmd/api/main.go`:

```go
import (
    _ "api.sting9.org/docs" // Import generated docs
    httpSwagger "github.com/swaggo/http-swagger"
)

// In your router setup:
r.Get("/swagger/*", httpSwagger.Handler(
    httpSwagger.URL("/swagger/doc.json"),
))
```

### 4. Access Documentation

Start the server:
```bash
make run
```

Visit: `http://localhost:8080/swagger/index.html`

## Production Setup

### Option A: Embedded in API (Simplest)

Use the development setup above but configure for production:

```go
// Only serve Swagger in non-production environments
if os.Getenv("ENVIRONMENT") != "production" {
    r.Get("/swagger/*", httpSwagger.Handler(
        httpSwagger.URL("/swagger/doc.json"),
    ))
}
```

### Option B: Serve from Frontend (Recommended)

1. **Copy swagger.json to frontend:**

```bash
# After generating docs
cp docs/swagger.json ../sting9.org/public/api-docs.json
```

2. **Install API documentation library:**

```bash
cd ../sting9.org
npm install @scalar/api-reference
```

3. **Create docs route** at `app/routes/research/api-docs.tsx`:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { ApiReference } from '@scalar/api-reference'
import '@scalar/api-reference/style.css'

export const Route = createFileRoute('/research/api-docs')({
  component: ApiDocsPage,
})

function ApiDocsPage() {
  return (
    <div className="min-h-screen">
      <ApiReference
        configuration={{
          spec: {
            url: '/api-docs.json',
          },
          theme: 'purple',
          authentication: {
            preferredSecurityScheme: 'BearerAuth',
            apiKey: {
              token: '',
            },
          },
        }}
      />
    </div>
  )
}
```

4. **Add link in navigation:**

```tsx
<Link to="/research/api-docs">API Documentation</Link>
```

### Option C: External Hosting

Upload `swagger.json` to:
- **SwaggerHub**: https://swagger.io/tools/swaggerhub/
- **Stoplight**: https://stoplight.io/
- **ReadMe.io**: https://readme.com/

## Customization

### Add General API Information

In `cmd/api/main.go`:

```go
// @title Sting9 API
// @version 1.0
// @description REST API for submitting and analyzing phishing/smishing messages
// @termsOfService https://sting9.org/terms

// @contact.name API Support
// @contact.url https://sting9.org/support
// @contact.email support@sting9.org

// @license.name Creative Commons CC0
// @license.url https://creativecommons.org/publicdomain/zero/1.0/

// @host api.sting9.org
// @BasePath /api/v1

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token
```

### Add Endpoint Documentation

In your handlers (example from `submissions.go`):

```go
// CreateSubmission godoc
// @Summary Submit a suspicious message
// @Description Submit a suspicious email, SMS, or other message for analysis
// @Tags submissions
// @Accept json
// @Produce json
// @Param submission body models.CreateSubmissionRequest true "Submission data"
// @Success 201 {object} models.SubmissionResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /submissions [post]
func (h *SubmissionHandler) CreateSubmission(w http.ResponseWriter, r *http.Request) {
    // Implementation
}
```

### Add Authentication Examples

```go
// GetSubmission godoc
// @Summary Get submission by ID
// @Description Get a submission by its ID (requires authentication)
// @Tags submissions
// @Accept json
// @Produce json
// @Param id path string true "Submission ID"
// @Security BearerAuth
// @Success 200 {object} models.SubmissionResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Router /submissions/{id} [get]
func (h *SubmissionHandler) GetSubmission(w http.ResponseWriter, r *http.Request) {
    // Implementation
}
```

## Workflow

1. **Write API code** with godoc annotations
2. **Generate docs**: `make swagger`
3. **Test locally**: Visit `/swagger/index.html`
4. **Deploy frontend**: Copy `swagger.json` to frontend public directory
5. **Commit**: Add generated docs to git (optional)

## Alternative Tools

### Scalar (Modern, Beautiful)
```bash
npm install @scalar/api-reference
```
- Modern design
- Dark mode support
- Better UX than Swagger UI

### Redoc (Clean, Responsive)
```bash
npm install redoc
```
- Three-panel layout
- Mobile-friendly
- No interactive testing

### Stoplight Elements (Feature-rich)
```bash
npm install @stoplight/elements
```
- Try-it functionality
- Mock servers
- Code generation

## Best Practice for Sting9

**Recommended Setup:**

1. **Development**: Use embedded Swagger UI at `/swagger/`
2. **Production**: Serve from frontend at `sting9.org/research/api-docs`
3. **Tool**: Use Scalar for modern, beautiful documentation
4. **Automation**: Add docs generation to CI/CD pipeline

### CI/CD Integration

Add to your deployment script:

```bash
#!/bin/bash
# Before deploying

cd api.sting9.org
make swagger

# Copy to frontend
cp docs/swagger.json ../sting9.org/public/api-docs.json

cd ../sting9.org
npm run build
```

## Troubleshooting

**Swagger UI shows "Failed to load API definition"**
- Ensure `docs/swagger.json` exists
- Check that imports are correct in main.go
- Verify the server is serving `/swagger/doc.json`

**Annotations not generating properly**
- Run `make swagger` after adding new endpoints
- Check godoc comment format (no space between `//` and `@`)
- Ensure models are properly exported (capitalized)

**404 on /swagger/index.html**
- Import `_ "api.sting9.org/docs"` in main.go
- Import `httpSwagger` package
- Check router configuration

## Resources

- Swag annotations: https://github.com/swaggo/swag#api-operation
- Scalar documentation: https://docs.scalar.com/
- OpenAPI specification: https://swagger.io/specification/
