# Go binary location
GO := /usr/local/go/bin/go

.PHONY: help
help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: setup
setup: ## Install dependencies and setup project
	@echo "Installing Go dependencies..."
	$(GO) mod download
	$(GO) mod tidy
	@echo "Installing development tools..."
	$(GO) install github.com/sqlc-dev/sqlc/cmd/sqlc@latest
	$(GO) install github.com/swaggo/swag/cmd/swag@latest
	@echo "Setup complete!"

.PHONY: run
run: ## Run the API server
	$(GO) run cmd/api/main.go

.PHONY: build
build: ## Build the API binary
	@echo "Building API server..."
	$(GO) build -o bin/api cmd/api/main.go
	@echo "Build complete: bin/api"

.PHONY: build-refresh-stats
build-refresh-stats: ## Build the refresh-stats CLI tool
	@echo "Building refresh-stats CLI..."
	$(GO) build -o bin/refresh-stats cmd/refresh-stats/main.go
	@echo "Build complete: bin/refresh-stats"

.PHONY: build-all
build-all: ## Build all binaries (API, CLI tools)
	@echo "Building all binaries..."
	$(GO) build -o bin/api cmd/api/main.go
	$(GO) build -o bin/refresh-stats cmd/refresh-stats/main.go
	$(GO) build -o bin/import-datasets cmd/import-datasets/main.go
	@echo "Build complete!"
	@echo "  - bin/api"
	@echo "  - bin/refresh-stats"
	@echo "  - bin/import-datasets"

.PHONY: test
test: ## Run all tests (uses in-memory SQLite - no DB required!)
	@echo "Running tests with in-memory SQLite..."
	PATH=/usr/local/go/bin:$$PATH $(GO) test -v -cover ./...

.PHONY: test-short
test-short: ## Run tests without verbose output
	$(GO) test ./...

.PHONY: test-coverage
test-coverage: ## Run tests with coverage report
	@echo "Running tests with coverage..."
	$(GO) test -v -coverprofile=coverage.out ./...
	$(GO) tool cover -func=coverage.out
	@echo ""
	@echo "Opening coverage report in browser..."
	$(GO) tool cover -html=coverage.out -o coverage.html
	@echo "Coverage report: coverage.html"

.PHONY: test-coverage-report
test-coverage-report: ## Generate detailed coverage report
	@echo "Generating detailed coverage report..."
	$(GO) test -coverprofile=coverage.out -covermode=count ./...
	$(GO) tool cover -func=coverage.out | sort -k3 -n -r
	@echo ""
	@echo "Total coverage:"
	$(GO) tool cover -func=coverage.out | grep total

.PHONY: test-unit
test-unit: ## Run unit tests only
	@echo "Running unit tests..."
	$(GO) test -v -short ./internal/service/... ./pkg/...

.PHONY: test-anonymizer
test-anonymizer: ## Run anonymizer tests
	$(GO) test -v ./internal/service/anonymizer/...

.PHONY: test-processor
test-processor: ## Run processor tests
	$(GO) test -v ./internal/service/processor/...

.PHONY: test-exporter
test-exporter: ## Run exporter tests
	$(GO) test -v ./internal/service/exporter/...

.PHONY: test-validator
test-validator: ## Run validator tests
	$(GO) test -v ./pkg/validator/...

.PHONY: test-email
test-email: ## Run email parser tests
	$(GO) test -v ./pkg/email/...

.PHONY: test-handlers
test-handlers: ## Run handler tests
	$(GO) test -v ./internal/handlers/...

.PHONY: test-repository
test-repository: ## Run repository tests
	$(GO) test -v ./internal/repository/...

.PHONY: test-middleware
test-middleware: ## Run middleware tests
	$(GO) test -v ./internal/middleware/...

.PHONY: test-parallel
test-parallel: ## Run tests in parallel
	$(GO) test -v -parallel=4 ./...

.PHONY: test-race
test-race: ## Run tests with race detector
	$(GO) test -race ./...

.PHONY: test-bench
test-bench: ## Run benchmark tests
	$(GO) test -bench=. -benchmem ./...

.PHONY: test-bench-anonymizer
test-bench-anonymizer: ## Run anonymizer benchmarks
	$(GO) test -bench=. -benchmem ./internal/service/anonymizer/...

.PHONY: test-bench-processor
test-bench-processor: ## Run processor benchmarks
	$(GO) test -bench=. -benchmem ./internal/service/processor/...

.PHONY: test-watch
test-watch: ## Run tests in watch mode (requires gotestsum)
	@which gotestsum > /dev/null || (echo "Installing gotestsum..." && $(GO) install gotest.tools/gotestsum@latest)
	gotestsum --watch

.PHONY: test-verbose
test-verbose: ## Run tests with verbose output
	$(GO) test -v -cover -coverprofile=coverage.out ./...
	@echo ""
	@echo "Coverage summary:"
	$(GO) tool cover -func=coverage.out | grep total

