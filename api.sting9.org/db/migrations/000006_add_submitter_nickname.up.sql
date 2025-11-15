-- Add submitter_nickname column to submissions table
ALTER TABLE submissions
ADD COLUMN submitter_nickname VARCHAR(50);

-- Create index for nickname-based queries (leaderboard)
CREATE INDEX idx_submissions_submitter_nickname ON submissions(submitter_nickname) WHERE deleted_at IS NULL AND submitter_nickname IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN submissions.submitter_nickname IS 'Public display name for leaderboard - optional, shown instead of email for privacy';
