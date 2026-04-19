import { EVENTS } from '../engine/events.js';
import { EventBus } from '../engine/eventBus.js';

export function EventsTimeline(state) {
  const el = document.createElement('div');
  el.className = 'fp-events-section';

  function render() {
    const { day, firedEvents } = state;
    const visible = EVENTS.filter(e => Math.abs(e.day - day) <= 4).sort((a, b) => a.day - b.day);
    el.innerHTML = `
      <div class="fp-section-label">Scenario Timeline</div>
      <div class="fp-events-list">
        ${visible.map(ev => {
          const fired = firedEvents.has(ev.id);
          let cls = fired ? 'fired' : (ev.day > day ? 'upcoming' : '');
          if (ev.overnight) cls = 'overnight';
          if (ev.type === 'state' && !fired) cls = 'warning';
          return `<div class="fp-event-item ${cls}">
            <span class="fp-event-day">D${ev.day}${ev.overnight ? '🌙' : ''}</span>
            <span>${ev.desc.substring(0, 85)}</span>
          </div>`;
        }).join('') || '<div class="fp-empty" style="font-size:var(--text-xs)">No events in range</div>'}
      </div>`;
  }

  render();

  const unsub = EventBus.on('state:changed', ({ reason, state: newState }) => {
    if (reason === 'SWITCH_ROLE' || reason === 'TOGGLE_ACTION' || reason === 'MARK_READY') return;
    Object.assign(state, newState);
    render();
  });

  el._destroy = unsub;
  return el;
}
