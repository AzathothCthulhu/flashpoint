import gsap from 'gsap';
import { getState, calcEndingProbability } from '../engine/state.js';
import { POOL_DEFS } from '../engine/pools.js';
import { GATES } from '../engine/gates.js';
import { BRANCHES } from '../engine/gates.js';

const ROLE_NARRATIVES = {
  CISO: {
    strong: 'The security team executed under sustained pressure. Forensic capability was established early, threat intelligence improved throughout, and the CISO maintained executive trust across the scenario. The control framework emerged stronger than it entered.',
    mixed:  'The CISO navigated the investigation with competence but uneven resource investment left some domain pools under pressure. Forensic quality was adequate. Executive alignment was inconsistent.',
    poor:   'The security team was overwhelmed. Team morale deteriorated, the control framework weakened, and forensic intelligence never reached the quality needed to support confident decision-making downstream.',
  },
  CFO: {
    strong: 'Financial management was disciplined and proactive. Budget integrity was maintained despite emergency spend, and the CFO provided the board with clear visibility into remediation costs throughout.',
    mixed:  'Financial management was adequate. Emergency spend created some budget variance, but the CFO maintained basic liquidity and avoided material financial reporting exposure.',
    poor:   'Financial management was reactive. Unplanned spend eroded budget integrity, liquidity came under pressure, and financial risk disclosure obligations were not fully managed.',
  },
  Legal: {
    strong: 'Legal strategy was coherent and forward-looking. Privilege was protected, regulator relationships were actively invested, and ethical tensions were resolved rather than accumulated.',
    mixed:  'Legal management was functional. Privilege was preserved at a basic level. The regulator relationship was maintained but not strengthened. Some ethical tension accumulated without resolution.',
    poor:   'Legal exposure accumulated throughout the scenario. Privilege erosion, regulator relationship damage, and unresolved ethical tension combined to create significant legal risk by the resolution phase.',
  },
  Comms: {
    strong: 'Comms executed a coherent narrative strategy. Message control was maintained throughout the researcher publication, media relationships were invested, and stakeholder confidence held.',
    mixed:  'Comms managed the crisis communications adequately. Some narrative coherence was lost when the researcher published, and message control required active recovery effort.',
    poor:   'Comms lost the narrative. The researcher publication was poorly handled, media relationships deteriorated, and stakeholder confidence collapsed. The organisation ceded the public narrative entirely.',
  },
  CEO: {
    strong: 'Executive leadership was visible and decisive. The CEO maintained board confidence, managed reputation through the crisis peak, and provided clear direction that enabled the team to function under pressure.',
    mixed:  'Executive leadership was present but reactive. Board confidence was maintained at a baseline level. Reputation absorbed some damage but was not actively managed.',
    poor:   'Executive leadership was insufficient. Reputation deteriorated significantly, board confidence eroded, and the organisation lacked a coherent leadership voice during the crisis peak.',
  },
};

function roleHealth(state, role) {
  const pools = POOL_DEFS.filter(p => p.owner === role && p.tier === 'domain');
  if (!pools.length) return 'mixed';
  const scores = pools.map(p => {
    const pct = (state.pools[p.id] - p.min) / (p.max - p.min);
    return p.inverted ? 1 - pct : pct;
  });
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  if (avg > 0.6) return 'strong';
  if (avg > 0.35) return 'mixed';
  return 'poor';
}

function endingLabel(letter) {
  return {
    A: { title: 'Accountability and Recovery', desc: 'Meridian Health navigated the breach with integrity. The regulator acknowledged the cooperative posture. Patient and stakeholder trust was damaged but is on a recovery trajectory.', color: 'var(--green)' },
    B: { title: 'Managed Response', desc: 'Meridian contained the crisis without catastrophic failure. Some reputational and regulatory cost was incurred. The organisation remains functional and forward-looking.', color: 'var(--yellow)' },
    C: { title: 'Compounded Failure', desc: 'Poor decisions compounded across the scenario. Regulatory enforcement is likely. Patient trust has collapsed. The organisation faces an extended period of crisis that will outlast the immediate breach.', color: 'var(--red)' },
  }[letter];
}

function determineLikelyEnding(prob) {
  if (prob.A >= prob.B && prob.A >= prob.C) return 'A';
  if (prob.B >= prob.C) return 'B';
  return 'C';
}

