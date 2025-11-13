-- Create statistics table for caching aggregated data
CREATE TABLE IF NOT EXISTS statistics (
    id SERIAL PRIMARY KEY,
    total_submissions BIGINT DEFAULT 0,
    submissions_by_type JSONB DEFAULT '{}',
    submissions_by_category JSONB DEFAULT '{}',
    submissions_by_status JSONB DEFAULT '{}',
    languages_detected JSONB DEFAULT '{}',
    submissions_by_date JSONB DEFAULT '{}',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert initial row
INSERT INTO statistics (total_submissions) VALUES (0);

-- Create function to update statistics
CREATE OR REPLACE FUNCTION update_statistics()
RETURNS void AS $$
BEGIN
    UPDATE statistics SET
        total_submissions = (SELECT COUNT(*) FROM submissions WHERE deleted_at IS NULL),
        submissions_by_type = (
            SELECT COALESCE(jsonb_object_agg(type::text, count), '{}'::jsonb)
            FROM (
                SELECT type, COUNT(*) as count
                FROM submissions
                WHERE deleted_at IS NULL
                GROUP BY type
            ) t
        ),
        submissions_by_category = (
            SELECT COALESCE(jsonb_object_agg(category, count), '{}'::jsonb)
            FROM (
                SELECT COALESCE(category, 'uncategorized') as category, COUNT(*) as count
                FROM submissions
                WHERE deleted_at IS NULL
                GROUP BY category
            ) t
        ),
        submissions_by_status = (
            SELECT COALESCE(jsonb_object_agg(status::text, count), '{}'::jsonb)
            FROM (
                SELECT status, COUNT(*) as count
                FROM submissions
                WHERE deleted_at IS NULL
                GROUP BY status
            ) t
        ),
        languages_detected = (
            SELECT COALESCE(jsonb_object_agg(language, count), '{}'::jsonb)
            FROM (
                SELECT COALESCE(language, 'unknown') as language, COUNT(*) as count
                FROM submissions
                WHERE deleted_at IS NULL
                GROUP BY language
            ) t
        ),
        submissions_by_date = (
            SELECT COALESCE(jsonb_object_agg(date::text, count), '{}'::jsonb)
            FROM (
                SELECT DATE(created_at) as date, COUNT(*) as count
                FROM submissions
                WHERE deleted_at IS NULL AND created_at >= NOW() - INTERVAL '30 days'
                GROUP BY DATE(created_at)
                ORDER BY date DESC
            ) t
        ),
        updated_at = NOW()
    WHERE id = 1;
END;
$$ LANGUAGE plpgsql;