.PHONY: lint
lint: ## Run linter
	golangci-lint run

.PHONY: fmt
fmt: ## Format code
	$(GO) fmt ./...
	goimports -w .

.PHONY: sqlc
sqlc: ## Generate type-safe SQL code with sqlc
	@echo "Generating sqlc code..."
	cd db && sqlc generate
	@echo "sqlc generation complete!"

.PHONY: swagger
swagger: ## Generate Swagger documentation
	@echo "Generating Swagger docs..."
	swag init -g cmd/api/main.go -o docs
	@echo "Swagger docs generated in docs/"

.PHONY: migrate-up
migrate-up: ## Run database migrations up
	@echo "Running migrations..."
	migrate -path db/migrations -database "${DATABASE_URL}" up
	@echo "Migrations complete!"

.PHONY: migrate-down
migrate-down: ## Rollback last migration
	@echo "Rolling back migration..."
	migrate -path db/migrations -database "${DATABASE_URL}" down 1
	@echo "Rollback complete!"

.PHONY: migrate-create
migrate-create: ## Create a new migration (usage: make migrate-create NAME=create_table_name)
	@if [ -z "$(NAME)" ]; then \
		echo "Error: NAME is required. Usage: make migrate-create NAME=create_table_name"; \
		exit 1; \
	fi
	@echo "Creating migration: $(NAME)"
	migrate create -ext sql -dir db/migrations -seq $(NAME)

.PHONY: db-reset
db-reset: ## Reset database (DROP and recreate)
	@echo "WARNING: This will DROP all tables!"
	@read -p "Are you sure? (y/N): " confirm; \
	if [ "$$confirm" = "y" ]; then \
		migrate -path db/migrations -database "${DATABASE_URL}" drop -f; \
		make migrate-up; \
		echo "Database reset complete!"; \
	else \
		echo "Cancelled."; \
	fi

.PHONY: db-seed
db-seed: ## Seed database with sample data
	@echo "Seeding database..."
	@# Add your seed script here
	@echo "Seeding complete!"

.PHONY: stats-refresh
stats-refresh: ## Refresh database statistics
	@echo "Refreshing statistics..."
	@if [ -f bin/refresh-stats ]; then \
		./bin/refresh-stats; \
	else \
		echo "Building refresh-stats first..."; \
		$(MAKE) build-refresh-stats; \
		./bin/refresh-stats; \
	fi

.PHONY: stats-refresh-verbose
stats-refresh-verbose: ## Refresh statistics with verbose output
	@if [ -f bin/refresh-stats ]; then \
		./bin/refresh-stats -verbose; \
	else \
		echo "Building refresh-stats first..."; \
		$(MAKE) build-refresh-stats; \
		./bin/refresh-stats -verbose; \
	fi

.PHONY: stats-refresh-quiet
stats-refresh-quiet: ## Refresh statistics quietly (for cron jobs)
	@if [ -f bin/refresh-stats ]; then \
		./bin/refresh-stats -quiet; \
	else \
		$(MAKE) build-refresh-stats >/dev/null 2>&1; \
		./bin/refresh-stats -quiet; \
	fi

.PHONY: docker-build
docker-build: ## Build Docker image
	docker build -t sting9-api:latest .

.PHONY: docker-run
docker-run: ## Run Docker container
	docker run -p 8080:8080 --env-file .env sting9-api:latest

.PHONY: docker-compose-up
docker-compose-up: ## Start Docker Compose stack
	docker-compose up -d

.PHONY: docker-compose-down
docker-compose-down: ## Stop Docker Compose stack
	docker-compose down

.PHONY: docker-compose-logs
docker-compose-logs: ## View Docker Compose logs
	docker-compose logs -f

.PHONY: clean
clean: ## Clean build artifacts
	@echo "Cleaning..."
	rm -rf bin/
	rm -f coverage.out
	@echo "Clean complete!"

.PHONY: dev
dev: ## Run with hot reload (requires air)
	@which air > /dev/null || (echo "Installing air..." && $(GO) install github.com/air-verse/air@latest)
	air

.PHONY: install-tools
install-tools: ## Install development tools
	@echo "Installing development tools..."
	$(GO) install github.com/sqlc-dev/sqlc/cmd/sqlc@latest
	$(GO) install github.com/swaggo/swag/cmd/swag@latest
	$(GO) install github.com/golang-migrate/migrate/v4/cmd/migrate@latest
	$(GO) install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
	$(GO) install golang.org/x/tools/cmd/goimports@latest
	$(GO) install github.com/air-verse/air@latest
	@echo "Tools installed!"

.PHONY: check
check: fmt lint test ## Run all checks (format, lint, test)
	@echo "All checks passed!"
