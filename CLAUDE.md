# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Sting9 Research Initiative** is building the world's most comprehensive open-source dataset of phishing, smishing, and scam messages to train AI models capable of detecting malicious communications with 99.9% accuracy.

> Named after the legendary sword from Lord of the Rings that glows blue when danger is near, Sting9 illuminates the threats hiding in your inbox.

### The Problem We're Solving
- **5.3 billion** phishing emails sent daily
- **$10.3 billion** lost to scams annually
- **1 in 3** people have fallen for phishing attempts
- **87%** of smishing attacks bypass current filters

### Project Components

This is a dual-component open-source project:

- **Marketing Site** (`sting9.org/`) - Public-facing website for submissions, education, and community
  - Built with TanStack Start, React 19, and Tailwind CSS v4
  - Submission portal for suspicious messages
  - Educational content about phishing/smishing
  - Dataset statistics and research documentation
  - Partnership and contribution information

- **Submission API** (`api.sting9.org/`) - Backend system for message collection and processing
  - Built with Go 1.23+, PostgreSQL, pgx/v5, sqlc, and golang-migrate
  - RESTful API for message submissions
  - Email forwarding endpoint (submit@sting9.org)
  - Message processing and anonymization
  - Data export and API access for researchers
  - Authentication for partners and bulk submissions

This is a monorepo containing both frontend and backend components in separate directories.

## Repository Structure

```
web/
├── sting9.org/          # Frontend marketing site
├── api.sting9.org/      # Backend API
└── .claude/agents/      # Specialized agent configurations
```

## Core Mission Principles

### Privacy and Anonymization
- **Privacy First**: All personal information must be automatically redacted
- **Anonymous Submissions**: No tracking of contributors
- **GDPR Compliant**: Follow all privacy laws and regulations
- **Secure Processing**: All message data handled with care

### Data Collection Focus
The platform collects and processes:
- **Emails**: Phishing, spear-phishing, business email compromise (BEC)
- **SMS/Text**: Smishing, spam texts, fraudulent alerts
- **Messaging Apps**: WhatsApp, Telegram, Signal scams
- **Social Media**: Fraudulent DMs and posts

### Dataset Goals
| Metric | Goal (2026) |
|--------|-------------|
| Total Messages | 50,000,000 |
| Languages | 100+ |
| Attack Types | 500+ |
| Contributing Countries | 150+ |
| Detection Accuracy | 99.9% |

### Open-Source Commitment
- All datasets released under Creative Commons CC0
- Trained models freely available
- Open API for researchers and developers
- Transparent methodology

## Development Philosophy

As an open-source project, code must be:
- **Clean and reproducible** - Easy for contributors to understand and replicate
- **Well-documented** - Clear comments and documentation where needed
- **Production-ready** - Following best practices for security, performance, and maintainability
- **Type-safe** - Leveraging TypeScript and Go's type systems
- **Privacy-conscious** - All features designed with user privacy as priority

## Working with Specialized Agents

This project uses specialized Claude Code agents for different development tasks:

### Backend Development
Use `@agent-golang-rest-api-developer` for all API work. This agent specializes in:
- Go 1.23+ REST API development
- PostgreSQL database design with pgx/v5
- Type-safe SQL queries with sqlc
- Database migrations with golang-migrate
- OpenAPI/Swagger documentation
- JWT authentication and authorization

### Frontend Development
Use the agents in `@.claude/agents/frontend/` for UI work:
- `@frontend-developer` - Feature implementation with TanStack Start and React 19
- `@frontend-architect` - Application architecture and structure
- `@frontend-design` - UI/UX design with Tailwind CSS v4
- `@website-analyzer` - Analyzing existing designs and creating specifications

### Startup Tools
Agents in `@.claude/agents/startups/` for business planning:
- `@product-manager` - PRDs, user stories, feature prioritization
- `@market-research` - Competitive analysis, market sizing
- `@pricing` - SaaS pricing strategy and revenue models
- `@domain-finder` - Domain name suggestions and availability

## Technology Stack

### Frontend (`sting9.org/`)
- **Framework**: TanStack Start (full-stack React framework)
- **UI Library**: React 19 (Server Components, Suspense, Transitions)
- **Routing**: TanStack Router (file-based, type-safe)
- **Data Fetching**: TanStack Query (caching, mutations)
- **Forms**: TanStack Form (type-safe validation)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript

### Backend (`api.sting9.org/`)
- **Language**: Go 1.23+
- **Database**: PostgreSQL
- **Driver**: pgx/v5 (high-performance)
- **SQL Generation**: sqlc (type-safe queries)
- **Migrations**: golang-migrate
- **Router**: chi (lightweight, idiomatic) or fiber/gin
- **API Docs**: OpenAPI 3.0 with swaggo/swag
- **Logging**: slog (structured logging)

## Common Development Commands

### Backend (api.sting9.org/)

