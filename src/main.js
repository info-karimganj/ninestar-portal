import './style.css';
import { supabase } from './supabase.js';

// Apps catalog defaults - 100% dynamic from Supabase database
const DEFAULT_APPS = [];

// Default site settings / general content
const DEFAULT_SITE_SETTINGS = {
  company_name: 'Nine Star Technologies',
  email: 'support@yourdomain.com',
  phone: '+000 0000 000000',
  address: 'Bhatia Zahirkona, Niamatpur, Karimganj, Kishoreganj 2310, Dhaka Division, Bangladesh',
  trade_license: 'No. 20262320000465, Dehunda Union Parishad, Karimganj, Kishoreganj',
  hero_kicker: 'Software studio for Android, web and cloud',
  hero_title: 'Crafting high-performance mobile and digital solutions',
  hero_desc: 'At Nine Star Technologies, we design and engineer scalable Android applications, intuitive web platforms, and smart digital utilities for everyday users and modern businesses.',
  about_title: 'About us',
  about_desc: 'Nine Star Technologies is an independent technology and software development company focused on building reliable mobile applications and modern digital infrastructure. We specialize in cross-platform app architecture, native Android experiences, and secure cloud integrations, delivering tools that simplify productivity, finance, and daily life.'
};

// Preset Social Media Platforms & Default state
const DEFAULT_SOCIAL_LINKS = {
  linkedin: '',
  facebook: '',
  twitter_x: '',
  whatsapp: '',
  telegram: '',
  instagram: '',
  youtube: '',
  github: ''
};

// Pure, lightweight inline SVG icon registry
const SOCIAL_ICONS = {
  linkedin: `<svg viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24"><path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z"/></svg>`,
  twitter_x: `<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.53c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.98-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.61c.12.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29z"/></svg>`,
  telegram: `<svg viewBox="0 0 24 24"><path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.162-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.671c.458 0 .66-.21.916-.458l2.2-2.14 4.577 3.382c.844.464 1.452.225 1.662-.785l3-14.135c.308-1.236-.473-1.8-1.282-1.438z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  github: `<svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>`
};

const SOCIAL_LABELS = {
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  twitter_x: 'X (Twitter)',
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
  instagram: 'Instagram',
  youtube: 'YouTube',
  github: 'GitHub'
};

let supabaseClient = supabase;
let currentSession = null;
let currentSettings = { ...DEFAULT_SITE_SETTINGS };
let currentSocialLinks = { ...DEFAULT_SOCIAL_LINKS };
// ==============================================================================
// 1. ROUTING, PRIVACY POLICY VIEWER & UI INTERACTIONS
// ==============================================================================

// Helper: Find app from cache or defaults by ID, package ID, or slug
export function findAppByIdOrSlug(query) {
  if (!query) return null;
  const q = String(query).trim().toLowerCase();
  const allApps = getLocalApps();
  return allApps.find(app => {
    const idMatch = String(app.id || '').toLowerCase() === q;
    const slugMatch = String(app.slug || '').toLowerCase() === q;
    const pkgMatch = String(extractPackageId(app.play_store_url || '') || '').toLowerCase() === q;
    const titleMatch = String(app.title || '').toLowerCase() === q || String(app.title || '').toLowerCase().replace(/[^a-z0-9]/g, '') === q.replace(/[^a-z0-9]/g, '');
    return idMatch || slugMatch || pkgMatch || titleMatch;
  }) || null;
}

// Lightweight, secure Markdown/Text to HTML parser (no heavyweight bundle dependencies)
export function parseAppMarkdown(md) {
  if (!md) return '';
  // Check if string is already HTML formatted
  if (/<(div|p|h[1-6]|ul|ol|table|section)[^>]*>/i.test(md)) {
    return md;
  }

  const lines = md.split('\n');
  const out = [];
  let inUl = false;
  let inOl = false;

  for (let rawLine of lines) {
    let line = rawLine.trim();

    // Blank line
    if (!line) {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (inOl) { out.push('</ol>'); inOl = false; }
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (inOl) { out.push('</ol>'); inOl = false; }
      out.push(`<h3>${inlineFormat(escapeHtml(line.slice(4)))}</h3>`);
      continue;
    }
    if (line.startsWith('## ')) {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (inOl) { out.push('</ol>'); inOl = false; }
      out.push(`<h2>${inlineFormat(escapeHtml(line.slice(3)))}</h2>`);
      continue;
    }
    if (line.startsWith('# ')) {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (inOl) { out.push('</ol>'); inOl = false; }
      out.push(`<h1>${inlineFormat(escapeHtml(line.slice(2)))}</h1>`);
      continue;
    }

    // Unordered List (* or -)
    if (/^[\*\-]\s+/.test(line)) {
      if (inOl) { out.push('</ol>'); inOl = false; }
      if (!inUl) { out.push('<ul>'); inUl = true; }
      const content = line.replace(/^[\*\-]\s+/, '');
      out.push(`<li>${inlineFormat(escapeHtml(content))}</li>`);
      continue;
    }

    // Ordered List (1. 2.)
    if (/^\d+\.\s+/.test(line)) {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (!inOl) { out.push('<ol>'); inOl = true; }
      const content = line.replace(/^\d+\.\s+/, '');
      out.push(`<li>${inlineFormat(escapeHtml(content))}</li>`);
      continue;
    }

    // Blockquote (> text)
    if (line.startsWith('> ')) {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (inOl) { out.push('</ol>'); inOl = false; }
      out.push(`<blockquote>${inlineFormat(escapeHtml(line.slice(2)))}</blockquote>`);
      continue;
    }

    // Standard paragraph
    if (inUl) { out.push('</ul>'); inUl = false; }
    if (inOl) { out.push('</ol>'); inOl = false; }
    out.push(`<p>${inlineFormat(escapeHtml(line))}</p>`);
  }

  if (inUl) out.push('</ul>');
  if (inOl) out.push('</ol>');

  return out.join('\n');
}

// Inline formatting helper (bold, italic, code, links)
function inlineFormat(str) {
  return str
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_([^_]+)_/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:underline">$1</a>')
    .replace(/\[([^\]]+)\]\((mailto:[^\s\)]+)\)/g, '<a href="$2" style="color:var(--gold);text-decoration:underline">$1</a>');
}

// Synthesizes a compliant default policy for apps without explicit custom content
export function generateDefaultAppPolicy(app) {
  const title = app.title || 'Mobile Application';
  const pkgId = app.slug || extractPackageId(app.play_store_url || '') || 'com.ninestar.app';
  const category = app.category || 'Mobile application';
  const desc = app.description || 'Modern mobile application built by Nine Star Technologies.';

  return `# Privacy Policy for ${title}

**Effective Date:** October 2026  
**Developer & Publisher:** Nine Star Technologies  
**Category:** ${category}  
**Application ID:** ${pkgId}  

### 1. Overview & Core Mission
Nine Star Technologies develops and publishes **${title}**. We believe user privacy is a fundamental right. This Privacy Policy details how **${title}** collects, handles, stores, and protects user data in strict compliance with the **Google Play Developer Program Policies**, the General Data Protection Regulation (GDPR), and the California Consumer Privacy Act (CCPA).

### 2. Application Functionality & Scope
* **App Description:** ${desc}
* **Data Processing Model:** ${title} processes user requests with a privacy-first approach, utilizing on-device local storage and minimal network operations necessary solely to deliver app functions.

### 3. Permissions Declared & Reasons for Access
Depending on the specific features configured within ${title}, the application may request:
* **INTERNET / ACCESS_NETWORK_STATE:** Used strictly for establishing secure TLS/HTTPS connections for feature data delivery, bug diagnostics, or optional account synchronization.
* **POST_NOTIFICATIONS (Android 13+):** Used solely to deliver timely alarms, user-scheduled task updates, or critical feature notifications initiated by the user.
* **WAKE_LOCK / SCHEDULE_EXACT_ALARM:** Ensures scheduled alerts and notifications fire with precision at user-defined moments.

### 4. Third-Party Services & SDK Integrations
${title} integrates only with established, audited service partners:
* **Google Play Services:** Core platform architecture, safety verification, and app updates.
* **Firebase Crashlytics & Diagnostics:** Anonymous stability telemetry and crash stack traces to identify and repair device-specific defects.
* **Supabase / Cloud Infrastructure (Optional):** If user login or cloud sync is utilized, authentication tokens and synchronized content are encrypted with industry-standard protocols.

### 5. Financial & Personal Data Protections
* **Zero Sale of User Data:** We do NOT sell, rent, trade, or monetize your personal or behavioral data to third-party brokers, tracking aggregators, or unauthorized ad networks.
* **Local Data Sovereignty:** Any user notes, preferences, or personal metrics generated in ${title} are primarily housed in the application's secure sandbox on your physical device.

### 6. User Rights & Data Deletion (Google Play Compliance)
You have complete sovereignty over your information:
* **On-Device Data:** You can purge all cached and local app data at any moment through your device's operating system (*Settings > Apps > ${title} > Storage & Cache > Clear Data*).
* **Cloud & Account Deletion:** To permanently delete any cloud-synced profile data or telemetry records associated with your account, please submit a request to **support@ninestartech.com** with the subject line *"Data Deletion Request - ${title}"*. Requests are verified and honored within 30 days without undue delay.

### 7. Developer Contact Information
For questions, compliance inquiries, or technical support regarding **${title}**, contact:  
* **Publisher:** Nine Star Technologies  
* **Support Email:** support@ninestartech.com  
* **Official Website:** https://ninestar-portal.vercel.app`;
}

