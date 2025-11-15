-- Drop index
DROP INDEX IF EXISTS idx_submissions_submitter_email;

-- Remove submitter_email column from submissions table
ALTER TABLE submissions
DROP COLUMN IF EXISTS submitter_email;
