# Home API Integration and Permissions Fix

## Goal
Replace hard-coded homepage data with existing public APIs and restore the role-permission management screen.

## Tasks
- [ ] Trace homepage sections to available API functions and response shapes.
- [ ] Load homepage data concurrently and derive NEW, SALE, and unbadged product groups from API products.
- [ ] Integrate remaining homepage sections that already have backend APIs, preserving safe fallbacks.
- [ ] Reproduce and isolate the blank role-permission page.
- [ ] Fix role list/form rendering and permission persistence without weakening route authorization.
- [ ] Add focused regression coverage where the current test setup permits.
- [ ] Run frontend lint/build and backend tests, then inspect the final diff.

## Done When
- [ ] `/` renders API-backed sections and no longer imports hard-coded product groups.
- [ ] Role-permission navigation displays editable permissions and saves them.
- [ ] Relevant build, lint, and test commands pass.

## Notes
- Existing APIs are preferred; backend expansion is limited to clearly missing integration support.
- Independent homepage requests should run concurrently.
