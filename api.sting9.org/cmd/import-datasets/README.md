# Sting9 Dataset Import Tool

A Go CLI tool for importing SMS smishing/spam datasets into the Sting9 database with automatic PII anonymization.

## Features

- ✅ **Dual Dataset Support**: Processes both `analysisdataset.csv` and `Dataset_5971.csv`
- ✅ **Automatic Encoding Detection**: Handles Latin-1 (ISO-8859-1) and UTF-8 encoded files
- ✅ **Smart Filtering**: Excludes legitimate "ham" messages from Dataset_5971
- ✅ **PII Anonymization**: Redacts phone numbers, emails, SSNs, credit cards, IPs, and addresses
- ✅ **URL Extraction**: Preserves malicious URLs for threat analysis
- ✅ **Metadata Enrichment**: Captures sender info, brand impersonation, message type
- ✅ **Batch Processing**: Efficient bulk inserts with transaction safety
- ✅ **Dry Run Mode**: Test imports without database modifications
- ✅ **Progress Reporting**: Real-time statistics and completion metrics

## Installation

### Build from Source

```bash
cd /Users/nls/projects/sting9.org/web/api.sting9.org

# Build the binary
GOTOOLCHAIN=auto go build -o bin/import-datasets cmd/import-datasets/main.go

# Make it executable
chmod +x bin/import-datasets
```

### Dependencies

The tool requires Go 1.24+ and the following packages (automatically handled by `go build`):

- `github.com/jackc/pgx/v5` - PostgreSQL driver
- `github.com/google/uuid` - UUID generation
- `golang.org/x/text` - Character encoding (Latin-1 support)

## Usage

### Basic Syntax

```bash
./bin/import-datasets [OPTIONS]
```

### Command-Line Options

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `-analysis` | string | - | Path to `analysisdataset.csv` |
| `-dataset5971` | string | - | Path to `Dataset_5971.csv` |
| `-dry-run` | bool | false | Test mode - no database operations |
| `-verbose` | bool | false | Enable detailed debug logging |
| `-batch-size` | int | 100 | Number of records per batch insert |

### Examples

#### 1. Dry Run (Recommended First)

Test the import without modifying the database:

```bash
# Set your database connection
export DATABASE_URL="postgresql://sting9:password@localhost:5432/sting9?sslmode=disable"

# Run dry-run test
./bin/import-datasets \
  -analysis data/analysisdataset.csv \
  -dataset5971 data/Dataset_5971.csv \
  -dry-run \
  -verbose
```

**Expected Output:**
```
INFO Sting9 Dataset Import Tool
WARN DRY RUN MODE - No database operations will be performed
INFO Processing analysisdataset.csv
INFO Progress processed=1000 imported=1000 skipped=0
INFO Processing Dataset_5971.csv
INFO Progress processed=5971 imported=1127 skipped=4844
INFO Import Complete!
INFO Statistics total_records=7033 imported=2189 skipped=4844 ...
```

#### 2. Import Both Datasets

```bash
# Set your database connection
export DATABASE_URL="postgresql://sting9:password@localhost:5432/sting9?sslmode=disable"

# Run the actual import
./bin/import-datasets \
  -analysis data/analysisdataset.csv \
  -dataset5971 data/Dataset_5971.csv
```

#### 3. Import Single Dataset

```bash
# Only analysisdataset.csv
./bin/import-datasets -analysis data/analysisdataset.csv

# Only Dataset_5971.csv
./bin/import-datasets -dataset5971 data/Dataset_5971.csv
```

#### 4. Production Import with Larger Batches

```bash
./bin/import-datasets \
  -analysis data/analysisdataset.csv \
  -dataset5971 data/Dataset_5971.csv \
  -batch-size 500
```

## Dataset Processing Details

### analysisdataset.csv

**Characteristics:**
- **Total Records**: 1,062 SMS messages
- **Encoding**: Latin-1 (ISO-8859-1)
- **Import Rate**: 100% (all malicious)
- **Timestamps**: Preserved from source (2022-2023 data)