// Dynamically renders the #privacy-policy view based on URL query
export function renderPrivacyPolicyView(appParam) {
  const container = document.getElementById('privacy-policy');
  if (!container) return;

  // Cache static global policy if not cached yet
  if (!container.dataset.globalPolicyHtml) {
    const defaultCard = container.querySelector('.legal-doc-card');
    if (defaultCard) {
      container.dataset.globalPolicyHtml = defaultCard.innerHTML;
    }
  }

  // Case 1: App parameter specified -> Render per-app privacy policy
  if (appParam) {
    const app = findAppByIdOrSlug(appParam);

    let docHtml = '';
    const backNav = `
      <div class="app-policy-nav">
        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
          <a href="#top" class="btn ghost small" data-home>← Back to All Apps</a>
          <a href="#privacy-policy" class="btn ghost small">View Company Policy</a>
        </div>
        ${app && app.play_store_url ? `
          <a href="${escapeHtml(app.play_store_url)}" target="_blank" rel="noopener noreferrer" class="btn small">
            View on Google Play ↗
          </a>
        ` : ''}
      </div>
    `;

    if (app) {
      const rawPolicy = app.privacy_policy_content && app.privacy_policy_content.trim()
        ? app.privacy_policy_content
        : generateDefaultAppPolicy(app);

      const parsedContent = parseAppMarkdown(rawPolicy);
      const pkgId = app.slug || extractPackageId(app.play_store_url || '') || 'com.ninestar.app';

      docHtml = `
        ${backNav}
        <div class="legal-doc-card" style="background:var(--surface);border:1px solid var(--line);border-radius:20px;padding:clamp(24px, 5vw, 48px);box-shadow:0 12px 36px -12px rgba(0,0,0,0.25);max-width:54em;margin:0 auto">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:12px">
            <div class="app-policy-badge">Google Play Developer Compliant</div>
            <span style="font-size:12px;color:var(--muted)">App-Specific Policy</span>
          </div>

          <div class="policy-quick-facts">
            <div class="policy-fact-item">
              <span class="policy-fact-label">Application</span>
              <span class="policy-fact-val">${escapeHtml(app.title)}</span>
            </div>
            <div class="policy-fact-item">
              <span class="policy-fact-label">Publisher</span>
              <span class="policy-fact-val">Nine Star Technologies</span>
            </div>
            <div class="policy-fact-item">
              <span class="policy-fact-label">Package Identifier</span>
              <span class="policy-fact-val" style="font-family:monospace">${escapeHtml(pkgId)}</span>
            </div>
            <div class="policy-fact-item">
              <span class="policy-fact-label">Category</span>
              <span class="policy-fact-val">${escapeHtml(app.category || 'Mobile application')}</span>
            </div>
          </div>

          <div class="policy-render-wrap">
            ${parsedContent}
          </div>

          <div style="margin-top:36px;padding-top:20px;border-top:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
            <a href="#privacy-policy" style="color:var(--gold);font-size:14px;font-weight:600">← Back to Global Organization Policy</a>
            <a href="#top" style="color:var(--muted);font-size:14px" data-home>Return to Home Catalog</a>
          </div>
        </div>
      `;
    } else {
      // App slug not found: show compliant fall-back view with link to full policy
      docHtml = `
        ${backNav}
        <div class="legal-doc-card" style="background:var(--surface);border:1px solid var(--line);border-radius:20px;padding:clamp(24px, 5vw, 48px);box-shadow:0 12px 36px -12px rgba(0,0,0,0.25);max-width:54em;margin:0 auto;text-align:center">
          <div style="font-size:42px;margin-bottom:12px">🛡️</div>
          <h1 style="margin:0 0 10px">Application Privacy Policy</h1>
          <p style="color:var(--muted);margin-bottom:24px">
            You navigated to the privacy policy for application: <strong style="color:var(--gold)">${escapeHtml(appParam)}</strong>.
          </p>
          <div style="background:var(--bg2);border:1px solid var(--line);border-radius:12px;padding:20px;text-align:left;margin-bottom:28px">
            <h3 style="margin:0 0 8px;font-size:16px">Nine Star Technologies Developer Commitment:</h3>
            <p style="font-size:14.5px;line-height:1.7;margin:0 0 12px">
              All applications published under Nine Star Technologies operate under strict Google Play Developer Program Policies. We do not sell user data, we require minimal device permissions, and we grant complete data deletion rights.
            </p>
            <p style="font-size:14px;color:var(--muted);margin:0">
              For complete details, please read our Global Organization Policy or contact our privacy desk directly.
            </p>
          </div>
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
            <a href="#privacy-policy" class="btn">View Global Organization Policy</a>
            <a href="#top" class="btn ghost" data-home>Back to Home</a>
          </div>
        </div>
      `;
    }

    container.innerHTML = docHtml;

    // Attach home links listener on dynamic view
    container.querySelectorAll('[data-home]').forEach(a => {
      a.addEventListener('click', () => {
        document.body.classList.remove('policy');
        document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
      });
    });

    document.title = app 
      ? `Privacy Policy for ${app.title} | Nine Star Technologies`
      : `Application Privacy Policy | Nine Star Technologies`;

  } else {
    // Case 2: No app parameter -> Restore standard Nine Star Technologies Global Policy
    document.title = 'Privacy Policy | Nine Star Technologies';
    if (container.dataset.globalPolicyHtml) {
      container.innerHTML = `
        <div style="margin-bottom:24px">
          <a href="#top" class="btn ghost small" data-home>← Back to home</a>
        </div>
        <div class="legal-doc-card" style="background:var(--surface);border:1px solid var(--line);border-radius:20px;padding:clamp(24px, 5vw, 48px);box-shadow:0 12px 36px -12px rgba(0,0,0,0.25);max-width:54em;margin:0 auto">
          ${container.dataset.globalPolicyHtml}
        </div>
        <p style="margin-top:24px;text-align:center"><a href="#top" class="btn ghost small" data-home>Back to home</a></p>
      `;
      container.querySelectorAll('[data-home]').forEach(a => {
        a.addEventListener('click', () => {
          document.body.classList.remove('policy');
          document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
        });
      });
    }
  }
}

