-- name: CreateUser :one
INSERT INTO users (
    email, password_hash, role, organization, purpose, verification_token, verification_expires_at
) VALUES (
    $1, $2, $3, $4, $5, $6, $7
)
RETURNING *;

-- name: GetUserByID :one
SELECT * FROM users
WHERE id = $1 AND deleted_at IS NULL;

-- name: GetUserByEmail :one
SELECT * FROM users
WHERE email = $1 AND deleted_at IS NULL;

-- name: GetUserByVerificationToken :one
SELECT * FROM users
WHERE verification_token = $1 AND deleted_at IS NULL;

-- name: GetUserByResetToken :one
SELECT * FROM users
WHERE reset_token = $1 AND deleted_at IS NULL;

-- name: ListUsers :many
SELECT * FROM users
WHERE deleted_at IS NULL
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;

-- name: ListUsersByRole :many
SELECT * FROM users
WHERE role = $1 AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;

-- name: UpdateUserVerification :one
UPDATE users
SET verified = TRUE, verification_token = NULL, verification_expires_at = NULL
WHERE id = $1 AND deleted_at IS NULL
RETURNING *;

-- name: UpdateUserApproval :one
UPDATE users
SET approved = $2
WHERE id = $1 AND deleted_at IS NULL
RETURNING *;

-- name: UpdateUserPassword :one
UPDATE users
SET password_hash = $2, reset_token = NULL, reset_expires_at = NULL
WHERE id = $1 AND deleted_at IS NULL
RETURNING *;

-- name: UpdateUserResetToken :one
UPDATE users
SET reset_token = $2, reset_expires_at = $3
WHERE id = $1 AND deleted_at IS NULL
RETURNING *;

-- name: UpdateUserLastLogin :exec
UPDATE users
SET last_login_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;

-- name: DeleteUser :exec
UPDATE users
SET deleted_at = NOW()
WHERE id = $1;

-- name: CountUsers :one
SELECT COUNT(*) FROM users WHERE deleted_at IS NULL;

-- name: CountUsersByRole :one
SELECT COUNT(*) FROM users WHERE role = $1 AND deleted_at IS NULL;
