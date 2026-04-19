import gsap from 'gsap';
import { dispatch, getState, serializeState } from '../engine/state.js';
import { EventBus } from '../engine/eventBus.js';

const ACT_DAYS = { 'Act 1 Start': 1, 'Act 2 (D8)': 8, 'Act 3 (D15)': 15, 'Day 21': 21 };

export function Facilitator() {
  const panel = document.createElement('div');
  panel.className = 'fp-facilitator-panel';
  panel.id = 'fp-facilitator-panel';
  panel.innerHTML = `
    <div class="fp-fac-header">
      <span class="fp-fac-title">⚙ FACILITATOR</span>
      <button class="fp-btn fp-fac-close" id="fp-fac-close">✕</button>
    </div>
    <div class="fp-fac-body">

      <div class="fp-fac-section">
        <div class="fp-fac-section-label">Quick Advance</div>
        <div class="fp-fac-btn-row" id="fp-fac-act-btns">
          <button class="fp-btn fp-fac-act-btn" data-day="8">→ Act 2</button>
          <button class="fp-btn fp-fac-act-btn" data-day="15">→ Act 3</button>
          <button class="fp-btn fp-fac-act-btn" data-day="21">→ Day 21</button>
        </div>
        <div style="display:flex;gap:var(--sp-2);margin-top:var(--sp-2)">
          <input type="number" id="fp-fac-day-input" class="fp-fac-input" min="1" max="21"
            placeholder="Day #" style="width:70px">
          <button class="fp-btn fp-btn-primary" id="fp-fac-day-go">Go</button>
        </div>
      </div>

      <div class="fp-fac-section">
        <div class="fp-fac-section-label">Role Controls</div>
        <div class="fp-fac-btn-row">
          <button class="fp-btn" id="fp-fac-all-ready">✓ All Ready</button>
        </div>
      </div>

      <div class="fp-fac-section">
        <div class="fp-fac-section-label">Commit All Gates</div>
        <div class="fp-fac-btn-row">
          <button class="fp-btn" id="fp-fac-commit-a" style="color:var(--green);border-color:rgba(63,185,80,0.4)">All A</button>
          <button class="fp-btn" id="fp-fac-commit-b" style="color:var(--yellow);border-color:rgba(210,153,34,0.4)">All B</button>
          <button class="fp-btn" id="fp-fac-commit-c" style="color:var(--red);border-color:rgba(248,81,73,0.4)">All C</button>
        </div>
      </div>

      <div class="fp-fac-section">
        <div class="fp-fac-section-label">Session</div>
        <div class="fp-fac-btn-row">
          <button class="fp-btn" id="fp-fac-save">💾 Save</button>
          <button class="fp-btn" id="fp-fac-load">⬆ Load</button>
          <button class="fp-btn fp-btn-danger" id="fp-fac-clear">✕ Clear</button>
        </div>
        <div style="font-size:9px;color:var(--text-dim);margin-top:var(--sp-1)" id="fp-fac-save-info"></div>
      </div>

      <div class="fp-fac-section">
        <div class="fp-fac-section-label">State</div>
        <div id="fp-fac-state-summary" class="fp-fac-state-summary"></div>
      </div>

    </div>`;

  document.body.appendChild(panel);

  // ── Helpers ─────────────────────────────────────────────────────────────
  function updateSaveInfo() {
    const raw = localStorage.getItem('fp-autosave');
    const el  = panel.querySelector('#fp-fac-save-info');
    if (!el) return;
    if (raw) {
      try {
        const s = JSON.parse(raw);
        const d = new Date(s._savedAt || 0);
        el.textContent = `Saved: Day ${s.day} — ${d.toLocaleTimeString()}`;
      } catch { el.textContent = 'Save data found'; }
    } else {
      el.textContent = 'No save data';
    }
  }

  function updateStateSummary() {
    const s   = getState();
    const el  = panel.querySelector('#fp-fac-state-summary');
    if (!el) return;
    const committed = Object.keys(s.decisions).length;
    const ready     = Object.values(s.roleReady).filter(Boolean).length;
    el.innerHTML = `
      <div>Day: <strong>${s.day}</strong> / 21</div>
      <div>Gates committed: <strong>${committed}</strong> / 13</div>
      <div>Roles ready: <strong>${ready}</strong> / 5</div>
      <div>Cascades: <strong>${[...s.firedEvents].filter(id => id.startsWith('cascade-')).length}</strong></div>`;
  }

  function advanceToDay(target) {
    const s = getState();
    if (target <= s.day) return;
    let iterations = target - s.day;
    const tick = () => {
      if (iterations <= 0) return;
      dispatch({ type: 'NEXT_DAY' });
      iterations--;
      // Use rAF to keep UI responsive during multi-advance
      if (iterations > 0) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ── Wire controls ────────────────────────────────────────────────────────
  panel.querySelector('#fp-fac-close').addEventListener('click', close);

  panel.querySelectorAll('.fp-fac-act-btn').forEach(btn => {
    btn.addEventListener('click', () => advanceToDay(parseInt(btn.dataset.day)));
  });

  panel.querySelector('#fp-fac-day-go').addEventListener('click', () => {
    const val = parseInt(panel.querySelector('#fp-fac-day-input').value);
    if (val >= 1 && val <= 21) advanceToDay(val);
  });

  panel.querySelector('#fp-fac-all-ready').addEventListener('click', () => {
    dispatch({ type: 'MARK_ALL_READY' });
  });

  ['a','b','c'].forEach(ch => {
    panel.querySelector(`#fp-fac-commit-${ch}`).addEventListener('click', () => {
      if (!confirm(`Commit all uncommitted gates as choice ${ch.toUpperCase()}?`)) return;
      dispatch({ type: 'COMMIT_ALL', choice: ch.toUpperCase() });
    });
  });

  panel.querySelector('#fp-fac-save').addEventListener('click', () => {
    const raw = serializeState();
    const obj = JSON.parse(raw);
    obj._savedAt = Date.now();
    localStorage.setItem('fp-autosave', JSON.stringify(obj));
    updateSaveInfo();
    gsap.fromTo(panel.querySelector('#fp-fac-save'), { scale: 0.95 }, { scale: 1, duration: 0.2, ease: 'back.out(2)' });
  });

  panel.querySelector('#fp-fac-load').addEventListener('click', () => {
    const raw = localStorage.getItem('fp-autosave');
    if (!raw) return alert('No saved session found.');
    if (!confirm('Restore saved session? Current progress will be overwritten.')) return;
    const s = JSON.parse(raw);
    dispatch({ type: 'RESTORE', snapshot: s });
  });

  panel.querySelector('#fp-fac-clear').addEventListener('click', () => {
    if (!confirm('Delete saved session?')) return;
    localStorage.removeItem('fp-autosave');
    updateSaveInfo();
  });

  // ── State sync ───────────────────────────────────────────────────────────
  EventBus.on('state:changed', () => {
    if (_isOpen) updateStateSummary();
  });

  // ── Open / Close ─────────────────────────────────────────────────────────
  let _isOpen = false;

  function open() {
    _isOpen = true;
    updateSaveInfo();
    updateStateSummary();
    panel.classList.add('open');
    gsap.from(panel, { x: 20, opacity: 0, duration: 0.3, ease: 'power2.out' });
  }

  function close() {
    _isOpen = false;
    panel.classList.remove('open');
  }

  function toggle() {
    _isOpen ? close() : open();
  }

  return { open, close, toggle };
}
