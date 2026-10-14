-- ==============================================================================
-- Nine Star Technologies - Supabase Schema & Security Setup
-- ==============================================================================

-- 1. Create table for applications / products
CREATE TABLE IF NOT EXISTS public.apps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Mobile App',
    description TEXT NOT NULL,
    icon_text TEXT NOT NULL DEFAULT '★',
    badge TEXT DEFAULT 'Active',
    play_store_url TEXT,
    privacy_policy_url TEXT,
    terms_url TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if re-running
DROP POLICY IF EXISTS "Public can view published apps" ON public.apps;
DROP POLICY IF EXISTS "Authenticated users have full access to apps" ON public.apps;

-- 3. Policy for Public Read Access:
-- Anyone (anonymous or verified) can view published apps in the public showcase
CREATE POLICY "Public can view published apps"
    ON public.apps
    FOR SELECT
    TO anon, authenticated
    USING (status = 'published');

-- 4. Policy for Authenticated Admin Access:
-- Only authenticated users (admins logged in via Supabase Auth) can SELECT, INSERT, UPDATE, DELETE all apps
CREATE POLICY "Authenticated users have full access to apps"
    ON public.apps
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 5. Trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_apps_updated_at ON public.apps;
CREATE TRIGGER trigger_apps_updated_at
    BEFORE UPDATE ON public.apps
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 6. Insert initial seed data for Nine Star Technologies
INSERT INTO public.apps (title, category, description, icon_text, badge, play_store_url, privacy_policy_url, terms_url, status, sort_order)
VALUES
(
    'StarPulse Productivity',
    'Productivity & Utility',
    'Streamlined task & project orchestration designed for high-focus professionals with intelligent offline sync and encrypted cloud backups.',
    '⚡',
    'Featured on Play Store',
    'https://play.google.com/store/apps/details?id=com.ninestar.starpulse',
    '#privacy',
    '#terms',
    'published',
    1
),
(
    'Zenith Habit Tracker',
    'Lifestyle & Wellness',
    'Minimalist behavioral science tracker assisting users in building lasting habits with micro-journaling and ambient audio.',
    '✦',
    'Popular',
    'https://play.google.com/store/apps/details?id=com.ninestar.zenith',
    '#privacy',
    '#terms',
    'published',
    2
),
(
    'Constellation Finance',
    'Finance & Tools',
    'Smart budget allocation and multi-currency expense ledger with biometrics, bank-grade encryption, and automated export.',
    '◈',
    'Latest Release',
    'https://play.google.com/store/apps/details?id=com.ninestar.constellation',
    '#privacy',
    '#terms',
    'published',
    3
)
ON CONFLICT DO NOTHING;
