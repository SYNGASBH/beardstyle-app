# BeardStyle project instructions

The frontend uses React 18 and Create React App (`react-scripts`), with `frontend/src/App.js`. The backend uses Express in `backend/src`; database configuration lives in `backend/src/config`. Docker Compose uses PostgreSQL 14. Do not assume Vite or PostgreSQL 15.

API groups are `/api/styles`, `/api/auth`, `/api/user`, and `/api/salon`. There is no `/api/beards` API. `/health` checks database readiness and returns 503 on failure.

The app's style identities are defined in `frontend/src/data/styleIdentity.json`. Preserve existing IDs for saved selections. English slugs and documented aliases resolve to the same identity. Never map semantically different styles to one another. Run `node scripts/sync-style-identity.cjs` after changing identities; CI verifies the backend copy, which is required for the separate Docker build context.

`beardStyles.js` contains display details; `styles.json` contains technical classifier rules. Both cover the identity catalog. `database/beard-profiles` contains a larger research/seed collection, not the active gallery catalog. Do not delete those profiles solely because their counts differ.

Sketches are in `frontend/public/assets/sketches`, with generation tooling in `scripts/image-generation`. Existing WebP sketches are 800 by 800. Four styles currently have explicit SVG placeholders (`illustrationAvailable: false`); never substitute another style's sketch as if it were accurate. Thumbnails and a 3:4 image migration are not implemented.

Validate backend changes with `npm test -- --runInBand` in `backend`; validate frontend changes with `npm test -- --watchAll=false --runInBand` and `npm run build` in `frontend`. Do not call paid AI APIs for tests.

AR try-on uses the MediaPipe tracker and transparent procedural Canvas 2D shapes in `arPreview.js`. Preserve the same video/overlay geometry and mirror transform for live view and capture. Camera streams must stop on capture and unmount. This is an illustrative additive preview, not removal of existing hair.

Academy is temporarily open to all lessons by explicit user request. Courses are in `frontend/src/data/academyCourses.json`; sync the backend validation catalog with `node scripts/sync-academy-catalog.cjs`. Preserve separate progress keys per user and guest; server sync failures must not block local lessons. See `docs/ar-academy.md` for setup and limitations.
