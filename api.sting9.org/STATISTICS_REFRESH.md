# Statistics Refresh Guide

This guide explains how to refresh dataset statistics in the Sting9 API, including automated scheduling with cron jobs.

## Overview

The statistics table caches aggregated data about submissions to improve query performance. The `refresh-stats` CLI tool updates these statistics by running the `update_statistics()` database function.

## Building the CLI Tool

```bash
# Build the refresh-stats binary
make build-refresh-stats

# Or build all binaries
make build-all
```

The binary will be created at `bin/refresh-stats`.

## Usage

### Basic Usage

```bash
# Run with default settings
./bin/refresh-stats

# Or use the Makefile
make stats-refresh
```

### Verbose Mode

For detailed logging (useful for debugging):

```bash
./bin/refresh-stats -verbose

# Or via Makefile
make stats-refresh-verbose
```

### Quiet Mode

For cron jobs or automated tasks (only shows errors):

```bash
./bin/refresh-stats -quiet

# Or via Makefile
make stats-refresh-quiet
```

## Database Connection

The tool supports two methods for database connection:

### Method 1: DATABASE_URL Environment Variable (Recommended)

```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/sting9?sslmode=disable"
./bin/refresh-stats
```

### Method 2: Individual Environment Variables

```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=sting9
export DB_PASSWORD=changeme
export DB_NAME=sting9
export DB_SSLMODE=disable

./bin/refresh-stats
```

## Setting Up Automated Refresh with Cron

### Step 1: Create a Shell Script

Create a wrapper script at `/usr/local/bin/refresh-sting9-stats.sh`:

```bash
#!/bin/bash
# Sting9 Statistics Refresh Script
# This script is designed to be run by cron

# Set environment variables
export DATABASE_URL="postgresql://sting9:your_password@localhost:5432/sting9?sslmode=disable"

# Optional: Set PATH to include Go binaries
export PATH="/usr/local/go/bin:$PATH"

# Change to the project directory
cd /path/to/sting9.org/web/api.sting9.org || exit 1

# Run the refresh-stats command in quiet mode
./bin/refresh-stats -quiet >> /var/log/sting9/stats-refresh.log 2>&1

# Check exit status
if [ $? -eq 0 ]; then
    echo "$(date): Statistics refreshed successfully" >> /var/log/sting9/stats-refresh.log
else
    echo "$(date): ERROR - Statistics refresh failed" >> /var/log/sting9/stats-refresh.log
    exit 1
fi
```

Make it executable:

```bash
chmod +x /usr/local/bin/refresh-sting9-stats.sh
```

### Step 2: Create Log Directory

```bash
sudo mkdir -p /var/log/sting9
sudo chown your_user:your_group /var/log/sting9
```

### Step 3: Configure Cron Job

Open crontab for editing:

```bash
crontab -e
```

Add one of the following schedules:

#### Refresh Every Hour
```cron
0 * * * * /usr/local/bin/refresh-sting9-stats.sh
```

#### Refresh Every 30 Minutes
```cron
*/30 * * * * /usr/local/bin/refresh-sting9-stats.sh
```

#### Refresh Every 15 Minutes
```cron
*/15 * * * * /usr/local/bin/refresh-sting9-stats.sh
```

#### Refresh Every 5 Minutes (High-Traffic Sites)
```cron
*/5 * * * * /usr/local/bin/refresh-sting9-stats.sh
```

#### Refresh Daily at 3 AM
```cron
0 3 * * * /usr/local/bin/refresh-sting9-stats.sh
```

#### Refresh Multiple Times Per Day
```cron
# Every 6 hours (midnight, 6am, noon, 6pm)
0 */6 * * * /usr/local/bin/refresh-sting9-stats.sh
```

### Step 4: Verify Cron Setup

List active cron jobs:

```bash
crontab -l
```

Check the log file:

```bash
tail -f /var/log/sting9/stats-refresh.log
```

## Docker Environment

If running in Docker, you can use docker-compose to schedule the refresh:

### Option 1: External Cron

The host machine can run a cron job that executes the command in the container:

Create `/usr/local/bin/refresh-sting9-stats-docker.sh`:

```bash
#!/bin/bash
# Refresh statistics in Docker container

cd /path/to/sting9.org/web/api.sting9.org || exit 1

docker-compose exec -T postgres psql -U sting9 -d sting9 -c "SELECT update_statistics();" >> /var/log/sting9/stats-refresh.log 2>&1

if [ $? -eq 0 ]; then
    echo "$(date): Statistics refreshed successfully" >> /var/log/sting9/stats-refresh.log
else
    echo "$(date): ERROR - Statistics refresh failed" >> /var/log/sting9/stats-refresh.log
    exit 1
fi
```

Add to crontab:

```cron
*/15 * * * * /usr/local/bin/refresh-sting9-stats-docker.sh
```

