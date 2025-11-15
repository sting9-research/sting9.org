-- Add submitter_email column to submissions table
ALTER TABLE submissions
ADD COLUMN submitter_email VARCHAR(255);

-- Create index for email-based queries (leaderboard)
CREATE INDEX idx_submissions_submitter_email ON submissions(submitter_email) WHERE deleted_at IS NULL AND submitter_email IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN submissions.submitter_email IS 'Email address of the person submitting the phishing/smishing content';
