import gsap from 'gsap';
import { POOL_DEFS, resolvePool } from '../engine/pools.js';
import { GATES, CONSEQUENCES } from '../engine/gates.js';
import { dispatch } from '../engine/state.js';
import { EventBus } from '../engine/eventBus.js';

const ROLE_COLORS = {
  CISO:'var(--col-ciso)', CFO:'var(--col-cfo)', Legal:'var(--col-legal)',
  Comms:'var(--col-comms)', CEO:'var(--col-ceo)',
  HR:'#7dd3c8', Board:'#b3b3b3', All:'var(--col-shared)',
};

function previewHTML(gateId, choice, showHidden) {
  const effects = CONSEQUENCES[gateId]?.[choice] ?? [];
  const rows = effects.filter(e => showHidden || e.attr !== 'CAUSE_HIDDEN').map(e => {
    const dc = e.delta > 0 ? 'fp-delta-pos' : (e.delta < 0 ? 'fp-delta-neg' : 'fp-delta-zero');
    const ds = e.delta > 0 ? `+${e.delta}` : `${e.delta}`;
    const hidTag = e.attr === 'CAUSE_HIDDEN' ? '<span class="fp-hidden-tag">●HIDDEN</span>' : '';
    const def = POOL_DEFS.find(p => p.id === resolvePool(e.pool));
    const pname = def ? def.name.substring(0, 24) : e.pool;
    return `<div class="fp-preview-row">
      <span class="fp-preview-delta ${dc}">${ds}</span>
      <span class="fp-preview-pool">${pname}</span>
      <span class="fp-vis-tag">${e.vis}</span>
      ${hidTag}
    </div>`;
  }).join('');
  return rows || '<div style="color:var(--text-muted);font-size:10px">No visible effects</div>';
}

