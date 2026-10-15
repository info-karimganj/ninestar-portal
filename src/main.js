import './style.css';
import { supabase } from './supabase.js';

// Default seed apps in case remote database is syncing
const DEFAULT_APPS = [
  {
    id: 'seed-1',
    title: 'StarPulse Productivity',
    category: 'Mobile application',
    description: 'A minimalist task and habit orchestration suite designed for high-focus professionals with offline sync and cloud backup.',
    icon_text: '★',
    badge: 'Mobile application',
    play_store_url: 'https://play.google.com/store/apps/details?id=com.ninestar.starpulse',
    privacy_policy_url: '#privacy-policy',
    terms_url: '#terms-and-conditions',
    status: 'published',
    sort_order: 1
  },
  {
    id: 'seed-2',
    title: 'Zenith Habit Tracker',
    category: 'Mobile application',
    description: 'Behavioral science tracker assisting users in building lasting habits with micro-journaling and ambient audio.',
    icon_text: '✦',
    badge: 'Mobile application',
    play_store_url: 'https://play.google.com/store/apps/details?id=com.ninestar.zenith',
    privacy_policy_url: '#privacy-policy',
    terms_url: '#terms-and-conditions',
    status: 'published',
    sort_order: 2
  },
  {
    id: 'seed-3',
    title: 'Custom Enterprise Suite',
    category: 'Enterprise and client solutions',
    description: 'Tailored software, API development, and web platforms built around client workflows and modern digital infrastructure.',
    icon_text: 'E',
    badge: 'Enterprise & Client Solutions',
    play_store_url: '',
    privacy_policy_url: '#privacy-policy',
    terms_url: '#terms-and-conditions',
    status: 'published',
    sort_order: 3
  }
];

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
let io = null;

// ==============================================================================
// 1. ROUTING & UI INTERACTIONS
// ==============================================================================
export function handleRouting() {
  const hash = window.location.hash.slice(1);
  const isPolicy = hash === 'privacy-policy' || hash === 'terms-and-conditions' || hash === 'admin';
  document.body.classList.toggle('policy', isPolicy);

  // Toggle pages
  document.querySelectorAll('.page').forEach(x => {
    if (hash === 'admin' && x.id === 'page-admin') {
      x.classList.add('active');
      checkAdminAuthState();
    } else {
      x.classList.toggle('active', x.id === hash);
    }
  });

  if (isPolicy) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (hash && hash !== 'top') {
    const el = document.getElementById(hash);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50);
    }
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

// Intersection Observer Reveal
export function reveal() {
  const els = document.querySelectorAll('.rv:not(.on)');
  if (!('IntersectionObserver' in window)) {
    els.forEach(e => e.classList.add('on'));
    document.querySelectorAll('[data-n]').forEach(e => { e.textContent = e.dataset.n; });
    return;
  }
  io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('on');
        entry.target.querySelectorAll('[data-n]').forEach(count);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
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

  try {
    const { data, error } = await supabaseClient
      .from('apps')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (data && data.length > 0) {
      renderPublicApps(data);
      return;
    }
  } catch (err) {
    console.warn('Could not fetch apps from Supabase, using local defaults:', err);
  }

  const local = getLocalApps().filter(a => a.status === 'published');
  renderPublicApps(local);
}

export function renderPublicApps(apps) {
  const grid = document.getElementById('apps-grid');
  if (!grid) return;

  if (!apps || apps.length === 0) {
    grid.innerHTML = `
      <article class="card rv on" style="grid-column:1/-1;text-align:center;padding:48px 24px">
        <div class="icon" style="margin:0 auto 16px">★</div>
        <h3>Software Catalog Updating</h3>
        <p>Our engineering team is currently deploying our latest Google Play builds. Please check back shortly.</p>
      </article>
    `;
    return;
  }

  grid.innerHTML = apps.map(app => {
    const hasImg = app.icon_url && (app.icon_url.startsWith('http://') || app.icon_url.startsWith('https://'));
    const iconHtml = hasImg 
      ? `<div class="icon has-img"><img src="${escapeHtml(app.icon_url)}" alt="${escapeHtml(app.title)}" class="app-icon-img" loading="lazy" onerror="this.parentElement.classList.remove('has-img');this.parentElement.textContent='${escapeHtml(app.icon_text || '★')}'"></div>`
      : `<div class="icon">${escapeHtml(app.icon_text || '★')}</div>`;

    return `
    <article class="card rv on" id="app-${escapeHtml(app.id)}">
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
        ${app.privacy_policy_url ? `
          <a href="${escapeHtml(app.privacy_policy_url)}" class="btn ghost small">Privacy policy</a>
        ` : ''}
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

    return `
    <tr>
      <td style="text-align:center">${iconCell}</td>
      <td>
        <strong style="color:var(--ink);font-size:15px">${escapeHtml(app.title)}</strong>
        <div style="font-size:12.5px;color:var(--muted)">${escapeHtml(app.category || 'Mobile application')}</div>
        ${app.badge ? `<span style="font-size:11px;color:var(--gold);font-weight:600">[${escapeHtml(app.badge)}]</span>` : ''}
      </td>
      <td>
        <span class="status-pill ${app.status}">${escapeHtml(app.status)}</span>
      </td>
      <td>
        <div style="font-size:13px;display:flex;flex-direction:column;gap:3px">
          ${app.play_store_url ? `<a href="${escapeHtml(app.play_store_url)}" target="_blank" style="color:var(--gold)">Play Store ↗</a>` : '<span style="color:var(--muted)">No Store URL</span>'}
          <span style="color:var(--muted);font-size:11px">${escapeHtml(app.privacy_policy_url || '#privacy-policy')}</span>
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
  const privacy_policy_url = document.getElementById('app-privacy-url').value.trim() || '#privacy-policy';
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
    privacy_policy_url,
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

    resetAppForm();
    fetchAppsList();
    fetchPublicApps();
  } catch(err) {
    showToast(err.message || 'Error saving application', 'error');
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
  document.getElementById('app-privacy-url').value = app.privacy_policy_url || '#privacy-policy';
  document.getElementById('app-terms-url').value = app.terms_url || '#terms-and-conditions';

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
  document.getElementById('app-privacy-url').value = '#privacy-policy';
  document.getElementById('app-terms-url').value = '#terms-and-conditions';
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
  clearScrapedIcon: clearScrapedIcon
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

  // Secret shortcut: Press Ctrl + Shift + A to open Admin CMS
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      window.location.hash = '#admin';
    }
  });

  handleRouting();
  reveal();
  fetchSiteSettings();
  fetchSocialLinks();
  fetchPublicApps();
  setupRealtimeSubscription();
});
