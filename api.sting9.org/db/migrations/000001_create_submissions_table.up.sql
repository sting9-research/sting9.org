-- Create enum types
CREATE TYPE submission_type AS ENUM ('email', 'sms', 'whatsapp', 'telegram', 'signal', 'social_media', 'other');
CREATE TYPE submission_status AS ENUM ('pending', 'processing', 'processed', 'flagged', 'approved', 'rejected');

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type submission_type NOT NULL,
    raw_content TEXT NOT NULL,
    anonymized_content TEXT,
    metadata JSONB DEFAULT '{}',
    language VARCHAR(10),
    category VARCHAR(100),
    status submission_status DEFAULT 'pending',
    submitter_ip VARCHAR(45),  -- IPv6 max length
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Create indexes for performance
CREATE INDEX idx_submissions_type ON submissions(type) WHERE deleted_at IS NULL;
CREATE INDEX idx_submissions_status ON submissions(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_submissions_category ON submissions(category) WHERE deleted_at IS NULL;
CREATE INDEX idx_submissions_language ON submissions(language) WHERE deleted_at IS NULL;
CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX idx_submissions_metadata ON submissions USING GIN (metadata);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_submissions_updated_at
    BEFORE UPDATE ON submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
