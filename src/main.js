import './styles/tokens.css';
import './styles/reset.css';
import './styles/shell.css';
import './styles/components.css';
import './styles/stage2.css';

import gsap from 'gsap';

import { dispatch, getState, calcEndingProbability, currentAct, readyCount } from './engine/state.js';
import { EventBus } from './engine/eventBus.js';
import { activeEscalations } from './engine/warroom.js';
import { EVENTS } from './engine/events.js';
import { POOL_DEFS } from './engine/pools.js';

import { PoolBar }        from './components/PoolBar.js';
import { GateCards }      from './components/GateCard.js';
import { ActionPanel }    from './components/ActionPanel.js';
import { RoleTabs }       from './components/RoleTabs.js';
import { EndingTracker }  from './components/EndingTracker.js';
import { LogPanel }       from './components/LogPanel.js';
import { EventsTimeline } from './components/EventsTimeline.js';
import { Debrief }        from './components/Debrief.js';

// ─── INIT ENGINE ─────────────────────────────────────────────────────────────
dispatch({ type: 'INIT' });
const state = getState();

// ─── BUILD SHELL ─────────────────────────────────────────────────────────────
const app = document.getElementById('app');

app.innerHTML = `
  <!-- HEADER -->
  <header class="fp-header">
    <div>
      <div class="fp-logo">Flashpoint</div>
      <div class="fp-logo-sub">Third Party · Meridian Health</div>
    </div>
    <div id="fp-day-badge" class="fp-day-badge">Day 1 of 21</div>
    <div id="fp-act-badge" class="fp-act-badge act-1">ACT 1 — EXPOSURE</div>
    <div class="fp-header-spacer"></div>
    <label style="font-size:var(--text-xs);color:var(--text-muted);display:flex;align-items:center;gap:var(--sp-1);cursor:pointer">
      <input type="checkbox" id="fp-show-hidden" checked> Show hidden effects
    </label>
    <button class="fp-btn" id="fp-btn-prev">◀ Day</button>
    <button class="fp-btn fp-btn-primary" id="fp-btn-next">Advance Day ▶</button>
    <button class="fp-btn fp-btn-war" id="fp-btn-warroom">⚑ War Room</button>
    <button class="fp-btn fp-btn-debrief" id="fp-btn-debrief">⬡ Debrief</button>
    <button class="fp-btn fp-btn-danger" id="fp-btn-reset">↺ Reset</button>
  </header>

  <!-- WAR ROOM OVERLAY -->
  <div class="fp-wr-overlay" id="fp-warroom-overlay">
    <div class="fp-wr-modal">
      <div class="fp-wr-header">
        <div>
          <div class="fp-wr-title">⚑ WAR ROOM</div>
          <div class="fp-wr-subtitle">Shared situational awareness · Escalation queue · Cross-role conflicts</div>
        </div>
        <button class="fp-btn" id="fp-wr-close">✕ Close</button>
      </div>
      <div class="fp-wr-body" id="fp-warroom-body"></div>
    </div>
  </div>

  <!-- MAIN -->
  <div class="fp-main">
    <!-- LEFT: POOLS -->
    <div class="fp-pools-panel">
      <div id="fp-pools-mount"></div>
    </div>

    <!-- CENTER -->
    <div class="fp-center-panel">
      <div id="fp-role-tabs-mount"></div>
      <div id="fp-action-panel-mount"></div>
      <div class="fp-center-content" id="fp-gate-container">
        <div id="fp-empty-gates" class="fp-empty" style="display:none">
          No active decision gates today. Advance the day.
        </div>
      </div>
      <div id="fp-cascade-alerts"></div>
      <div id="fp-events-mount"></div>
    </div>

    <!-- RIGHT -->
    <div class="fp-right-panel">
      <div id="fp-log-tabs-mount"></div>
      <div id="fp-log-content-mount" style="flex:1;overflow-y:auto"></div>
      <div id="fp-ending-mount"></div>
    </div>
  </div>`;

// ─── MOUNT COMPONENTS ────────────────────────────────────────────────────────
document.getElementById('fp-pools-mount').appendChild(PoolBar(state));
document.getElementById('fp-role-tabs-mount').appendChild(RoleTabs(state));
document.getElementById('fp-action-panel-mount').appendChild(ActionPanel(state));
document.getElementById('fp-events-mount').appendChild(EventsTimeline(state));
document.getElementById('fp-ending-mount').appendChild(EndingTracker());

const gateCtrl = GateCards(
  document.getElementById('fp-gate-container'),
  state,
  document.getElementById('fp-show-hidden').checked
);

const logPanel = LogPanel(state);
document.getElementById('fp-log-tabs-mount').appendChild(logPanel._tabs);
document.getElementById('fp-log-content-mount').appendChild(logPanel._content);

const debrief = Debrief();

// ─── HEADER WIRING ───────────────────────────────────────────────────────────
document.getElementById('fp-show-hidden').addEventListener('change', e => {
  gateCtrl.setShowHidden(e.target.checked);
});