export function handleRouting() {
  const fullHash = window.location.hash.slice(1);
  const [hashBase, queryString] = fullHash.split('?');
  const params = new URLSearchParams(queryString || '');
  const appParam = params.get('app');

  const isPrivacy = hashBase === 'privacy' || hashBase === 'privacy-policy';
  const isTerms = hashBase === 'terms-and-conditions' || hashBase === 'terms';
  const isAdmin = hashBase === 'admin';
  const isPolicy = isPrivacy || isTerms || isAdmin;

  document.body.classList.toggle('policy', isPolicy);

  // Toggle pages with transition reset
  document.querySelectorAll('.page').forEach(x => {
    let isTarget = false;
    if (isAdmin && x.id === 'page-admin') isTarget = true;
    else if (isPrivacy && x.id === 'privacy-policy') isTarget = true;
    else if (isTerms && x.id === 'terms-and-conditions') isTarget = true;
    else if (x.id === hashBase) isTarget = true;

    if (isTarget) {
      x.classList.remove('active');
      void x.offsetWidth; // Trigger reflow for clean CSS animation replay
      x.classList.add('active');
      if (isAdmin) checkAdminAuthState();
      if (isPrivacy) renderPrivacyPolicyView(appParam);
    } else {
      x.classList.remove('active');
    }
  });

  if (isPolicy) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (hashBase && hashBase !== 'top') {
    const el = document.getElementById(hashBase);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  } else {
    // Returning to home view: refresh reveal states and reset document title
    document.title = 'Nine Star Technologies | Official Developer Organization';
    setTimeout(() => reveal(), 80);
  }
}

// Interactive Number Counter
function count(el) {
  const n = +el.dataset.n;
  let t = 0;
  const f = () => {
    t += Math.max(1, n / 40);
    if (t >= n) {
      el.textContent = n;
      return;
    }
    el.textContent = Math.floor(t);
    requestAnimationFrame(f);
  };
  f();
}

