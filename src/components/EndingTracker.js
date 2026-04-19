import gsap from 'gsap';
import { calcEndingProbability } from '../engine/state.js';
import { EventBus } from '../engine/eventBus.js';

export function EndingTracker() {
  const el = document.createElement('div');
  el.className = 'fp-ending-bar';

  function render(prob) {
    el.innerHTML = `
      <div class="fp-section-label" style="margin-bottom:var(--sp-2)">Ending Probability</div>
      <div class="fp-ending-row">
        <span class="fp-ending-letter" style="color:var(--green)">A</span>
        <div class="fp-ending-track">
          <div class="fp-ending-fill" id="end-fill-a" style="width:0%;background:var(--green)"></div>
        </div>
        <span class="fp-ending-pct" id="end-pct-a">–</span>
      </div>
      <div class="fp-ending-row">
        <span class="fp-ending-letter" style="color:var(--yellow)">B</span>
        <div class="fp-ending-track">
          <div class="fp-ending-fill" id="end-fill-b" style="width:0%;background:var(--yellow)"></div>
        </div>
        <span class="fp-ending-pct" id="end-pct-b">–</span>
      </div>
      <div class="fp-ending-row">
        <span class="fp-ending-letter" style="color:var(--red)">C</span>
        <div class="fp-ending-track">
          <div class="fp-ending-fill" id="end-fill-c" style="width:0%;background:var(--red)"></div>
        </div>
        <span class="fp-ending-pct" id="end-pct-c">–</span>
      </div>`;

    requestAnimationFrame(() => {
      gsap.to(el.querySelector('#end-fill-a'), { width: `${prob.A}%`, duration: 0.6, ease: 'power2.out' });
      gsap.to(el.querySelector('#end-fill-b'), { width: `${prob.B}%`, duration: 0.6, ease: 'power2.out', delay: 0.05 });
      gsap.to(el.querySelector('#end-fill-c'), { width: `${prob.C}%`, duration: 0.6, ease: 'power2.out', delay: 0.1 });
      el.querySelector('#end-pct-a').textContent = `${prob.A}%`;
      el.querySelector('#end-pct-b').textContent = `${prob.B}%`;
      el.querySelector('#end-pct-c').textContent = `${prob.C}%`;
    });
  }

  render(calcEndingProbability());

  const unsub = EventBus.on('state:changed', ({ reason }) => {
    if (reason === 'SWITCH_ROLE' || reason === 'TOGGLE_ACTION' || reason === 'MARK_READY') return;
    render(calcEndingProbability());
  });

  el._destroy = unsub;
  return el;
}
