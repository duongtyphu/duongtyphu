/* ════════════════════════════════════════════════════════════
   SUPABASE CONFIG — VDAI Academy
   Điền thông tin sau khi tạo project tại https://supabase.com
════════════════════════════════════════════════════════════ */
const SUPABASE_URL  = 'https://uosxpxolsvwcafxvnroy.supabase.co';
const SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvc3hweG9sc3Z3Y2FmeHZucm95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1Mjk4MTgsImV4cCI6MjA5NzEwNTgxOH0.2fGXDEAYYFc5uxLnU1Ep4dvqkTmd0CLydLhDRpydVNE';

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
