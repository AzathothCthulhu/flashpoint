import { dispatch, getState, calcEndingProbability, currentAct } from './engine/state.js';
import { EventBus } from './engine/eventBus.js';

// Stage 0: engine wired, minimal shell to prove all modules load cleanly
dispatch({ type: 'INIT' });

EventBus.on('state:changed', ({ reason, state }) => {
  const prob = calcEndingProbability();
  document.getElementById('app').innerHTML = `
    <div style="font-family:monospace;padding:24px;background:#0d1117;color:#e6edf3;min-height:100vh">
      <h1 style="color:#e05c2b;letter-spacing:4px;margin-bottom:4px">FLASHPOINT</h1>
      <p style="color:#7d8590;margin-bottom:24px">Stage 0 Engine — Production Foundation</p>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:24px">
        <div style="background:#161b22;border:1px solid #30363d;border-radius:8px;padding:16px">
          <div style="color:#7d8590;font-size:11px;letter-spacing:2px;margin-bottom:8px">DAY / ACT</div>
          <div style="font-size:28px;font-weight:700">Day ${state.day}</div>
          <div style="color:#58a6ff;font-size:12px">ACT ${currentAct()}</div>
        </div>
        <div style="background:#161b22;border:1px solid #30363d;border-radius:8px;padding:16px">
          <div style="color:#7d8590;font-size:11px;letter-spacing:2px;margin-bottom:8px">KEY POOLS</div>
          <div style="font-size:12px;line-height:1.8">
            TIME: <span style="color:#58a6ff">${state.pools['TIME']}</span> |
            REPUTATION: <span style="color:${state.pools['REPUTATION'] >= 0 ? '#3fb950' : '#f85149'}">${state.pools['REPUTATION']}</span> |
            IQ: <span style="color:#58a6ff">${state.pools['INTELLIGENCE_QUALITY']}</span>
          </div>
          <div style="font-size:12px;line-height:1.8">
            REG: <span style="color:${state.pools['REGULATORY_STANDING'] >= 0 ? '#3fb950' : '#f85149'}">${state.pools['REGULATORY_STANDING']}</span> |
            CAPACITY: <span style="color:#3fb950">${state.pools['CAPACITY']}</span>
          </div>
        </div>
        <div style="background:#161b22;border:1px solid #30363d;border-radius:8px;padding:16px">
          <div style="color:#7d8590;font-size:11px;letter-spacing:2px;margin-bottom:8px">ENDING PROBABILITY</div>
          <div style="font-size:12px;line-height:1.8">
            <span style="color:#3fb950">A: ${prob.A}%</span> |
            <span style="color:#d29922">B: ${prob.B}%</span> |
            <span style="color:#f85149">C: ${prob.C}%</span>
          </div>
        </div>
      </div>

      <div style="background:#161b22;border:1px solid #30363d;border-radius:8px;padding:16px;margin-bottom:16px">
        <div style="color:#7d8590;font-size:11px;letter-spacing:2px;margin-bottom:12px">ACTIVE ROLE: ${state.activeRole}</div>
        <div style="display:flex;gap:8px;margin-bottom:12px">
          ${['CISO','CFO','Legal','Comms','CEO'].map(r =>
            `<button onclick="window.__dispatch({type:'SWITCH_ROLE',role:'${r}'})"
              style="padding:4px 12px;border-radius:4px;border:1px solid #30363d;background:${state.activeRole===r?'#e05c2b':'#1c2128'};color:#e6edf3;cursor:pointer;font-family:monospace">
              ${r}${state.roleReady[r]?' ✓':''}
            </button>`
          ).join('')}
        </div>
        <div style="font-size:12px;color:#7d8590">
          AP Spent: ${state.roleAPSpent[state.activeRole]} / ${[{CISO:30,CFO:25,Legal:25,Comms:25,CEO:30}][0][state.activeRole]}
          &nbsp;|&nbsp;
          Actions selected: ${state.dailyActions[state.activeRole].join(', ') || 'none'}
        </div>
      </div>

      <div style="background:#161b22;border:1px solid #30363d;border-radius:8px;padding:16px;margin-bottom:16px">
        <div style="color:#7d8590;font-size:11px;letter-spacing:2px;margin-bottom:12px">WORKSTREAMS</div>
        <div style="display:flex;gap:16px;font-size:12px">
          ${Object.entries(state.workstreams).map(([k,v]) =>
            `<span>${k}: <span style="color:#bc8cff">${v}%</span></span>`
          ).join('')}
        </div>
      </div>

      <div style="display:flex;gap:8px;margin-bottom:16px">
        <button onclick="window.__dispatch({type:'NEXT_DAY'})"
          style="padding:8px 20px;border-radius:5px;border:none;background:#e05c2b;color:#fff;cursor:pointer;font-weight:700;font-family:monospace">
          Advance Day ▶
        </button>
        <button onclick="window.__dispatch({type:'MARK_READY',role:'${state.activeRole}'})"
          style="padding:8px 20px;border-radius:5px;border:1px solid #30363d;background:#1c2128;color:#e6edf3;cursor:pointer;font-family:monospace">
          Mark ${state.activeRole} Ready
        </button>
        <button onclick="window.__dispatch({type:'RESET'})"
          style="padding:8px 20px;border-radius:5px;border:1px solid rgba(248,81,73,0.4);background:rgba(248,81,73,0.1);color:#f85149;cursor:pointer;font-family:monospace">
          ↺ Reset
        </button>
      </div>

      <div style="background:#161b22;border:1px solid #30363d;border-radius:8px;padding:16px">
        <div style="color:#7d8590;font-size:11px;letter-spacing:2px;margin-bottom:8px">
          ACTIVITY LOG (last ${Math.min(state.log.length, 8)} entries)
        </div>
        ${state.log.slice(0,8).map(e => `
          <div style="padding:4px 0;border-bottom:1px solid rgba(48,54,61,0.5);font-size:11px">
            <span style="color:#7d8590">D${e.day} [${e.source}]</span>
            ${e.delta !== 0 ? `<span style="color:${e.delta > 0 ? '#3fb950' : '#f85149'};margin:0 6px">${e.delta > 0 ? '+' : ''}${e.delta} ${e.poolName}</span>` : ''}
            <span style="color:#7d8590">${(e.note||'').substring(0,60)}</span>
          </div>
        `).join('') || '<div style="color:#7d8590">No entries yet.</div>'}
      </div>

      <div style="margin-top:12px;color:#7d8590;font-size:10px">
        Stage 0 engine shell — all modules loaded. EventBus: active. Last event: <strong style="color:#e6edf3">${reason}</strong>
      </div>
    </div>
  `;
});

// Expose dispatch globally for inline button handlers in the shell
window.__dispatch = dispatch;

// Trigger initial render
EventBus.emit('state:changed', { reason: 'BOOT', state: getState() });
