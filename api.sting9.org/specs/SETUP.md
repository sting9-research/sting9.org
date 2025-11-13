# Sting9 API - Complete Setup Guide

This guide will walk you through setting up the Sting9 API from scratch.

## Quick Start

```bash
# 1. Navigate to project directory
cd api.sting9.org

# 2. Copy environment file
cp .env.example .env

# 3. Edit .env with your configuration
nano .env  # or use your preferred editor

# 4. Install Go dependencies
go mod download

# 5. Install development tools
make install-tools

# 6. Setup database
createdb sting9

# 7. Run migrations
export DATABASE_URL="postgresql://sting9:changeme@localhost:5432/sting9?sslmode=disable"
make migrate-up

# 8. Start the server
make run
```

The API will be available at `http://localhost:8080`

## Detailed Setup Instructions

### 1. Prerequisites

Install the following tools:

- **Go 1.23+**: [Download](https://go.dev/dl/)
- **PostgreSQL 14+**: [Download](https://www.postgresql.org/download/)
- **migrate CLI**:
  ```bash
  go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest
  ```

### 2. Database Setup

#### Option A: Local PostgreSQL

```bash
# Create database
createdb sting9

# Create user (if needed)
psql -c "CREATE USER sting9 WITH PASSWORD 'changeme';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE sting9 TO sting9;"
```

#### Option B: Docker PostgreSQL

```bash
docker run --name sting9-postgres \
  -e POSTGRES_USER=sting9 \
  -e POSTGRES_PASSWORD=changeme \
  -e POSTGRES_DB=sting9 \
  -p 5432:5432 \
  -d postgres:16-alpine
```

#### Option C: Docker Compose (Recommended)

```bash
# Start PostgreSQL and API together
make docker-compose-up

# View logs
make docker-compose-logs

# Stop services
make docker-compose-down
```

### 3. Environment Configuration

Create `.env` file:

```bash
cp .env.example .env
```

**Required Configuration:**

```bash
# Server
PORT=8080
ENVIRONMENT=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=sting9
DB_PASSWORD=changeme  # CHANGE THIS!
DB_NAME=sting9
DB_SSL_MODE=disable  # Use "require" in production
DB_MAX_CONNS=25
DB_MIN_CONNS=5

# JWT (CRITICAL: Generate a secure secret!)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-chars-long-change-this
JWT_EXPIRATION=168h  # 7 days

# Rate Limiting
RATE_LIMIT_PUBLIC=10
RATE_LIMIT_RESEARCHER=100
RATE_LIMIT_PARTNER=1000

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# File Uploads
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_FILE_TYPES=.txt,.eml,.msg,.pdf,.png,.jpg,.jpeg
```

**Generate a secure JWT secret:**
```bash
openssl rand -base64 32
```

### 4. Run Database Migrations

Set the DATABASE_URL environment variable:

```bash
export DATABASE_URL="postgresql://sting9:changeme@localhost:5432/sting9?sslmode=disable"
```

Run migrations:

```bash
make migrate-up
```

Verify migrations:

```bash
psql sting9 -c "\dt"
```

You should see tables: `submissions`, `users`, `api_tokens`, `statistics`

### 5. Install Development Tools (Optional)

```bash
make install-tools
```

This installs:
- `sqlc` - Type-safe SQL code generator
- `swag` - Swagger documentation generator
- `migrate` - Database migration tool
- `golangci-lint` - Go linter
- `goimports` - Import formatter
- `air` - Hot reload for development

### 6. Generate Code (Optional)

If you modify SQL queries:

```bash
make sqlc
```

To generate API documentation:

```bash
make swagger
```

### 7. Run the API

**Development mode:**
```bash
make run
```

**With hot reload:**
```bash
make dev
```

**Build and run binary:**
```bash
make build
./bin/api
```

### 8. Verify Installation

Test the health endpoint:

```bash
curl http://localhost:8080/health
```

Expected response:
```json
{"status":"ok"}
```

Test database connectivity:

```bash
curl http://localhost:8080/ready
```

Expected response:
```json
{"status":"ready"}
```

## Testing the API

### 1. Register a User

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "organization": "Test Organization",
    "purpose": "Testing the API for development purposes",
    "role": "researcher"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

Save the token from the response.

### 3. Submit a Message

```bash
curl -X POST http://localhost:8080/api/v1/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "type": "email",
    "content": "Urgent! Your account has been compromised. Click here immediately to verify your identity: http://fake-bank.com/verify",
    "metadata": {
      "subject": "Security Alert",
      "from": "security@fake-bank.com"
    }
  }'
```

### 4. View Statistics

```bash
curl http://localhost:8080/api/v1/stats
```

### 5. List Submissions (Authenticated)

```bash
curl -X GET http://localhost:8080/api/v1/submissions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Export Dataset (Authenticated)

```bash
curl -X GET "http://localhost:8080/api/v1/export?format=json&page_size=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -o export.json
```

## Common Issues & Solutions

### Issue: "Failed to connect to database"

**Solution:**
- Verify PostgreSQL is running: `pg_isready`
- Check database credentials in `.env`
- Ensure database exists: `psql -l | grep sting9`
- Check firewall settings

### Issue: "Migration failed"

**Solution:**
- Check DATABASE_URL is set correctly
- Verify database user has appropriate permissions
- Check migration files in `db/migrations/`
- View current migration version: `migrate -path db/migrations -database "$DATABASE_URL" version`

### Issue: "Port already in use"

**Solution:**
- Change PORT in `.env` to a different value
- Or stop the process using port 8080:
  ```bash
  lsof -ti:8080 | xargs kill -9
  ```

### Issue: "JWT_SECRET is required"

**Solution:**
- Ensure JWT_SECRET is set in `.env`
- Generate a secure secret: `openssl rand -base64 32`
- Must be at least 32 characters long

### Issue: "Rate limit exceeded"

**Solution:**
- Rate limits are applied per IP address
- Adjust limits in `.env`:
  - `RATE_LIMIT_PUBLIC` - for unauthenticated requests
  - `RATE_LIMIT_RESEARCHER` - for researcher accounts
  - `RATE_LIMIT_PARTNER` - for partner accounts

## Development Workflow

### Making Database Changes

1. Create new migration:
```bash
make migrate-create NAME=add_new_feature
```

2. Edit the generated files in `db/migrations/`

3. Run migration:
```bash
make migrate-up
```

4. Update SQL queries in `db/queries/`

5. Regenerate Go code:
```bash
make sqlc
```

### Code Quality

Run checks before committing:

```bash
make check  # Runs format, lint, and tests
```

Or individually:

```bash
make fmt    # Format code
make lint   # Run linter
make test   # Run tests
```

### API Documentation

After adding new endpoints:

```bash
make swagger
```

View documentation at: `http://localhost:8080/swagger/index.html`

## Production Deployment

### Environment Variables for Production

```bash
ENVIRONMENT=production
DB_SSL_MODE=require
ALLOWED_ORIGINS=https://sting9.org,https://www.sting9.org
```

### Security Checklist

- [ ] Change default database password
- [ ] Generate strong JWT_SECRET (32+ characters)
- [ ] Enable SSL for database (DB_SSL_MODE=require)
- [ ] Configure proper CORS origins
- [ ] Set up firewall rules
- [ ] Enable HTTPS (use reverse proxy like nginx)
- [ ] Set appropriate rate limits
- [ ] Configure log rotation
- [ ] Set up monitoring and alerts
- [ ] Regular database backups
- [ ] Review and update dependencies regularly

### Docker Deployment

```bash
# Build image
docker build -t sting9-api:latest .

# Run container
docker run -d \
  --name sting9-api \
  -p 8080:8080 \
  --env-file .env \
  sting9-api:latest
```

Or use Docker Compose:

```bash
docker-compose -f docker-compose.yml up -d
```

## Monitoring

### Health Checks

- `/health` - Basic health check
- `/ready` - Includes database connectivity check

Use these endpoints for:
- Load balancer health checks
- Kubernetes liveness/readiness probes
- Monitoring systems

### Logs

Application logs are output to stdout in JSON format.

View logs:
```bash
# Docker
docker logs sting9-api

# Docker Compose
docker-compose logs -f api

# Binary
./bin/api 2>&1 | tee app.log
```

## Next Steps

1. **Customize the API** - Modify handlers, add endpoints
2. **Improve Anonymization** - Enhance PII detection patterns
3. **Add Email Forwarding** - Set up submit@sting9.org
4. **Configure CI/CD** - Set up automated testing and deployment
5. **Set up Monitoring** - Add APM, error tracking, metrics
6. **Scale Infrastructure** - Load balancing, database replication

## Support

For questions or issues:
- Check README.md for API documentation
- Review code comments in source files
- Contact: support@sting9.org

## Resources

- [Go Documentation](https://go.dev/doc/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Chi Router](https://github.com/go-chi/chi)
- [sqlc Documentation](https://docs.sqlc.dev/)
- [golang-migrate](https://github.com/golang-migrate/migrate)