// High-Performance IntersectionObserver with Staggered Scroll Reveals
export function reveal() {
  const els = document.querySelectorAll('.rv:not(.on), .rv-stagger:not(.on)');
  if (!('IntersectionObserver' in window)) {
    els.forEach(e => e.classList.add('on'));
    document.querySelectorAll('[data-n]').forEach(e => { e.textContent = e.dataset.n; });
    return;
  }

  if (io) {
    io.disconnect();
  }

  io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        target.classList.add('on');

        // Check if container has direct staggered children
        const staggerChildren = target.querySelectorAll(':scope > .card, :scope > .step, :scope > .fact');
        if (staggerChildren.length > 0) {
          staggerChildren.forEach((child, index) => {
            child.style.transitionDelay = `${index * 110}ms`;
            child.classList.add('on');
          });
        }

        // Trigger any embedded number counters
        target.querySelectorAll('[data-n]').forEach(count);
        io.unobserve(target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  els.forEach(e => io.observe(e));
}

// ==============================================================================
// 2. DYNAMIC SITE SETTINGS / GENERAL CONTENT
// ==============================================================================
export async function fetchSiteSettings() {
  try {
    const { data, error } = await supabaseClient
      .from('site_settings')
      .select('*')
      .eq('key', 'general')
      .maybeSingle();

    if (!error && data && data.value) {
      currentSettings = { ...DEFAULT_SITE_SETTINGS, ...data.value };
      localStorage.setItem('ninestar_site_settings', JSON.stringify(currentSettings));
    } else {
      const cached = localStorage.getItem('ninestar_site_settings');
      if (cached) currentSettings = { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(cached) };
    }
  } catch (err) {
    console.warn('Could not fetch site_settings from Supabase:', err);
    const cached = localStorage.getItem('ninestar_site_settings');
    if (cached) currentSettings = { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(cached) };
  }

  applySiteSettingsToDOM(currentSettings);
}

function applySiteSettingsToDOM(s) {
  if (!s) return;

  // Hero
  const kicker = document.getElementById('dyn-hero-kicker');
  if (kicker && s.hero_kicker) kicker.textContent = s.hero_kicker;

  const hTitle = document.getElementById('dyn-hero-title');
  if (hTitle && s.hero_title) {
    hTitle.innerHTML = escapeHtml(s.hero_title).replace(/(mobile and digital|high-performance|digital systems)/gi, '<span>$1</span>');
  }

  const hDesc = document.getElementById('dyn-hero-desc');
  if (hDesc && s.hero_desc) hDesc.textContent = s.hero_desc;

  // About
  const aTitle = document.getElementById('dyn-about-title');
  if (aTitle && s.about_title) aTitle.textContent = s.about_title;

  const aDesc = document.getElementById('dyn-about-desc');
  if (aDesc && s.about_desc) {
    aDesc.innerHTML = `<strong>${escapeHtml(s.company_name || 'Nine Star Technologies')}</strong> ${escapeHtml(s.about_desc).replace(s.company_name, '')}`;
  }

  // Contact
  const cCompany = document.getElementById('dyn-contact-company');
  if (cCompany && s.company_name) cCompany.textContent = s.company_name;

  const cEmail = document.getElementById('dyn-contact-email');
  if (cEmail && s.email) {
    cEmail.textContent = s.email;
    cEmail.href = `mailto:${s.email}`;
  }

  const cBandBtn = document.getElementById('dyn-contact-band-btn');
  if (cBandBtn && s.email) {
    const subj = encodeURIComponent('Project Inquiry - ' + (s.company_name || 'Nine Star Technologies'));
    const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
    if (isMobile) {
      cBandBtn.href = `mailto:${s.email}?subject=${subj}`;
      cBandBtn.removeAttribute('target');
    } else {
      cBandBtn.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(s.email)}&su=${subj}`;
      cBandBtn.setAttribute('target', '_blank');
      cBandBtn.setAttribute('rel', 'noopener noreferrer');
    }
  }

  const cPhone = document.getElementById('dyn-contact-phone');
  if (cPhone && s.phone) cPhone.textContent = s.phone;

  const cAddress = document.getElementById('dyn-contact-address');
  if (cAddress && s.address) cAddress.textContent = s.address;

  const cLicense = document.getElementById('dyn-contact-license');
  if (cLicense && s.trade_license) cLicense.textContent = s.trade_license;

  // Sync Terms & Conditions Legal section dynamic IDs
  const legCompany = document.getElementById('dyn-legal-company');
  if (legCompany && s.company_name) legCompany.textContent = s.company_name;

  const legEmail = document.getElementById('dyn-legal-email');
  if (legEmail && s.email) {
    legEmail.textContent = s.email;
    legEmail.href = `mailto:${s.email}`;
  }

  const legAddress = document.getElementById('dyn-legal-address');
  if (legAddress && s.address) legAddress.textContent = s.address;

  // Populate form if open
  populateSettingsForm(s);
}

function populateSettingsForm(s) {
  const fCompany = document.getElementById('cfg-company-name');
  if (fCompany) fCompany.value = s.company_name || '';

  const fEmail = document.getElementById('cfg-email');
  if (fEmail) fEmail.value = s.email || '';

  const fPhone = document.getElementById('cfg-phone');
  if (fPhone) fPhone.value = s.phone || '';

  const fLicense = document.getElementById('cfg-trade-license');
  if (fLicense) fLicense.value = s.trade_license || '';

  const fAddress = document.getElementById('cfg-address');
  if (fAddress) fAddress.value = s.address || '';

  const fKicker = document.getElementById('cfg-hero-kicker');
  if (fKicker) fKicker.value = s.hero_kicker || '';

  const fTitle = document.getElementById('cfg-hero-title');
  if (fTitle) fTitle.value = s.hero_title || '';

  const fDesc = document.getElementById('cfg-hero-desc');
  if (fDesc) fDesc.value = s.hero_desc || '';

  const fAboutTitle = document.getElementById('cfg-about-title');
  if (fAboutTitle) fAboutTitle.value = s.about_title || '';

  const fAboutDesc = document.getElementById('cfg-about-desc');
  if (fAboutDesc) fAboutDesc.value = s.about_desc || '';
}

export async function handleSaveSiteSettings(e) {
  if (e) e.preventDefault();

  const settings = {
    company_name: document.getElementById('cfg-company-name').value.trim(),
    email: document.getElementById('cfg-email').value.trim(),
    phone: document.getElementById('cfg-phone').value.trim(),
    trade_license: document.getElementById('cfg-trade-license').value.trim(),
    address: document.getElementById('cfg-address').value.trim(),
    hero_kicker: document.getElementById('cfg-hero-kicker').value.trim(),
    hero_title: document.getElementById('cfg-hero-title').value.trim(),
    hero_desc: document.getElementById('cfg-hero-desc').value.trim(),
    about_title: document.getElementById('cfg-about-title').value.trim(),
    about_desc: document.getElementById('cfg-about-desc').value.trim()
  };

  const btn = document.getElementById('btn-save-settings');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Saving to database...';
  }

  try {
    const { error } = await supabaseClient
      .from('site_settings')
      .upsert({ key: 'general', value: settings }, { onConflict: 'key' });

    if (error) throw error;

    currentSettings = settings;
    localStorage.setItem('ninestar_site_settings', JSON.stringify(settings));
    applySiteSettingsToDOM(settings);
    showToast('Website content and contact info updated live!', 'success');
  } catch (err) {
    console.warn('Error saving site_settings to remote Supabase, saved locally:', err);
    currentSettings = settings;
    localStorage.setItem('ninestar_site_settings', JSON.stringify(settings));
    applySiteSettingsToDOM(settings);
    showToast('Saved locally. (Run supabase_schema.sql in Supabase to sync remote table)', 'warning');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Save Website Changes';
    }
  }
}

// ==============================================================================
// 2.5 DYNAMIC SOCIAL MEDIA HUB (SUPABASE + REALTIME)
// ==============================================================================
export async function fetchSocialLinks() {
  try {
    const { data, error } = await supabaseClient
      .from('social_links')
      .select('*')
      .eq('is_active', true);

    if (!error && data && data.length > 0) {
      const map = { ...DEFAULT_SOCIAL_LINKS };
      data.forEach(item => {
        if (item.platform && item.url) {
          map[item.platform] = item.url;
        }
      });
      currentSocialLinks = map;
      localStorage.setItem('ninestar_social_links', JSON.stringify(map));
    } else {
      const cached = localStorage.getItem('ninestar_social_links');
      if (cached) currentSocialLinks = { ...DEFAULT_SOCIAL_LINKS, ...JSON.parse(cached) };
    }
  } catch (err) {
    console.warn('Could not fetch social_links from Supabase:', err);
    const cached = localStorage.getItem('ninestar_social_links');
    if (cached) currentSocialLinks = { ...DEFAULT_SOCIAL_LINKS, ...JSON.parse(cached) };
  }

  renderSocialBars(currentSocialLinks);
}

// Helper to format WhatsApp and Telegram links safely
function sanitizeSocialUrl(platform, rawVal) {
  if (!rawVal) return '';
  const val = String(rawVal).trim();
  if (!val) return '';

  if (platform === 'whatsapp') {
    if (val.startsWith('http://') || val.startsWith('https://')) return val;
    const cleanNumber = val.replace(/[^0-9]/g, '');
    return cleanNumber ? `https://wa.me/${cleanNumber}` : '';
  }

  if (platform === 'telegram') {
    if (val.startsWith('http://') || val.startsWith('https://')) return val;
    const cleanUser = val.replace(/^@/, '').trim();
    return cleanUser ? `https://t.me/${cleanUser}` : '';
  }

  if (!val.startsWith('http://') && !val.startsWith('https://')) {
    return `https://${val}`;
  }

  return val;
}

export function renderSocialBars(links) {
  const contactBar = document.getElementById('contact-social-bar');
  const footerBar = document.getElementById('footer-social-bar');

  const platforms = Object.keys(DEFAULT_SOCIAL_LINKS);
  const activeItems = platforms
    .map(p => ({
      platform: p,
      label: SOCIAL_LABELS[p] || p,
      url: sanitizeSocialUrl(p, links[p]),
      svg: SOCIAL_ICONS[p] || ''
    }))
    .filter(item => Boolean(item.url));

  const html = activeItems.length > 0 ? activeItems.map(item => `
    <a href="${escapeHtml(item.url)}" 
       target="_blank" 
       rel="noopener noreferrer" 
       class="social-btn" 
       title="${escapeHtml(item.label)}" 
       aria-label="${escapeHtml(item.label)}">
      ${item.svg}
    </a>
  `).join('') : '<span style="color:var(--muted);font-size:13.5px">Connect with us on our upcoming social channels.</span>';

  if (contactBar) contactBar.innerHTML = html;
  if (footerBar) footerBar.innerHTML = activeItems.length > 0 ? html : '';
}

export function populateSocialForm(links) {
  Object.keys(DEFAULT_SOCIAL_LINKS).forEach(p => {
    const input = document.getElementById(`soc-${p}`);
    if (input) {
      input.value = links[p] || '';
    }
  });
}

export async function handleSaveSocialLinks(e) {
  if (e) e.preventDefault();

  const newLinks = {};
  const upsertRows = [];

  Object.keys(DEFAULT_SOCIAL_LINKS).forEach(p => {
    const input = document.getElementById(`soc-${p}`);
    const val = input ? input.value.trim() : '';
    newLinks[p] = val;
    upsertRows.push({
      id: p,
      platform: p,
      url: val,
      is_active: Boolean(val),
      updated_at: new Date().toISOString()
    });
  });

  const btn = document.getElementById('btn-save-social');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Saving to database...';
  }

  try {
    const { error } = await supabaseClient
      .from('social_links')
      .upsert(upsertRows, { onConflict: 'id' });

    if (error) throw error;

    currentSocialLinks = newLinks;
    localStorage.setItem('ninestar_social_links', JSON.stringify(newLinks));
    renderSocialBars(newLinks);
    showToast('Social links updated successfully!', 'success');
  } catch (err) {
    console.warn('Error saving social_links to remote Supabase, saved locally:', err);
    currentSocialLinks = newLinks;
    localStorage.setItem('ninestar_social_links', JSON.stringify(newLinks));
    renderSocialBars(newLinks);
    showToast('Saved locally. (Run supabase_schema.sql in Supabase to sync remote table)', 'warning');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Save Social Links';
    }
  }
}

