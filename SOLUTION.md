SOLUTION.md

# Run teste and up Backend
1) docker compose build
2) docker compose up -d
3) docker exec -it backend_node sh
4) npm test
--Result
Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        1.014 s, estimated 2 s


# Full Solution Summary
This document outlines the complete implementation for a backend using Docker and a frontend
running locally, along with API behavior, tests, and architecture.
## Backend Overview
The backend is built with Express.js, structured to handle:
- File-based storage.
- Pagination.
- Search.
- Cached `/api/stats` route using an innmemory layer.
- Global error handler.
Backend runs in Docker.
## Endpoints
### GET /api/items
Returns paginated and searchable list of items.
### GET /api/items/:id
Fetch a single item. Validates ID and returns 400/404 when appropriate.
### POST /api/items
Creates a new item and writes to file. Returns `500` on FS errors.
### GET /api/stats
Reads file, calculates:
- total items
- average price
And caches the result until server restarts.
## Tests
All tests pass:
- Filtering
- Pagination
- Error handling
- Stats caching
- ID validation
- FS error mocking
## Frontend Overview
React app running locally (no Docker), implementing:
- Items listing
- Search with debounce
- Pagination
- Error states
- Loading state
- NotFound and error handling components
## DataContext
Provides:
- `items`
- `pageInfo`
- `fetchItems({ q, page, limit })`
## Docker
Only backend runs in Docker.
Frontend runs via `npm start`.