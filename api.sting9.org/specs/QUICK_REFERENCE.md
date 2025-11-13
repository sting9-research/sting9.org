# Sting9 API - Quick Reference

## Essential Commands

```bash
# Setup
make setup                  # First-time setup
make migrate-up            # Run database migrations

# Development
make run                   # Run the API
make dev                   # Run with hot reload
make test                  # Run tests

# Database
make migrate-create NAME=feature_name   # Create migration
make migrate-up                         # Apply migrations
make migrate-down                       # Rollback last migration
make sqlc                              # Regenerate SQL code

# Code Quality
make fmt                   # Format code
make lint                  # Run linter
make test                  # Run tests
make check                 # Run all checks

# Docker
make docker-compose-up     # Start entire stack
make docker-compose-down   # Stop stack
make docker-compose-logs   # View logs
```

## Environment Variables

```bash
# Required
JWT_SECRET=your-secret-here
DB_PASSWORD=your-db-password

# Common
PORT=8080
ENVIRONMENT=development
DB_HOST=localhost
DB_NAME=sting9
```

## API Endpoints Quick Reference

### Public (No Auth)
```
POST   /api/v1/submissions          Submit message
GET    /api/v1/stats                Get statistics
POST   /api/v1/auth/register        Register
POST   /api/v1/auth/login           Login
```

### Protected (JWT Required)
```
GET    /api/v1/submissions          List all
GET    /api/v1/submissions/{id}     Get one
POST   /api/v1/submissions/bulk     Bulk submit
GET    /api/v1/export               Export dataset
```

## Example Requests

### Submit a Message
```bash
curl -X POST http://localhost:8080/api/v1/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "type": "email",
    "content": "Your account will be suspended! Click here: http://fake.com"
  }'
```

### Register
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "organization": "Research Lab",
    "purpose": "ML training"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### Use Token
```bash
TOKEN="your-jwt-token"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/v1/submissions
```

## Database Connection

```bash
# Connect to database
psql sting9

# Common queries
\dt                        # List tables
\d submissions            # Describe table
SELECT COUNT(*) FROM submissions;
```

## Troubleshooting

### Can't connect to database
```bash
# Check if PostgreSQL is running
pg_isready

# Check if database exists
psql -l | grep sting9

# View connection settings
echo $DATABASE_URL
```

### Port already in use
```bash
# Find process using port 8080
lsof -ti:8080

# Kill process
lsof -ti:8080 | xargs kill -9
```

### Migration errors
```bash
# Check migration version
migrate -path db/migrations -database "$DATABASE_URL" version

# Force version (use with caution)
migrate -path db/migrations -database "$DATABASE_URL" force VERSION
```

## Rate Limits

| Role | Requests/Min |
|------|-------------|
| Public | 10 |
| Researcher | 100 |
| Partner | 1000 |

## File Locations

```
cmd/api/main.go              - Main entry point
internal/handlers/           - HTTP handlers
internal/middleware/         - Middleware
internal/service/            - Business logic
db/migrations/               - Database migrations
db/queries/                  - SQL queries
.env                         - Configuration
```

## Useful SQL Queries

```sql
-- Count submissions by type
SELECT type, COUNT(*) FROM submissions GROUP BY type;

-- Recent submissions
SELECT id, type, category, created_at
FROM submissions
ORDER BY created_at DESC
LIMIT 10;

-- User statistics
SELECT role, COUNT(*) FROM users GROUP BY role;

-- Update statistics
SELECT update_statistics();
```

## Environment Setup

### Local Development
```bash
cp .env.example .env
# Edit .env
make migrate-up
make run
```

### Docker Development
```bash
make docker-compose-up
# API: http://localhost:8080
# Adminer: http://localhost:8081
```

## Testing Workflow

1. Start the API: `make run`
2. Test health: `curl http://localhost:8080/health`
3. Submit message: (see example above)
4. View stats: `curl http://localhost:8080/api/v1/stats`

## Common Patterns

### Adding a New Endpoint

1. Add SQL queries to `db/queries/`
2. Run `make sqlc`
3. Add handler in `internal/handlers/`
4. Add route in `cmd/api/main.go`
5. Test with curl
6. Run `make swagger`

### Adding a New Migration

1. `make migrate-create NAME=add_feature`
2. Edit `.up.sql` and `.down.sql` files
3. `make migrate-up`
4. Update queries if needed
5. `make sqlc`

## Security Notes

- Always use HTTPS in production
- Rotate JWT_SECRET regularly
- Use strong database passwords
- Enable SSL for database in production
- Review rate limits for your use case
- Monitor for suspicious activity

## Support

- Documentation: README.md, SETUP.md
- Code: Well-commented inline
- Issues: Check logs in JSON format
- Email: support@sting9.org