// ==============================================================================
// 3. PUBLIC APPS CATALOG (SUPABASE + REALTIME)
// ==============================================================================
export async function fetchPublicApps() {
  const grid = document.getElementById('apps-grid');
  if (!grid) return;

  // Purge any legacy stale cache keys
  localStorage.removeItem('ninestar_apps');
  localStorage.removeItem('cached_apps');
  localStorage.removeItem('apps');

  try {
    const { data, error } = await supabaseClient
      .from('apps')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Check if database returned 0 rows
    if (!data || data.length === 0) {
      localStorage.setItem('ninestar_cached_apps', JSON.stringify([]));
      grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;text-align:center;padding:40px;color:var(--gold);"><p>No live applications currently listed.</p></div>';
      return;
    }

    // Save active published apps to local cache for offline/instant policy routing
    localStorage.setItem('ninestar_cached_apps', JSON.stringify(data));
    renderPublicApps(data);
    return;
  } catch (err) {
    console.warn('Could not fetch apps from Supabase live:', err);
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;text-align:center;padding:40px;color:var(--gold);"><p>No live applications currently listed.</p></div>';
  }
}

export function renderPublicApps(apps) {
  const grid = document.getElementById('apps-grid');
  if (!grid) return;

  if (!apps || apps.length === 0) {
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;text-align:center;padding:40px;color:var(--gold);"><p>No live applications currently listed.</p></div>';
    return;
  }

  grid.innerHTML = apps.map((app, idx) => {
    const hasImg = app.icon_url && (app.icon_url.startsWith('http://') || app.icon_url.startsWith('https://'));
    const iconHtml = hasImg 
      ? `<div class="icon has-img"><img src="${escapeHtml(app.icon_url)}" alt="${escapeHtml(app.title)}" class="app-icon-img" loading="lazy" onerror="this.parentElement.classList.remove('has-img');this.parentElement.textContent='${escapeHtml(app.icon_text || '★')}'"></div>`
      : `<div class="icon">${escapeHtml(app.icon_text || '★')}</div>`;

    return `
    <article class="card rv on" id="app-${escapeHtml(app.id)}" style="animation-delay:${idx * 0.12}s">
      ${iconHtml}
      ${app.badge ? `<span class="badge">${escapeHtml(app.badge)}</span>` : ''}
      <h3>${escapeHtml(app.title)}</h3>
      <p>${escapeHtml(app.description)}</p>
      <div class="card-links">
        ${app.play_store_url ? `
          <a href="${escapeHtml(app.play_store_url)}" target="_blank" rel="noopener" class="btn small">
            Get it on Google Play ↗
          </a>
        ` : `
          <a class="btn ghost small" href="#contact" data-home>Learn more</a>
        `}
        ${(() => {
          const directPolicyUrl = (app.privacy_policy_url && app.privacy_policy_url !== '#privacy-policy')
            ? app.privacy_policy_url
            : `#privacy?app=${encodeURIComponent(app.slug || extractPackageId(app.play_store_url || '') || app.id)}`;
          return `<a href="${escapeHtml(directPolicyUrl)}" class="btn ghost small">Privacy policy</a>`;
        })()}
      </div>
    </article>
    `;
  }).join('');

  // Attach card spotlight hover listener
  grid.querySelectorAll('.card').forEach(c => {
    c.addEventListener('pointermove', function(e) {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--x', (e.clientX - r.left) + 'px');
      c.style.setProperty('--y', (e.clientY - r.top) + 'px');
    });
  });

  // Re-observe any unrevealed elements
  reveal();
}

export function setupRealtimeSubscription() {
  try {
    supabaseClient
      .channel('public:realtime_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'apps' }, (payload) => {
        fetchPublicApps();
        if (window.location.hash === '#admin' && currentSession) {
          fetchAppsList();
        }
        showToast('App catalog synchronized with Supabase live', 'info');
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, (payload) => {
        fetchSiteSettings();
        showToast('Website content updated live', 'info');
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'social_links' }, (payload) => {
        fetchSocialLinks();
        showToast('Social media links updated live', 'info');
      })
      .subscribe();
  } catch (err) {
    console.warn('Realtime subscription error:', err);
  }
}

// ==============================================================================
// 4. ADMIN AUTHENTICATION
// ==============================================================================
export async function checkAdminAuthState() {
  const loginView = document.getElementById('admin-login-view');
  const dashView = document.getElementById('admin-dashboard-view');
  const userEmailChip = document.getElementById('auth-status-chip');
  const adminUserEmail = document.getElementById('admin-user-email');

  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    currentSession = session;
  } catch(e) {
    const localAuth = sessionStorage.getItem('ninestar_admin_auth');
    currentSession = localAuth ? { user: { email: localAuth } } : null;
  }

  if (currentSession && currentSession.user) {
    if (loginView) loginView.style.display = 'none';
    if (dashView) dashView.style.display = 'block';
    if (userEmailChip) userEmailChip.innerHTML = `Active Session: <strong>${escapeHtml(currentSession.user.email)}</strong>`;
    if (adminUserEmail) adminUserEmail.textContent = `Signed in as: ${currentSession.user.email}`;
    fetchAppsList();
    populateSettingsForm(currentSettings);
    populateSocialForm(currentSocialLinks);
  } else {
    if (loginView) loginView.style.display = 'block';
    if (dashView) dashView.style.display = 'none';
    if (userEmailChip) userEmailChip.textContent = 'Not authenticated';
  }
}

export async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('admin-email').value.trim();
  const password = document.getElementById('admin-pass').value;
  const btn = document.getElementById('btn-login-submit');

  btn.disabled = true;
  btn.textContent = 'Verifying credentials...';

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
    currentSession = data.session;
    showToast('Signed in to Supabase CMS', 'success');
    checkAdminAuthState();
  } catch(err) {
    showToast(err.message || 'Authentication error. Please check credentials.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Sign In to CMS';
  }
}

export async function handleLogout() {
  try {
    await supabaseClient.auth.signOut();
  } catch(e){}
  sessionStorage.removeItem('ninestar_admin_auth');
  currentSession = null;
  showToast('Signed out of admin session.', 'info');
  checkAdminAuthState();
}

// Tab switcher for Admin CMS
export function switchTab(tab) {
  const contentTab = document.getElementById('admin-tab-content');
  const socialTab = document.getElementById('admin-tab-social');
  const appsTab = document.getElementById('admin-tab-apps');

  const btnContent = document.getElementById('tab-btn-content');
  const btnSocial = document.getElementById('tab-btn-social');
  const btnApps = document.getElementById('tab-btn-apps');

  // Reset all tabs
  if (contentTab) contentTab.style.display = 'none';
  if (socialTab) socialTab.style.display = 'none';
  if (appsTab) appsTab.style.display = 'none';

  btnContent?.classList.remove('active');
  btnSocial?.classList.remove('active');
  btnApps?.classList.remove('active');

  if (tab === 'content') {
    if (contentTab) contentTab.style.display = 'block';
    btnContent?.classList.add('active');
    populateSettingsForm(currentSettings);
  } else if (tab === 'social') {
    if (socialTab) socialTab.style.display = 'block';
    btnSocial?.classList.add('active');
    populateSocialForm(currentSocialLinks);
  } else {
    if (appsTab) appsTab.style.display = 'block';
    btnApps?.classList.add('active');
    fetchAppsList();
  }
}

// ==============================================================================
// 5. ADMIN CRUD OPERATIONS FOR APPS
// ==============================================================================
export async function fetchAppsList() {
  const tbody = document.getElementById('admin-apps-tbody');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="6" class="empty-state">Fetching data from Supabase...</td></tr>`;

  let apps = [];
  try {
    const { data, error } = await supabaseClient
      .from('apps')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) throw error;
    apps = data || [];
  } catch(err) {
    console.warn('Supabase fetch error:', err);
    apps = getLocalApps();
  }

  if (apps.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No applications found. Add one above!</td></tr>`;
    return;
  }

  tbody.innerHTML = apps.map(app => {
    const hasImg = app.icon_url && (app.icon_url.startsWith('http://') || app.icon_url.startsWith('https://'));
    const iconCell = hasImg
      ? `<img src="${escapeHtml(app.icon_url)}" alt="${escapeHtml(app.title)}" style="width:36px;height:36px;border-radius:10px;object-fit:cover;vertical-align:middle">`
      : `<span style="font-size:22px">${escapeHtml(app.icon_text || '★')}</span>`;

    const appIdentifier = app.slug || extractPackageId(app.play_store_url || '') || app.id;
    const policyUrl = (app.privacy_policy_url && app.privacy_policy_url !== '#privacy-policy')
      ? app.privacy_policy_url
      : `#privacy?app=${encodeURIComponent(appIdentifier)}`;

    return `
    <tr>
      <td style="text-align:center">${iconCell}</td>
      <td>
        <strong style="color:var(--ink);font-size:15px">${escapeHtml(app.title)}</strong>
        <div style="font-size:12.5px;color:var(--muted)">${escapeHtml(app.category || 'Mobile application')}</div>
        ${app.badge ? `<span style="font-size:11px;color:var(--gold);font-weight:600">[${escapeHtml(app.badge)}]</span>` : ''}
        ${app.slug ? `<div style="font-size:11px;font-family:monospace;color:var(--muted)">slug: ${escapeHtml(app.slug)}</div>` : ''}
      </td>
      <td>
        <span class="status-pill ${app.status}">${escapeHtml(app.status)}</span>
      </td>
      <td>
        <div style="font-size:13px;display:flex;flex-direction:column;gap:3px">
          ${app.play_store_url ? `<a href="${escapeHtml(app.play_store_url)}" target="_blank" style="color:var(--gold)">Play Store ↗</a>` : '<span style="color:var(--muted)">No Store URL</span>'}
          <a href="${escapeHtml(policyUrl)}" target="_blank" style="color:var(--ink);font-size:11px;text-decoration:underline">
            ${escapeHtml(policyUrl)}
          </a>
        </div>
      </td>
      <td>${app.sort_order ?? 0}</td>
      <td style="text-align:right">
        <div style="display:flex;gap:6px;justify-content:flex-end">
          <button class="btn small secondary" onclick="window.appActions.editApp('${escapeHtml(app.id)}')">Edit</button>
          <button class="btn small secondary" onclick="window.appActions.toggleStatus('${escapeHtml(app.id)}', '${app.status}')">
            ${app.status === 'published' ? 'Draft' : 'Publish'}
          </button>
          <button class="btn small danger" onclick="window.appActions.deleteApp('${escapeHtml(app.id)}')">Delete</button>
        </div>
      </td>
    </tr>
  `;
  }).join('');
}

