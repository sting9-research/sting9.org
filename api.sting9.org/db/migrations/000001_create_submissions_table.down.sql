-- Drop trigger and function
DROP TRIGGER IF EXISTS update_submissions_updated_at ON submissions;
DROP FUNCTION IF EXISTS update_updated_at_column;

-- Drop indexes
DROP INDEX IF EXISTS idx_submissions_metadata;
DROP INDEX IF EXISTS idx_submissions_created_at;
DROP INDEX IF EXISTS idx_submissions_language;
DROP INDEX IF EXISTS idx_submissions_category;
DROP INDEX IF EXISTS idx_submissions_status;
DROP INDEX IF EXISTS idx_submissions_type;

-- Drop table
DROP TABLE IF EXISTS submissions;

-- Drop enum types
DROP TYPE IF EXISTS submission_status;
DROP TYPE IF EXISTS submission_type;
