import { EventBus } from './eventBus.js';
import { POOL_DEFS, CASCADE_RULES, resolvePool, initialPoolState } from './pools.js';
import { GATES, CONSEQUENCES } from './gates.js';
import { AP_BUDGETS, DOMAIN_ACTIONS, DEFAULTS, WORKSTREAM_PAYOFFS, ROLES, emptyRoleMap } from './fm.js';
import { EVENTS, evaluateEventCondition } from './events.js';

// ─── INITIAL STATE ────────────────────────────────────────────────────────────

function createInitialState() {
  return {
    pools:        initialPoolState(),
    day:          1,
    decisions:    {},          // { G1: 'A', G2: 'B', ... }
    log:          [],          // append-only effect log
    firedEvents:  new Set(),   // event IDs that have already fired
    // FM layer
    activeRole:   'CISO',
    roleReady:    emptyRoleMap(false),
    roleAPSpent:  emptyRoleMap(0),
    dailyActions: emptyRoleMap(() => []),
    workstreams:  { forensics:0, regulatory:0, media:0, financial:0, stakeholder:0 },
    firedPayoffs: {},
    activityFeed: [],          // war room cross-role activity feed
  };
}

// ─── STATE (mutable singleton — only mutated via dispatch) ───────────────────

let _state = createInitialState();

export function getState() {
  return _state;
}

// ─── DISPATCH ─────────────────────────────────────────────────────────────────

export function dispatch(action) {
  switch (action.type) {
    case 'INIT':            _handleInit();                                 break;
    case 'COMMIT_DECISION': _handleCommitDecision(action.gateId, action.choice); break;
    case 'NEXT_DAY':        _handleNextDay();                              break;
    case 'PREV_DAY':        _handlePrevDay();                              break;
    case 'TOGGLE_ACTION':   _handleToggleAction(action.role, action.actionId); break;
    case 'MARK_READY':      _handleMarkReady(action.role);                 break;
    case 'SWITCH_ROLE':     _handleSwitchRole(action.role);                break;
    case 'RESET':           _handleReset();                                break;
    default: console.warn('Unknown action:', action.type);
  }
}

// ─── HANDLERS ────────────────────────────────────────────────────────────────

function _handleInit() {
  _state = createInitialState();
  _fireEventsForDay(1);
  EventBus.emit('state:changed', { reason: 'INIT', state: _state });
}

function _handleReset() {
  _state = createInitialState();
  _fireEventsForDay(1);
  EventBus.emit('state:changed', { reason: 'RESET', state: _state });
}

function _handleCommitDecision(gateId, choice) {
  _state.decisions[gateId] = choice;
  const effects = CONSEQUENCES[gateId]?.[choice] ?? [];
  effects.forEach(e => _applyDelta(e.pool, e.delta, e.note, gateId, choice, e.vis, e.attr));
  _checkCascades();
  EventBus.emit('state:changed', { reason: 'DECISION', gateId, choice, state: _state });
  EventBus.emit('decision:committed', { gateId, choice });
}

function _handleNextDay() {
  if (_state.day >= 21) return;

  const actMultiplier = _state.day >= 8 ? 1.5 : 1;

  ROLES.forEach(role => {
    if (_state.roleReady[role]) {
      _state.dailyActions[role].forEach(actionId => _applyDomainAction(role, actionId));
    } else {
      (DEFAULTS[role] ?? []).forEach(e => {
        const delta = Math.round(e.delta * actMultiplier);
        _applyDelta(e.pool, delta, `Default drift — ${role} did not act (Day ${_state.day})`, 'DEFAULT', role, 'IMMEDIATE', 'FULL_DISCLOSURE');
      });
    }
  });

  _checkWorkstreamPayoffs();

  POOL_DEFS.forEach(p => {
    if (p.decayPerDay) {
      _applyDelta(p.id, -p.decayPerDay, `Day ${_state.day + 1} passive decay`, 'DECAY', '-', 'IMMEDIATE', 'FULL_DISCLOSURE');
    }
  });

  _state.day++;
  _state.roleReady    = emptyRoleMap(false);
  _state.roleAPSpent  = emptyRoleMap(0);
  _state.dailyActions = emptyRoleMap(() => []);

  _fireEventsForDay(_state.day);
  _checkCascades();

  EventBus.emit('state:changed', { reason: 'DAY_ADVANCE', day: _state.day, state: _state });
  EventBus.emit('day:advanced', { day: _state.day });
}

function _handlePrevDay() {
  if (_state.day <= 1) return;
  _state.day--;
  EventBus.emit('state:changed', { reason: 'DAY_BACK', day: _state.day, state: _state });
}

function _handleToggleAction(role, actionId) {
  if (_state.roleReady[role]) return;
  const action = (DOMAIN_ACTIONS[role] ?? []).find(a => a.id === actionId);
  if (!action) return;

  const idx = _state.dailyActions[role].indexOf(actionId);
  if (idx === -1) {
    if (_state.roleAPSpent[role] + action.ap > AP_BUDGETS[role]) return;
    _state.dailyActions[role].push(actionId);
    _state.roleAPSpent[role] += action.ap;
  } else {
    _state.dailyActions[role].splice(idx, 1);
    _state.roleAPSpent[role] -= action.ap;
  }

  EventBus.emit('state:changed', { reason: 'TOGGLE_ACTION', role, actionId, state: _state });
}

function _handleMarkReady(role) {
  _state.roleReady[role] = true;
  EventBus.emit('state:changed', { reason: 'MARK_READY', role, state: _state });
  EventBus.emit('role:ready', { role });
}

function _handleSwitchRole(role) {
  _state.activeRole = role;
  EventBus.emit('state:changed', { reason: 'SWITCH_ROLE', role, state: _state });
}

