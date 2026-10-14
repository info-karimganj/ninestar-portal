# Nine Star Technologies - Developer Landing Page & CMS

Official Google Play Console organization verification website, privacy policy hosting, and real-time application showcase powered by Supabase.

---

## 🌟 Key Architecture & Capabilities

1. **Google Play Console Compliant**:
   - Official Organization Name: **"Nine Star Technologies"** strictly maintained across all tags, headers, footer, and schema.
   - Comprehensive **Privacy Policy** (`#privacy`) including device telemetry disclosures, third-party libraries, and direct GDPR/CCPA data deletion instructions.
   - Standard **Terms and Conditions** (`#terms`).
   - Corporate Contact & Organization Credentials (`#contact`) including support email: `support@ninestartechnologies.com`.
   - Google Rich Snippets Schema (`Organization` JSON-LD) integrated for search engine and Play Console verification.

2. **Dual-State Dynamic Architecture**:
   - **Public Portal**: Responsive showcase of apps with live sync status, gold gradient aesthetic, orbit animations, dark/light theme responsiveness, and deep links.
   - **Admin CMS (`#admin`)**: Secret route providing password authentication, real-time CRUD (Create, Edit, Publish/Draft toggle, Delete), sort ordering, and instant database reflection.

3. **Zero-Maintenance / Zero Build-Step**:
   - Pure HTML5, modern CSS custom properties, and Supabase JS v2 Client via CDN.
   - No `node_modules` or complex compilation needed. Deployable instantly to Vercel, Cloudflare Pages, GitHub Pages, or Netlify as a single static file.
   - Graceful offline fallback: Runs smoothly out-of-the-box in local demo mode, and seamlessly connects to your Supabase project once keys are added.

---

## 🚀 Supabase Setup (3 Minutes)

### 1. Execute SQL Migration
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) and select/create a project.
2. Navigate to the **SQL Editor** in the left sidebar.
3. Open [`supabase_schema.sql`](file:///c:/Users/user/Desktop/New%20folder/9web/supabase_schema.sql) and paste its content into the SQL Editor, then click **Run**.
   - This sets up the `public.apps` table, Row Level Security (RLS) policies, automatic `updated_at` triggers, and default seed data.

### 2. Create Your Admin User
1. In Supabase Dashboard, go to **Authentication** > **Users**.
2. Click **Add user** > **Create user**.
3. Enter your administrative email (e.g. `admin@ninestartechnologies.com`) and a secure password.
4. Set **Auto Confirm User?** to `true`.

### 3. Connect Supabase to the App
1. Open the landing page (`index.html`) in any browser.
2. Navigate to `#admin` (or click "Admin Portal" in the navigation bar).
3. Click **"Configure Supabase API Keys"** (or use the banner button).
4. Enter your:
   - **Supabase Project URL** (e.g., `https://xyzcompany.supabase.co`)
   - **Supabase Public Anon Key** (from *Project Settings* > *API*)
5. Click **Save & Connect**.
6. Sign in with the admin email and password created in Step 2.

---

## 📂 File Structure

- [`index.html`](file:///c:/Users/user/Desktop/New%20folder/9web/index.html) - Production landing page, legal documents, and Admin CMS.
- [`supabase_schema.sql`](file:///c:/Users/user/Desktop/New%20folder/9web/supabase_schema.sql) - Database schema, RLS policies, and seed data.
- [`README.md`](file:///c:/Users/user/Desktop/New%20folder/9web/README.md) - Documentation and deployment guide.
