-- Drop index
DROP INDEX IF EXISTS idx_submissions_submitter_nickname;

-- Remove submitter_nickname column from submissions table
ALTER TABLE submissions
DROP COLUMN IF EXISTS submitter_nickname;
