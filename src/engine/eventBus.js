const listeners = new Map();

export const EventBus = {
  on(event, fn) {
    if (!listeners.has(event)) listeners.set(event, []);
    listeners.get(event).push(fn);
    return () => this.off(event, fn);
  },

  off(event, fn) {
    if (!listeners.has(event)) return;
    listeners.set(event, listeners.get(event).filter(f => f !== fn));
  },

  emit(event, payload) {
    if (!listeners.has(event)) return;
    listeners.get(event).forEach(fn => fn(payload));
  },

  clear() {
    listeners.clear();
  },
};