**Fields Extracted:**
- `MainText` → Raw message content
- `Sender` → Original sender (anonymized, stored in metadata)
- `SenderType` → "Phone Number" or "Short Code"
- `timeReceived` → Original timestamp
- `Brand` → Impersonated brand (e.g., "Costco", "USPS")
- `Message Categories` → Scam type (normalized)
- `Url` → Malicious URLs (extracted to metadata)

**Category Mapping:**
- `"Delivery"` → `"delivery"`
- `"Prize/Contest"` → `"prize_contest"`
- `"Account Alert"` → `"account_alert"`
- `"Wrong Number/Romance Scam"` → `"wrong_number_romance_scam"`

### Dataset_5971.csv

**Characteristics:**
- **Total Records**: 5,971 SMS messages
- **Encoding**: UTF-8
- **Import Rate**: 18.9% (filters out "ham")
- **Timestamps**: Set to import time (no source timestamps)

**Label Filtering:**
```
ham       → SKIPPED (4,844 messages)
spam      → IMPORTED (489 messages)
Smishing  → IMPORTED (638 messages)
```

**Fields Extracted:**
- `TEXT` → Raw message content
- `LABEL` → Classification (case-insensitive)
- `URL/EMAIL/PHONE` → Indicator flags (stored in metadata)

## Anonymization Details

The tool uses the existing Sting9 anonymizer service to redact PII:

### Patterns Detected and Redacted

| PII Type | Example | Replacement |
|----------|---------|-------------|
| Email | `user@example.com` | `[EMAIL_REDACTED]` |
| Phone | `+1 (555) 123-4567` | `[PHONE_REDACTED]` |
| SSN | `123-45-6789` | `[SSN_REDACTED]` |
| Credit Card | `4532 1234 5678 9010` | `[CC_REDACTED]` |
| IPv4 | `192.168.1.1` | `[IP_REDACTED]` |
| IPv6 | `2001:0db8::1` | `[IP_REDACTED]` |
| Address | `123 Main Street` | `[ADDRESS_REDACTED]` |
| Account | `Account #12345678` | `[ACCOUNT_REDACTED]` |

### URLs Preserved

⚠️ **Important**: URLs are **NOT** redacted because they're valuable for malware analysis and threat intelligence. They are:
- Extracted before anonymization
- Stored in `metadata.urls[]` array
- Preserved in the anonymized content

### Metadata Enrichment

Each submission includes enriched metadata in JSON format:

```json
{
  "date": "2022-03-31T21:58:50Z",
  "urls": ["http://malicious-site.com/path"],
  "brand": "Costco",
  "sender_type": "shortcode",
  "original_sender": "42003",
  "indicators": ["url", "phone"]
}
```

## Database Schema

Records are inserted into the `submissions` table:

```sql
CREATE TABLE submissions (
    id UUID PRIMARY KEY,
    type submission_type NOT NULL,           -- Always 'sms' for these datasets
    raw_content TEXT NOT NULL,               -- Original message
    anonymized_content TEXT,                 -- PII-redacted version
    metadata JSONB DEFAULT '{}',             -- Enriched metadata
    language VARCHAR(10),                    -- Language code (e.g., 'en')
    category VARCHAR(100),                   -- Scam category
    status submission_status,                -- Set to 'processed'
    created_at TIMESTAMPTZ NOT NULL,         -- Original or import time
    processed_at TIMESTAMPTZ,                -- Import time
    updated_at TIMESTAMPTZ NOT NULL
);
```

## Import Statistics

### Expected Results

Based on dry-run testing:

```
═══════════════════════════════════════════
Import Complete!
═══════════════════════════════════════════
Statistics:
  total_records:   7,033
  imported:        2,189 (31.1%)
  skipped:         4,844 (68.9% - ham messages)
  failed:          0
  urls_extracted:  671
  pii_detected:    885
  duration:        ~0.2s (dry-run) / ~2-5s (actual)
═══════════════════════════════════════════
Success Rate: 31.12%
```

