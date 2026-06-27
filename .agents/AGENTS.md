# Project-scoped Rules

- **Supabase Database Management**: Ensure that all future database schema modifications are created as Supabase migrations (using `npx supabase migration new <name>`), pushed/applied successfully to the remote Supabase database, and verified to function correctly within the Supabase integration. Avoid fallback to local storage or raw files for schema definitions.
