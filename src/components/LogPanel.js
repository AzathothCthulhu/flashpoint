import gsap from 'gsap';
import { BRANCHES } from '../engine/gates.js';
import { EventBus } from '../engine/eventBus.js';

export function LogPanel(state) {
  const el = document.createElement('div');
  el.className = 'fp-right-content';

  const tabs = document.createElement('div');
  tabs.className = 'fp-right-tabs';
  tabs.innerHTML = `
    <div class="fp-right-tab active" data-tab="log">Decision Log</div>
    <div class="fp-right-tab" data-tab="branches">Branches</div>`;

  const content = document.createElement('div');
  content.className = 'fp-right-content';
  content.style.flex = '1';

  let activeTab = 'log';

  function renderLog() {
    if (!state.log.length) {
      content.innerHTML = '<div class="fp-empty">No decisions yet.</div>';
      return;
    }
    content.innerHTML = state.log.slice(0, 60).map(e => {
      const sign = e.delta > 0 ? '+' : '';
      const col  = e.delta > 0 ? 'var(--green)' : (e.delta < 0 ? 'var(--red)' : 'var(--text-muted)');
      const hidCls = e.attr === 'CAUSE_HIDDEN' ? 'color:var(--purple)' : '';
      const src = e.source === 'EVENT' ? e.sourceId
        : e.source === 'CASCADE' ? '⚠ CASCADE'
        : e.source === 'DECAY'   ? '⏱ DECAY'
        : e.source === 'DEFAULT' ? `⟳ ${e.sourceId}`
        : e.source === 'ACTION'  ? `▶ ${e.sourceId}`
        : e.source === 'WORKSTREAM' ? `⬡ ${e.sourceId}`
        : `${e.source}→${e.sourceId}`;
      return `
        <div class="fp-log-entry">
          <div class="fp-log-time">D${e.day} · ${src}</div>
          ${e.delta !== 0 ? `<div style="font-weight:600;color:${col};${hidCls}">${sign}${e.delta} ${e.poolName}</div>` : ''}
          <div style="font-size:var(--text-xs);color:var(--text-muted)">${(e.note||'').substring(0,80)}</div>
        </div>`;
    }).join('');
  }

  function renderBranches() {
    content.innerHTML = BRANCHES.map(b => {
      const [gId, cId] = b.condition.split('=');
      let icon = '○', col = 'var(--text-muted)';
      if (state.decisions[gId]) {
        if (state.decisions[gId] === cId) { icon = '✓'; col = 'var(--green)'; }
        else { icon = '✗'; col = 'var(--red)'; }
      }
      return `
        <div class="fp-branch-item">
          <div class="fp-branch-dot" style="color:${col}">${icon}</div>
          <div>
            <div class="fp-branch-name" style="color:${col}">${b.name}</div>
            <div class="fp-branch-meta">${b.type} · ${b.condition}</div>
            <div class="fp-branch-meta">${b.endingWeight}</div>
          </div>
        </div>`;
    }).join('');
  }

  function renderActive() {
    activeTab === 'log' ? renderLog() : renderBranches();
  }

  tabs.addEventListener('click', e => {
    const tab = e.target.closest('.fp-right-tab');
    if (!tab) return;
    activeTab = tab.dataset.tab;
    tabs.querySelectorAll('.fp-right-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === activeTab));
    renderActive();
  });

  renderActive();

  const unsub = EventBus.on('state:changed', ({ reason, state: newState }) => {
    if (reason === 'SWITCH_ROLE') return;
    Object.assign(state, newState);
    renderActive();
  });

  // Wrap both in a fragment-like container
  const wrapper = document.createDocumentFragment();
  wrapper._tabs = tabs;
  wrapper._content = content;
  wrapper._destroy = unsub;
  return wrapper;
}
