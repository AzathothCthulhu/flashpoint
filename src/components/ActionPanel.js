import gsap from 'gsap';
import { DOMAIN_ACTIONS, AP_BUDGETS, WORKSTREAM_PAYOFFS } from '../engine/fm.js';
import { POOL_DEFS } from '../engine/pools.js';
import { dispatch } from '../engine/state.js';
import { EventBus } from '../engine/eventBus.js';

const WS_COLORS = {
  forensics:   'var(--col-ciso)',
  regulatory:  'var(--col-legal)',
  media:       'var(--col-comms)',
  financial:   'var(--col-cfo)',
  stakeholder: 'var(--col-ceo)',
};

const ROLE_COLORS = {
  CISO:'var(--col-ciso)', CFO:'var(--col-cfo)', Legal:'var(--col-legal)',
  Comms:'var(--col-comms)', CEO:'var(--col-ceo)',
};

const CEO_METRICS = [
  { id:'REPUTATION',        label:'Reputation',         min:-50, max:50  },
  { id:'CAPACITY',          label:'Op. Capacity',       min:0,   max:100 },
  { id:'PATIENT_CONFIDENCE',label:'Patient Confidence', min:0,   max:100 },
  { id:'DR_OBI_TRAJECTORY', label:'Dr. Obi Trajectory', min:0,   max:100 },
];

function apRingHTML(spent, budget, color) {
  const pct    = Math.min(1, spent / budget);
  const r      = 18;
  const circ   = 2 * Math.PI * r;
  const dash   = circ * pct;
  const warn   = pct > 0.85;
  const ringCol = warn ? 'var(--red)' : (pct > 0.5 ? 'var(--yellow)' : color);
  return `
    <svg width="44" height="44" viewBox="0 0 44 44">
      <circle cx="22" cy="22" r="${r}" fill="none" stroke="var(--surface-3)" stroke-width="4"/>
      <circle cx="22" cy="22" r="${r}" fill="none" stroke="${ringCol}" stroke-width="4"
        stroke-dasharray="${dash} ${circ}" stroke-dashoffset="${circ / 4}"
        stroke-linecap="round" style="transition:stroke-dasharray 0.4s var(--ease-out)"/>
      <text x="22" y="26" text-anchor="middle" fill="${ringCol}"
        font-size="11" font-weight="700" font-family="var(--font-sans)">${spent}</text>
    </svg>`;
}

function wsBarHTML(workstreams) {
  return Object.entries(workstreams).map(([ws, pct]) => {
    const color = WS_COLORS[ws] || 'var(--purple)';
    const marks = [25, 50, 75].map(m =>
      `<div class="fp-ws-mark" style="left:${m}%"></div>`
    ).join('');
    return `
      <div class="fp-ws-row">
        <span class="fp-ws-label">${ws}</span>
        <div class="fp-ws-track">
          ${marks}
          <div class="fp-ws-fill" style="width:${pct}%;background:${color}"></div>
        </div>
        <span class="fp-ws-pct">${pct}%</span>
      </div>`;
  }).join('');
}

function ceoPanelHTML(pools, workstreams) {
  const metrics = CEO_METRICS.map(m => {
    const val = pools[m.id] ?? 0;
    const pct = Math.max(0, Math.min(100, ((val - m.min) / (m.max - m.min)) * 100)).toFixed(0);
    const col = parseInt(pct) > 60 ? 'var(--green)' : (parseInt(pct) > 35 ? 'var(--yellow)' : 'var(--red)');
    const display = m.min < 0 ? (val >= 0 ? `+${Math.round(val)}` : `${Math.round(val)}`) : Math.round(val);
    return `<div class="fp-leadership-metric">
      <span class="fp-leadership-metric-label">${m.label}</span>
      <div class="fp-leadership-metric-track">
        <div class="fp-leadership-metric-fill" style="width:${pct}%;background:${col}"></div>
      </div>
      <span class="fp-leadership-metric-val" style="color:${col}">${display}</span>
    </div>`;
  }).join('');

  const chips = Object.entries(workstreams).map(([ws, pct]) => {
    const col = WS_COLORS[ws] || 'var(--purple)';
    return `<div class="fp-ws-chip">
      <div class="fp-ws-chip-dot" style="background:${col}"></div>
      <span style="color:var(--text-muted)">${ws}</span>
      <span style="color:${col};font-weight:700">${pct}%</span>
    </div>`;
  }).join('');

  return `
    <div class="fp-leadership-panel">
      <div class="fp-section-label" style="margin-bottom:var(--sp-2)">Leadership Metrics</div>
      ${metrics}
    </div>
    <div style="margin-top:var(--sp-3)">
      <div class="fp-section-label" style="margin-bottom:var(--sp-2)">Workstream Progress</div>
      <div class="fp-ws-compact">${chips}</div>
    </div>`;
}

