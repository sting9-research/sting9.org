# API Documentation Integration

The Sting9 API documentation is integrated into the frontend using Scalar, a modern API documentation tool.

## Pages Created

### 1. Research Hub (`/research`)
- **File**: `src/routes/research.index.tsx`
- **URL**: `http://localhost:3000/research`
- Landing page for researchers with cards linking to:
  - API Documentation
  - Dataset Access (coming soon)
  - Authentication Guide (coming soon)
  - Code Examples (coming soon)
- Includes quick start code examples

### 2. API Documentation (`/research/api-docs`)
- **File**: `src/routes/research.api-docs.tsx`
- **URL**: `http://localhost:3000/research/api-docs`
- Interactive API reference powered by Scalar
- Features:
  - Try-it functionality for testing endpoints
  - JWT authentication support
  - Code examples in multiple languages
  - Dark/light mode toggle
  - Search functionality
  - Server selection (dev/production)

## Files Structure

```
web/
├── api.sting9.org/
│   └── docs/
│       └── swagger.json          # Generated OpenAPI spec
└── sting9.org/
    ├── public/
    │   └── api-docs.json         # Copy of swagger.json
    └── src/routes/
        ├── research.index.tsx    # Research hub page
        └── research.api-docs.tsx # API documentation page
```

## Workflow

### 1. Generate API Documentation

After making changes to API handlers or models:

```bash
cd api.sting9.org
make swagger
```

This generates:
- `docs/swagger.json` - OpenAPI specification
- `docs/swagger.yaml` - YAML format
- `docs/docs.go` - Go code for serving docs

### 2. Update Frontend

Copy the updated specification to the frontend:

```bash
cp api.sting9.org/docs/swagger.json sting9.org/public/api-docs.json
```

### 3. View Documentation

Start the frontend development server:

```bash
cd sting9.org
pnpm dev
```

Visit:
- Research Hub: http://localhost:3000/research
- API Docs: http://localhost:3000/research/api-docs

## Customization

### Scalar Configuration

Edit `src/routes/research.api-docs.tsx` to customize:

```tsx
<ApiReference
  configuration={{
    theme: 'purple',           // Theme color
    layout: 'modern',          // Layout style
    darkMode: false,           // Enable dark mode by default
    servers: [                 // Available API servers
      {
        url: 'http://localhost:8080',
        description: 'Development',
      },
      {
        url: 'https://api.sting9.org',
        description: 'Production',
      },
    ],
  }}
/>
```

### Available Themes
- `purple` (current)
- `blue`
- `green`
- `orange`
- `default`

### Authentication

Users can authenticate in the Scalar UI:
1. Click "Authorize" button
2. Select "BearerAuth"
3. Enter JWT token
4. Try authenticated endpoints

## Adding to Navigation

To add a link to the research hub in your main navigation, add this to your navigation component:

```tsx
<Link to="/research">
  Research
</Link>
```

Or to link directly to API docs:

```tsx
<Link to="/research/api-docs">
  API Documentation
</Link>
```

## Production Deployment

### Automatic Updates

Add to your CI/CD pipeline:

```bash
#!/bin/bash
# deploy.sh

# Generate latest API docs
cd api.sting9.org
make swagger

# Copy to frontend
cp docs/swagger.json ../sting9.org/public/api-docs.json

# Build frontend
cd ../sting9.org
pnpm build

# Deploy...
```

### Manual Updates

1. Generate docs: `cd api.sting9.org && make swagger`
2. Copy to frontend: `cp api.sting9.org/docs/swagger.json sting9.org/public/api-docs.json`
3. Commit changes: `git add . && git commit -m "Update API documentation"`
4. Deploy frontend

## Troubleshooting

**Issue**: API docs page shows "Failed to load specification"

**Solution**: Verify `api-docs.json` exists in `public/` directory:
```bash
ls -lh sting9.org/public/api-docs.json
```

**Issue**: Endpoints not showing up

**Solution**:
1. Ensure handlers have proper godoc annotations
2. Regenerate docs: `make swagger`
3. Copy updated file to frontend

**Issue**: Authentication not working in Try-it

**Solution**:
1. Register/login through the API
2. Copy JWT token from response
3. Click "Authorize" in Scalar
4. Paste token in BearerAuth field

## Features

### What Scalar Provides

- ✅ Interactive API testing
- ✅ JWT authentication support
- ✅ Code generation (curl, JavaScript, Python, Go, etc.)
- ✅ Request/response examples
- ✅ Schema validation
- ✅ Search functionality
- ✅ Dark mode
- ✅ Mobile responsive
- ✅ Deep linking to endpoints
- ✅ History of requests

### What Users Can Do

1. **Browse Endpoints**: Navigate through all available API endpoints
2. **Test Requests**: Make real API calls directly from the docs
3. **View Schemas**: See request/response models with examples
4. **Copy Code**: Get code snippets in multiple languages
5. **Authenticate**: Test protected endpoints with JWT tokens
6. **Switch Servers**: Toggle between dev and production

## Resources

- Scalar Documentation: https://docs.scalar.com/
- OpenAPI Specification: https://swagger.io/specification/
- Swag (Go Swagger): https://github.com/swaggo/swag

## Support

For issues with API documentation integration:
- Research team: research@sting9.org
- Technical support: support@sting9.org