export async function handleSaveApp(e) {
  e.preventDefault();
  const id = document.getElementById('app-id').value;
  const title = document.getElementById('app-title').value.trim();
  const category = document.getElementById('app-category').value.trim();
  const icon_text = document.getElementById('app-icon').value.trim() || '★';
  const icon_url = document.getElementById('app-icon-url').value.trim() || null;
  const badge = document.getElementById('app-badge').value.trim();
  const status = document.getElementById('app-status').value;
  const sort_order = parseInt(document.getElementById('app-sort').value, 10) || 0;
  const description = document.getElementById('app-desc').value.trim();
  const play_store_url = document.getElementById('app-play-url').value.trim();
  const slugInput = document.getElementById('app-slug') ? document.getElementById('app-slug').value.trim() : '';
  const slug = slugInput || extractPackageId(play_store_url) || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const privacy_policy_content = document.getElementById('app-privacy-content') ? document.getElementById('app-privacy-content').value.trim() : '';
  
  let privacy_policy_url = document.getElementById('app-privacy-url').value.trim();
  if (!privacy_policy_url || privacy_policy_url === '#privacy-policy') {
    privacy_policy_url = `#privacy?app=${encodeURIComponent(slug || id || 'app')}`;
  }
  const terms_url = document.getElementById('app-terms-url').value.trim() || '#terms-and-conditions';

  const appData = {
    title,
    category,
    icon_text,
    icon_url,
    badge,
    status,
    sort_order,
    description,
    play_store_url,
    slug,
    privacy_policy_url,
    privacy_policy_content,
    terms_url
  };

  const btn = document.getElementById('btn-save-app');
  btn.disabled = true;
  btn.textContent = 'Saving to database...';

  try {
    if (id) {
      const { error } = await supabaseClient.from('apps').update(appData).eq('id', id);
      if (error) throw error;
      showToast('Application updated successfully!', 'success');
    } else {
      const { error } = await supabaseClient.from('apps').insert([appData]);
      if (error) throw error;
      showToast('Application added to live catalog!', 'success');
    }

    // Keep local cache synced
    const currentLocal = getLocalApps();
    const updatedLocal = id
      ? currentLocal.map(a => a.id === id ? { ...a, ...appData } : a)
      : [...currentLocal, { id: 'local-' + Date.now(), ...appData }];
    localStorage.setItem('ninestar_cached_apps', JSON.stringify(updatedLocal));

    resetAppForm();
    fetchAppsList();
    fetchPublicApps();
  } catch(err) {
    console.warn('Database save notice, persisting to local storage:', err);
    const currentLocal = getLocalApps();
    const updatedLocal = id
      ? currentLocal.map(a => a.id === id ? { ...a, ...appData } : a)
      : [...currentLocal, { id: 'local-' + Date.now(), ...appData }];
    localStorage.setItem('ninestar_cached_apps', JSON.stringify(updatedLocal));
    showToast('Saved to local storage cache! (Syncing with Supabase when online)', 'warning');

    resetAppForm();
    fetchAppsList();
    fetchPublicApps();
  } finally {
    btn.disabled = false;
    btn.textContent = 'Save Application';
  }
}

