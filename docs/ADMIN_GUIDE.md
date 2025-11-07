# 🔧 TechKlein VoteLive - Admin Training Guide

## Administrator Access & Responsibilities

### 🎯 Admin Role Overview

As a VoteLive Administrator, you are responsible for:

1. **Platform Monitoring** - System health & performance
2. **Fraud Detection** - Identifying suspicious activity
3. **Data Management** - Candidate info, vote integrity
4. **Support** - User issues & technical problems
5. **Reporting** - Generate insights for stakeholders

---

## 🔐 Access & Login

### Supabase Dashboard

**URL:** https://supabase.com/dashboard

**Login:** Use your admin credentials

**What You Can Do:**
- View all database tables
- Run SQL queries
- Monitor realtime activity
- Check storage usage
- Review logs

### Vercel Dashboard

**URL:** https://vercel.com/dashboard

**What You Can Do:**
- Monitor deployment status
- View analytics
- Check error logs
- Manage environment variables
- Roll back deployments

### Admin Panel (In-App)

**URL:** https://www.haitivote.org/admin

**Password:** [Set in environment variables]

**Features:**
- Real-time vote monitoring
- Fraud detection alerts
- Candidate management
- Export data

---

## 📊 Daily Monitoring Tasks

### Morning Checklist (15 minutes)

#### 1. System Health Check
```sql
-- Run in Supabase SQL Editor

-- Check total votes today
SELECT COUNT(*) as votes_today
FROM votes
WHERE created_at >= CURRENT_DATE;

-- Check error rate
SELECT 
  COUNT(*) as total_attempts,
  SUM(CASE WHEN error IS NOT NULL THEN 1 ELSE 0 END) as errors
FROM fraud_logs
WHERE created_at >= CURRENT_DATE;

-- Check duplicate attempts
SELECT COUNT(*) as duplicate_attempts
FROM fraud_logs
WHERE suspicion_type = 'duplicate_phone'
AND created_at >= CURRENT_DATE;
```

**Expected Results:**
- ✅ Votes growing steadily
- ✅ Error rate < 2%
- ✅ Duplicate attempts < 1%

#### 2. Performance Check

**Vercel Dashboard → Analytics:**
- Check average response time (target: < 500ms)
- Check error rate (target: < 0.5%)
- Check bandwidth usage

#### 3. Fraud Alert Review

**Supabase Dashboard → fraud_logs table:**

Look for:
- 🚨 High suspicion scores (> 70)
- 🚨 Rapid votes from same IP
- 🚨 VPN/proxy usage patterns
- 🚨 Multiple DOBs same phone

**Action:** Flag for investigation

### Mid-Day Check (10 minutes)

#### 1. Vote Velocity
```sql
-- Votes per hour today
SELECT 
  DATE_TRUNC('hour', created_at) as hour,
  COUNT(*) as votes
FROM votes
WHERE created_at >= CURRENT_DATE
GROUP BY hour
ORDER BY hour DESC;
```

**Expected:** Steady growth throughout day

#### 2. Candidate Distribution
```sql
-- Top 10 candidates
SELECT 
  c.name,
  va.total_votes,
  va.percentage
FROM vote_aggregates va
JOIN candidates c ON c.id = va.candidate_id
ORDER BY va.total_votes DESC
LIMIT 10;
```

**Check:** No candidate at 0 votes (could indicate system issue)

### Evening Report (20 minutes)

#### 1. Daily Summary
```sql
-- Generate daily report
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_votes,
  COUNT(DISTINCT country) as countries,
  COUNT(DISTINCT candidate_id) as candidates_with_votes
FROM votes
WHERE created_at >= CURRENT_DATE
GROUP BY DATE(created_at);
```

#### 2. Geographic Distribution
```sql
-- Top 10 countries today
SELECT 
  country,
  COUNT(*) as votes
FROM votes
WHERE created_at >= CURRENT_DATE
GROUP BY country
ORDER BY votes DESC
LIMIT 10;
```

#### 3. Fraud Summary
```sql
-- Fraud attempts today
SELECT 
  suspicion_type,
  COUNT(*) as attempts,
  AVG(suspicion_score) as avg_score
FROM fraud_logs
WHERE created_at >= CURRENT_DATE
GROUP BY suspicion_type;
```

---

## 🚨 Fraud Detection & Response

### Suspicion Levels

**Low (Score: 0-30)**
- Occasional duplicate attempts
- **Action:** Monitor, no intervention needed

**Medium (Score: 31-60)**
- Multiple attempts from same IP
- Rapid voting patterns
- **Action:** Flag for review