export function ActionPanel(state) {
  const el = document.createElement('div');
  el.className = 'fp-action-panel';

  function render() {
    const { activeRole, roleReady, roleAPSpent, dailyActions, workstreams, pools } = state;
    const actions   = DOMAIN_ACTIONS[activeRole] ?? [];
    const budget    = AP_BUDGETS[activeRole] ?? 0;
    const spent     = roleAPSpent[activeRole] ?? 0;
    const selected  = dailyActions[activeRole] ?? [];
    const ready     = roleReady[activeRole];
    const roleColor = ROLE_COLORS[activeRole] || 'var(--accent-2)';

    const actionsHtml = actions.map(a => {
      const isSel     = selected.includes(a.id);
      const isWs      = !!a.workstream;
      const wouldOver = !isSel && spent + a.ap > budget;
      const cls       = ready ? 'locked' : (wouldOver ? 'disabled' : (isSel ? 'selected' : ''));
      const wsTag     = isWs ? `<span class="fp-action-ws-tag">WS</span>` : '';
      return `
        <div class="fp-action-item ${cls}" data-action-id="${a.id}" title="${a.desc}">
          <div class="fp-action-check">${isSel ? '✓' : ''}</div>
          <span class="fp-action-label">${a.label}</span>
          ${wsTag}
          <span class="fp-action-ap">${a.ap}AP</span>
        </div>`;
    }).join('');

    const bottomSection = activeRole === 'CEO'
      ? ceoPanelHTML(pools, workstreams)
      : `<div style="margin-top:var(--sp-3)">
          <div class="fp-section-label" style="margin-bottom:var(--sp-2)">Workstreams</div>
          ${wsBarHTML(workstreams)}
        </div>`;

    el.innerHTML = `
      <div class="fp-ap-header">
        <div style="display:flex;align-items:center;gap:var(--sp-2)">
          ${apRingHTML(spent, budget, roleColor)}
          <div>
            <div class="fp-ap-ring-label">ACTION POINTS</div>
            <div>
              <span class="fp-ap-spent" style="color:${roleColor}">${spent}</span>
              <span class="fp-ap-budget"> / ${budget}</span>
            </div>
          </div>
        </div>
        <button class="fp-ready-btn ${ready ? 'done' : ''}" id="fp-ready-btn">
          ${ready ? '✓ Ready' : `Mark ${activeRole} Ready`}
        </button>
      </div>
      <div class="fp-action-list">${actionsHtml}</div>
      ${bottomSection}`;

    el.querySelectorAll('.fp-action-item:not(.disabled):not(.locked)').forEach(item => {
      item.addEventListener('click', () => {
        dispatch({ type: 'TOGGLE_ACTION', role: activeRole, actionId: item.dataset.actionId });
        gsap.fromTo(item, { scale: 0.97 }, { scale: 1, duration: 0.2, ease: 'back.out(2)' });
      });
    });

    const readyBtn = el.querySelector('#fp-ready-btn');
    if (readyBtn && !ready) {
      readyBtn.addEventListener('click', () => {
        dispatch({ type: 'MARK_READY', role: activeRole });
        gsap.to(readyBtn, { backgroundColor: 'rgba(63,185,80,0.2)', duration: 0.3 });
      });
    }
  }

  render();

  const unsub = EventBus.on('state:changed', ({ reason, state: newState }) => {
    const prevRole = state.activeRole;
    Object.assign(state, newState);

    if (reason === 'SWITCH_ROLE' && newState.activeRole !== prevRole) {
      gsap.to(el, {
        opacity: 0, y: 4, duration: 0.15, ease: 'power2.in',
        onComplete: () => {
          render();
          gsap.to(el, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' });
        },
      });
      return;
    }

    if (reason === 'TOGGLE_ACTION' || reason === 'MARK_READY') {
      render();
      return;
    }

    render();
  });

  el._destroy = unsub;
  return el;
}