document.getElementById('fp-btn-next').addEventListener('click', () => {
  animateDayAdvance(() => dispatch({ type: 'NEXT_DAY' }));
});

document.getElementById('fp-btn-prev').addEventListener('click', () => {
  dispatch({ type: 'PREV_DAY' });
});

document.getElementById('fp-btn-reset').addEventListener('click', () => {
  dispatch({ type: 'RESET' });
  dispatch({ type: 'INIT' });
});

document.getElementById('fp-btn-debrief').addEventListener('click', () => debrief.open());

// ─── WAR ROOM ────────────────────────────────────────────────────────────────
document.getElementById('fp-btn-warroom').addEventListener('click', openWarRoom);
document.getElementById('fp-wr-close').addEventListener('click', closeWarRoom);
document.getElementById('fp-warroom-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('fp-warroom-overlay')) closeWarRoom();
});

function openWarRoom() {
  const s = getState();
  const escs = activeEscalations(s.pools, s.decisions, s.day);
  document.getElementById('fp-warroom-body').innerHTML = warRoomHTML(s, escs);
  document.getElementById('fp-warroom-overlay').classList.add('open');
}

function closeWarRoom() {
  document.getElementById('fp-warroom-overlay').classList.remove('open');
}

function warRoomHTML(s, escs) {
  const sharedPools = POOL_DEFS.filter(p => p.tier === 'shared');
  const stripItems = sharedPools.map(p => {
    const pct = ((s.pools[p.id] - p.min) / (p.max - p.min) * 100).toFixed(0);
    const col = s.pools[p.id] > (p.max - p.min) * 0.4 + p.min ? 'var(--green)' : 'var(--red)';
    return `<div style="text-align:center;padding:var(--sp-2) var(--sp-3)">
      <div style="font-size:var(--text-xs);color:var(--text-muted);margin-bottom:4px">${p.name.substring(0,14)}</div>
      <div style="font-size:var(--text-lg);font-weight:700;color:${col}">${p.min < 0 ? (s.pools[p.id] >= 0 ? '+' : '') : ''}${Math.round(s.pools[p.id])}</div>
    </div>`;
  }).join('');

  const escHtml = escs.length === 0
    ? '<div class="fp-empty">No active escalations</div>'
    : escs.map(e => {
        const urgCol = e.urgency === 'high' ? 'var(--red)' : (e.urgency === 'medium' ? 'var(--yellow)' : 'var(--accent-2)');
        return `<div style="padding:var(--sp-2) var(--sp-3);border:1px solid ${urgCol}44;border-radius:var(--r-md);background:${urgCol}11;margin-bottom:var(--sp-2)">
          <div style="display:flex;align-items:center;gap:var(--sp-2);margin-bottom:4px">
            <span>${e.icon}</span>
            <span style="font-size:var(--text-sm);font-weight:700;color:${urgCol}">${e.title}</span>
            <span style="font-size:var(--text-xs);padding:1px 6px;border-radius:var(--r-sm);background:${urgCol}22;color:${urgCol};margin-left:auto">${e.urgency.toUpperCase()}</span>
          </div>
          <div style="font-size:var(--text-xs);color:var(--text-muted)">${e.from} → ${e.to}: ${e.desc}</div>
        </div>`;
      }).join('');

  const feedHtml = s.activityFeed.slice(0, 12).map(e => {
    const col = e.delta > 0 ? 'var(--green)' : (e.delta < 0 ? 'var(--red)' : 'var(--text-muted)');
    return `<div style="padding:var(--sp-1) 0;border-bottom:1px solid var(--border-subtle);font-size:var(--text-xs)">
      <span style="color:var(--text-muted)">D${e.day} [${e.source}]</span>
      ${e.delta !== 0 ? `<span style="color:${col};font-weight:600;margin:0 6px">${e.delta > 0 ? '+' : ''}${e.delta} ${e.poolName}</span>` : ''}
      <span style="color:var(--text-muted)">${(e.note||'').substring(0,50)}</span>
    </div>`;
  }).join('');

  return `
    <div style="background:var(--surface-2);border-bottom:1px solid var(--border);display:flex;flex-wrap:wrap;margin:-var(--sp-4) -var(--sp-4) var(--sp-4)">${stripItems}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-4)">
      <div>
        <div class="fp-section-label">Escalation Queue (${escs.length} active)</div>
        ${escHtml}
      </div>
      <div>
        <div class="fp-section-label">Cross-Role Activity Feed</div>
        ${feedHtml || '<div class="fp-empty">No activity yet</div>'}
      </div>
    </div>`;
}

