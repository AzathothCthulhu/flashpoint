import gsap from 'gsap';
import { getState } from '../engine/state.js';
import { EventBus } from '../engine/eventBus.js';
import { POOL_DEFS } from '../engine/pools.js';
import { GATES } from '../engine/gates.js';
import { activeEscalations } from '../engine/warroom.js';
import { AP_BUDGETS, ROLES } from '../engine/fm.js';

const ROLE_COLORS = {
  CISO:'var(--col-ciso)', CFO:'var(--col-cfo)', Legal:'var(--col-legal)',
  Comms:'var(--col-comms)', CEO:'var(--col-ceo)',
  HR:'#7dd3c8', Board:'#b3b3b3',
};

const ROLE_BG = {
  CISO:'rgba(255,123,114,0.15)', CFO:'rgba(121,192,255,0.15)',
  Legal:'rgba(188,140,255,0.15)', Comms:'rgba(86,211,100,0.15)',
  CEO:'rgba(255,166,87,0.15)',
  DEFAULT:'rgba(88,166,255,0.15)',
};

// ── Threat score 0–100 (higher = worse) ───────────────────────────────────────
function calcThreat(pools) {
  const timePct  = pools['TIME'] / 100;
  const capPct   = pools['CAPACITY'] / 100;
  const repPct   = (pools['REPUTATION'] + 50) / 100;
  const regPct   = (pools['REGULATORY_STANDING'] + 50) / 100;
  const iqPct    = pools['INTELLIGENCE_QUALITY'] / 100;
  const health   = timePct * 0.15 + capPct * 0.2 + repPct * 0.25 + regPct * 0.25 + iqPct * 0.15;
  return Math.round((1 - health) * 100);
}

function threatLabel(score) {
  if (score < 25) return { word: 'STABLE',   color: 'var(--green)'  };
  if (score < 50) return { word: 'ELEVATED', color: 'var(--yellow)' };
  if (score < 75) return { word: 'CRITICAL', color: 'var(--accent)' };
  return           { word: 'SEVERE',   color: 'var(--red)'   };
}

// ── Pool trend from last N log entries per pool ────────────────────────────────
function poolTrend(log, poolId, n = 5) {
  const entries = log.filter(e => e.pool === poolId).slice(0, n);
  const sum     = entries.reduce((acc, e) => acc + e.delta, 0);
  if (sum > 0)  return { arrow: '↑', color: 'var(--green)' };
  if (sum < 0)  return { arrow: '↓', color: 'var(--red)'   };
  return               { arrow: '→', color: 'var(--text-muted)' };
}

// ── Pending / overdue gates ────────────────────────────────────────────────────
function pendingGates(decisions, day) {
  return GATES
    .filter(g => !decisions[g.id])
    .sort((a, b) => a.day - b.day);
}

// ── Section builders ──────────────────────────────────────────────────────────

function renderThreatGauge(pools, el) {
  const score = calcThreat(pools);
  const tl    = threatLabel(score);
  el.innerHTML = `
    <span class="fp-threat-label">Threat Level</span>
    <div class="fp-threat-track">
      <div class="fp-threat-fill" style="width:${score}%;background:${tl.color}"></div>
    </div>
    <span class="fp-threat-value" style="color:${tl.color}">${score}</span>
    <span class="fp-threat-word" style="color:${tl.color}">${tl.word}</span>`;
}

function renderReadiness(roleReady, roleAPSpent, el) {
  el.innerHTML = ROLES.map(r => {
    const ready  = roleReady[r];
    const spent  = roleAPSpent[r];
    const budget = AP_BUDGETS[r];
    const col    = ROLE_COLORS[r] || 'var(--text-muted)';
    return `<div class="fp-wr-role-cell ${ready ? 'ready' : ''}">
      <div class="fp-wr-role-name" style="color:${col}">${r}</div>
      <div class="fp-wr-role-ap">${spent}/${budget} AP</div>
      <div class="fp-wr-role-status" style="color:${ready ? 'var(--green)' : 'var(--text-dim)'}">
        ${ready ? '✓ READY' : 'PENDING'}
      </div>
    </div>`;
  }).join('');
}