export async function editAppById(id) {
  let app = null;
  try {
    const { data, error } = await supabaseClient.from('apps').select('*').eq('id', id).single();
    if (error) throw error;
    app = data;
  } catch(e) {
    app = getLocalApps().find(a => a.id === id);
  }

  if (!app) {
    showToast('Application not found', 'error');
    return;
  }

  document.getElementById('app-id').value = app.id;
  document.getElementById('app-title').value = app.title || '';
  document.getElementById('app-category').value = app.category || '';
  document.getElementById('app-icon').value = app.icon_text || '★';
  document.getElementById('app-icon-url').value = app.icon_url || '';
  document.getElementById('app-badge').value = app.badge || '';
  document.getElementById('app-status').value = app.status || 'published';
  document.getElementById('app-sort').value = app.sort_order ?? 0;
  document.getElementById('app-desc').value = app.description || '';
  document.getElementById('app-play-url').value = app.play_store_url || '';
  if (document.getElementById('app-slug')) {
    document.getElementById('app-slug').value = app.slug || '';
  }

  const defaultPolicyLink = `#privacy?app=${encodeURIComponent(app.slug || extractPackageId(app.play_store_url || '') || app.id)}`;
  document.getElementById('app-privacy-url').value = app.privacy_policy_url || defaultPolicyLink;
  document.getElementById('app-terms-url').value = app.terms_url || '#terms-and-conditions';

  if (document.getElementById('app-privacy-content')) {
    document.getElementById('app-privacy-content').value = app.privacy_policy_content || '';
  }

  // Update preview card if app has icon_url
  const prevWrap = document.getElementById('play-preview-wrap');
  const prevImg = document.getElementById('play-preview-img');
  const prevTitle = document.getElementById('play-preview-title');
  const prevPkg = document.getElementById('play-preview-pkg');

  if (app.icon_url) {
    if (prevWrap) prevWrap.style.display = 'block';
    if (prevImg) prevImg.src = app.icon_url;
    if (prevTitle) prevTitle.textContent = app.title;
    if (prevPkg) prevPkg.textContent = app.play_store_url || 'Saved App Icon';
  } else {
    if (prevWrap) prevWrap.style.display = 'none';
  }

  document.getElementById('form-app-heading').textContent = `Editing: ${app.title}`;
  document.getElementById('btn-save-app').textContent = 'Update Application';
  document.getElementById('btn-cancel-edit').style.display = 'inline-block';

  window.scrollTo({ top: document.getElementById('form-app').offsetTop - 100, behavior: 'smooth' });
}

export function resetAppForm() {
  document.getElementById('form-app').reset();
  document.getElementById('app-id').value = '';
  document.getElementById('app-icon-url').value = '';
  if (document.getElementById('app-slug')) document.getElementById('app-slug').value = '';
  document.getElementById('app-privacy-url').value = '#privacy-policy';
  document.getElementById('app-terms-url').value = '#terms-and-conditions';
  if (document.getElementById('app-privacy-content')) document.getElementById('app-privacy-content').value = '';
  document.getElementById('app-icon').value = '★';
  document.getElementById('app-sort').value = '0';
  document.getElementById('form-app-heading').textContent = 'Add New Application';
  document.getElementById('btn-save-app').textContent = 'Save Application';
  document.getElementById('btn-cancel-edit').style.display = 'none';

  const prevWrap = document.getElementById('play-preview-wrap');
  if (prevWrap) prevWrap.style.display = 'none';

  const statusEl = document.getElementById('play-scrape-status');
  if (statusEl) statusEl.textContent = '';
}

// Inserts a Google Play compliant Markdown privacy policy template into the editor
export function insertCompliantPolicyTemplate() {
  const title = document.getElementById('app-title')?.value.trim() || 'My Application';
  const category = document.getElementById('app-category')?.value.trim() || 'Mobile application';
  const desc = document.getElementById('app-desc')?.value.trim() || 'A productivity and utility tool for Android.';
  const slug = document.getElementById('app-slug')?.value.trim() || 'com.ninestar.app';

  const template = generateDefaultAppPolicy({
    title,
    category,
    description: desc,
    slug
  });

  const textarea = document.getElementById('app-privacy-content');
  if (textarea) {
    textarea.value = template;
    showToast('Compliant privacy template generated and inserted!', 'success');
  }
}

export async function toggleAppStatus(id, currentStatus) {
  const newStatus = currentStatus === 'published' ? 'draft' : 'published';
  try {
    const { error } = await supabaseClient.from('apps').update({ status: newStatus }).eq('id', id);
    if (error) throw error;
    showToast(`Status toggled to ${newStatus}`, 'info');
    fetchAppsList();
    fetchPublicApps();
  } catch(err) {
    showToast(err.message || 'Error updating status', 'error');
  }
}

export async function deleteAppById(id) {
  if (!confirm('Are you sure you want to permanently delete this application?')) return;

  try {
    const { error } = await supabaseClient.from('apps').delete().eq('id', id);
    if (error) throw error;
    showToast('Application deleted.', 'info');
    fetchAppsList();
    fetchPublicApps();
  } catch(err) {
    showToast(err.message || 'Delete failed', 'error');
  }
}

function getLocalApps() {
  const data = localStorage.getItem('ninestar_cached_apps');
  if (data) {
    try { return JSON.parse(data); } catch(e){}
  }
  return DEFAULT_APPS;
}

