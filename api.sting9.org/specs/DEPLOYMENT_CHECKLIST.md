# Sting9 API - Production Deployment Checklist

## Pre-Deployment

### Code Quality
- [ ] All tests passing (`make test`)
- [ ] No linter warnings (`make lint`)
- [ ] Code formatted (`make fmt`)
- [ ] Dependencies updated (`go get -u && go mod tidy`)
- [ ] Security audit completed
- [ ] Code review completed

### Documentation
- [ ] README.md up to date
- [ ] API documentation generated (`make swagger`)
- [ ] Environment variables documented
- [ ] Deployment procedure documented
- [ ] Rollback procedure documented

### Configuration
- [ ] `.env` file created for production
- [ ] JWT_SECRET generated (32+ characters)
  ```bash
  openssl rand -base64 32
  ```
- [ ] Database credentials secured
- [ ] CORS origins configured
- [ ] Rate limits reviewed
- [ ] File upload limits set appropriately

## Database Setup

### PostgreSQL Installation
- [ ] PostgreSQL 14+ installed
- [ ] Database created
  ```bash
  createdb sting9_production
  ```
- [ ] User created with appropriate permissions
  ```sql
  CREATE USER sting9 WITH PASSWORD 'secure-password';
  GRANT ALL PRIVILEGES ON DATABASE sting9_production TO sting9;
  ```
- [ ] SSL/TLS enabled
- [ ] Connection pooling configured
- [ ] Backup strategy in place

### Database Configuration
- [ ] `DB_HOST` set to production database
- [ ] `DB_PORT` configured (default: 5432)
- [ ] `DB_USER` and `DB_PASSWORD` secured
- [ ] `DB_NAME` set correctly
- [ ] `DB_SSL_MODE` set to "require"
- [ ] `DB_MAX_CONNS` tuned for workload
- [ ] `DB_MIN_CONNS` set appropriately

### Migrations
- [ ] All migrations tested in staging
- [ ] Migration backup created
- [ ] Migrations applied to production
  ```bash
  export DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
  make migrate-up
  ```
- [ ] Migration version verified
  ```bash
  migrate -path db/migrations -database "$DATABASE_URL" version
  ```

## Security Hardening

### Environment Variables
- [ ] `ENVIRONMENT` set to "production"
- [ ] `JWT_SECRET` is unique and strong (32+ chars)
- [ ] `JWT_EXPIRATION` reviewed (default: 168h / 7 days)
- [ ] Database password is strong and unique
- [ ] No secrets in code or version control

### Network Security
- [ ] Firewall configured
  - Allow: Port 443 (HTTPS)
  - Allow: Port 80 (HTTP redirect to HTTPS)
  - Deny: Direct database access from internet
- [ ] SSL/TLS certificates installed
- [ ] HTTPS enforced (no HTTP)
- [ ] Database connections encrypted
- [ ] Private network for database connections

### Application Security
- [ ] Security headers enabled (already in code)
- [ ] CORS origins restricted to production domains
  ```bash
  ALLOWED_ORIGINS=https://sting9.org,https://www.sting9.org
  ```
- [ ] Rate limiting configured appropriately
- [ ] Input validation enabled (already in code)
- [ ] SQL injection prevention (parameterized queries ✓)
- [ ] XSS prevention (no HTML rendering ✓)

### Access Control
- [ ] Database user has minimal required permissions
- [ ] API runs as non-root user
- [ ] File permissions restricted
- [ ] Admin accounts created with strong passwords
- [ ] API keys/tokens rotated regularly

## Infrastructure Setup

### Server Requirements
- [ ] Minimum 2 CPU cores
- [ ] Minimum 4GB RAM
- [ ] Minimum 20GB storage
- [ ] SSD recommended for database
- [ ] Ubuntu 22.04 LTS or similar

### Application Deployment

#### Option A: Binary Deployment
```bash
# Build
make build

# Transfer to server
scp bin/api user@server:/opt/sting9/

# Create systemd service
sudo nano /etc/systemd/system/sting9-api.service
```