function renderSharedPools(pools, log, el) {
  const shared = POOL_DEFS.filter(p => p.tier === 'shared');
  el.innerHTML = `
    <div class="fp-wr-section-title">Shared Pools</div>
    <div class="fp-wr-pool-grid">
      ${shared.map(p => {
        const val  = pools[p.id] ?? 0;
        const pct  = Math.max(0, Math.min(100, ((val - p.min) / (p.max - p.min)) * 100));
        const col  = pct > 60 ? 'var(--green)' : (pct > 35 ? 'var(--yellow)' : 'var(--red)');
        const tr   = poolTrend(log, p.id);
        const disp = p.min < 0 ? (val >= 0 ? `+${Math.round(val)}` : `${Math.round(val)}`) : Math.round(val);
        return `<div class="fp-wr-pool-cell">
          <div class="fp-wr-pool-name" title="${p.name}">${p.name.substring(0, 14)}</div>
          <div class="fp-wr-pool-val" style="color:${col}">${disp}</div>
          <div class="fp-wr-pool-trend" style="color:${tr.color}">${tr.arrow}</div>
          <div class="fp-wr-pool-bar">
            <div class="fp-wr-pool-bar-fill" style="width:${pct}%;background:${col}"></div>
          </div>
        </div>`;
      }).join('')}
    </div>`;
}

function renderEscalations(escs, el) {
  if (escs.length === 0) {
    el.innerHTML = `
      <div class="fp-wr-section-title">Escalations</div>
      <div class="fp-empty" style="padding:var(--sp-3) 0">No active escalations.</div>`;
    return;
  }
  const cards = escs.map(e => {
    const urgCol = e.urgency === 'high' ? 'var(--red)'
      : (e.urgency === 'medium' ? 'var(--yellow)' : 'var(--accent-2)');
    const bgCol  = e.urgency === 'high' ? 'var(--red-dim)'
      : (e.urgency === 'medium' ? 'var(--yellow-dim)' : 'var(--accent-2-dim)');
    const bdCol  = e.urgency === 'high' ? 'rgba(248,81,73,0.3)'
      : (e.urgency === 'medium' ? 'rgba(210,153,34,0.3)' : 'rgba(88,166,255,0.25)');
    return `<div class="fp-esc-card" style="background:${bgCol};border-color:${bdCol}">
      <div class="fp-esc-card-header">
        <span class="fp-esc-icon">${e.icon}</span>
        <span class="fp-esc-title" style="color:${urgCol}">${e.title}</span>
        <span class="fp-esc-urgency-badge" style="background:${bgCol};color:${urgCol};border:1px solid ${bdCol}">
          ${e.urgency.toUpperCase()}
        </span>
      </div>
      <div class="fp-esc-body">
        ${e.desc}
        <div class="fp-esc-path">${e.from} → ${e.to}</div>
      </div>
    </div>`;
  }).join('');
  el.innerHTML = `<div class="fp-wr-section-title">Escalations (${escs.length})</div>${cards}`;
}

function renderPendingGates(decisions, day, el) {
  const pending = pendingGates(decisions, day);
  if (pending.length === 0) {
    el.innerHTML = `
      <div class="fp-wr-section-title">Pending Gates</div>
      <div class="fp-empty" style="padding:var(--sp-3) 0">All gates committed.</div>`;
    return;
  }
  const rows = pending.map(g => {
    const overdue  = g.day < day;
    const today    = g.day === day;
    const cls      = overdue ? 'fp-pending-overdue' : (today ? 'fp-pending-today' : 'fp-pending-upcoming');
    const dayLabel = overdue ? `D${g.day} OVERDUE` : (today ? `D${g.day} TODAY` : `D${g.day}`);
    const roleList = g.roles.join(', ');
    return `<div class="fp-pending-gate">
      <span class="fp-pending-gate-id">${g.id}</span>
      <span class="fp-pending-gate-day ${cls}">${dayLabel}</span>
      <span class="fp-pending-gate-title">${g.title}</span>
      <span class="fp-pending-gate-roles">${roleList}</span>
    </div>`;
  }).join('');
  el.innerHTML = `<div class="fp-wr-section-title">Pending Gates (${pending.length})</div>${rows}`;
}