// ─── HEADER STATE SYNC ────────────────────────────────────────────────────────
EventBus.on('state:changed', ({ state: s, reason }) => {
  if (reason === 'SWITCH_ROLE' || reason === 'TOGGLE_ACTION') return;

  // Day + act badges
  const act = currentAct();
  document.getElementById('fp-day-badge').textContent = `Day ${s.day} of 21`;
  const actEl = document.getElementById('fp-act-badge');
  actEl.className = `fp-act-badge act-${act}`;
  const actLabels = { 1:'ACT 1 — EXPOSURE', 2:'ACT 2 — ESCALATION', 3:'ACT 3 — RESOLUTION' };
  actEl.textContent = actLabels[act];

  // Advance button
  const btn = document.getElementById('fp-btn-next');
  if (btn) {
    const ready = readyCount();
    btn.textContent = s.day >= 21 ? 'Complete'
      : ready === 5 ? 'Advance Day ▶ (All Ready)'
      : ready > 0   ? `Advance Day ▶ (${ready}/5)`
      : 'Advance Day ▶';
  }

  // Cascade alerts
  const alertsEl = document.getElementById('fp-cascade-alerts');
  if (alertsEl) {
    const triggered = [...s.firedEvents].filter(id => id.startsWith('cascade-'));
    alertsEl.innerHTML = triggered.map(id => {
      const labels = {
        'cascade-time-low': 'TIME CRITICAL — Accelerated capacity and intelligence drain.',
        'cascade-rep-low':  'REPUTATION CRITICAL — Regulatory Standing cascade triggered.',
        'cascade-reg-low':  'REGULATORY STANDING CRITICAL — Legal capacity cascade triggered.',
        'cascade-iq-low':   'INTELLIGENCE LOW — Decision outcomes subject to ±20% noise band.',
      };
      return labels[id]
        ? `<div class="fp-cascade-alert"><strong>⚠ CASCADE:</strong> ${labels[id]}</div>`
        : '';
    }).join('');
  }
});

// ─── ACT TRANSITION BANNER ────────────────────────────────────────────────────
const actBanner = document.createElement('div');
actBanner.className = 'fp-act-banner';
actBanner.innerHTML = `
  <div class="fp-act-banner-inner">
    <div class="fp-act-banner-label" id="fp-act-label"></div>
    <div class="fp-act-banner-title" id="fp-act-title"></div>
    <div class="fp-act-banner-desc" id="fp-act-desc"></div>
  </div>`;
document.body.appendChild(actBanner);

const ACT_COPY = {
  8:  { label: 'ACT 2', title: 'ESCALATION',  desc: 'The breach goes public. Regulatory and media pressure escalates.' },
  15: { label: 'ACT 3', title: 'RESOLUTION',  desc: 'The investigation enters its final phase. Outcomes crystallise.' },
};

EventBus.on('day:advanced', ({ day }) => {
  const copy = ACT_COPY[day];
  if (!copy) return;
  document.getElementById('fp-act-label').textContent = copy.label;
  document.getElementById('fp-act-title').textContent = copy.title;
  document.getElementById('fp-act-desc').textContent  = copy.desc;
  gsap.timeline()
    .to(actBanner, { opacity: 1, duration: 0.5, ease: 'power2.out', pointerEvents: 'none' })
    .to(actBanner, { opacity: 0, duration: 0.6, ease: 'power2.in', delay: 2.8 });
});

// ─── CONSEQUENCE REVEAL ───────────────────────────────────────────────────────
EventBus.on('decision:committed', ({ gateId }) => {
  const card = document.getElementById(`gate-${gateId}`);
  if (!card) return;
  card.classList.add('fp-gate-committed');
  setTimeout(() => card.classList.remove('fp-gate-committed'), 700);
  const effects = card.querySelectorAll('.fp-consequence-effect');
  if (effects.length) {
    gsap.to(effects, { opacity: 1, x: 0, duration: 0.3, stagger: 0.07, ease: 'power2.out', delay: 0.15 });
  }
});

// ─── PAYOFF TOAST ─────────────────────────────────────────────────────────────
EventBus.on('workstream:payoff', ({ wsId, payoff }) => {
  const toast = document.createElement('div');
  toast.className = 'fp-payoff-toast';
  toast.textContent = `⬡ ${wsId}: ${payoff.label}`;
  document.body.appendChild(toast);
  gsap.timeline()
    .to(toast, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)' })
    .to(toast, { opacity: 0, y: -10, duration: 0.4, ease: 'power2.in', delay: 2.2, onComplete: () => toast.remove() });
});

// ─── INTRO ANIMATION ─────────────────────────────────────────────────────────
gsap.from('.fp-header', { y: -10, opacity: 0, duration: 0.5, ease: 'power2.out' });
gsap.from('.fp-pools-panel', { x: -20, opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.1 });
gsap.from('.fp-right-panel', { x: 20, opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.15 });
gsap.from('.fp-center-panel', { opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.2 });

// ─── DAY ADVANCE ANIMATION ───────────────────────────────────────────────────
function animateDayAdvance(callback) {
  const btn = document.getElementById('fp-btn-next');
  gsap.timeline()
    .to(btn, { scale: 0.95, duration: 0.1 })
    .to(btn, { scale: 1, duration: 0.15, ease: 'back.out(2)', onComplete: callback });

  // Brief flash on the center panel
  gsap.fromTo('.fp-center-panel',
    { background: 'rgba(224,92,43,0.06)' },
    { background: 'transparent', duration: 0.8, ease: 'power2.out' }
  );
}