export function Debrief() {
  const overlay = document.createElement('div');
  overlay.className = 'fp-debrief-overlay';
  overlay.id = 'fp-debrief-overlay';

  overlay.innerHTML = `
    <div class="fp-debrief-modal">
      <div class="fp-debrief-header">
        <div>
          <div style="font-size:var(--text-md);font-weight:var(--weight-black);letter-spacing:1px">FLASHPOINT — Scenario Debrief</div>
          <div style="font-size:var(--text-xs);color:var(--text-muted)">Third Party · Meridian Health</div>
        </div>
        <button class="fp-btn" id="fp-debrief-close">✕ Close</button>
      </div>
      <div class="fp-debrief-body" id="fp-debrief-body"></div>
    </div>`;

  document.body.appendChild(overlay);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });
  overlay.querySelector('#fp-debrief-close').addEventListener('click', close);

  function open() {
    const state = getState();
    const prob  = calcEndingProbability();
    const ending = determineLikelyEnding(prob);
    const ed = endingLabel(ending);

    const roles = ['CISO','CFO','Legal','Comms','CEO'];

    const gateLog = GATES.map(g => {
      const dec = state.decisions[g.id];
      if (!dec) return '';
      const ch = g.choices[dec];
      return `<div style="padding:var(--sp-1) 0;border-bottom:1px solid var(--border-subtle);display:flex;gap:var(--sp-3);font-size:var(--text-sm)">
        <span style="color:var(--text-muted);min-width:60px">D${g.day} ${g.id}</span>
        <span style="color:var(--accent-2);font-weight:600">${dec}.</span>
        <span>${ch.label}</span>
      </div>`;
    }).join('');

    const roleCards = roles.map(role => {
      const health = roleHealth(state, role);
      const narrative = ROLE_NARRATIVES[role][health];
      const healthCol = health === 'strong' ? 'var(--green)' : (health === 'mixed' ? 'var(--yellow)' : 'var(--red)');
      const rolePools = POOL_DEFS.filter(p => p.owner === role && p.tier === 'domain').map(p => {
        const val = state.pools[p.id];
        const pct = ((val - p.min) / (p.max - p.min) * 100).toFixed(0);
        const col = parseInt(pct) > 60 ? 'var(--green)' : (parseInt(pct) > 35 ? 'var(--yellow)' : 'var(--red)');
        return `<span style="font-size:var(--text-xs);padding:2px 6px;border-radius:var(--r-sm);background:${col}22;border:1px solid ${col}44;color:${col}">${p.name.substring(0,14)}: ${Math.round(val)}</span>`;
      }).join(' ');
      return `
        <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:var(--r-lg);margin-bottom:var(--sp-3);overflow:hidden">
          <div style="padding:var(--sp-2) var(--sp-3);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:var(--sp-3)">
            <span style="font-size:var(--text-base);font-weight:var(--weight-bold);flex:1">${role}</span>
            <span style="font-size:var(--text-xs);font-weight:var(--weight-bold);padding:2px 8px;border-radius:var(--r-sm);background:${healthCol}22;border:1px solid ${healthCol}44;color:${healthCol}">${health.toUpperCase()}</span>
          </div>
          <div style="padding:var(--sp-2) var(--sp-3)">
            <p style="font-size:var(--text-sm);line-height:var(--leading-loose);color:var(--text-muted);margin-bottom:var(--sp-2)">${narrative}</p>
            <div style="display:flex;flex-wrap:wrap;gap:var(--sp-1)">${rolePools}</div>
          </div>
        </div>`;
    }).join('');

    document.getElementById('fp-debrief-body').innerHTML = `
      <div class="fp-ending-verdict fp-ev-${ending.toLowerCase()}">
        <div class="fp-ev-letter" style="color:${ed.color}">${ending}</div>
        <div>
          <div style="font-size:var(--text-md);font-weight:var(--weight-bold);margin-bottom:var(--sp-1)">${ed.title}</div>
          <div style="font-size:var(--text-sm);color:var(--text-muted);line-height:var(--leading-loose)">${ed.desc}</div>
          <div style="margin-top:var(--sp-2);font-size:var(--text-xs);color:var(--text-muted)">
            Probability at close — A: <strong style="color:var(--green)">${prob.A}%</strong>
            &nbsp;B: <strong style="color:var(--yellow)">${prob.B}%</strong>
            &nbsp;C: <strong style="color:var(--red)">${prob.C}%</strong>
          </div>
        </div>
      </div>
      <div class="fp-debrief-section">
        <div class="fp-debrief-section-title">Role Performance</div>
        ${roleCards}
      </div>
      <div class="fp-debrief-section">
        <div class="fp-debrief-section-title">Decision Record</div>
        ${gateLog || '<div style="color:var(--text-muted);font-size:var(--text-sm)">No gates committed yet.</div>'}
      </div>`;

    overlay.classList.add('open');
  }

  function close() {
    overlay.classList.remove('open');
  }

  return { open, close };
}