// ─── INTERNAL ENGINE FUNCTIONS ────────────────────────────────────────────────

function _applyDelta(poolId, delta, note, source, sourceId, vis, attr) {
  const resolved = resolvePool(poolId);
  const def = POOL_DEFS.find(p => p.id === resolved);
  if (!def) return;

  const before = _state.pools[resolved];
  _state.pools[resolved] = Math.max(def.min, Math.min(def.max, before + delta));
  const actual = _state.pools[resolved] - before;

  const entry = {
    day: _state.day,
    source, sourceId,
    pool: resolved,
    poolName: def.name,
    delta: actual,
    vis, attr, note,
    ts: Date.now(),
  };
  _state.log.unshift(entry);
  _state.activityFeed.unshift(entry);

  EventBus.emit('pool:changed', { pool: resolved, before, after: _state.pools[resolved], delta: actual, entry });
}

function _checkCascades() {
  CASCADE_RULES.forEach(rule => {
    if (!_state.firedEvents.has(rule.id) && rule.check(_state.pools)) {
      _state.firedEvents.add(rule.id);
      if (!rule.noteOnly) {
        rule.effects.forEach(e => {
          _applyDelta(e.pool, e.delta, `CASCADE: ${e.note}`, 'CASCADE', rule.id, 'IMMEDIATE', 'FULL_DISCLOSURE');
        });
      } else {
        _state.log.unshift({
          day: _state.day, source: 'CASCADE', sourceId: rule.id,
          pool: '-', poolName: 'System', delta: 0,
          vis: 'IMMEDIATE', attr: 'FULL_DISCLOSURE', note: rule.label, ts: Date.now(),
        });
      }
      EventBus.emit('cascade:triggered', { rule, state: _state });
    }
  });
}

function _applyDomainAction(role, actionId) {
  const action = (DOMAIN_ACTIONS[role] ?? []).find(a => a.id === actionId);
  if (!action) return;

  if (action.workstream) {
    _state.workstreams[action.workstream] = Math.min(100, _state.workstreams[action.workstream] + (action.wsProgress ?? 20));
  }

  (action.effects ?? []).forEach(e => {
    _applyDelta(resolvePool(e.pool), e.delta, `[${role}] ${action.label}`, 'ACTION', role, 'IMMEDIATE', 'CAUSE_VISIBLE');
  });
}

function _checkWorkstreamPayoffs() {
  Object.entries(WORKSTREAM_PAYOFFS).forEach(([wsId, payoffs]) => {
    payoffs.forEach(p => {
      const key = `${wsId}-${p.at}`;
      if (!_state.firedPayoffs[key] && _state.workstreams[wsId] >= p.at) {
        _state.firedPayoffs[key] = true;
        p.effects.forEach(e => {
          _applyDelta(resolvePool(e.pool), e.delta, `Workstream payoff: ${p.label}`, 'WORKSTREAM', wsId, 'IMMEDIATE', 'FULL_DISCLOSURE');
        });
        EventBus.emit('workstream:payoff', { wsId, payoff: p, state: _state });
      }
    });
  });
}

function _fireEventsForDay(day) {
  EVENTS.filter(e => e.day === day && !_state.firedEvents.has(e.id)).forEach(ev => {
    if (!evaluateEventCondition(ev.condition, _state.pools, _state.decisions)) return;

    _state.firedEvents.add(ev.id);
    ev.effects.forEach(e => {
      _applyDelta(resolvePool(e.pool), e.delta, ev.desc.substring(0, 60), 'EVENT', ev.id, 'IMMEDIATE', 'FULL_DISCLOSURE');
    });
    _state.log.unshift({
      day, source: 'EVENT', sourceId: ev.id,
      pool: '-', poolName: 'Scenario Event', delta: 0,
      vis: 'IMMEDIATE', attr: 'FULL_DISCLOSURE', note: ev.desc, ts: Date.now(),
    });
    EventBus.emit('event:fired', { event: ev, state: _state });
  });
}

// ─── DERIVED STATE ────────────────────────────────────────────────────────────

export function calcEndingProbability() {
  const { decisions, pools } = _state;
  let scoreA = 0, scoreC = 0;

  const reqA = ['G1=A','G5=A','G10=A','G13=A'];
  reqA.forEach(r => {
    const [g, c] = r.split('=');
    scoreA += decisions[g] === c ? 15 : -5;
  });

  ['G3=A','G6=A','G7=A','G9=A','G11=A','G12=A'].forEach(r => {
    const [g, c] = r.split('=');
    if (decisions[g] === c) scoreA += 5;
  });

  ['G5=C','G6=C','G8=C','G9=C','G10=C'].forEach(r => {
    const [g, c] = r.split('=');
    if (decisions[g] === c) scoreC += 20;
  });

  if (pools['REPUTATION'] >= 0)           scoreA += 10;
  if (pools['REPUTATION'] <= -25)         scoreC += 20;
  if (pools['REGULATORY_STANDING'] >= 10) scoreA += 10;
  if (pools['REGULATORY_STANDING'] <= -20)scoreC += 20;

  scoreA = Math.max(5, Math.min(scoreA, 85));
  scoreC = Math.max(5, Math.min(scoreC, 85));
  const scoreB = Math.max(10, 100 - scoreA - scoreC);
  const total   = scoreA + scoreB + scoreC;

  return {
    A: Math.round(scoreA / total * 100),
    B: Math.round(scoreB / total * 100),
    C: Math.round(scoreC / total * 100),
  };
}

export function currentAct() {
  const day = _state.day;
  if (day <= 7)  return 1;
  if (day <= 15) return 2;
  return 3;
}

export function readyCount() {
  return Object.values(_state.roleReady).filter(Boolean).length;
}
