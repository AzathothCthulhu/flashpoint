import gsap from 'gsap';
import { ROLES } from '../engine/fm.js';
import { dispatch } from '../engine/state.js';
import { EventBus } from '../engine/eventBus.js';

const ROLE_COLORS = {
  CISO:'var(--col-ciso)', CFO:'var(--col-cfo)', Legal:'var(--col-legal)',
  Comms:'var(--col-comms)', CEO:'var(--col-ceo)',
};

export function RoleTabs(state) {
  const el = document.createElement('div');
  el.className = 'fp-role-tabs';

  function render() {
    const { activeRole, roleReady, roleAPSpent } = state;
    el.innerHTML = ROLES.map(r => {
      const isActive = r === activeRole;
      const isReady  = roleReady[r];
      const spent    = roleAPSpent[r];
      return `
        <div class="fp-role-tab ${isActive ? 'active' : ''} ${isReady ? 'ready' : ''}"
          style="color:${isActive ? ROLE_COLORS[r] : 'var(--text-muted)'}"
          data-role="${r}">
          ${r.toUpperCase()}
          <span class="fp-ready-pip"></span>
        </div>`;
    }).join('');

    el.querySelectorAll('.fp-role-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const role = tab.dataset.role;
        if (role === state.activeRole) return;
        gsap.fromTo(tab, { scale: 0.95 }, { scale: 1, duration: 0.2, ease: 'back.out(2)' });
        dispatch({ type: 'SWITCH_ROLE', role });
      });
    });
  }

  render();

  const unsub = EventBus.on('state:changed', ({ state: newState }) => {
    Object.assign(state, newState);
    render();
  });

  el._destroy = unsub;
  return el;
}