```bash
# Navigate to API directory
cd api.sting9.org

# Initialize Go module (first time)
go mod init api.sting9.org

# Install dependencies
go mod download
go mod tidy

# Generate type-safe SQL code with sqlc
sqlc generate

# Run database migrations
migrate -path db/migrations -database "postgresql://user:pass@localhost:5432/sting9?sslmode=disable" up

# Run tests
go test ./...
go test -v ./...                    # Verbose
go test -run TestFunctionName ./... # Single test

# Run the API server
go run cmd/api/main.go

# Build for production
go build -o bin/api cmd/api/main.go

# Generate OpenAPI documentation
swag init -g cmd/api/main.go -o docs
```

### Frontend (sting9.org/)

```bash
# Navigate to frontend directory
cd sting9.org

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
pnpm dev

# Run tests
npm test
pnpm test

# Run specific test file
npm test -- path/to/test.spec.ts
pnpm test path/to/test.spec.ts

# Type checking
npm run type-check
pnpm type-check

# Linting
npm run lint
pnpm lint

# Build for production
npm run build
pnpm build

# Preview production build
npm run preview
pnpm preview
```

## Architecture Patterns

### Backend Architecture

**Directory Structure:**
```
api.sting9.org/
├── cmd/api/              # Application entry points
├── internal/             # Private application code
│   ├── handlers/         # HTTP request handlers
│   ├── models/           # Data models (submissions, users, etc.)
│   ├── middleware/       # HTTP middleware (auth, rate limiting)
│   ├── service/          # Business logic layer
│   │   ├── anonymizer/   # PII redaction and anonymization
│   │   ├── processor/    # Message processing and classification
│   │   └── exporter/     # Dataset export functionality
│   └── repository/       # Data access layer
├── db/
│   ├── migrations/       # Database migration files
│   ├── queries/          # SQL query files for sqlc
│   └── sqlc/             # Generated code from sqlc
├── docs/                 # OpenAPI documentation
└── pkg/                  # Public, reusable packages
    ├── validator/        # Input validation utilities
    └── email/            # Email parsing and processing
```

**Core API Endpoints:**
- `POST /api/v1/submissions` - Submit a suspicious message
- `POST /api/v1/submissions/bulk` - Bulk submission (authenticated)
- `GET /api/v1/submissions/:id` - Get submission details (authenticated)
- `GET /api/v1/stats` - Public dataset statistics
- `GET /api/v1/export` - Dataset export (authenticated researchers)
- `POST /api/v1/auth/register` - Register researcher/partner account
- Email ingestion endpoint for submit@sting9.org

**Key Patterns:**
- Repository pattern for data access abstraction
- Service layer for business logic (especially anonymization)
- Handler layer for HTTP concerns
- Middleware for cross-cutting concerns (auth, logging, CORS, rate limiting)
- Context-aware request handling throughout the stack
- Structured error responses with consistent JSON format
- **Anonymization pipeline** - All submissions pass through PII redaction before storage
- **Message classification** - Automatic categorization of submission types

### Frontend Architecture

**Directory Structure:**
```
sting9.org/
├── app/
│   ├── routes/          # File-based routing (TanStack Router)
│   │   ├── index.tsx    # Homepage with mission and stats
│   │   ├── submit/      # Submission portal
│   │   ├── about/       # About the initiative
│   │   ├── research/    # For researchers (API docs, datasets)
│   │   ├── partners/    # Partnership information
│   │   └── stats/       # Live dataset statistics
│   ├── components/      # React components
│   │   ├── submission/  # Submission form and validation
│   │   ├── stats/       # Statistics visualizations
│   │   └── education/   # Educational content about threats
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and helpers
│   ├── services/        # API client and data services
│   └── styles/          # Global styles and Tailwind config
├── public/              # Static assets (logo, images)
└── tests/               # Test files
```

**Core Pages/Features:**
- **Homepage** - Mission statement, statistics, call-to-action
- **Submission Portal** - Multi-format message submission (email, SMS, file upload)
- **Dataset Statistics** - Live visualization of collection progress
- **Research Hub** - API documentation, dataset access, academic resources
- **Educational Content** - How to identify phishing/smishing
- **Partnership Portal** - Information for organizations wanting to contribute
- **About Page** - Project roadmap, team, contact information

**Key Patterns:**
- File-based routing with TanStack Router
- Server functions for API calls (co-located with routes)
- Component composition with React 19 features
- Custom hooks for shared logic (submission validation, stats fetching)
- TanStack Query for server state management
- Suspense boundaries for loading states
- Error boundaries for error handling
- **Real-time statistics** - Live updates of dataset metrics
- **Progressive form** - Multi-step submission with validation

## Development Workflow

### Starting a New Feature

1. **Planning**: Use `@product-manager` agent if defining requirements
2. **Backend**: Use `@agent-golang-rest-api-developer` to implement API endpoints
3. **Frontend**: Use `@frontend-developer` to implement UI components
4. **Design**: Use `@frontend-design` for styling and responsive behavior
5. **Testing**: Write tests alongside implementation

### Database Changes

