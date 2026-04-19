// Headless 21-day simulation test — no DOM, no browser required
// Run with: node src/engine/__tests__/simulation.test.js

import { dispatch, getState, calcEndingProbability, currentAct } from '../state.js';
import { POOL_DEFS } from '../pools.js';
import { GATES } from '../gates.js';
import { ROLES } from '../fm.js';

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${label}`);
    failed++;
  }
}

function section(title) {
  console.log(`\n── ${title} ${'─'.repeat(Math.max(0, 50 - title.length))}`);
}

// ─── 1. ENGINE INIT ────────────────────────────────────────────────────────────
section('1. Engine initialisation');

dispatch({ type: 'INIT' });
const s0 = getState();

assert(s0.day === 1, 'Day starts at 1');
assert(s0.pools['TIME'] === 100, 'TIME pool initialised to 100');
assert(s0.pools['CAPACITY'] === 75, 'CAPACITY pool initialised to 75');
// IQ starts at 25, INJ-01 fires +2 during init → 27
assert(s0.pools['INTELLIGENCE_QUALITY'] === 27, 'IQ pool at 27 after init (25 start + INJ-01 +2)');
assert(s0.pools['REPUTATION'] === 10, 'REPUTATION pool initialised to 10');
assert(s0.pools['REGULATORY_STANDING'] === 5, 'REGULATORY_STANDING initialised to 5');
assert(s0.activeRole === 'CISO', 'Active role is CISO');
assert(Object.keys(s0.workstreams).length === 5, 'All 5 workstreams present');
assert(POOL_DEFS.length === 29, `Pool count correct (29 pools, got ${POOL_DEFS.length})`);
assert(GATES.length === 13, `Gate count correct (13 gates, got ${GATES.length})`);

// Day 1 events should have fired (INJ-01, INJ-02, INJ-03)
assert(s0.firedEvents.has('INJ-01'), 'INJ-01 fired on Day 1');
assert(s0.firedEvents.has('INJ-02'), 'INJ-02 fired on Day 1');
assert(s0.firedEvents.has('INJ-03'), 'INJ-03 fired on Day 1');

// INJ-01 applies +2 IQ, INJ-03 applies -5 THIRD_PARTY_TRUST
assert(s0.pools['THIRD_PARTY_TRUST'] === 40, 'THIRD_PARTY_TRUST at 40 after INJ-03 (-5)');
assert(s0.pools['INTELLIGENCE_QUALITY'] === 27, 'IQ at 27 after INJ-01 (+2)');

// ─── 2. POOL BOUNDS ────────────────────────────────────────────────────────────
section('2. Pool bounds enforcement');

dispatch({ type: 'COMMIT_DECISION', gateId: 'G1', choice: 'A' });
const sG1A = getState();

assert(sG1A.decisions['G1'] === 'A', 'G1 decision recorded as A');
// G1-A: +8 IQ (from 27 → 35), -10 CAPACITY (75 → 65), +3 SECURITY_POSTURE (55 → 58)
assert(sG1A.pools['INTELLIGENCE_QUALITY'] === 35, 'G1-A applied +8 IQ correctly');
assert(sG1A.pools['CAPACITY'] === 65, 'G1-A applied -10 CAPACITY correctly');
assert(sG1A.pools['CISO.SECURITY_POSTURE'] === 58, 'G1-A applied +3 SECURITY_POSTURE correctly');

POOL_DEFS.forEach(p => {
  const val = getState().pools[p.id];
  assert(val >= p.min && val <= p.max, `${p.id} within bounds [${p.min}, ${p.max}] (got ${val})`);
});

// ─── 3. DAY ADVANCE + DECAY ────────────────────────────────────────────────────
section('3. Day advance and passive decay');

dispatch({ type: 'INIT' });
dispatch({ type: 'COMMIT_DECISION', gateId: 'G1', choice: 'A' });

const beforeAdvance = { ...getState().pools };
dispatch({ type: 'NEXT_DAY' });
const afterAdvance = getState();

assert(afterAdvance.day === 2, 'Day advanced to 2');
// TIME decays -5 per day, no events affect TIME on day 2
assert(afterAdvance.pools['TIME'] === beforeAdvance['TIME'] - 5, 'TIME decayed by 5');
// IQ decays -2 but INJ-04 fires on Day 2 with +8 IQ → net +6 from beforeAdvance
assert(afterAdvance.pools['INTELLIGENCE_QUALITY'] === beforeAdvance['INTELLIGENCE_QUALITY'] + 6, 'IQ: -2 decay + INJ-04 +8 = net +6');

// ─── 4. DEFAULT DRIFT (no roles marked ready) ──────────────────────────────────
section('4. Default drift — no roles marked ready');

dispatch({ type: 'INIT' });
const poolsBefore = { ...getState().pools };
dispatch({ type: 'NEXT_DAY' }); // no roles marked ready
const afterDrift = getState();

// CISO default: CONTROL_FRAMEWORK -2, TEAM_MORALE -3
assert(afterDrift.pools['CISO.CONTROL_FRAMEWORK'] < poolsBefore['CISO.CONTROL_FRAMEWORK'], 'CISO.CONTROL_FRAMEWORK drifted down when CISO idle');
assert(afterDrift.pools['CISO.TEAM_MORALE'] < poolsBefore['CISO.TEAM_MORALE'], 'CISO.TEAM_MORALE drifted down when CISO idle');
// Legal default: PRIVILEGE_INTEGRITY -4, ETHICAL_TENSION +5
assert(afterDrift.pools['LEGAL.PRIVILEGE_INTEGRITY'] < poolsBefore['LEGAL.PRIVILEGE_INTEGRITY'], 'LEGAL.PRIVILEGE_INTEGRITY drifted down when Legal idle');
assert(afterDrift.pools['LEGAL.ETHICAL_TENSION'] > poolsBefore['LEGAL.ETHICAL_TENSION'], 'LEGAL.ETHICAL_TENSION increased when Legal idle');

// ─── 5. DOMAIN ACTIONS ────────────────────────────────────────────────────────
section('5. Domain action selection and AP budget');

dispatch({ type: 'INIT' });
dispatch({ type: 'TOGGLE_ACTION', role: 'CISO', actionId: 'ciso-team-brief' }); // AP 8
const s5a = getState();
assert(s5a.roleAPSpent['CISO'] === 8, 'CISO AP spent: 8 after selecting ciso-team-brief');
assert(s5a.dailyActions['CISO'].includes('ciso-team-brief'), 'ciso-team-brief in daily actions');

// Toggle off
dispatch({ type: 'TOGGLE_ACTION', role: 'CISO', actionId: 'ciso-team-brief' });
const s5b = getState();
assert(s5b.roleAPSpent['CISO'] === 0, 'CISO AP reset after deselecting action');

// AP budget enforcement: CISO budget is 30. ciso-forensics-ws costs 14 + ciso-audit-docs costs 12 = 26. Adding ciso-control-review (12) should be blocked.
dispatch({ type: 'TOGGLE_ACTION', role: 'CISO', actionId: 'ciso-forensics-ws' });  // 14
dispatch({ type: 'TOGGLE_ACTION', role: 'CISO', actionId: 'ciso-audit-docs' });    // 12 → total 26
dispatch({ type: 'TOGGLE_ACTION', role: 'CISO', actionId: 'ciso-control-review' }); // 12 → would be 38, over budget
const s5c = getState();
assert(s5c.roleAPSpent['CISO'] === 26, 'AP budget enforced — over-budget action rejected (26, not 38)');
assert(!s5c.dailyActions['CISO'].includes('ciso-control-review'), 'ciso-control-review not added when over budget');

// ─── 6. WORKSTREAMS ───────────────────────────────────────────────────────────
section('6. Workstream progress and payoffs');

dispatch({ type: 'INIT' });
// ciso-forensics-ws contributes wsProgress:20 to forensics
dispatch({ type: 'TOGGLE_ACTION', role: 'CISO', actionId: 'ciso-forensics-ws' });
dispatch({ type: 'MARK_READY', role: 'CISO' });
dispatch({ type: 'MARK_READY', role: 'CFO' });
dispatch({ type: 'MARK_READY', role: 'Legal' });
dispatch({ type: 'MARK_READY', role: 'Comms' });
dispatch({ type: 'MARK_READY', role: 'CEO' });
const iqBefore = getState().pools['INTELLIGENCE_QUALITY'];
dispatch({ type: 'NEXT_DAY' });
const s6 = getState();
assert(s6.workstreams['forensics'] === 20, 'Forensics workstream at 20 after one CISO investment');
// Payoff fires at 25%, so 20 < 25 — no payoff yet
assert(!s6.firedPayoffs['forensics-25'], 'Forensics payoff at 25% not yet fired (only at 20%)');

// ─── 7. CASCADE RULES ─────────────────────────────────────────────────────────
section('7. Cascade rules');

dispatch({ type: 'INIT' });
// Force REPUTATION to ≤ -20 via multiple G10=C (delta -18 at ACT_BOUNDARY — simulate directly via decisions)
// Use G6=C: REPUTATION -15, then G13=C: REPUTATION -10 → total -5 (from start 10) → -15 not enough
// Simulate by committing decisions that tank reputation
dispatch({ type: 'COMMIT_DECISION', gateId: 'G6', choice: 'C' }); // -15 REP (from 10 → -5, still not ≤-20)
dispatch({ type: 'COMMIT_DECISION', gateId: 'G13', choice: 'C' }); // -10 REP → -15
dispatch({ type: 'COMMIT_DECISION', gateId: 'G10', choice: 'C' }); // -18 REP at ACT_BOUNDARY (not immediate)
// vis tags are metadata only — ALL deltas apply immediately (matching prototype behavior)
// G6=C: REPUTATION -15 (IMMEDIATE) → 10 - 15 = -5
// G13=C: REPUTATION -10 (END) → -5 - 10 = -15
// G10=C: REPUTATION -18 (ACT_BOUNDARY) → -15 - 18 = -33
const s7 = getState();
assert(s7.pools['REPUTATION'] === -33, `All gate effects apply immediately regardless of vis tag (got ${s7.pools['REPUTATION']}, expected -33)`);
// Cascade threshold is ≤ -20, so it should have fired
assert(s7.firedEvents.has('cascade-rep-low'), 'Reputation cascade triggered (REPUTATION ≤ -20)');

// ─── 8. FULL 21-DAY SIMULATION (default path) ─────────────────────────────────
section('8. Full 21-day simulation — all defaults, all role A choices');

dispatch({ type: 'INIT' });

// Commit all gates on their respective days with choice A
const gatesByDay = {};
GATES.forEach(g => { gatesByDay[g.day] = gatesByDay[g.day] || []; gatesByDay[g.day].push(g); });

for (let d = 1; d <= 21; d++) {
  // Commit any gate active today
  (gatesByDay[d] || []).forEach(g => {
    if (!getState().decisions[g.id]) {
      dispatch({ type: 'COMMIT_DECISION', gateId: g.id, choice: 'A' });
    }
  });

  // Mark all roles ready with a simple action each
  ROLES.forEach(role => {
    dispatch({ type: 'MARK_READY', role });
  });

  if (d < 21) dispatch({ type: 'NEXT_DAY' });
}

const sFinal = getState();
assert(sFinal.day === 21, 'Reached Day 21');
assert(Object.keys(sFinal.decisions).length === 13, `All 13 gates decided (got ${Object.keys(sFinal.decisions).length})`);

// All pools should still be within bounds after 21 days
let boundsOk = true;
POOL_DEFS.forEach(p => {
  const val = sFinal.pools[p.id];
  if (val < p.min || val > p.max) {
    console.error(`  ✗ BOUNDS VIOLATION: ${p.id} = ${val} (expected [${p.min}, ${p.max}])`);
    boundsOk = false;
    failed++;
  }
});
if (boundsOk) { console.log('  ✓ All 29 pools within bounds after 21-day simulation'); passed++; }

const prob21 = calcEndingProbability();
assert(prob21.A + prob21.B + prob21.C === 100, `Ending probabilities sum to 100 (A:${prob21.A} B:${prob21.B} C:${prob21.C})`);
assert(prob21.A > prob21.C, `All-A path favours Ending A (A:${prob21.A}% vs C:${prob21.C}%)`);

// ─── RESULTS ──────────────────────────────────────────────────────────────────
console.log('\n' + '═'.repeat(60));
console.log(`  ${passed + failed} tests run — ${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('  ALL TESTS PASSED ✓ — Stage 0 engine verified\n');
} else {
  console.error(`  ${failed} FAILURE(S) — review above\n`);
  process.exit(1);
}
