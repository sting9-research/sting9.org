# Sting9 API Scripts

This directory contains utility scripts for managing the Sting9 API.

## Available Scripts

### `refresh-stats.sh`

Refreshes the cached statistics in the database.

**Usage:**
```bash
# Normal mode
./scripts/refresh-stats.sh

# Verbose mode (detailed output)
./scripts/refresh-stats.sh -v

# Quiet mode (only errors, ideal for cron)
./scripts/refresh-stats.sh -q
```

**Features:**
- Automatically builds the `refresh-stats` binary if not present
- Validates database connection before running
- Provides colored output for better readability
- Logs to syslog when available
- Exit codes for monitoring (0 = success, non-zero = failure)

**Environment Variables:**
- `DATABASE_URL` - Full PostgreSQL connection string (recommended)
- Or individual variables: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSLMODE`

### `crontab.example`

Contains example crontab entries for scheduling automatic statistics refresh.

**Quick Setup:**
```bash
# 1. Create log directory
sudo mkdir -p /var/log/sting9
sudo chown $USER:$USER /var/log/sting9

# 2. Edit crontab
crontab -e

# 3. Add a line from crontab.example (adjust path!)
# Example: Refresh every 15 minutes
*/15 * * * * /path/to/sting9.org/web/api.sting9.org/scripts/refresh-stats.sh -q >> /var/log/sting9/stats-refresh.log 2>&1

# 4. Verify
crontab -l
tail -f /var/log/sting9/stats-refresh.log
```

## Quick Start

### Option 1: Using the Shell Script (Recommended for Cron)

```bash
# Build the binary first
cd /path/to/sting9.org/web/api.sting9.org
make build-refresh-stats

# Set database connection
export DATABASE_URL="postgresql://sting9:password@localhost:5432/sting9?sslmode=disable"

# Run the script
./scripts/refresh-stats.sh
```

### Option 2: Using Make

```bash
cd /path/to/sting9.org/web/api.sting9.org

# Run with default settings
make stats-refresh

# Run with verbose output
make stats-refresh-verbose

# Run quietly (for cron)
make stats-refresh-quiet
```

### Option 3: Direct Binary

```bash
cd /path/to/sting9.org/web/api.sting9.org

# Build if needed
make build-refresh-stats

# Run directly
export DATABASE_URL="postgresql://sting9:password@localhost:5432/sting9?sslmode=disable"
./bin/refresh-stats
```

## Cron Job Setup

### Step 1: Prepare Environment

```bash
# Create log directory
sudo mkdir -p /var/log/sting9
sudo chown $USER:$USER /var/log/sting9

# Build the binary
cd /path/to/sting9.org/web/api.sting9.org
make build-refresh-stats

# Test the script
export DATABASE_URL="postgresql://sting9:password@localhost:5432/sting9?sslmode=disable"
./scripts/refresh-stats.sh -v
```

### Step 2: Configure Cron

Edit crontab:
```bash
crontab -e
```

Add one of these schedules:

**Production (every 15 minutes):**
```cron
*/15 * * * * cd /path/to/sting9.org/web/api.sting9.org && DATABASE_URL="postgresql://sting9:password@localhost:5432/sting9" ./scripts/refresh-stats.sh -q >> /var/log/sting9/stats-refresh.log 2>&1
```

**Medium traffic (every 30 minutes):**
```cron
*/30 * * * * cd /path/to/sting9.org/web/api.sting9.org && DATABASE_URL="postgresql://sting9:password@localhost:5432/sting9" ./scripts/refresh-stats.sh -q >> /var/log/sting9/stats-refresh.log 2>&1
```

**Low traffic (every hour):**
```cron
0 * * * * cd /path/to/sting9.org/web/api.sting9.org && DATABASE_URL="postgresql://sting9:password@localhost:5432/sting9" ./scripts/refresh-stats.sh -q >> /var/log/sting9/stats-refresh.log 2>&1
```

### Step 3: Set Up Log Rotation

Create `/etc/logrotate.d/sting9`:
```
/var/log/sting9/stats-refresh.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 your_user your_group
}
```

### Step 4: Verify

```bash
# List cron jobs
crontab -l

# Watch the log
tail -f /var/log/sting9/stats-refresh.log

# Check cron is running
sudo systemctl status cron  # systemd
sudo service cron status     # sysvinit
```

## Docker Environments

### Using docker-compose

Add this to your crontab:
```cron
*/15 * * * * cd /path/to/sting9.org/web/api.sting9.org && docker-compose exec -T postgres psql -U sting9 -d sting9 -c "SELECT update_statistics();" >> /var/log/sting9/stats-refresh.log 2>&1
```

### Using a separate container

See `STATISTICS_REFRESH.md` for details on running a dedicated cron container.

## Monitoring

### Check Last Update

```bash
# Via database
psql -U sting9 -d sting9 -c "SELECT total_submissions, updated_at FROM statistics WHERE id = 1;"

# Via API (if running)
curl http://localhost:8080/api/v1/stats
```

### Monitor Logs

```bash
# Real-time monitoring
tail -f /var/log/sting9/stats-refresh.log

# Recent entries
tail -n 50 /var/log/sting9/stats-refresh.log

# Search for errors
grep ERROR /var/log/sting9/stats-refresh.log

# Check system cron logs
sudo tail -f /var/log/syslog | grep CRON
```

### Alerting

Set up email alerts for failures:
```cron
*/15 * * * * /path/to/scripts/refresh-stats.sh -q >> /var/log/sting9/stats-refresh.log 2>&1 || echo "Stats refresh failed at $(date)" | mail -s "Sting9 Alert" admin@example.com
```

## Troubleshooting

### Script Not Running

1. **Check cron is running:**
   ```bash
   sudo systemctl status cron
   ```

2. **Check permissions:**
   ```bash
   ls -la scripts/refresh-stats.sh
   chmod +x scripts/refresh-stats.sh
   ```

3. **Check environment variables in cron:**
   Cron has a limited environment. Always set variables explicitly in crontab.

4. **Test the script manually:**
   ```bash
   export DATABASE_URL="postgresql://..."
   ./scripts/refresh-stats.sh -v
   ```

### Database Connection Failed

1. **Verify DATABASE_URL:**
   ```bash
   echo $DATABASE_URL
   ```

2. **Test connection:**
   ```bash
   psql "$DATABASE_URL" -c "SELECT 1;"
   ```

3. **Check database is running:**
   ```bash
   docker-compose ps postgres  # Docker
   pg_isready -h localhost     # Local
   ```

### Binary Not Found

Build the binary:
```bash
cd /path/to/sting9.org/web/api.sting9.org
make build-refresh-stats
ls -la bin/refresh-stats
```

### Cron Output Not Logged

Ensure you're redirecting output in crontab:
```cron
*/15 * * * * /path/to/script.sh >> /var/log/sting9/stats-refresh.log 2>&1
```

## Performance

Typical execution times:

| Submissions | Duration |
|-------------|----------|
| < 10K       | < 1s     |
| 10K - 100K  | 1-5s     |
| 100K - 1M   | 5-30s    |
| > 1M        | 30s+     |

Adjust cron frequency based on your database size and traffic.

## Security Notes

- **Never commit DATABASE_URL to version control**
- Use environment variables or secure secret management
- Restrict log file permissions: `chmod 640 /var/log/sting9/stats-refresh.log`
- Use read-only database credentials if possible for the refresh operation

## See Also

- [STATISTICS_REFRESH.md](../STATISTICS_REFRESH.md) - Comprehensive guide
- [Makefile](../Makefile) - Build and run targets
- [API Documentation](../docs/) - API endpoints including `/stats/refresh`