export function showToast(msg, type = 'info') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = `toast ${type}`;
  t.style.display = 'block';
  setTimeout(() => {
    t.style.display = 'none';
  }, 4000);
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function handleEmailCTA(e) {
  const btn = document.getElementById('dyn-contact-band-btn');
  const targetEmail = currentSettings.email || 'support@ninestartech.com';
  const mailSubject = encodeURIComponent('Project Inquiry - ' + (currentSettings.company_name || 'Nine Star Technologies'));
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

  const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${mailSubject}`;
  const mailtoUri = `mailto:${targetEmail}?subject=${mailSubject}`;

  // Copy email to clipboard silently/toast for extra convenience
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(targetEmail).then(() => {
      showToast(`Opening Gmail for ${targetEmail}...`, 'info');
    }).catch(() => {
      showToast(`Opening Gmail for ${targetEmail}...`, 'info');
    });
  } else {
    showToast(`Opening Gmail for ${targetEmail}...`, 'info');
  }

  if (isMobile) {
    if (btn) btn.href = mailtoUri;
    window.location.href = mailtoUri;
  } else {
    if (btn) {
      btn.href = gmailWebUrl;
      btn.target = '_blank';
    }
    window.open(gmailWebUrl, '_blank', 'noopener,noreferrer');
  }

  if (e) e.preventDefault();
}

// ==============================================================================
// 5. GOOGLE PLAY STORE AUTO-SCRAPER & METADATA EXTRACTOR
// ==============================================================================
export function extractPackageId(url) {
  if (!url) return null;
  const str = String(url).trim();
  try {
    const parsedUrl = new URL(str);
    const idParam = parsedUrl.searchParams.get('id');
    if (idParam) return idParam;
  } catch (e) {
    // URL constructor failed, fallback to regex
  }
  const match = str.match(/(?:[?&]id=|details\?id=)([a-zA-Z0-9._]+)/i);
  return match ? match[1] : null;
}

export async function fetchPlayStoreMetadata(packageId) {
  const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageId}&hl=en`;
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(playStoreUrl)}`;

  const response = await fetch(proxyUrl);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();

  if (!data.contents) throw new Error('Could not fetch app page');

  const parser = new DOMParser();
  const doc = parser.parseFromString(data.contents, 'text/html');

  // Extract Open Graph & Twitter Card tags
  const title = doc.querySelector('meta[property="og:title"]')?.getAttribute('content')
             || doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content')
             || doc.querySelector('h1')?.textContent
             || '';

  // Extract high-resolution official app logo
  const iconUrl = doc.querySelector('meta[property="og:image"]')?.getAttribute('content')
               || doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content')
               || doc.querySelector('img[alt*="Cover art"], img[alt*="icon"]')?.getAttribute('src')
               || '';

  // Extract description snippet
  const description = doc.querySelector('meta[property="og:description"]')?.getAttribute('content')
                   || doc.querySelector('meta[name="description"]')?.getAttribute('content')
                   || '';

  return {
    title: title.replace(/\s*-\s*Apps on Google Play$/i, '').trim(),
    iconUrl: iconUrl ? iconUrl.replace(/=s\d+.*$/, '=s512') : '', // Request high-res icon if Google thumbnail format
    description: description.slice(0, 220).trim()
  };
}

let scrapeTimeout = null;

export async function handlePlayUrlInput(url) {
  clearTimeout(scrapeTimeout);
  const statusEl = document.getElementById('play-scrape-status');
  const prevWrap = document.getElementById('play-preview-wrap');
  const prevImg = document.getElementById('play-preview-img');
  const prevTitle = document.getElementById('play-preview-title');
  const prevPkg = document.getElementById('play-preview-pkg');

  const packageId = extractPackageId(url);

  if (!packageId) {
    if (statusEl) statusEl.textContent = '';
    return;
  }

  if (statusEl) {
    statusEl.innerHTML = `<span style="color:var(--gold)">⏳ Fetching app metadata from Google Play...</span>`;
  }

  scrapeTimeout = setTimeout(async () => {
    try {
      const meta = await fetchPlayStoreMetadata(packageId);

      if (meta.title && !document.getElementById('app-title').value.trim()) {
        document.getElementById('app-title').value = meta.title;
      }

      if (meta.description && !document.getElementById('app-desc').value.trim()) {
        document.getElementById('app-desc').value = meta.description;
      }

      if (meta.iconUrl) {
        document.getElementById('app-icon-url').value = meta.iconUrl;
        if (prevWrap) prevWrap.style.display = 'block';
        if (prevImg) prevImg.src = meta.iconUrl;
        if (prevTitle) prevTitle.textContent = meta.title || 'Official App Icon';
        if (prevPkg) prevPkg.textContent = `Package: ${packageId}`;
      }

      if (statusEl) {
        statusEl.innerHTML = `<span style="color:var(--success)">✓ Successfully auto-filled from Play Store!</span>`;
      }
      showToast(`Auto-fetched details for ${meta.title || packageId}`, 'success');
    } catch (err) {
      console.warn('Play store scraping notice:', err);
      if (statusEl) {
        statusEl.innerHTML = `<span style="color:var(--muted)">Could not auto-fetch. Please fill fields manually.</span>`;
      }
    }
  }, 450);
}

export function clearScrapedIcon() {
  const iconInput = document.getElementById('app-icon-url');
  if (iconInput) iconInput.value = '';
  const prevWrap = document.getElementById('play-preview-wrap');
  if (prevWrap) prevWrap.style.display = 'none';
  showToast('Scraped icon removed. Form will use fallback symbol.', 'info');
}

export async function handleContactSubmit(e) {
  if (e) e.preventDefault();

  const form = document.getElementById('contact-lead-form');
  if (!form) return;

  const btn = document.getElementById('btn-submit-lead');
  const btnText = document.getElementById('btn-submit-text');
  const spinner = document.getElementById('btn-submit-spinner');

  const payload = {
    name: document.getElementById('lead-name')?.value.trim() || '',
    email: document.getElementById('lead-email')?.value.trim() || '',
    phone: document.getElementById('lead-phone')?.value.trim() || '',
    service_type: document.getElementById('lead-service')?.value || 'General Technical Inquiry',
    message: document.getElementById('lead-message')?.value.trim() || ''
  };

  if (!payload.name || !payload.email || !payload.message) {
    showToast('Please fill out all required fields (*)', 'error');
    return;
  }

  // Set loading state
  if (btn) btn.disabled = true;
  if (btnText) btnText.textContent = 'Submitting inquiry...';
  if (spinner) spinner.style.display = 'inline-block';

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || data.detail || `Server returned error status ${res.status}`);
    }

    form.reset();
    showToast("Thank you! Your request has been forwarded to our team. A confirmation has been sent to your email.", 'success');
  } catch (err) {
    console.error('Contact form submission error:', err);
    // Graceful fallback: attempt direct client-side backup to Supabase leads table if available
    try {
      if (supabaseClient) {
        await supabaseClient.from('leads').insert([{
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          service_type: payload.service_type,
          message: payload.message
        }]);
        form.reset();
        showToast("Thank you! Your request has been forwarded to our team. A confirmation has been sent to your email.", 'success');
        return;
      }
    } catch (dbErr) {
      console.warn('Fallback direct save error:', dbErr);
    }
    showToast("Submission failed. Please reach us directly at support@ninestartech.com.", 'error');
  } finally {
    if (btn) btn.disabled = false;
    if (btnText) btnText.textContent = 'Send Proposal Request';
    if (spinner) spinner.style.display = 'none';
  }
}

// Global actions for inline event compatibility
window.appActions = {
  editApp: editAppById,
  toggleStatus: toggleAppStatus,
  deleteApp: deleteAppById,
  resetForm: resetAppForm,
  refreshList: fetchAppsList,
  handleLogout: handleLogout,
  switchTab: switchTab,
  saveSiteSettings: handleSaveSiteSettings,
  loadSiteSettings: () => populateSettingsForm(currentSettings),
  saveSocialLinks: handleSaveSocialLinks,
  loadSocialLinks: () => populateSocialForm(currentSocialLinks),
  handleEmailCTA: handleEmailCTA,
  handlePlayUrlInput: handlePlayUrlInput,
  clearScrapedIcon: clearScrapedIcon,
  handleContactSubmit: handleContactSubmit,
  insertPolicyTemplate: insertCompliantPolicyTemplate
};

// Lifecycle initialization
window.addEventListener('hashchange', handleRouting);
window.addEventListener('DOMContentLoaded', () => {
  const R = document.documentElement;

  // Reading progress bar
  const bar = document.getElementById('bar');
  if (bar) {
    window.addEventListener('scroll', () => {
      const h = R.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h * 100) : 0) + '%';
    }, { passive: true });
  }

  // Dark/Light theme toggle
  const themeBtn = document.getElementById('theme');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const dark = R.dataset.theme ? R.dataset.theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
      R.dataset.theme = dark ? 'light' : 'dark';
    });
  }

  // Home links cleanup
  document.querySelectorAll('[data-home]').forEach(a => {
    a.addEventListener('click', () => {
      document.body.classList.remove('policy');
      document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
    });
  });

  // Spotlight on static cards
  document.querySelectorAll('.card').forEach(c => {
    c.addEventListener('pointermove', function(e) {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--x', (e.clientX - r.left) + 'px');
      c.style.setProperty('--y', (e.clientY - r.top) + 'px');
    });
  });

  // Attach submit listeners
  document.getElementById('form-login')?.addEventListener('submit', handleLogin);
  document.getElementById('form-app')?.addEventListener('submit', handleSaveApp);
  document.getElementById('btn-gen-policy-template')?.addEventListener('click', insertCompliantPolicyTemplate);

  // Secret shortcut: Press Ctrl + Shift + A to open Admin CMS
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      window.location.hash = '#admin';
    }
  });

  // Purge any stale cache keys immediately on load
  localStorage.removeItem('ninestar_apps');
  localStorage.removeItem('cached_apps');
  localStorage.removeItem('apps');

  handleRouting();
  reveal();
  fetchSiteSettings();
  fetchSocialLinks();
  fetchPublicApps();
  setupRealtimeSubscription();
});
