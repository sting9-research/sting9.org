# Sting9 API

REST API for the Sting9 Research Initiative - collecting phishing, smishing, and scam messages for AI training.

> Named after the legendary sword from Lord of the Rings that glows blue when danger is near, Sting9 illuminates the threats hiding in your inbox.

## Overview

The Sting9 API provides endpoints for:
- **Submitting suspicious messages** (email, SMS, WhatsApp, etc.)
- **Anonymizing PII** from submissions automatically
- **Processing and classifying** messages
- **Accessing dataset statistics**
- **Exporting datasets** for research (authenticated)
- **User authentication** for researchers and partners

## Technology Stack

- **Go 1.23+** - Modern, performant backend language
- **PostgreSQL** - Robust relational database
- **pgx/v5** - High-performance PostgreSQL driver
- **sqlc** - Type-safe SQL code generation
- **golang-migrate** - Database migration management
- **chi** - Lightweight, idiomatic HTTP router
- **JWT** - Token-based authentication
- **OpenAPI/Swagger** - API documentation

## Getting Started

### Prerequisites

- Go 1.23 or higher
- PostgreSQL 14 or higher
- migrate CLI tool
- sqlc (optional, for regenerating code)

### Installation

1. **Clone the repository**
```bash
cd api.sting9.org
```

2. **Install dependencies**
```bash
go mod download
```

3. **Install development tools**
```bash
make install-tools
```

4. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your database credentials and JWT secret
```

5. **Setup database**
```bash
# Create database
createdb sting9

# Run migrations
export DATABASE_URL="postgresql://user:password@localhost:5432/sting9?sslmode=disable"
make migrate-up
```

6. **Generate type-safe SQL code (optional)**
```bash
make sqlc
```

7. **Generate API documentation (optional)**
```bash
make swagger
```

### Running the API

```bash
# Development mode
make run

# Or with hot reload (requires air)
make dev

# Build and run binary
make build
./bin/api
```

The API will be available at `http://localhost:8080`

## API Endpoints

### Public Endpoints

#### Health Checks
- `GET /health` - Basic health check
- `GET /ready` - Readiness check (includes database)

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get JWT token

#### Submissions
- `POST /api/v1/submissions` - Submit a suspicious message (rate-limited)

#### Statistics
- `GET /api/v1/stats` - Get dataset statistics

### Protected Endpoints (Requires JWT)

#### Submissions
- `GET /api/v1/submissions` - List submissions (paginated)
- `GET /api/v1/submissions/{id}` - Get single submission
- `POST /api/v1/submissions/bulk` - Bulk submit messages

#### Export (Researchers/Partners only)
- `GET /api/v1/export` - Export dataset in JSON, CSV, or JSONL format

#### Admin Only
- `POST /api/v1/stats/refresh` - Manually refresh statistics

## API Documentation

After running `make swagger`, visit:
- Swagger UI: `http://localhost:8080/swagger/index.html`
- OpenAPI Spec: `http://localhost:8080/swagger/doc.json`

## Example Usage

### Submit a Suspicious Email

```bash
curl -X POST http://localhost:8080/api/v1/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "type": "email",
    "content": "Dear customer, your account will be suspended unless you verify your information immediately. Click here: http://phishing-site.com",
    "metadata": {
      "subject": "Urgent: Account Verification Required",
      "from": "noreply@fake-bank.com"
    }
  }'
```

### Register as Researcher

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "researcher@university.edu",
    "password": "SecurePassword123!",
    "organization": "University Research Lab",
    "purpose": "Training machine learning models to detect phishing attempts",
    "role": "researcher"
  }'
```

### Login

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "researcher@university.edu",
    "password": "SecurePassword123!"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_at": "2025-11-19T12:00:00Z",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "researcher@university.edu",
    "role": "researcher",
    "verified": true,
    "approved": true
  }
}
```

### Get Statistics

```bash
curl http://localhost:8080/api/v1/stats
```

### Export Dataset (Authenticated)

```bash
curl -X GET "http://localhost:8080/api/v1/export?format=json&page=1&page_size=100" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -o dataset.json
```

## Database Schema