### Performance

- **Processing Speed**: ~35,000 records/second (parsing)
- **Database Insertion**: ~500-1000 records/second (depends on batch size)
- **Total Time**: 2-10 seconds for full import
- **Memory Usage**: <50MB

## Configuration

### Environment Variables

The tool supports two methods for database configuration:

**Method 1: DATABASE_URL (Recommended)**

```bash
export DATABASE_URL="postgresql://sting9:password@localhost:5432/sting9?sslmode=disable"

# Then run import
./bin/import-datasets -analysis data/analysisdataset.csv
```

**Method 2: Individual Variables (Fallback)**

If `DATABASE_URL` is not set, the tool falls back to the same `.env` configuration as the main API:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=sting9
DATABASE_PASSWORD=your_password
DATABASE_PATH=sting9
DATABASE_SSL_MODE=disable

# Connection Pool (optional)
DATABASE_MAX_CONNS=25
DATABASE_MIN_CONNS=5
```

### Database Setup

Ensure the database is ready before importing:

```bash
# Run migrations
migrate -path db/migrations \
  -database "postgresql://sting9:password@localhost:5432/sting9?sslmode=disable" \
  up

# Verify tables exist
psql -d sting9 -c "\dt"
```

## Verification

After import, verify the data:

```sql
-- Check total imported count
SELECT COUNT(*) FROM submissions;
-- Expected: 2,189

-- Check category distribution
SELECT category, COUNT(*)
FROM submissions
GROUP BY category
ORDER BY COUNT(*) DESC;

-- Verify anonymization worked
SELECT COUNT(*)
FROM submissions
WHERE anonymized_content LIKE '%[PHONE_REDACTED]%'
   OR anonymized_content LIKE '%[EMAIL_REDACTED]%';

-- Check metadata structure
SELECT metadata
FROM submissions
WHERE metadata->'urls' IS NOT NULL
LIMIT 5;

-- Verify no PII leaks (should return 0)
SELECT COUNT(*)
FROM submissions
WHERE anonymized_content ~ '\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}';
```

## Troubleshooting

### Error: "go.mod requires go >= 1.24.0"

**Solution**: Use the auto toolchain:
```bash
GOTOOLCHAIN=auto go build -o bin/import-datasets cmd/import-datasets/main.go
```

### Error: "Failed to open file"

**Solution**: Check file paths are correct:
```bash
ls -la data/analysisdataset.csv data/Dataset_5971.csv
```

### Error: "Failed to connect to database"

**Solution**: Verify database is running and `.env` is configured:
```bash
# Check PostgreSQL status
psql -d sting9 -c "SELECT version();"

# Verify .env exists
cat api.sting9.org/.env
```

### High Skipped Count

**Expected Behavior**: Dataset_5971.csv contains 4,844 legitimate "ham" messages that are intentionally skipped. The tool only imports malicious messages (smishing + spam).

### Names Not Redacted

**Known Limitation**: The current anonymizer doesn't detect personal names like "Daniel" or "Julianne". This is by design per user preference. Names will appear in the raw content but are stored securely.

## Future Enhancements

Potential improvements for future versions:

- [ ] Name entity recognition (NER) for name redaction
- [ ] Language detection library instead of hardcoded "en"
- [ ] Duplicate detection based on content hash
- [ ] CSV validation before import
- [ ] Resume capability for interrupted imports
- [ ] Export feature (database → CSV)
- [ ] Multi-threaded processing for larger datasets
- [ ] Support for additional CSV formats

## License

Part of the Sting9 Research Initiative. Dataset and models released under Creative Commons CC0 (Public Domain).

## Support

For issues or questions:
- **Research**: research@sting9.org
- **Technical**: hello@sting9.org
- **GitHub**: https://github.com/sting9org/sting9

---

**Generated by Sting9 Import Tool v1.0** | Built with ❤️ for cyber threat research
