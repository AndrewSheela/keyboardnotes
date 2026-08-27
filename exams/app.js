/* ═══════════════════════════════════════════
   app.js — Bootstrap & Event Wiring (Firebase)
═══════════════════════════════════════════ */

// Add loading overlay helpers to Utils
Utils.showLoadingOverlay = function(msg = 'Loading…') {
  let el = document.getElementById('loading-overlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'loading-overlay';
    el.className = 'loading-overlay';
    el.innerHTML = `<div class="spinner"></div><p id="loading-overlay-msg"></p>`;
    document.body.appendChild(el);
  }
  document.getElementById('loading-overlay-msg').textContent = msg;
  el.style.display = 'flex';
};
Utils.hideLoadingOverlay = function() {
  const el = document.getElementById('loading-overlay');
  if (el) el.style.display = 'none';
};

// ── BOOTSTRAP ───────────────────────────────
// Note: DOM is already ready by the time this runs (scripts load dynamically after page load)
(async () => {

  document.getElementById('loading-msg').textContent = 'Connecting to Firebase…';

  try {
    // Seed sample data (only runs if DB is empty)
    await DB.seed();
    document.getElementById('loading-msg').textContent = 'Ready!';
  } catch(e) {
    document.getElementById('loading-msg').textContent = 'Connection error — check Firebase rules.';
    console.error('Firebase seed error:', e);
  }

  // Check existing session (page refresh)
  const user = Auth.current();
  if (user) {
    if (user.role === 'teacher') enterTeacher();
    else enterStudent(user);
  } else {
    Utils.showScreen('screen-login');
  }

  // ── LOGIN ─────────────────────────────────
  let loginRole = 'student';

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loginRole = btn.dataset.role;
      document.getElementById('login-hint').innerHTML =
        loginRole === 'student'
          ? 'Students: enter your username &amp; password'
          : 'Teacher: <b>andrew</b> / 156251';
      document.getElementById('login-error').classList.add('hidden');
    });
  });

  document.getElementById('login-btn').addEventListener('click', doLogin);
  document.getElementById('login-password').addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  });
  document.getElementById('login-username').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('login-password').focus();
  });

  async function doLogin() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const errEl    = document.getElementById('login-error');
    const btn      = document.getElementById('login-btn');

    if (!username || !password) {
      errEl.textContent = 'Please enter username and password.';
      errEl.classList.remove('hidden');
      return;
    }

    btn.textContent = 'Signing in…';
    btn.disabled    = true;

    try {
      const result = await Auth.login(username, password, loginRole);
      btn.textContent = 'Sign In';
      btn.disabled    = false;

      if (!result.ok) {
        errEl.textContent = result.msg;
        errEl.classList.remove('hidden');
        return;
      }

      errEl.classList.add('hidden');
      document.getElementById('login-password').value = '';

      if (result.user.role === 'teacher') enterTeacher();
      else enterStudent(result.user);

    } catch(e) {
      btn.textContent = 'Sign In';
      btn.disabled    = false;
      errEl.textContent = 'Login failed: ' + e.message;
      errEl.classList.remove('hidden');
    }
  }

  function enterTeacher() {
    Utils.showScreen('screen-teacher');
    TeacherViews.show('t-dashboard');
  }

  function enterStudent(user) {
    document.getElementById('student-name-tag').textContent = '🎓 ' + (user.name || user.username);
    Utils.showScreen('screen-student');
    StudentViews.show('s-dashboard');
  }

  // ── LOGOUTS ──────────────────────────────
  document.getElementById('student-logout').addEventListener('click', async () => {
    await Auth.logout();
    Utils.showScreen('screen-login');
    document.getElementById('login-username').value = '';
  });

  document.getElementById('teacher-logout').addEventListener('click', async () => {
    await Auth.logout();
    Utils.showScreen('screen-login');
    document.getElementById('login-username').value = '';
  });

  // ── SIDEBAR NAV ──────────────────────────
  document.getElementById('student-sidebar').addEventListener('click', e => {
    const item = e.target.closest('.nav-item');
    if (item?.dataset.view) StudentViews.show(item.dataset.view);
  });

  document.getElementById('teacher-sidebar').addEventListener('click', e => {
    const item = e.target.closest('.nav-item');
    if (item?.dataset.view) TeacherViews.show(item.dataset.view);
  });

  // ── EXAM NAVIGATION ──────────────────────
  document.getElementById('exam-next').addEventListener('click', () => ExamEngine.next());
  document.getElementById('exam-prev').addEventListener('click', () => ExamEngine.prev());

  // ── MODAL ────────────────────────────────
  document.getElementById('modal-close').addEventListener('click', Utils.closeModal);
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) Utils.closeModal();
  });

  // ── KEYBOARD ─────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') Utils.closeModal();
  });

  // Also patch QTypes.saveQuestion to be async-aware
  QTypes.saveQuestion = async function(existingId) {
    const q = QTypes.collectQuestion(existingId);
    if (!q) return;
    const savedId = await DB.Questions.save(q);
    // Update cache
    if (window._allQs) {
      const idx = window._allQs.findIndex(x => x.id === savedId);
      const saved = { ...q, id: savedId };
      if (idx >= 0) window._allQs[idx] = saved;
      else window._allQs.push(saved);
    }
    Utils.closeModal();
    Utils.toast('Question saved!','success');
    TeacherViews.refresh();
  };

})();