**High (Score: 61-80)**
- Clear bot patterns
- VPN/proxy detected
- **Action:** Block IP temporarily

**Critical (Score: 81-100)**
- Coordinated attack
- Database manipulation attempts
- **Action:** Block immediately, alert team

### Investigation Process

#### 1. Identify Suspicious Activity
```sql
-- Find high suspicion votes
SELECT 
  fl.*,
  v.country,
  v.ip_address
FROM fraud_logs fl
LEFT JOIN votes v ON v.phone_number = fl.phone_number
WHERE fl.suspicion_score > 70
AND fl.created_at > NOW() - INTERVAL '24 hours'
ORDER BY fl.suspicion_score DESC;
```

#### 2. Analyze Pattern

Check for:
- Same IP, multiple phones?
- Same DOB pattern?
- Time intervals < 10 seconds?
- Geographic anomalies?

#### 3. Take Action

**If Confirmed Fraud:**
```sql
-- Mark vote as fraudulent (soft delete)
UPDATE votes
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{fraud_flag}',
  'true'
)
WHERE phone_number = '+509xxxxxxxx';

-- Block phone number
INSERT INTO blocked_numbers (phone_number, reason, blocked_at)
VALUES ('+509xxxxxxxx', 'Confirmed fraud', NOW());
```

**If False Positive:**
```sql
-- Clear suspicion
UPDATE fraud_logs
SET resolved = true,
    notes = 'False positive - legitimate voter'
WHERE id = 'xxx';
```

#### 4. Document

Keep log of:
- Date/time of investigation
- Evidence found
- Action taken
- Outcome

---

## 📈 Generating Reports

### Weekly Report Template
```sql
-- Week Summary Report
SELECT 
  'Total Votes' as metric,
  COUNT(*)::text as value
FROM votes
WHERE created_at > NOW() - INTERVAL '7 days'

UNION ALL

SELECT 
  'Unique Countries' as metric,
  COUNT(DISTINCT country)::text as value
FROM votes
WHERE created_at > NOW() - INTERVAL '7 days'

UNION ALL

SELECT 
  'Average Daily Votes' as metric,
  ROUND(COUNT(*) / 7.0)::text as value
FROM votes
WHERE created_at > NOW() - INTERVAL '7 days'

UNION ALL

SELECT 
  'Top Candidate' as metric,
  c.name as value
FROM votes v
JOIN candidates c ON c.id = v.candidate_id
WHERE v.created_at > NOW() - INTERVAL '7 days'
GROUP BY c.name
ORDER BY COUNT(*) DESC
LIMIT 1;
```

**Export:** Copy results to Excel/Google Sheets

### Media Report (For Press)
```sql
-- Generate media-friendly stats
SELECT 
  c.name as "Candidate",
  va.total_votes as "Total Votes",
  ROUND(va.percentage, 2)::text || '%' as "Percentage",
  (
    SELECT COUNT(DISTINCT country)
    FROM votes
    WHERE candidate_id = c.id
  ) as "Countries"
FROM candidates c
JOIN vote_aggregates va ON va.candidate_id = c.id
ORDER BY va.total_votes DESC;
```

**Output:** Professional table for social media/press releases

---

## 🔧 Common Admin Tasks

### 1. Add New Candidate (Emergency)
```sql
-- Insert candidate
INSERT INTO candidates (name, slug, party, photo_url)
VALUES (
  'New Candidate Name',
  'new-candidate-slug',
  'Party Name',
  'https://supabase.co/storage/v1/object/public/candidate-photos/new-candidate.jpg'
);

-- Verify
SELECT * FROM candidates WHERE slug = 'new-candidate-slug';
```

### 2. Update Candidate Info
```sql
-- Update party affiliation
UPDATE candidates
SET party = 'New Party Name'
WHERE slug = 'candidate-slug';

-- Update photo
UPDATE candidates
SET photo_url = 'https://new-photo-url.jpg'
WHERE slug = 'candidate-slug';
```

### 3. Refresh Materialized Views
```sql
-- Manual refresh (usually automatic)
REFRESH MATERIALIZED VIEW CONCURRENTLY vote_aggregates;
REFRESH MATERIALIZED VIEW CONCURRENTLY vote_by_country;
```

**When to refresh manually:**
- After bulk data changes
- If counts seem incorrect
- During low-traffic periods