function renderFeed(activityFeed, log, firedEvents, el) {
  const entries = activityFeed.slice(0, 16);
  if (!entries.length) {
    el.innerHTML = `
      <div class="fp-wr-section-title">Activity Feed</div>
      <div class="fp-empty" style="padding:var(--sp-3) 0">No activity yet.</div>`;
    return;
  }

  const SOURCE_COLORS = {
    ACTION:'CISO', DEFAULT:'var(--text-muted)', EVENT:'var(--purple)',
    WORKSTREAM:'var(--teal)', CASCADE:'var(--red)', DECAY:'var(--text-dim)',
  };

  const rows = entries.map(e => {
    const isPos     = e.delta > 0;
    const isNeg     = e.delta < 0;
    const deltaCol  = isPos ? 'var(--green)' : (isNeg ? 'var(--red)' : 'var(--text-muted)');
    const deltaStr  = e.delta > 0 ? `+${e.delta}` : (e.delta === 0 ? '—' : `${e.delta}`);
    const roleSrc   = ['CISO','CFO','Legal','Comms','CEO'].includes(e.source) ? e.source : null;
    const srcCol    = roleSrc ? (ROLE_COLORS[roleSrc] || 'var(--accent-2)') : 'var(--text-muted)';
    const srcBg     = roleSrc ? (ROLE_BG[roleSrc] || ROLE_BG.DEFAULT) : 'var(--surface-3)';
    const srcLabel  = roleSrc ? roleSrc : (e.sourceId ? e.sourceId.substring(0, 8) : e.source);
    return `<div class="fp-feed-entry">
      <span class="fp-feed-day">D${e.day}</span>
      <span class="fp-feed-source" style="color:${srcCol};background:${srcBg}">${srcLabel}</span>
      <span class="fp-feed-delta" style="color:${deltaCol}">${deltaStr}</span>
      <span class="fp-feed-pool">${e.poolName}</span>
    </div>`;
  }).join('');

  const cascades = [...firedEvents].filter(id => id.startsWith('cascade-'));
  const cascadeChips = cascades.map(id => {
    const labels = {
      'cascade-time-low': 'TIME ↓',
      'cascade-rep-low':  'REP ↓',
      'cascade-reg-low':  'REG ↓',
      'cascade-iq-low':   'IQ ↓',
    };
    return `<span class="fp-cascade-chip">⚠ ${labels[id] || id}</span>`;
  }).join('');

  el.innerHTML = `
    <div class="fp-wr-section-title">Activity Feed</div>
    ${cascades.length ? `<div style="margin-bottom:var(--sp-2)">${cascadeChips}</div>` : ''}
    ${rows}`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function WarRoom() {
  let _isOpen = false;
  let _unsub  = null;

  const overlay = document.createElement('div');
  overlay.className = 'fp-wr-overlay';
  overlay.id = 'fp-warroom-overlay';
  overlay.innerHTML = `
    <div class="fp-wr-modal">
      <div class="fp-wr-header">
        <div>
          <div class="fp-wr-title">⚑ WAR ROOM</div>
          <div class="fp-wr-subtitle">Situational awareness · Escalation queue · Cross-role status</div>
        </div>
        <button class="fp-btn" id="fp-wr-close">✕ Close</button>
      </div>
      <div class="fp-threat-gauge" id="fp-wr-threat"></div>
      <div class="fp-wr-readiness" id="fp-wr-readiness"></div>
      <div class="fp-wr-body" style="overflow-y:auto;flex:1">
        <div class="fp-wr-grid" id="fp-wr-grid"></div>
      </div>
    </div>`;

  document.body.appendChild(overlay);
  overlay.querySelector('#fp-wr-close').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

  function refresh() {
    const s    = getState();
    const escs = activeEscalations(s.pools, s.decisions, s.day);

    renderThreatGauge(s.pools, overlay.querySelector('#fp-wr-threat'));
    renderReadiness(s.roleReady, s.roleAPSpent, overlay.querySelector('#fp-wr-readiness'));

    const grid = overlay.querySelector('#fp-wr-grid');
    grid.innerHTML = `
      <div id="fp-wr-pools"   class="fp-wr-grid-full"></div>
      <div id="fp-wr-escs"></div>
      <div id="fp-wr-pending"></div>
      <div id="fp-wr-feed"    class="fp-wr-grid-full"></div>`;

    renderSharedPools(s.pools, s.log, grid.querySelector('#fp-wr-pools'));
    renderEscalations(escs, grid.querySelector('#fp-wr-escs'));
    renderPendingGates(s.decisions, s.day, grid.querySelector('#fp-wr-pending'));
    renderFeed(s.activityFeed, s.log, s.firedEvents, grid.querySelector('#fp-wr-feed'));
  }

  function open() {
    _isOpen = true;
    refresh();
    overlay.classList.add('open');
    gsap.from('.fp-wr-modal', { y: 20, opacity: 0, duration: 0.4, ease: 'power2.out' });

    _unsub = EventBus.on('state:changed', ({ reason }) => {
      if (reason === 'SWITCH_ROLE' || reason === 'TOGGLE_ACTION') return;
      refresh();
    });
  }

  function close() {
    _isOpen = false;
    overlay.classList.remove('open');
    if (_unsub) { _unsub(); _unsub = null; }
  }

  return { open, close };
}
