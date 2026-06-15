/* ════════════════════════════════════════════════════════════
   SUPABASE CONFIG — VDAI Academy
   Điền thông tin sau khi tạo project tại https://supabase.com
════════════════════════════════════════════════════════════ */
const SUPABASE_URL  = 'https://uosxpxolsvwcafxvnroy.supabase.co';
const SUPABASE_KEY  = 'sb_publishable_6QdMtBcfIzBNMJeag2cOEw_wCwsec-9';

// Khởi tạo client — dùng CDN supabase-js
const _supabase = (typeof supabase !== 'undefined')
  ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

async function getSession() {
  if (!_supabase) return null;
  const { data: { session } } = await _supabase.auth.getSession();
  return session;
}

async function signUp(email, password, metadata = {}) {
  const { data, error } = await _supabase.auth.signUp({
    email, password,
    options: { data: metadata }
  });
  return { data, error };
}

async function signIn(email, password) {
  const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

async function signOut() {
  await _supabase.auth.signOut();
  window.location.href = '/login.html';
}

async function requireAuth(redirectTo = '/login.html') {
  const session = await getSession();
  if (!session) {
    window.location.href = redirectTo + '?next=' + encodeURIComponent(window.location.pathname);
    return null;
  }
  return session;
}