### 4. Export Vote Data
```sql
-- Export all votes (CSV format)
COPY (
  SELECT 
    v.id,
    v.created_at,
    c.name as candidate,
    v.country,
    v.region,
    DATE_PART('year', AGE(v.date_of_birth)) as voter_age
  FROM votes v
  JOIN candidates c ON c.id = v.candidate_id
  ORDER BY v.created_at DESC
) TO '/tmp/votes_export.csv' WITH CSV HEADER;
```

**Security Note:** Remove personally identifiable information before sharing

### 5. Block Suspicious IP
```sql
-- Add to blocklist
INSERT INTO blocked_ips (ip_address, reason, blocked_at)
VALUES ('123.456.789.0', 'Suspicious activity detected', NOW());
```

### 6. Handle User Support Request

**User can't receive SMS:**

1. Check Twilio logs
2. Verify phone number format
3. Check if number is blocked
4. Manually send code if needed
```sql
-- Check if phone number exists
SELECT * FROM votes WHERE phone_number = '+509xxxxxxxx';

-- Check fraud logs
SELECT * FROM fraud_logs WHERE phone_number = '+509xxxxxxxx';
```

---

## 🆘 Emergency Procedures

### System Down

#### 1. Check Status Pages
- Vercel: https://vercel-status.com
- Supabase: https://status.supabase.com
- Twilio: https://status.twilio.com

#### 2. Check Vercel Logs
```bash
# In terminal
vercel logs --prod
```

#### 3. Rollback if Needed
```bash
vercel rollback
```

### Database Issues

#### 1. Check Connection
```sql
-- Simple health check
SELECT NOW();
```

#### 2. Check Table Sizes
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

#### 3. Check Active Queries
```sql
SELECT 
  pid,
  now() - query_start as duration,
  query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY duration DESC;
```

### Fraud Attack

#### 1. Identify Attack Pattern
```sql
-- Check recent high-volume IPs
SELECT 
  ip_address,
  COUNT(*) as attempts,
  MIN(created_at) as first_attempt,
  MAX(created_at) as last_attempt
FROM votes
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY ip_address
HAVING COUNT(*) > 10
ORDER BY attempts DESC;
```

#### 2. Block Attack Source
```sql
-- Block IPs with > 50 attempts in 1 hour
INSERT INTO blocked_ips (ip_address, reason, blocked_at)
SELECT DISTINCT
  ip_address,
  'Automated attack - ' || COUNT(*) || ' attempts',
  NOW()
FROM votes
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY ip_address
HAVING COUNT(*) > 50
ON CONFLICT (ip_address) DO NOTHING;
```

#### 3. Alert Team
- Send email to team@techklein.com
- Post in Slack #alerts channel
- Document incident

---

## 📋 Weekly Admin Checklist

### Monday Morning
- [ ] Review weekend activity
- [ ] Check system health
- [ ] Generate weekly report
- [ ] Clear resolved fraud alerts
- [ ] Check Supabase quota (80% threshold)

### Wednesday
- [ ] Mid-week performance review
- [ ] Check for API errors
- [ ] Review candidate stats
- [ ] Test backups

### Friday
- [ ] Generate end-of-week report
- [ ] Review fraud patterns
- [ ] Plan for weekend monitoring
- [ ] Update stakeholders

---

## 📊 Database Schema Reference

### Key Tables

**votes**
- Core voting data
- Columns: id, candidate_id, phone_number, country, region, date_of_birth, ip_address, created_at

**candidates**
- Candidate information
- Columns: id, name, slug, party, photo_url, bio

**fraud_logs**
- Suspicious activity tracking
- Columns: id, phone_number, suspicion_type, suspicion_score, ip_address, created_at

**vote_aggregates** (Materialized View)
- Pre-calculated vote totals
- Columns: candidate_id, total_votes, percentage, rank

**vote_by_country** (Materialized View)
- Geographic vote distribution
- Columns: country, candidate_id, votes, percentage

---

## 🔍 Advanced SQL Queries

### Find Voting Patterns
```sql
-- Identify time-based voting patterns
SELECT 
  EXTRACT(HOUR FROM created_at) as hour,
  COUNT(*) as votes,
  COUNT(DISTINCT ip_address) as unique_ips,
  COUNT(DISTINCT phone_number) as unique_phones
FROM votes
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY EXTRACT(HOUR FROM created_at)
ORDER BY hour;
```

