-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- User Profiles Table - Trusted Source of Truth for User Roles
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
--
-- This table stores verified user profile information including roles.
-- It is the ONLY trusted source for role-based authorization.
-- Frontend metadata is NEVER trusted for authorization decisions.
--
-- Migration: 001_create_user_profiles.sql
-- Created: 2026-03-08
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    -- Primary key: references auth.users(id)
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Profile information
    email TEXT NOT NULL,
    full_name TEXT,
    
    -- Role-based access control (RBAC)
    role TEXT CHECK (role IN ('faculty', 'student')) DEFAULT NULL,
    role_status TEXT CHECK (role_status IN ('pending', 'approved', 'rejected', 'revoked')) DEFAULT 'pending',
    
    -- Role verification metadata
    role_requested_at TIMESTAMPTZ,
    role_verified_at TIMESTAMPTZ,
    role_verified_by UUID REFERENCES auth.users(id),
    role_verification_note TEXT,
    
    -- Institutional affiliation (optional)
    institution TEXT,
    department TEXT,
    student_id TEXT,
    employee_id TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT valid_role_state CHECK (
        (role IS NULL AND role_status = 'pending') OR
        (role IS NOT NULL AND role_status IN ('approved', 'revoked'))
    )
);

-- Create index on role for fast authorization queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role) WHERE role IS NOT NULL;

-- Create index on email for lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);

-- Create index on role_status for admin queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_role_status ON public.user_profiles(role_status);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Row Level Security (RLS) Policies
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can view own profile"
    ON public.user_profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Policy: Users can update their own non-sensitive fields
CREATE POLICY "Users can update own profile"
    ON public.user_profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id AND
        -- Prevent users from setting their own role or role_status
        role = (SELECT role FROM public.user_profiles WHERE id = auth.uid()) AND
        role_status = (SELECT role_status FROM public.user_profiles WHERE id = auth.uid())
    );

-- Policy: Service role can do anything (backend operations)
CREATE POLICY "Service role has full access"
    ON public.user_profiles
    FOR ALL
    USING (auth.jwt()->>'role' = 'service_role')
    WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- Policy: Authenticated users can insert their initial profile
CREATE POLICY "Users can create own profile"
    ON public.user_profiles
    FOR INSERT
    WITH CHECK (
        auth.uid() = id AND
        -- Users can only create with pending status, no role
        role IS NULL AND
        role_status = 'pending'
    );

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Trigger: Auto-update updated_at timestamp
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Function: Auto-create profile on user signup
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, created_at)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Create profile when user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Helper Views for Common Queries
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- View: Pending role requests (for admin dashboard)
CREATE OR REPLACE VIEW public.pending_role_requests AS
SELECT 
    id,
    email,
    full_name,
    role,
    role_requested_at,
    institution,
    department,
    student_id,
    employee_id,
    created_at
FROM public.user_profiles
WHERE role_status = 'pending' AND role IS NOT NULL
ORDER BY role_requested_at ASC;

-- View: Active users with verified roles
CREATE OR REPLACE VIEW public.active_verified_users AS
SELECT 
    id,
    email,
    full_name,
    role,
    role_verified_at,
    role_verified_by,
    last_login_at
FROM public.user_profiles
WHERE role_status = 'approved' AND role IS NOT NULL
ORDER BY last_login_at DESC NULLS LAST;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Audit Log Table (Optional but Recommended)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE IF NOT EXISTS public.role_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('request', 'approve', 'reject', 'revoke', 'modify')),
    old_role TEXT CHECK (old_role IN ('faculty', 'student')),
    new_role TEXT CHECK (new_role IN ('faculty', 'student')),
    old_status TEXT CHECK (old_status IN ('pending', 'approved', 'rejected', 'revoked')),
    new_status TEXT CHECK (new_status IN ('pending', 'approved', 'rejected', 'revoked')),
    performed_by UUID REFERENCES auth.users(id),
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_role_audit_log_user_id ON public.role_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_role_audit_log_created_at ON public.role_audit_log(created_at DESC);

-- Enable RLS for audit log
ALTER TABLE public.role_audit_log ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own audit log
CREATE POLICY "Users can view own audit log"
    ON public.role_audit_log
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Service role can insert audit records
CREATE POLICY "Service role can insert audit records"
    ON public.role_audit_log
    FOR INSERT
    WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Sample Data for Testing (Optional - Comment out in production)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Note: In production, users will be created via signup flow
-- This is just for local development testing

-- COMMENT OUT OR REMOVE BEFORE PRODUCTION DEPLOYMENT:
/*
-- Example: Create test user profiles (requires existing auth.users entries)
-- INSERT INTO public.user_profiles (id, email, full_name, role, role_status, role_verified_at)
-- VALUES 
--     ('existing-user-id-1', 'professor@example.edu', 'Dr. Jane Smith', 'faculty', 'approved', NOW()),
--     ('existing-user-id-2', 'student@example.edu', 'John Doe', 'student', 'approved', NOW());
*/

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Verification / Smoke Test Queries
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Run these queries to verify the migration worked:
/*
-- 1. Check table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles'
);

-- 2. Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'user_profiles';

-- 3. Check policies
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'user_profiles';

-- 4. Check indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename = 'user_profiles';
*/
