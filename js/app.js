/* ============================================
   Teachable Machine — Year 7 Unit
   Main JavaScript (no frameworks, offline)
   ============================================ */

(function () {
  'use strict';

  /* ---- Constants ---- */
  var TOTAL_LESSONS = 6;
  var LS_PREFIX = 'tm7_';

  /* ---- Helpers ---- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  function lsGet(key) {
    try { return localStorage.getItem(LS_PREFIX + key); } catch (e) { return null; }
  }
  function lsSet(key, val) {
    try { localStorage.setItem(LS_PREFIX + key, val); } catch (e) { /* ignore */ }
  }
  function lsRemove(key) {
    try { localStorage.removeItem(LS_PREFIX + key); } catch (e) { /* ignore */ }
  }
  function lsKeysForLesson(n) {
    var keys = [];
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(LS_PREFIX + 'L' + n + '_') === 0) {
          keys.push(k);
        }
      }
    } catch (e) { /* ignore */ }
    return keys;
  }

  /* ---- Mobile sidebar toggle ---- */
  function initSidebar() {
    var toggle = $('.menu-toggle');
    var sidebar = $('.sidebar');
    var overlay = $('.sidebar-overlay');
    if (!toggle || !sidebar) return;

    function open() {
      sidebar.classList.add('open');
      if (overlay) overlay.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
    }
    function close() {
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      sidebar.classList.contains('open') ? close() : open();
    });
    if (overlay) overlay.addEventListener('click', close);
  }

  /* ---- Teacher / Student mode ---- */
  function initModeToggle() {
    var checkbox = $('#mode-checkbox');
    if (!checkbox) return;

    var saved = lsGet('teacherMode');
    if (saved === 'true') {
      checkbox.checked = true;
      document.body.classList.add('teacher-mode');
    }

    checkbox.addEventListener('change', function () {
      if (this.checked) {
        document.body.classList.add('teacher-mode');
        lsSet('teacherMode', 'true');
      } else {
        document.body.classList.remove('teacher-mode');
        lsSet('teacherMode', 'false');
      }
    });
  }

  /* ---- Progress tracker ---- */
  function isLessonDone(n) {
    return lsGet('lesson' + n + '_done') === 'true';
  }
  function setLessonDone(n, done) {
    lsSet('lesson' + n + '_done', done ? 'true' : 'false');
  }

  function updateProgressBar() {
    var completed = 0;
    for (var i = 1; i <= TOTAL_LESSONS; i++) {
      if (isLessonDone(i)) completed++;
    }
    var pct = Math.round((completed / TOTAL_LESSONS) * 100);

    // Mini progress bar in header
    var fill = $('.progress-bar-mini .fill');
    if (fill) fill.style.width = pct + '%';

    // Progress text
    var txt = $('.progress-text');
    if (txt) txt.textContent = completed + '/' + TOTAL_LESSONS;

    // Sidebar check marks
    for (var j = 1; j <= TOTAL_LESSONS; j++) {
      var link = $('.sidebar-nav a[data-lesson="' + j + '"]');
      if (link) {
        var check = link.querySelector('.check');
        if (isLessonDone(j)) {
          if (!check) {
            check = document.createElement('span');
            check.className = 'check';
            check.textContent = '✓';
            check.setAttribute('aria-label', 'completed');
            link.appendChild(check);
          }
        } else if (check) {
          check.remove();
        }
      }
    }

    // Home page progress cards
    $$('.progress-card').forEach(function (card) {
      var num = parseInt(card.getAttribute('data-lesson'), 10);
      var icon = card.querySelector('.status-icon');
      if (isLessonDone(num)) {
        card.classList.add('done');
        if (icon) icon.textContent = '✓ Done';
      } else {
        card.classList.remove('done');
        if (icon) icon.textContent = '○ To do';
      }
    });
  }

  /* ---- "Mark as Done" button on lesson pages ---- */
  function initDoneButton() {
    var btn = $('.btn-done');
    if (!btn) return;
    var lessonNum = parseInt(btn.getAttribute('data-lesson'), 10);
    if (!lessonNum) return;

    function render() {
      if (isLessonDone(lessonNum)) {
        btn.textContent = '✓ Lesson Complete!';
        btn.classList.add('completed');
      } else {
        btn.textContent = '☐ Mark Lesson as Done';
        btn.classList.remove('completed');
      }
    }

    render();
    btn.addEventListener('click', function () {
      var nowDone = !isLessonDone(lessonNum);
      setLessonDone(lessonNum, nowDone);
      render();
      updateProgressBar();
    });
  }

  /* ---- Reset lesson button ---- */
  function initResetButton() {
    var btn = $('.btn-reset-lesson');
    if (!btn) return;
    var lessonNum = parseInt(btn.getAttribute('data-lesson'), 10);
    if (!lessonNum) return;

    btn.addEventListener('click', function () {
      if (!confirm('Reset all your saved work for Lesson ' + lessonNum + '? This cannot be undone.')) return;

      // Remove all keys for this lesson
      var keys = lsKeysForLesson(lessonNum);
      keys.forEach(function (k) {
        try { localStorage.removeItem(k); } catch (e) { /* ignore */ }
      });
      // Also remove the done flag
      lsRemove('lesson' + lessonNum + '_done');

      // Clear all inputs on page
      $$('[data-save]').forEach(function (el) {
        if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
          el.value = '';
        }
      });

      updateProgressBar();
      var doneBtn = $('.btn-done');
      if (doneBtn) {
        doneBtn.classList.remove('completed');
        doneBtn.textContent = '☐ Mark Lesson as Done';
      }

      alert('Lesson ' + lessonNum + ' has been reset.');
    });
  }

  /* ---- Auto-save inputs to localStorage ---- */
  function initAutoSave() {
    $$('[data-save]').forEach(function (el) {
      var key = el.getAttribute('data-save');
      if (!key) return;

      // Restore saved value
      var saved = lsGet(key);
      if (saved !== null) {
        el.value = saved;
      }

      // Save on change
      var handler = function () {
        lsSet(key, el.value);
      };
      el.addEventListener('input', handler);
      el.addEventListener('change', handler);
    });
  }

  /* ---- Active nav link highlighting ---- */
  function highlightActiveNav() {
    var path = window.location.pathname;
    // Normalise: get filename
    var parts = path.split('/');
    var file = parts[parts.length - 1] || 'index.html';
    var dir = parts.length > 1 ? parts[parts.length - 2] : '';

    $$('.sidebar-nav a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href) return;
      // Build a comparable string
      var hrefParts = href.replace(/^\.\.\//, '').replace(/^\.\//, '').split('/');
      var hrefFile = hrefParts[hrefParts.length - 1] || 'index.html';
      var hrefDir = hrefParts.length > 1 ? hrefParts[hrefParts.length - 2] : '';

      if (hrefFile === file && hrefDir === dir) {
        a.classList.add('active');
      }
    });
  }

  /* ---- Init ---- */
  function init() {
    initSidebar();
    initModeToggle();
    updateProgressBar();
    initDoneButton();
    initResetButton();
    initAutoSave();
    highlightActiveNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
