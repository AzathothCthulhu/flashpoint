import gsap from 'gsap';
import { POOL_DEFS } from '../engine/pools.js';
import { EventBus } from '../engine/eventBus.js';

const ROLE_GROUPS = [
  { label:'SHARED',   color:'var(--col-shared)',   tier:'shared',   owner:'All' },
  { label:'CISO',     color:'var(--col-ciso)',      tier:'domain',   owner:'CISO' },
  { label:'CFO',      color:'var(--col-cfo)',        tier:'domain',   owner:'CFO' },
  { label:'LEGAL',    color:'var(--col-legal)',     tier:'domain',   owner:'Legal' },
  { label:'COMMS',    color:'var(--col-comms)',     tier:'domain',   owner:'Comms' },
  { label:'SCENARIO', color:'var(--col-scenario)',  tier:'scenario', owner:'All' },
];

function barColor(def, value) {
  const pct = (value - def.min) / (def.max - def.min);
  if (def.inverted) {
    if (pct > 0.65) return 'var(--red)';
    if (pct > 0.35) return 'var(--yellow)';
    return 'var(--green)';
  }
  if (def.min < 0) return value >= 0 ? 'var(--green)' : 'var(--red)';
  if (pct < 0.3)  return 'var(--red)';
  if (pct < 0.6)  return 'var(--yellow)';
  return 'var(--green)';
}

function barWidth(def, value) {
  const range = def.max - def.min;
  if (def.min < 0) return Math.abs(value) / (range / 2) * 50;
  return (value - def.min) / range * 100;
}

function barLeft(def, value) {
  if (def.min < 0) return value >= 0 ? 50 : 50 - Math.abs(value) / 50 * 50;
  return 0;
}

function displayVal(def, value) {
  if (def.min < 0) return value >= 0 ? `+${value}` : `${value}`;
  return Math.round(value);
}

export function PoolBar(state) {
  const el = document.createElement('div');
  el.className = 'fp-pools-scroll';

  // Build group + item DOM
  const groups = ROLE_GROUPS.map(g => {
    const pools = POOL_DEFS.filter(p =>
      p.tier === g.tier &&
      (g.tier === 'shared' || g.tier === 'scenario' ? true : p.owner === g.owner)
    );

    const groupEl = document.createElement('div');
    groupEl.className = 'fp-pool-group';

    const hdr = document.createElement('div');
    hdr.className = 'fp-pool-group-header';
    hdr.style.color = g.color;
    hdr.innerHTML = `<div class="fp-pool-group-dot" style="background:${g.color}"></div>${g.label}`;
    groupEl.appendChild(hdr);

    pools.forEach(p => {
      const val = state.pools[p.id];
      const itemEl = document.createElement('div');
      itemEl.className = 'fp-pool-item';
      itemEl.id = `pool-${p.id.replace(/\./g, '_')}`;
      const col = barColor(p, val);
      const w   = barWidth(p, val);
      const l   = barLeft(p, val);
      const dv  = displayVal(p, val);
      const inv = p.inverted ? '<span class="fp-pool-inv-tag">INV</span>' : '';
      itemEl.innerHTML = `
        <div class="fp-pool-row">
          <span class="fp-pool-name">${p.name}${inv}</span>
          <span class="fp-pool-value" style="color:${col}">${dv}</span>
        </div>
        <div class="fp-pool-track">
          ${p.min < 0 ? '<div class="fp-pool-center-line"></div>' : ''}
          <div class="fp-pool-fill" style="width:${w}%;left:${l}%;background:${col}"></div>
        </div>`;
      groupEl.appendChild(itemEl);
    });

    return groupEl;
  });

  groups.forEach(g => el.appendChild(g));

  // Subscribe to pool changes
  const unsub = EventBus.on('pool:changed', ({ pool, before, after, delta }) => {
    const def = POOL_DEFS.find(p => p.id === pool);
    if (!def) return;
    const itemEl = el.querySelector(`#pool-${pool.replace(/\./g, '_')}`);
    if (!itemEl) return;

    const col = barColor(def, after);
    const w   = barWidth(def, after);
    const l   = barLeft(def, after);
    const dv  = displayVal(def, after);

    const valEl  = itemEl.querySelector('.fp-pool-value');
    const fillEl = itemEl.querySelector('.fp-pool-fill');

    // GSAP animate fill width + color
    gsap.to(fillEl, {
      width: `${w}%`,
      left: `${l}%`,
      duration: 0.5,
      ease: 'power2.out',
    });

    // Flash the item
    const flashClass = delta > 0 ? 'fp-pool-flash-pos' : 'fp-pool-flash-neg';
    itemEl.classList.add(flashClass);

    gsap.to(valEl, {
      color: col,
      duration: 0.3,
      onStart: () => { valEl.textContent = dv; },
    });

    // Counter animate the value
    const obj = { n: before };
    gsap.to(obj, {
      n: after,
      duration: 0.4,
      ease: 'power2.out',
      onUpdate: () => {
        const cur = Math.round(obj.n);
        valEl.textContent = def.min < 0 ? (cur >= 0 ? `+${cur}` : `${cur}`) : cur;
      },
    });

    setTimeout(() => itemEl.classList.remove(flashClass), 1800);
  });

  el._destroy = unsub;
  return el;
}