1. Create migration file in `db/migrations/`
2. Write SQL queries in `db/queries/`
3. Run `sqlc generate` to create type-safe Go code
4. Run `migrate up` to apply migrations
5. Update repository and service layers

### API Development

1. Define OpenAPI specification or use swag annotations
2. Implement handler with proper error handling
3. Add middleware if needed (auth, validation, rate limiting)
4. Write unit tests for handlers and integration tests
5. Update API documentation

### Frontend Development

1. Create route file in `app/routes/`
2. Implement components with TypeScript types
3. Use TanStack Query for data fetching
4. Style with Tailwind CSS utility classes
5. Add loading and error states
6. Ensure accessibility (WCAG 2.1)
7. Write component tests

## Code Quality Standards

### Backend (Go)

- Follow official Go style guide and `gofmt` formatting
- Use meaningful variable and function names (Go conventions)
- Handle all errors explicitly, never ignore
- Use context for cancellation and timeouts
- Write table-driven tests
- Use interfaces for dependency injection
- Keep functions small and focused
- Document exported functions and types

### Frontend (TypeScript/React)

- Use TypeScript strict mode
- Define explicit types, avoid `any`
- Use React 19 features appropriately (Server Components, Suspense)
- Follow TanStack best practices for each library
- Keep components small and composable
- Use custom hooks for shared logic
- Ensure accessibility attributes (aria-*, role, etc.)
- Follow Tailwind CSS best practices

## Security Considerations

### Backend
- **Input validation on all endpoints** - Especially critical for user-submitted message content
- **SQL injection prevention** - Use parameterized queries via sqlc only
- **JWT token validation and expiration** - For researcher/partner API access
- **Rate limiting on public endpoints** - Prevent abuse of submission endpoint
- **CORS configuration** - Strict origin checking for frontend
- **Secure password hashing** - bcrypt or argon2 for researcher accounts
- **SQL migrations versioned and immutable** - No rollback capabilities that could expose data
- **PII detection and redaction** - Critical feature to protect submitter privacy
  - Email addresses, phone numbers, names, addresses
  - Credit card numbers, SSNs, account numbers
  - IP addresses and device identifiers
- **File upload security** - Validate file types, scan for malware, size limits
- **Message content scanning** - Detect and handle malicious URLs/attachments safely

### Frontend
- **Sanitize user input before display** - Especially when showing example phishing messages
- **Use HTTPS for all API calls** - No exception
- **Store JWT tokens securely** - httpOnly cookies preferred for researcher accounts
- **Implement CSRF protection** - For all state-changing operations
- **Validate data from API responses** - Never trust API data blindly
- **No sensitive data in client-side code** - No API keys, tokens, or credentials
- **Content Security Policy** - Prevent XSS attacks
- **Safe rendering of malicious content** - When displaying submitted phishing examples

### Privacy-Specific Requirements
- **No tracking pixels or analytics that identify users**
- **Anonymous submission support** - No required registration for public submissions
- **Data minimization** - Only collect what's necessary for research
- **Secure data export** - Authenticated, audited access to full dataset
- **GDPR compliance** - Right to be forgotten, data portability, consent management

## MCP Server Configuration

The project has MCP (Model Context Protocol) server permissions configured in `.claude/settings.json`:

- **context7**: Documentation lookups for libraries
- **chrome**: Browser automation (for website-analyzer agent)
- **upsun**: Deployment platform integration

## Git Workflow

This project is open-source and follows standard Git practices:
- Feature branches from main
- Descriptive commit messages
- Pull requests for all changes
- Code review before merging

## Project Roadmap

### Phase 1: Foundation (Q3 2025)
- Launch collection platform (sting9.org)
- Build initial dataset (1M messages)
- Release alpha AI model
- Implement core anonymization pipeline

### Phase 2: Growth (Q4 2025)
- Scale to 10M messages
- Multi-language support
- Public API release for researchers
- Email forwarding (submit@sting9.org)

### Phase 3: Intelligence (Q1 2026)
- Advanced ML models for classification
- Real-time threat feeds
- Industry partnerships
- Mobile app for submissions

### Phase 4: Impact (2026)
- 50M message dataset
- 99.9% accuracy achieved
- Global protection network
- Dataset export in multiple formats

## Key Contacts

- **Research Inquiries**: research@sting9.org
- **Partnerships**: partners@sting9.org
- **Media**: press@sting9.org
- **General**: hello@sting9.org
- **Submissions**: submit@sting9.org

## License

The Sting9 dataset and models are released under **Creative Commons CC0** (Public Domain) for maximum accessibility and impact. All code in this repository is open-source.

## Additional Resources

- Go documentation: https://go.dev/doc/
- TanStack documentation: https://tanstack.com/
- React 19 documentation: https://react.dev/
- PostgreSQL documentation: https://www.postgresql.org/docs/
- Tailwind CSS v4: https://tailwindcss.com/
- GDPR Compliance Guide: https://gdpr.eu/
- OWASP Security Best Practices: https://owasp.org/

---

*Together, we can make digital deception obsolete.*
