-- ==============================================================================
-- Nine Star Technologies - Supabase Schema & Real-Time Security Setup
-- ==============================================================================

-- 1. Create table for applications / products
CREATE TABLE IF NOT EXISTS public.apps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Mobile application',
    description TEXT NOT NULL,
    icon_text TEXT NOT NULL DEFAULT '★',
    icon_url TEXT,
    badge TEXT DEFAULT 'Mobile application',
    play_store_url TEXT,
    privacy_policy_url TEXT DEFAULT '#privacy-policy',
    terms_url TEXT DEFAULT '#terms-and-conditions',
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Ensure icon_url exists if table was previously created
ALTER TABLE public.apps ADD COLUMN IF NOT EXISTS icon_url TEXT;

-- 2. Create table for editable Website Settings / Content (Hero, About, Contact, Services, Legal)
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public can view published apps" ON public.apps;
DROP POLICY IF EXISTS "Authenticated users have full access to apps" ON public.apps;
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated users can update site settings" ON public.site_settings;

-- 3. Policy for Public Read Access:
CREATE POLICY "Public can view published apps"
    ON public.apps
    FOR SELECT
    TO anon, authenticated
    USING (status = 'published');

CREATE POLICY "Public can view site settings"
    ON public.site_settings
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 4. Policy for Authenticated Admin Access:
CREATE POLICY "Authenticated users have full access to apps"
    ON public.apps
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update site settings"
    ON public.site_settings
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 5. Realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.apps;
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;

-- 6. Trigger for updated_at timestamp
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

DROP TRIGGER IF EXISTS trigger_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER trigger_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 7. Insert initial seed data for Nine Star Technologies Apps
INSERT INTO public.apps (title, category, description, icon_text, badge, play_store_url, privacy_policy_url, terms_url, status, sort_order)
VALUES
(
    'StarPulse Productivity',
    'Mobile application',
    'A minimalist task and habit orchestration suite designed for high-focus professionals with offline sync and encrypted cloud backups.',
    '★',
    'Featured on Play Store',
    'https://play.google.com/store/apps/details?id=com.ninestar.starpulse',
    '#privacy-policy',
    '#terms-and-conditions',
    'published',
    1
),
(
    'Zenith Habit Tracker',
    'Mobile application',
    'Behavioral science tracker assisting users in building lasting habits with micro-journaling and ambient audio.',
    '✦',
    'Popular',
    'https://play.google.com/store/apps/details?id=com.ninestar.zenith',
    '#privacy-policy',
    '#terms-and-conditions',
    'published',
    2
),
(
    'Custom Enterprise Suite',
    'Enterprise and client solutions',
    'Tailored software, API development, and web platforms built around client workflows and modern digital infrastructure.',
    'E',
    'Enterprise & Client Solutions',
    '',
    '#privacy-policy',
    '#terms-and-conditions',
    'published',
    3
)
ON CONFLICT DO NOTHING;

-- 8. Insert initial seed content for All Website Sections
INSERT INTO public.site_settings (key, value)
VALUES
(
  'general',
  '{
    "company_name": "Nine Star Technologies",
    "email": "support@yourdomain.com",
    "phone": "+000 0000 000000",
    "address": "Bhatia Zahirkona, Niamatpur, Karimganj, Kishoreganj 2310, Dhaka Division, Bangladesh",
    "trade_license": "No. 20262320000465, Dehunda Union Parishad, Karimganj, Kishoreganj",
    "hero_kicker": "Software studio for Android, web and cloud",
    "hero_title": "Crafting high-performance mobile and digital solutions",
    "hero_desc": "At Nine Star Technologies, we design and engineer scalable Android applications, intuitive web platforms, and smart digital utilities for everyday users and modern businesses.",
    "about_title": "About us",
    "about_desc": "Nine Star Technologies is an independent technology and software development company focused on building reliable mobile applications and modern digital infrastructure. We specialize in cross-platform app architecture, native Android experiences, and secure cloud integrations, delivering tools that simplify productivity, finance, and daily life."
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- ==============================================================================
-- 9. Create table for Social Media Profiles (Dynamic Admin Hub)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.social_links (
    id TEXT PRIMARY KEY, -- platform key e.g. 'linkedin', 'facebook', 'twitter_x'
    platform TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Drop old policies if re-running
DROP POLICY IF EXISTS "Public can view active social links" ON public.social_links;
DROP POLICY IF EXISTS "Authenticated users have full access to social links" ON public.social_links;

-- Public can read all active social links
CREATE POLICY "Public can view active social links"
    ON public.social_links
    FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

-- Authenticated admins have full CRUD access
CREATE POLICY "Authenticated users have full access to social links"
    ON public.social_links
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Realtime publication for social_links
ALTER PUBLICATION supabase_realtime ADD TABLE public.social_links;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS trigger_social_links_updated_at ON public.social_links;
CREATE TRIGGER trigger_social_links_updated_at
    BEFORE UPDATE ON public.social_links
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Seed initial platforms for Nine Star Technologies
INSERT INTO public.social_links (id, platform, url, is_active)
VALUES
('linkedin', 'linkedin', '', true),
('facebook', 'facebook', '', true),
('twitter_x', 'twitter_x', '', true),
('whatsapp', 'whatsapp', '', true),
('telegram', 'telegram', '', true),
('instagram', 'instagram', '', true),
('youtube', 'youtube', '', true),
('github', 'github', '', true)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 4. LEADS & INQUIRIES AUTOMATION TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service_type TEXT DEFAULT 'General Inquiry',
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on leads table
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow public / anon users to submit contact leads via website
CREATE POLICY "Allow public inserts for leads"
    ON public.leads
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow authenticated admins to view, update, and manage leads
CREATE POLICY "Allow authenticated admins full access to leads"
    ON public.leads
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Enable realtime for leads table
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;

-- Trigger for leads updated_at
DROP TRIGGER IF EXISTS trigger_leads_updated_at ON public.leads;
CREATE TRIGGER trigger_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();


