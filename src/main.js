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

let supabaseClient = supabase;
let currentSession = null;
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
// 2. PUBLIC APPS CATALOG (SUPABASE + REALTIME)
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
    console.warn('Could not fetch from Supabase, using local defaults:', err);
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

  grid.innerHTML = apps.map(app => `
    <article class="card rv on" id="app-${escapeHtml(app.id)}">
      <div class="icon">${escapeHtml(app.icon_text || '★')}</div>
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
  `).join('');

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
      .channel('public:apps')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'apps' }, (payload) => {
        console.log('Realtime update received:', payload);
        fetchPublicApps();
        if (window.location.hash === '#admin' && currentSession) {
          fetchAppsList();
        }
        showToast('App catalog synchronized with Supabase live', 'info');
      })
      .subscribe();
  } catch (err) {
    console.warn('Realtime subscription error:', err);
  }
}

// ==============================================================================
// 3. ADMIN AUTHENTICATION
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

// ==============================================================================
// 4. ADMIN CRUD OPERATIONS
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

  tbody.innerHTML = apps.map(app => `
    <tr>
      <td style="font-size:22px;text-align:center">${escapeHtml(app.icon_text || '★')}</td>
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
  `).join('');
}

export async function handleSaveApp(e) {
  e.preventDefault();
  const id = document.getElementById('app-id').value;
  const title = document.getElementById('app-title').value.trim();
  const category = document.getElementById('app-category').value.trim();
  const icon_text = document.getElementById('app-icon').value.trim() || '★';
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
  document.getElementById('app-badge').value = app.badge || '';
  document.getElementById('app-status').value = app.status || 'published';
  document.getElementById('app-sort').value = app.sort_order ?? 0;
  document.getElementById('app-desc').value = app.description || '';
  document.getElementById('app-play-url').value = app.play_store_url || '';
  document.getElementById('app-privacy-url').value = app.privacy_policy_url || '#privacy-policy';
  document.getElementById('app-terms-url').value = app.terms_url || '#terms-and-conditions';

  document.getElementById('form-app-heading').textContent = `Editing: ${app.title}`;
  document.getElementById('btn-save-app').textContent = 'Update Application';
  document.getElementById('btn-cancel-edit').style.display = 'inline-block';

  window.scrollTo({ top: document.getElementById('form-app').offsetTop - 100, behavior: 'smooth' });
}

export function resetAppForm() {
  document.getElementById('form-app').reset();
  document.getElementById('app-id').value = '';
  document.getElementById('app-privacy-url').value = '#privacy-policy';
  document.getElementById('app-terms-url').value = '#terms-and-conditions';
  document.getElementById('app-icon').value = '★';
  document.getElementById('app-sort').value = '0';
  document.getElementById('form-app-heading').textContent = 'Add New Application';
  document.getElementById('btn-save-app').textContent = 'Save Application';
  document.getElementById('btn-cancel-edit').style.display = 'none';
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

// Global actions for inline event compatibility
window.appActions = {
  editApp: editAppById,
  toggleStatus: toggleAppStatus,
  deleteApp: deleteAppById,
  resetForm: resetAppForm,
  refreshList: fetchAppsList,
  handleLogout: handleLogout
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
  fetchPublicApps();
  setupRealtimeSubscription();
});
