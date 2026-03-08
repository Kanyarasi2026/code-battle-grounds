# Database Migrations

This folder contains SQL migration files for the Code Battle Grounds backend database.

## Migration Files

### 001_create_user_profiles.sql

**Purpose:** Creates the trusted user profile and role authorization system.

**What it does:**
- Creates `user_profiles` table (source of truth for roles)
- Creates `role_audit_log` table (tracks all role changes)
- Sets up Row Level Security (RLS) policies
- Creates triggers for auto-profile creation on signup
- Creates helper views for admin dashboard
- Adds indexes for performance

**When to run:** Before deploying the role-based authorization system.

## How to Run Migrations

### Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your Supabase project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Using Supabase Dashboard

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor**
4. Open the migration file
5. Copy and paste the SQL content
6. Click **Run**
7. Verify success in the output panel

### Verify Migration Success

Run these queries in SQL Editor:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_profiles', 'role_audit_log');

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_profiles', 'role_audit_log');

-- Check policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';

-- Check triggers exist
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

## Migration Workflow

### For New Projects

1. Run migration 001 during initial setup
2. Backend will auto-create profiles on user signup
3. Use CLI tool or admin API to verify roles

### For Existing Projects

1. Run migration 001
2. Run migration script to copy existing role data from user_metadata
3. Verify all users have profiles created
4. Test role-based endpoints
5. Monitor audit logs for issues

### Migration Script for Existing Data

```sql
-- Copy existing roles from user_metadata to user_profiles
INSERT INTO public.user_profiles (id, email, full_name, role, role_status, role_verified_at)
SELECT 
    id,
    email,
    raw_user_meta_data->>'full_name',
    CASE 
        WHEN raw_user_meta_data->>'role_verified' = 'faculty' THEN 'faculty'
        WHEN raw_user_meta_data->>'role_verified' = 'student' THEN 'student'
        ELSE NULL
    END,
    CASE 
        WHEN raw_user_meta_data->>'role_verified' IN ('faculty', 'student') THEN 'approved'
        ELSE 'pending'
    END,
    CASE 
        WHEN raw_user_meta_data->>'role_verified' IN ('faculty', 'student') THEN NOW()
        ELSE NULL
    END
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    role_status = EXCLUDED.role_status,
    role_verified_at = EXCLUDED.role_verified_at;
```

## Rollback Strategy

If you need to rollback a migration:

### Rollback 001_create_user_profiles.sql

```sql
-- Drop tables (this will remove all profile data!)
DROP TABLE IF EXISTS public.role_audit_log CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Drop views
DROP VIEW IF EXISTS public.pending_role_requests;
DROP VIEW IF EXISTS public.active_verified_users;

-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.update_updated_at_column();
```

⚠️ **Warning:** Rollback will delete all profile and audit data. Back up first!

## Database Schema Diagram

```
┌──────────────────┐
│ auth.users       │
│ (Supabase Auth)  │
└────────┬─────────┘
         │
         │ 1:1
         │
         ▼
┌──────────────────────────────┐
│ public.user_profiles         │
├──────────────────────────────┤
│ • id (PK, FK to auth.users)  │
│ • email                      │
│ • role (faculty/student)     │
│ • role_status                │
│ • role_verified_at           │
│ • ... institutional data ... │
└────────┬─────────────────────┘
         │
         │ 1:N
         │
         ▼
┌──────────────────────────────┐
│ public.role_audit_log        │
├──────────────────────────────┤
│ • id (PK)                    │
│ • user_id (FK)               │
│ • action                     │
│ • old_role / new_role        │
│ • performed_by               │
│ • created_at                 │
└──────────────────────────────┘
```

## Best Practices

1. **Always backup** before running migrations
2. **Test locally** with a development Supabase project first
3. **Run during low traffic** for production deployments
4. **Monitor logs** after migration for errors
5. **Verify data integrity** with test queries
6. **Keep migrations immutable** - don't edit after deployment
7. **Document breaking changes** in migration comments

## Support

For issues or questions about migrations:

1. Check [TRUSTED_ROLE_LOOKUP.md](../TRUSTED_ROLE_LOOKUP.md) for architecture details
2. Review [AUTHORIZATION.md](../AUTHORIZATION.md) for middleware usage
3. Consult [Supabase Database Documentation](https://supabase.com/docs/guides/database)
4. Check logs: `supabase logs --db`

## Migration Checklist

Before deploying to production:

- [ ] Backup current database
- [ ] Test migration on staging/dev environment
- [ ] Review RLS policies for security
- [ ] Verify indexes are created
- [ ] Test auth flow end-to-end
- [ ] Check role authorization works
- [ ] Monitor error logs for 24 hours
- [ ] Verify audit logging is working
- [ ] Document any custom changes
- [ ] Update team on changes

## Future Migrations

When adding new migrations:

1. Name sequentially: `002_migration_name.sql`, `003_...`, etc.
2. Add description in this README
3. Test thoroughly before production
4. Provide rollback script
5. Document breaking changes