Service file:
```ini
[Unit]
Description=Sting9 API
After=network.target postgresql.service

[Service]
Type=simple
User=sting9
WorkingDirectory=/opt/sting9
EnvironmentFile=/opt/sting9/.env
ExecStart=/opt/sting9/api
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable sting9-api
sudo systemctl start sting9-api
sudo systemctl status sting9-api
```

#### Option B: Docker Deployment
```bash
# Build image
make docker-build

# Tag for registry
docker tag sting9-api:latest registry.example.com/sting9-api:latest

# Push to registry
docker push registry.example.com/sting9-api:latest

# Pull and run on server
docker pull registry.example.com/sting9-api:latest
docker run -d \
  --name sting9-api \
  --restart unless-stopped \
  -p 8080:8080 \
  --env-file /opt/sting9/.env \
  registry.example.com/sting9-api:latest
```

#### Option C: Docker Compose
```bash
# Copy files to server
scp docker-compose.yml .env user@server:/opt/sting9/

# On server
cd /opt/sting9
docker-compose up -d

# View logs
docker-compose logs -f
```

### Reverse Proxy (Nginx)

Install Nginx:
```bash
sudo apt-get update
sudo apt-get install nginx
```

Configure:
```nginx
# /etc/nginx/sites-available/api.sting9.org
server {
    listen 80;
    server_name api.sting9.org;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.sting9.org;

    ssl_certificate /etc/letsencrypt/live/api.sting9.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.sting9.org/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req zone=api_limit burst=20 nodelay;
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/api.sting9.org /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### SSL Certificate (Let's Encrypt)

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d api.sting9.org

# Auto-renewal (already setup by certbot)
sudo certbot renew --dry-run
```

## Monitoring Setup

### Health Checks
- [ ] Load balancer configured to check `/health`
- [ ] Monitoring system checks `/ready` every 30s
- [ ] Alerts configured for downtime

### Logging
- [ ] Log aggregation configured (e.g., ELK, CloudWatch)
- [ ] Log rotation configured
  ```bash
  # /etc/logrotate.d/sting9-api
  /var/log/sting9/*.log {
      daily
      rotate 14
      compress
      delaycompress
      notifempty
      create 0640 sting9 sting9
      sharedscripts
      postrotate
          systemctl reload sting9-api > /dev/null
      endscript
  }
  ```
- [ ] Logs searchable and queryable
- [ ] Error alerts configured

### Metrics
- [ ] APM tool integrated (optional: New Relic, DataDog)
- [ ] Database performance monitored
- [ ] API response times tracked
- [ ] Error rates monitored
- [ ] Disk space monitored
- [ ] Memory usage tracked
- [ ] CPU usage tracked

### Alerts
- [ ] API down alert
- [ ] Database connection failure alert
- [ ] High error rate alert (>5%)
- [ ] Slow response time alert (>1s p95)
- [ ] Disk space low alert (<20%)
- [ ] Memory usage high alert (>80%)

## Backup Strategy

### Database Backups
- [ ] Automated daily backups configured
  ```bash
  # Backup script
  #!/bin/bash
  DATE=$(date +%Y%m%d_%H%M%S)
  BACKUP_DIR="/backups/sting9"
  pg_dump -U sting9 sting9_production | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

  # Delete backups older than 30 days
  find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
  ```
- [ ] Backup verification process in place
- [ ] Off-site backup storage configured
- [ ] Backup retention policy documented (30 days)
- [ ] Restore procedure tested

### Application Backups
- [ ] Configuration files backed up
- [ ] Environment variables backed up (encrypted)
- [ ] SSL certificates backed up

## Performance Optimization

### Database
- [ ] Indexes created for common queries (✓ in migrations)
- [ ] Connection pool sized appropriately
- [ ] Query performance analyzed
- [ ] Vacuum and analyze scheduled
  ```bash
  # Cron job
  0 2 * * * psql -U sting9 -d sting9_production -c "VACUUM ANALYZE;"
  ```

