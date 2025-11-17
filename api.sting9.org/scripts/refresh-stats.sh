#!/bin/bash
# Sting9 Statistics Refresh Script
#
# This script refreshes the statistics in the Sting9 database.
# It's designed to be run manually or via cron job.
#
# Usage:
#   ./refresh-stats.sh              # Normal mode
#   ./refresh-stats.sh -v           # Verbose mode
#   ./refresh-stats.sh -q           # Quiet mode (for cron)
#
# Cron example (refresh every 15 minutes):
#   */15 * * * * /path/to/sting9.org/web/api.sting9.org/scripts/refresh-stats.sh -q >> /var/log/sting9/stats-refresh.log 2>&1

set -e  # Exit on error

# Change to the script's directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

# Colors for output (disabled in quiet mode)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Parse command line arguments
VERBOSE=false
QUIET=false

while getopts "vq" opt; do
  case $opt in
    v)
      VERBOSE=true
      ;;
    q)
      QUIET=true
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
  esac
done

# Log function
log() {
    if [ "$QUIET" = false ]; then
        echo -e "$1"
    fi
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

log_success() {
    if [ "$QUIET" = false ]; then
        echo -e "${GREEN}[SUCCESS]${NC} $1"
    fi
}

log_warning() {
    if [ "$QUIET" = false ]; then
        echo -e "${YELLOW}[WARNING]${NC} $1"
    fi
}

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    log_warning "DATABASE_URL not set, checking for individual DB environment variables..."

    # Check for individual variables
    if [ -z "$DB_HOST" ] || [ -z "$DB_USER" ] || [ -z "$DB_NAME" ]; then
        log_error "Database connection variables not set!"
        log_error "Please set DATABASE_URL or DB_HOST, DB_USER, DB_NAME, etc."
        exit 1
    fi
fi

# Check if the refresh-stats binary exists
if [ ! -f "bin/refresh-stats" ]; then
    log_warning "refresh-stats binary not found, building..."

    # Check if Go is installed
    if ! command -v go &> /dev/null; then
        log_error "Go is not installed. Please install Go first."
        exit 1
    fi

    # Build the binary
    make build-refresh-stats

    if [ ! -f "bin/refresh-stats" ]; then
        log_error "Failed to build refresh-stats binary"
        exit 1
    fi

    log_success "refresh-stats binary built successfully"
fi

# Determine flags for the command
FLAGS=""
if [ "$VERBOSE" = true ]; then
    FLAGS="-verbose"
elif [ "$QUIET" = true ]; then
    FLAGS="-quiet"
fi

# Log start time
START_TIME=$(date +%s)
log "$(date '+%Y-%m-%d %H:%M:%S') - Starting statistics refresh..."

# Run the refresh command
if ./bin/refresh-stats $FLAGS; then
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))

    log_success "Statistics refreshed successfully in ${DURATION}s"

    # Log to syslog if available
    if command -v logger &> /dev/null; then
        logger -t sting9-stats "Statistics refreshed successfully in ${DURATION}s"
    fi

    exit 0
else
    EXIT_CODE=$?
    log_error "Statistics refresh failed with exit code $EXIT_CODE"

    # Log to syslog if available
    if command -v logger &> /dev/null; then
        logger -t sting9-stats -p user.err "Statistics refresh failed with exit code $EXIT_CODE"
    fi

    exit $EXIT_CODE
fi
