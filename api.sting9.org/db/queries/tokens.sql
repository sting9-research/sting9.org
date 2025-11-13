-- name: CreateAPIToken :one
INSERT INTO api_tokens (
    user_id, token_hash, expires_at, user_agent, ip_address
) VALUES (
    $1, $2, $3, $4, $5
)
RETURNING *;

-- name: GetAPITokenByHash :one
SELECT * FROM api_tokens
WHERE token_hash = $1 AND NOT revoked AND expires_at > NOW();

-- name: ListUserTokens :many
SELECT * FROM api_tokens
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;

-- name: UpdateTokenLastUsed :exec
UPDATE api_tokens
SET last_used_at = NOW()
WHERE id = $1;

-- name: RevokeToken :exec
UPDATE api_tokens
SET revoked = TRUE, revoked_at = NOW()
WHERE id = $1;

-- name: RevokeAllUserTokens :exec
UPDATE api_tokens
SET revoked = TRUE, revoked_at = NOW()
WHERE user_id = $1 AND NOT revoked;

-- name: DeleteExpiredTokens :exec
DELETE FROM api_tokens
WHERE expires_at < NOW();
