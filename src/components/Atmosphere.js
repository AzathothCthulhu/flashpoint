import gsap from 'gsap';
import { EventBus } from '../engine/eventBus.js';
import { POOL_DEFS } from '../engine/pools.js';
import { EVENTS } from '../engine/events.js';

// ── Threat level → CSS class ───────────────────────────────────────────────
function tensionClass(threatScore) {
  if (threatScore < 25) return '';
  if (threatScore < 50) return 'tension-elevated';
  if (threatScore < 75) return 'tension-critical';
  return 'tension-severe';
}

function calcThreat(pools) {
  const timePct = pools['TIME'] / 100;
  const capPct  = pools['CAPACITY'] / 100;
  const repPct  = (pools['REPUTATION'] + 50) / 100;
  const regPct  = (pools['REGULATORY_STANDING'] + 50) / 100;
  const iqPct   = pools['INTELLIGENCE_QUALITY'] / 100;
  const health  = timePct * 0.15 + capPct * 0.2 + repPct * 0.25 + regPct * 0.25 + iqPct * 0.15;
  return Math.round((1 - health) * 100);
}

// ── Pool danger threshold ──────────────────────────────────────────────────
function isPoolDangerous(pool, value) {
  const pct = (value - pool.min) / (pool.max - pool.min);
  return pool.inverted ? pct > 0.75 : pct < 0.25;
}

export function Atmosphere() {
  // Insert ambient vignette
  const vignette = document.createElement('div');
  vignette.className = 'fp-vignette';
  document.body.insertBefore(vignette, document.body.firstChild);

  // Day flash overlay
  const flashOverlay = document.createElement('div');
  flashOverlay.className = 'fp-day-flash-overlay';
  document.body.appendChild(flashOverlay);

  // ── Tension header ────────────────────────────────────────────────────────
  function updateTension(pools) {
    const score = calcThreat(pools);
    const cls   = tensionClass(score);
    const header = document.querySelector('.fp-header');
    if (!header) return;
    header.classList.remove('tension-elevated', 'tension-critical', 'tension-severe');
    if (cls) header.classList.add(cls);
  }

  // ── Pool danger glow ──────────────────────────────────────────────────────
  function updatePoolDanger(pools) {
    POOL_DEFS.forEach(def => {
      const el  = document.getElementById(`pool-${def.id.replace(/\./g, '_')}`);
      if (!el) return;
      const val = pools[def.id] ?? def.start;
      if (isPoolDangerous(def, val)) {
        el.classList.add('danger');
      } else {
        el.classList.remove('danger');
      }
    });
  }

  // ── Act body class ────────────────────────────────────────────────────────
  function updateActClass(day) {
    document.body.classList.remove('act-2', 'act-3');
    if (day >= 15) document.body.classList.add('act-3');
    else if (day >= 8) document.body.classList.add('act-2');
  }

  // ── Gate due-today highlight ──────────────────────────────────────────────
  function updateGateDueToday(day, decisions) {
    document.querySelectorAll('.fp-gate-card').forEach(card => {
      const gId = card.id.replace('gate-', '');
      card.classList.remove('due-today');
    });
    // Find gates due today that are not yet committed
    document.querySelectorAll('.fp-gate-card.active').forEach(card => {
      const dayTag = card.querySelector('.fp-gate-day-tag');
      if (dayTag && dayTag.textContent === `Day ${day}`) {
        card.classList.add('due-today');
      }
    });
  }

  // ── Ending tracker tension tint ───────────────────────────────────────────
  function updateEndingTint(prob) {
    const endingBar = document.querySelector('.fp-ending-bar');
    if (!endingBar) return;
    if (prob && prob.C >= 50) {
      endingBar.classList.add('high-c');
    } else {
      endingBar.classList.remove('high-c');
    }
  }

  // ── Advance button shimmer when all ready ─────────────────────────────────
  function updateAdvanceBtn(roleReady) {
    const btn   = document.getElementById('fp-btn-next');
    if (!btn) return;
    const allReady = Object.values(roleReady).every(Boolean);
    if (allReady) {
      btn.classList.add('all-ready');
    } else {
      btn.classList.remove('all-ready');
    }
  }

  // ── Event toast ───────────────────────────────────────────────────────────
  function showEventToast(ev) {
    const toast = document.createElement('div');
    toast.className = 'fp-event-toast';
    toast.innerHTML = `
      <div class="fp-event-toast-label">Scenario Event — Day ${ev.day}</div>
      <div class="fp-event-toast-text">${ev.desc.substring(0, 120)}</div>`;
    document.body.appendChild(toast);
    gsap.timeline()
      .to(toast, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' })
      .to(toast, { opacity: 0, x: 10, duration: 0.35, ease: 'power2.in',
                   delay: 3.5, onComplete: () => toast.remove() });
  }

  // ── Day advance flash ─────────────────────────────────────────────────────
  function flashDay() {
    gsap.timeline()
      .to(flashOverlay, { opacity: 1, duration: 0.12 })
      .to(flashOverlay, { opacity: 0, duration: 0.7, ease: 'power2.out' });
  }

  // ── Pool item row flash (green up / red down) ─────────────────────────────
  EventBus.on('pool:changed', ({ pool, delta }) => {
    const el = document.getElementById(`pool-${pool.replace(/\./g, '_')}`);
    if (!el || delta === 0) return;
    const cls = delta > 0 ? 'flash-up' : 'flash-down';
    el.classList.remove('flash-up', 'flash-down');
    void el.offsetWidth; // reflow to restart animation
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), 1050);
  });

  // ── State change handler ──────────────────────────────────────────────────
  EventBus.on('state:changed', ({ state: s, reason }) => {
    if (reason === 'TOGGLE_ACTION') return;
    updateTension(s.pools);
    updatePoolDanger(s.pools);
    updateAdvanceBtn(s.roleReady);
    if (reason !== 'SWITCH_ROLE') {
      updateActClass(s.day);
      updateGateDueToday(s.day, s.decisions);
    }
  });

  // ── Day advance flash ─────────────────────────────────────────────────────
  EventBus.on('day:advanced', ({ day }) => {
    flashDay();
    updateActClass(day);
  });

  // ── Cascade triggered ─────────────────────────────────────────────────────
  EventBus.on('cascade:triggered', ({ rule }) => {
    // Brief red vignette intensification
    gsap.timeline()
      .to(vignette, { opacity: 2, duration: 0.3 })
      .to(vignette, { opacity: 1, duration: 1.5, ease: 'power2.out' });
  });

  // ── Scenario events toast ─────────────────────────────────────────────────
  EventBus.on('event:fired', ({ event: ev }) => {
    if (ev.overnight) return; // overnight events fire silently
    showEventToast(ev);
  });

  // ── Ending probability tint ────────────────────────────────────────────────
  EventBus.on('state:changed', ({ state: s }) => {
    const prob = (() => {
      // Quick inline estimate — same weights as calcEndingProbability
      const d = s.decisions;
      let sA = 0, sC = 0;
      ['G1','G5','G10','G13'].forEach(g => { sA += d[g] === 'A' ? 15 : -5; });
      ['G5','G6','G8','G9','G10'].forEach(g => { if (d[g] === 'C') sC += 20; });
      sA = Math.max(5, Math.min(sA, 85));
      sC = Math.max(5, Math.min(sC, 85));
      const sB = Math.max(10, 100 - sA - sC);
      const t  = sA + sB + sC;
      return { C: Math.round(sC / t * 100) };
    })();
    updateEndingTint(prob);
  });
}
