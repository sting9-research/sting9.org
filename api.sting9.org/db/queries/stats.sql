-- name: GetStatistics :one
SELECT * FROM statistics WHERE id = 1;

-- name: UpdateStatistics :exec
SELECT update_statistics();
