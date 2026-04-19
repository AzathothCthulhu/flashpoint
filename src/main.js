import './styles/tokens.css';
import './styles/reset.css';
import './styles/shell.css';
import './styles/components.css';
import './styles/stage2.css';
import './styles/stage3.css';
import './styles/stage4.css';
import './styles/stage5.css';

import gsap from 'gsap';

import { dispatch, getState, calcEndingProbability, currentAct, readyCount } from './engine/state.js';
import { EventBus } from './engine/eventBus.js';

import { PoolBar }        from './components/PoolBar.js';
import { GateCards }      from './components/GateCard.js';
import { ActionPanel }    from './components/ActionPanel.js';
import { RoleTabs }       from './components/RoleTabs.js';
import { EndingTracker }  from './components/EndingTracker.js';
import { LogPanel }       from './components/LogPanel.js';
import { EventsTimeline } from './components/EventsTimeline.js';
import { Debrief }        from './components/Debrief.js';
import { WarRoom }        from './components/WarRoom.js';
import { Atmosphere }     from './components/Atmosphere.js';

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

  <!-- MAIN -->
  <div class="fp-main">
    <!-- LEFT: POOLS -->
    <div class="fp-pools-panel">
      <div id="fp-pools-mount"></div>
    </div>

    <!-- CENTER -->
    <div class="fp-center-panel">
      <div id="fp-role-tabs-mount"></div>
      <div id="fp-role-context-mount"></div>
      <div id="fp-action-panel-mount"></div>
      <div id="fp-gate-filter-bar" class="fp-gate-filter-bar">
        <span class="fp-gate-filter-label" id="fp-gate-filter-label">CISO gates</span>
        <label class="fp-gate-filter-toggle">
          <input type="checkbox" id="fp-filter-role" checked>
          Filter by role
        </label>
      </div>
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

document.getElementById('fp-filter-role').addEventListener('change', e => {
  gateCtrl.setRoleFilter(e.target.checked);
  document.getElementById('fp-gate-filter-label').textContent =
    e.target.checked ? `${state.activeRole} gates` : 'All gates';
});

const logPanel = LogPanel(state);
document.getElementById('fp-log-tabs-mount').appendChild(logPanel._tabs);
document.getElementById('fp-log-content-mount').appendChild(logPanel._content);

const debrief  = Debrief();
const warRoom  = WarRoom();
Atmosphere();

// ─── ROLE CONTEXT BAR ────────────────────────────────────────────────────────
const ROLE_CONTEXT = {
  CISO:  'Security posture · Forensics workstream · Team management · Executive trust',
  CFO:   'Budget integrity · Liquidity · Financial risk · Vendor relationships',
  Legal: 'Privilege protection · Regulator engagement · Contract position · Ethics',
  Comms: 'Narrative control · Media relationships · Stakeholder confidence · Capacity',
  CEO:   'Board confidence · Reputation · Staff morale · Strategic posture',
};

const ROLE_COLORS_MAIN = {
  CISO:'var(--col-ciso)', CFO:'var(--col-cfo)', Legal:'var(--col-legal)',
  Comms:'var(--col-comms)', CEO:'var(--col-ceo)',
};

function buildRoleContextBar(role) {
  const el = document.createElement('div');
  el.className = 'fp-role-context';
  el.style.color = ROLE_COLORS_MAIN[role];
  el.textContent = ROLE_CONTEXT[role] ?? '';
  return el;
}

const roleContextMount = document.getElementById('fp-role-context-mount');
let roleContextEl = buildRoleContextBar(state.activeRole);
roleContextMount.appendChild(roleContextEl);

EventBus.on('state:changed', ({ reason, state: s }) => {
  if (reason !== 'SWITCH_ROLE') return;
  gsap.to(roleContextEl, {
    opacity: 0, duration: 0.1,
    onComplete: () => {
      roleContextEl.style.color  = ROLE_COLORS_MAIN[s.activeRole];
      roleContextEl.textContent  = ROLE_CONTEXT[s.activeRole] ?? '';
      gsap.to(roleContextEl, { opacity: 1, duration: 0.2 });
    },
  });
  const filterLabel = document.getElementById('fp-gate-filter-label');
  const filterCheck = document.getElementById('fp-filter-role');
  if (filterLabel && filterCheck?.checked) {
    filterLabel.textContent = `${s.activeRole} gates`;
  }
});

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
document.getElementById('fp-btn-warroom').addEventListener('click', () => warRoom.open());

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
