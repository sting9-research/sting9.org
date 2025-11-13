-- name: CreateSubmission :one
INSERT INTO submissions (
    type, raw_content, anonymized_content, metadata, language, category, status, submitter_ip, user_agent
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9
)
RETURNING *;

-- name: GetSubmissionByID :one
SELECT * FROM submissions
WHERE id = $1 AND deleted_at IS NULL;

-- name: ListSubmissions :many
SELECT * FROM submissions
WHERE deleted_at IS NULL
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;

-- name: ListSubmissionsByType :many
SELECT * FROM submissions
WHERE type = $1 AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;

-- name: ListSubmissionsByCategory :many
SELECT * FROM submissions
WHERE category = $1 AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;

-- name: ListSubmissionsByStatus :many
SELECT * FROM submissions
WHERE status = $1 AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;

-- name: ListSubmissionsByDateRange :many
SELECT * FROM submissions
WHERE created_at >= $1 AND created_at <= $2 AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT $3 OFFSET $4;

-- name: UpdateSubmissionStatus :one
UPDATE submissions
SET status = $2, processed_at = CASE WHEN $2 = 'processed' THEN NOW() ELSE processed_at END
WHERE id = $1 AND deleted_at IS NULL
RETURNING *;

-- name: UpdateSubmissionContent :one
UPDATE submissions
SET anonymized_content = $2, language = $3, category = $4
WHERE id = $1 AND deleted_at IS NULL
RETURNING *;

-- name: DeleteSubmission :exec
UPDATE submissions
SET deleted_at = NOW()
WHERE id = $1;

-- name: CountSubmissions :one
SELECT COUNT(*) FROM submissions WHERE deleted_at IS NULL;

-- name: CountSubmissionsByType :one
SELECT COUNT(*) FROM submissions WHERE type = $1 AND deleted_at IS NULL;

-- name: CountSubmissionsByCategory :one
SELECT COUNT(*) FROM submissions WHERE category = $1 AND deleted_at IS NULL;