### Application
- [ ] Response time benchmarked
  ```bash
  # Load testing
  ab -n 1000 -c 10 http://api.sting9.org/health
  ```
- [ ] Memory leaks checked
- [ ] Resource limits configured

### Caching (Optional)
- [ ] Redis installed for caching
- [ ] Statistics cached (15 min TTL)
- [ ] Rate limiting uses Redis

## Testing in Production

### Smoke Tests
- [ ] Health check passes
  ```bash
  curl https://api.sting9.org/health
  ```
- [ ] Ready check passes
  ```bash
  curl https://api.sting9.org/ready
  ```
- [ ] Can register new user
- [ ] Can login
- [ ] Can submit message
- [ ] Can view statistics
- [ ] Can export data (authenticated)

### Load Testing
- [ ] API handles expected load
- [ ] Response times acceptable under load
- [ ] No memory leaks during sustained load
- [ ] Rate limiting works correctly

## Documentation

### Internal
- [ ] Deployment runbook created
- [ ] Incident response plan documented
- [ ] Rollback procedure documented
- [ ] Database restore procedure documented
- [ ] Contact list for emergencies

### External
- [ ] API documentation published
- [ ] Status page created (optional)
- [ ] User guides available

## Compliance

### Privacy
- [ ] GDPR compliance reviewed
- [ ] Privacy policy updated
- [ ] Cookie policy (if applicable)
- [ ] Data retention policy implemented
- [ ] User data export feature working
- [ ] User deletion feature working

### Security
- [ ] Security audit completed
- [ ] Penetration testing done (optional)
- [ ] Vulnerability scanning scheduled
- [ ] Dependency scanning enabled (Dependabot)

## Post-Deployment

### Immediate (First 24 hours)
- [ ] Monitor error logs continuously
- [ ] Watch resource usage (CPU, memory, disk)
- [ ] Verify backups are running
- [ ] Check health checks are working
- [ ] Monitor response times
- [ ] Verify SSL certificate is valid

### First Week
- [ ] Review logs daily
- [ ] Check backup integrity
- [ ] Monitor user registrations
- [ ] Review submission patterns
- [ ] Check for unusual activity
- [ ] Verify rate limiting is effective

### Ongoing
- [ ] Review security advisories weekly
- [ ] Update dependencies monthly
- [ ] Review and rotate secrets quarterly
- [ ] Test backup restore quarterly
- [ ] Review and optimize performance monthly
- [ ] Update documentation as needed

## Rollback Plan

### If deployment fails:

1. **Stop new deployment**
   ```bash
   sudo systemctl stop sting9-api
   # or
   docker-compose down
   ```

2. **Restore previous version**
   ```bash
   # Binary
   sudo cp /opt/sting9/api.backup /opt/sting9/api

   # Docker
   docker pull registry.example.com/sting9-api:previous
   ```

3. **Rollback database if needed**
   ```bash
   make migrate-down
   # or restore from backup
   gunzip < backup_date.sql.gz | psql -U sting9 sting9_production
   ```

4. **Restart service**
   ```bash
   sudo systemctl start sting9-api
   # or
   docker-compose up -d
   ```

5. **Verify rollback**
   ```bash
   curl https://api.sting9.org/health
   ```

## Success Criteria

- [ ] All health checks passing
- [ ] No errors in logs
- [ ] Response times <100ms (p95)
- [ ] Can perform all API operations
- [ ] Backups running successfully
- [ ] Monitoring and alerts working
- [ ] SSL certificate valid
- [ ] Rate limiting functional
- [ ] No security warnings

## Team Notification

- [ ] Development team notified
- [ ] Operations team notified
- [ ] Stakeholders notified
- [ ] Status page updated (if applicable)

## Sign-off

- [ ] Technical Lead: ________________ Date: ________
- [ ] Security Officer: ________________ Date: ________
- [ ] Operations Lead: ________________ Date: ________

---

**Deployment Date:** __________
**Deployed By:** __________
**Version:** __________
**Git Commit:** __________