### Option 2: Using a Separate Cron Container

Add to your `docker-compose.yml`:

```yaml
services:
  # ... existing services ...

  stats-refresher:
    image: alpine:latest
    container_name: sting9-stats-refresher
    depends_on:
      - postgres
    networks:
      - sting9-network
    environment:
      DATABASE_URL: postgresql://${DB_USER:-sting9}:${DB_PASSWORD:-changeme}@postgres:5432/${DB_NAME:-sting9}?sslmode=disable
    command: |
      sh -c "
        apk add --no-cache postgresql-client dcron &&
        echo '*/15 * * * * psql $$DATABASE_URL -c \"SELECT update_statistics();\" >> /var/log/stats-refresh.log 2>&1' > /etc/crontabs/root &&
        crond -f -l 2
      "
    volumes:
      - stats-logs:/var/log
    profiles:
      - production

volumes:
  stats-logs:
```

## Monitoring

### Check Last Update Time

```bash
# Via psql
psql -U sting9 -d sting9 -c "SELECT total_submissions, updated_at FROM statistics WHERE id = 1;"

# Via the API (if running)
curl http://localhost:8080/api/v1/stats
```

### Monitor Log File

```bash
# Follow the log in real-time
tail -f /var/log/sting9/stats-refresh.log

# Check recent entries
tail -n 50 /var/log/sting9/stats-refresh.log

# Search for errors
grep ERROR /var/log/sting9/stats-refresh.log
```

### Set Up Log Rotation

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

## Manual Refresh Options

### Option 1: Using the CLI Tool
```bash
cd api.sting9.org
./bin/refresh-stats
```

### Option 2: Using Make
```bash
cd api.sting9.org
make stats-refresh
```

### Option 3: Direct Database Access
```bash
psql -U sting9 -d sting9 -c "SELECT update_statistics();"
```

### Option 4: Via API (Requires Authentication)
```bash
curl -X POST http://localhost:8080/api/v1/stats/refresh \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### Command Not Found

If `refresh-stats` is not found, build it first:

```bash
cd api.sting9.org
make build-refresh-stats
```

### Database Connection Failed

Check your environment variables:

```bash
echo $DATABASE_URL
# or
echo $DB_HOST $DB_PORT $DB_USER
```

Verify database is running:

```bash
# For Docker
docker-compose ps postgres

# For local PostgreSQL
pg_isready -h localhost -p 5432 -U sting9
```

### Permissions Issues

Ensure the binary is executable:

```bash
chmod +x bin/refresh-stats
```

For cron scripts:

```bash
chmod +x /usr/local/bin/refresh-sting9-stats.sh
```

### Cron Not Running

Check cron service status:

```bash
# On systemd systems
sudo systemctl status cron

# On systems with service command
sudo service cron status
```

Check cron logs:

```bash
# On most Linux systems
sudo tail -f /var/log/syslog | grep CRON

# On some systems
sudo journalctl -u cron -f
```

## Performance Considerations

### How Long Does Refresh Take?

The refresh time depends on the number of submissions:

- **< 10,000 submissions**: < 1 second
- **10,000 - 100,000 submissions**: 1-5 seconds
- **100,000 - 1,000,000 submissions**: 5-30 seconds
- **> 1,000,000 submissions**: 30+ seconds

### Recommended Refresh Intervals

Choose based on your traffic and freshness requirements:

- **Low traffic (< 100 submissions/day)**: Every 6-24 hours
- **Medium traffic (100-1,000 submissions/day)**: Every 1-6 hours
- **High traffic (1,000-10,000 submissions/day)**: Every 15-60 minutes
- **Very high traffic (> 10,000 submissions/day)**: Every 5-15 minutes

### Database Load

The `update_statistics()` function uses aggregation queries that can be resource-intensive on large datasets. Consider:

- Running refreshes during off-peak hours for very large datasets
- Monitoring database CPU and I/O during refresh operations
- Adjusting refresh frequency if performance issues occur

## Statistics Included

The refresh updates the following statistics:

- **total_submissions**: Total count of non-deleted submissions
- **submissions_by_type**: Count grouped by type (email, sms, etc.)
- **submissions_by_category**: Count grouped by category
- **submissions_by_status**: Count grouped by status
- **languages_detected**: Count grouped by language
- **submissions_by_date**: Count by date for the last 30 days

## Next Steps

- Set up monitoring alerts for failed refresh jobs
- Configure log aggregation (e.g., to ELK stack or Grafana Loki)
- Create a dashboard to visualize statistics refresh status
- Consider implementing automatic refresh triggered by submission count thresholds

---

For more information, see:
- [API Documentation](./docs/swagger.yaml)
- [Database Schema](./db/migrations/)
- [Statistics Handler](./internal/handlers/stats.go)