### Demographic Analysis
```sql
-- Age distribution of voters
SELECT 
  CASE 
    WHEN DATE_PART('year', AGE(date_of_birth)) < 25 THEN '18-24'
    WHEN DATE_PART('year', AGE(date_of_birth)) < 35 THEN '25-34'
    WHEN DATE_PART('year', AGE(date_of_birth)) < 45 THEN '35-44'
    WHEN DATE_PART('year', AGE(date_of_birth)) < 55 THEN '45-54'
    ELSE '55+'
  END as age_group,
  COUNT(*) as votes,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM votes
GROUP BY age_group
ORDER BY age_group;
```

### Regional Performance
```sql
-- Candidate performance by department
SELECT 
  v.region as department,
  c.name as candidate,
  COUNT(*) as votes,
  RANK() OVER (PARTITION BY v.region ORDER BY COUNT(*) DESC) as rank
FROM votes v
JOIN candidates c ON c.id = v.candidate_id
WHERE v.region IS NOT NULL
GROUP BY v.region, c.name
HAVING RANK() OVER (PARTITION BY v.region ORDER BY COUNT(*) DESC) <= 3
ORDER BY v.region, rank;
```

### Fraud Pattern Detection
```sql
-- Detect coordinated voting attempts
SELECT 
  ip_address,
  COUNT(DISTINCT phone_number) as unique_phones,
  COUNT(*) as total_votes,
  MIN(created_at) as first_vote,
  MAX(created_at) as last_vote,
  EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) as time_span_seconds
FROM votes
WHERE created_at > NOW() - INTERVAL '1 day'
GROUP BY ip_address
HAVING COUNT(DISTINCT phone_number) > 5
ORDER BY unique_phones DESC;
```

---

## 🎓 Troubleshooting Guide

### Issue: Vote Not Appearing in Leaderboard

**Diagnosis:**
```sql
-- Check if vote exists
SELECT * FROM votes WHERE phone_number = '+509xxxxxxxx';

-- Check aggregates
SELECT * FROM vote_aggregates WHERE candidate_id = (
  SELECT candidate_id FROM votes WHERE phone_number = '+509xxxxxxxx'
);
```

**Solution:**
```sql
-- Refresh materialized view
REFRESH MATERIALIZED VIEW CONCURRENTLY vote_aggregates;
```

### Issue: Slow Query Performance

**Diagnosis:**
```sql
-- Find slow queries
SELECT 
  query,
  calls,
  mean_exec_time,
  max_exec_time
FROM pg_stat_statements
WHERE mean_exec_time > 1000
ORDER BY mean_exec_time DESC
LIMIT 10;
```

**Solution:**
- Add indexes
- Optimize query
- Use materialized views

### Issue: High Fraud Score False Positives

**Common Causes:**
- Users in same household
- Public WiFi networks
- Corporate proxies

**Action:**
```sql
-- Review and whitelist if legitimate
UPDATE fraud_logs
SET resolved = true,
    notes = 'Legitimate - shared network'
WHERE ip_address = 'xxx.xxx.xxx.xxx'
AND created_at > NOW() - INTERVAL '1 day';
```

---

## 📚 Additional Resources

### Documentation
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/

### Support Channels
- Emergency: team@techklein.com
- Slack: #votelive-admin
- GitHub: https://github.com/carleintech/TechKlein_VoteLive

### Training Videos
- Platform Overview: [To be created]
- Fraud Detection: [To be created]
- Report Generation: [To be created]

---

## ✅ Admin Certification

Upon completion of training, admin should be able to:

- [ ] Access all admin dashboards (Supabase, Vercel)
- [ ] Run daily monitoring checks (morning, mid-day, evening)
- [ ] Identify and respond to fraud (suspicion levels, investigation)
- [ ] Generate reports (weekly, media, exports)
- [ ] Handle common support requests (SMS issues, duplicate votes)
- [ ] Execute emergency procedures (rollback, block IPs, fraud response)
- [ ] Manage candidate data (add, update, verify)
- [ ] Run SQL queries (health checks, analytics, fraud detection)
- [ ] Understand database schema (tables, views, relationships)
- [ ] Troubleshoot common issues (performance, false positives)

**Certified By:** _________________

**Date:** _________________

**Signature:** _________________

---

## 🔒 Security Best Practices

### Access Control
- Use strong passwords (20+ characters)
- Enable 2FA on all accounts
- Don't share credentials
- Log out when finished
- Use VPN for remote access

### Data Protection
- Never share voter phone numbers
- Redact PII in exports
- Encrypt sensitive data
- Follow GDPR/privacy laws
- Regular security audits

### Incident Response
1. Detect threat
2. Contain damage
3. Document incident
4. Notify stakeholders
5. Review & improve

---

*Last Updated: November 2025*
*Version: 1.0*
*Platform: TechKlein VoteLive*