### Submissions
- Stores raw and anonymized message content
- Automatic PII redaction
- Classification and language detection
- Metadata extraction (URLs, headers, etc.)

### Users
- Email/password authentication
- Role-based access control (researcher, partner, admin)
- Email verification workflow
- Manual approval for researcher accounts

### API Tokens
- JWT token management
- Token expiration and revocation
- Usage tracking

### Statistics
- Cached aggregated statistics
- Updated after each submission
- Breakdown by type, category, language, etc.

## Privacy & Anonymization

The API automatically anonymizes all PII before storage:

- **Email addresses** -> `[EMAIL_REDACTED]`
- **Phone numbers** -> `[PHONE_REDACTED]`
- **Credit cards** -> `[CC_REDACTED]`
- **SSNs** -> `[SSN_REDACTED]`
- **IP addresses** -> `[IP_REDACTED]`
- **Physical addresses** -> `[ADDRESS_REDACTED]`
- **Account numbers** -> `[ACCOUNT_REDACTED]`

Raw content is stored separately and only anonymized content is returned via API.

## Rate Limiting

Rate limits vary by user role:

| Role | Requests/Minute |
|------|----------------|
| Public | 10 |
| Researcher | 100 |
| Partner | 1000 |
| Admin | Unlimited |

## Development

### Database Migrations

```bash
# Create new migration
make migrate-create NAME=add_new_table

# Run migrations
make migrate-up

# Rollback last migration
make migrate-down

# Reset database (WARNING: destructive)
make db-reset
```

### Generate Code

```bash
# Generate type-safe SQL queries
make sqlc

# Generate API documentation
make swagger
```

### Testing

```bash
# Run all tests
make test

# Run with coverage
make test-coverage

# Run linter
make lint
```

### Code Quality

```bash
# Format code
make fmt

# Run all checks (format, lint, test)
make check
```

## Deployment

### Environment Variables

Required environment variables:

```bash
# Server
PORT=8080
ENVIRONMENT=production

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=sting9
DB_PASSWORD=your-secure-password
DB_NAME=sting9
DB_SSL_MODE=require
DB_MAX_CONNS=25
DB_MIN_CONNS=5

# JWT
JWT_SECRET=your-secure-jwt-secret-at-least-32-characters
JWT_EXPIRATION=168h

# Rate Limiting
RATE_LIMIT_PUBLIC=10
RATE_LIMIT_RESEARCHER=100
RATE_LIMIT_PARTNER=1000

# CORS
ALLOWED_ORIGINS=https://sting9.org,https://www.sting9.org

# File Uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=.txt,.eml,.msg,.pdf,.png,.jpg,.jpeg
```

### Docker

```bash
# Build image
make docker-build

# Run container
make docker-run

# Or use Docker Compose
make docker-compose-up
```

## Contributing

This is an open-source project. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Security

- All passwords hashed with bcrypt
- JWT tokens with expiration
- SQL injection prevention via parameterized queries
- CORS configuration
- Rate limiting
- Input validation and sanitization
- Security headers

## Project Structure

```
api.sting9.org/
├── cmd/api/              # Application entry point
├── internal/             # Private application code
│   ├── handlers/         # HTTP handlers
│   ├── middleware/       # HTTP middleware
│   ├── models/           # Data models
│   ├── service/          # Business logic
│   │   ├── anonymizer/   # PII redaction
│   │   ├── processor/    # Message processing
│   │   └── exporter/     # Dataset export
│   └── database/         # Database utilities
├── pkg/                  # Public packages
│   ├── validator/        # Input validation
│   └── email/            # Email parsing
├── db/
│   ├── migrations/       # SQL migrations
│   └── queries/          # SQL queries for sqlc
├── config/               # Configuration
├── docs/                 # Generated API documentation
└── Makefile             # Development commands
```

## License

The Sting9 dataset and models are released under **Creative Commons CC0** (Public Domain).

All code in this repository is open-source.

## Contact

- **Research**: research@sting9.org
- **Partnerships**: partners@sting9.org
- **Support**: support@sting9.org
- **General**: info@sting9.org

## Acknowledgments

Part of the Sting9 Research Initiative to make digital deception obsolete.

*Together, we can protect everyone from online threats.*