function buildCard(gate, decisions, showHidden) {
  const isDone     = !!decisions[gate.id];
  const isActive   = !isDone;
  const choiceKeys = Object.keys(gate.choices);

  const el = document.createElement('div');
  el.className = `fp-gate-card ${isDone ? 'completed' : 'active'}`;
  el.id = `gate-${gate.id}`;
  el.style.opacity = '0';
  el.style.transform = 'translateY(12px)';

  const roleTagsHtml = gate.roles.map(r =>
    `<span class="fp-gate-role-tag" style="background:${ROLE_COLORS[r]}22;color:${ROLE_COLORS[r]};border:1px solid ${ROLE_COLORS[r]}44">${r}</span>`
  ).join('');

  const statusIcon = isDone ? '✓' : '⬤';
  const statusColor = isDone ? 'var(--green)' : 'var(--accent)';
  const decisionLabel = isDone
    ? `<span class="fp-gate-decision-label">→ ${gate.choices[decisions[gate.id]].label}</span>`
    : '';

  const committedEffects = isDone ? (CONSEQUENCES[gate.id]?.[decisions[gate.id]] ?? []) : [];
  const visibleEffects = committedEffects.filter(e => showHidden || e.attr !== 'CAUSE_HIDDEN');
  const revealHtml = isDone && visibleEffects.length > 0 ? `
    <div class="fp-consequence-reveal">
      <div class="fp-consequence-title">Effects Applied</div>
      ${visibleEffects.map(e => {
        const col = e.delta > 0 ? 'var(--green)' : (e.delta < 0 ? 'var(--red)' : 'var(--text-muted)');
        const ds = e.delta > 0 ? `+${e.delta}` : `${e.delta}`;
        const def = POOL_DEFS.find(p => p.id === resolvePool(e.pool));
        const pname = def ? def.name.substring(0, 22) : e.pool;
        return `<div class="fp-consequence-effect">
          <span style="color:${col};font-weight:700;min-width:32px">${ds}</span>
          <span>${pname}</span>
          <span style="margin-left:auto;color:var(--text-muted);font-size:9px">${e.vis}</span>
        </div>`;
      }).join('')}
    </div>` : '';

  const choicesHtml = choiceKeys.map(ck => {
    const ch = gate.choices[ck];
    const isSelected = decisions[gate.id] === ck;
    return `
      <div class="fp-choice ${isSelected ? 'selected' : ''}" data-gate="${gate.id}" data-choice="${ck}">
        <div class="fp-choice-label">${ck}. ${ch.label}</div>
        <div class="fp-choice-desc">${ch.desc}</div>
        <div class="fp-preview">${previewHTML(gate.id, ck, showHidden)}</div>
        ${isActive ? `<div class="fp-commit-row">
          <button class="fp-commit-btn" data-gate="${gate.id}" data-choice="${ck}">Commit ${ck} ▶</button>
        </div>` : ''}
      </div>`;
  }).join('');

  el.innerHTML = `
    <div class="fp-gate-header">
      <span class="fp-gate-id">${gate.id}</span>
      <span class="fp-gate-day-tag">Day ${gate.day}</span>
      <span class="fp-gate-status" style="color:${statusColor}">${statusIcon}</span>
      ${roleTagsHtml}
      <span class="fp-gate-title">${gate.title}</span>
      ${decisionLabel}
    </div>
    ${isActive ? `<div class="fp-gate-body">
      <div class="fp-gate-desc">${gate.desc}</div>
      <div>${choicesHtml}</div>
    </div>` : revealHtml}`;

  // Animate in
  requestAnimationFrame(() => {
    gsap.to(el, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
  });

  // Choice hover/commit handlers
  el.addEventListener('click', e => {
    const commitBtn = e.target.closest('.fp-commit-btn');
    if (commitBtn) {
      const gId = commitBtn.dataset.gate;
      const ch  = commitBtn.dataset.choice;
      animateCommit(el, () => dispatch({ type: 'COMMIT_DECISION', gateId: gId, choice: ch }));
      return;
    }
    const choiceEl = e.target.closest('.fp-choice');
    if (choiceEl && !isDone) {
      el.querySelectorAll('.fp-choice').forEach(c => c.classList.remove('previewing'));
      choiceEl.classList.add('previewing');
    }
  });

  return el;
}

function animateCommit(cardEl, callback) {
  gsap.timeline()
    .to(cardEl, { scale: 0.98, duration: 0.1, ease: 'power2.in' })
    .to(cardEl, { scale: 1, duration: 0.15, ease: 'power2.out', onComplete: callback })
    .to(cardEl, { borderColor: 'var(--green)', duration: 0.3 });
}

// HR and Board gates are surfaced under the CEO tab
const CEO_PROXY_ROLES = new Set(['HR', 'Board']);

function effectiveRoles(gate) {
  if (gate.roles.some(r => CEO_PROXY_ROLES.has(r))) {
    return [...gate.roles, 'CEO'];
  }
  return gate.roles;
}

export function GateCards(container, state, showHidden = true) {
  let _showHidden  = showHidden;
  let _filterRole  = true;

  function render() {
    const { decisions, day, activeRole } = state;
    container.querySelectorAll('.fp-gate-card').forEach(el => el.remove());

    const visible = GATES.filter(g => {
      if (g.day > day + 1) return false;
      if (_filterRole) return effectiveRoles(g).includes(activeRole);
      return true;
    });

    const filterBar = container.querySelector('#fp-gate-filter-bar');
    if (filterBar) {
      filterBar.querySelector('#fp-gate-filter-label').textContent =
        _filterRole ? `${activeRole} gates` : 'All gates';
    }

    if (visible.length === 0) {
      const empty = container.querySelector('#fp-empty-gates');
      if (empty) {
        empty.style.display = 'block';
        empty.textContent = _filterRole
          ? `No ${activeRole} gates active yet. Advance the day or switch to All.`
          : 'No active decision gates today. Advance the day.';
      }
      return;
    }
    const empty = container.querySelector('#fp-empty-gates');
    if (empty) empty.style.display = 'none';

    visible.forEach(gate => {
      const card = buildCard(gate, decisions, _showHidden);
      const isMatch = effectiveRoles(gate).includes(activeRole);
      if (isMatch) {
        card.classList.add('role-match');
        const ROLE_RGBA = {
          CISO:'255,123,114', CFO:'121,192,255', Legal:'188,140,255',
          Comms:'86,211,100', CEO:'255,166,87',
        };
        const rgb = ROLE_RGBA[activeRole] || '88,166,255';
        card.style.setProperty('--role-accent', ROLE_COLORS[activeRole] || 'var(--accent-2)');
        card.style.setProperty('--role-accent-dim', `rgba(${rgb}, 0.07)`);
      }
      container.appendChild(card);
    });
  }

  render();

  const unsub = EventBus.on('state:changed', ({ reason, state: newState }) => {
    if (reason === 'TOGGLE_ACTION' || reason === 'MARK_READY') return;
    Object.assign(state, newState);
    render();
  });

  return {
    setShowHidden: v => { _showHidden = v; render(); },
    setRoleFilter: v => { _filterRole = v; render(); },
    destroy: unsub,
  };
}
