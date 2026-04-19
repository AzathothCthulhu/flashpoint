export const POOL_DEFS = [
  { id:'TIME',                      name:'Scenario Clock',            tier:'shared',   owner:'All',   start:100, min:0,   max:100, decayPerDay:5,  color:'var(--shared-col)' },
  { id:'CAPACITY',                  name:'Response Capacity',         tier:'shared',   owner:'All',   start:75,  min:0,   max:100, decayPerDay:0,  color:'var(--shared-col)' },
  { id:'REPUTATION',                name:'Public / Stakeholder Trust',tier:'shared',   owner:'All',   start:10,  min:-50, max:50,  decayPerDay:0,  color:'var(--shared-col)' },
  { id:'REGULATORY_STANDING',       name:'Regulator Posture',         tier:'shared',   owner:'All',   start:5,   min:-50, max:50,  decayPerDay:0,  color:'var(--shared-col)' },
  { id:'INTELLIGENCE_QUALITY',      name:'Threat Picture Accuracy',   tier:'shared',   owner:'All',   start:25,  min:0,   max:100, decayPerDay:2,  color:'var(--shared-col)' },

  { id:'CISO.SECURITY_POSTURE',     name:'Security Posture',          tier:'domain',   owner:'CISO',  start:55,  min:0,   max:100, decayPerDay:0,  color:'var(--ciso-col)' },
  { id:'CISO.CONTROL_FRAMEWORK',    name:'Control Framework',         tier:'domain',   owner:'CISO',  start:60,  min:0,   max:100, decayPerDay:0,  color:'var(--ciso-col)' },
  { id:'CISO.AUDIT_READINESS',      name:'Audit Readiness',           tier:'domain',   owner:'CISO',  start:70,  min:0,   max:100, decayPerDay:0,  color:'var(--ciso-col)' },
  { id:'CISO.TEAM_MORALE',          name:'Team Morale',               tier:'domain',   owner:'CISO',  start:65,  min:0,   max:100, decayPerDay:0,  color:'var(--ciso-col)' },
  { id:'CISO.EXECUTIVE_TRUST',      name:'Executive Trust',           tier:'domain',   owner:'CISO',  start:45,  min:-50, max:50,  decayPerDay:0,  color:'var(--ciso-col)' },

  { id:'CFO.LIQUIDITY',             name:'Cash / Liquidity',          tier:'domain',   owner:'CFO',   start:75,  min:0,   max:100, decayPerDay:0,  color:'var(--cfo-col)' },
  { id:'CFO.BUDGET_INTEGRITY',      name:'Budget Integrity',          tier:'domain',   owner:'CFO',   start:80,  min:0,   max:100, decayPerDay:0,  color:'var(--cfo-col)' },
  { id:'CFO.COST_OF_CAPITAL',       name:'Cost of Capital',           tier:'domain',   owner:'CFO',   start:75,  min:0,   max:100, inverted:true,  decayPerDay:0,  color:'var(--cfo-col)' },
  { id:'CFO.FINANCIAL_RISK',        name:'Financial Reporting Risk',  tier:'domain',   owner:'CFO',   start:25,  min:0,   max:100, inverted:true,  decayPerDay:0,  color:'var(--cfo-col)' },
  { id:'CFO.VENDOR_RELATIONSHIPS',  name:'Vendor Relationships',      tier:'domain',   owner:'CFO',   start:20,  min:-50, max:50,  decayPerDay:0,  color:'var(--cfo-col)' },

  { id:'LEGAL.LEGAL_EXPOSURE',      name:'Legal Exposure',            tier:'domain',   owner:'Legal', start:20,  min:0,   max:100, inverted:true,  decayPerDay:0,  color:'var(--legal-col)' },
  { id:'LEGAL.PRIVILEGE_INTEGRITY', name:'Privilege Integrity',       tier:'domain',   owner:'Legal', start:90,  min:0,   max:100, decayPerDay:0,  color:'var(--legal-col)' },
  { id:'LEGAL.REG_RELATIONSHIPS',   name:'Regulatory Relationships',  tier:'domain',   owner:'Legal', start:15,  min:-50, max:50,  decayPerDay:0,  color:'var(--legal-col)' },
  { id:'LEGAL.CONTRACT_POSITION',   name:'Contract Position',         tier:'domain',   owner:'Legal', start:70,  min:0,   max:100, decayPerDay:0,  color:'var(--legal-col)' },
  { id:'LEGAL.ETHICAL_TENSION',     name:'Ethical Tension',           tier:'domain',   owner:'Legal', start:30,  min:0,   max:100, inverted:true,  decayPerDay:0,  color:'var(--legal-col)' },

  { id:'COMMS.MESSAGE_CONTROL',     name:'Message Control',           tier:'domain',   owner:'Comms', start:70,  min:0,   max:100, decayPerDay:0,  color:'var(--comms-col)' },
  { id:'COMMS.MEDIA_RELATIONSHIPS', name:'Media Relationships',       tier:'domain',   owner:'Comms', start:15,  min:-50, max:50,  decayPerDay:0,  color:'var(--comms-col)' },
  { id:'COMMS.STAKEHOLDER_CONF',    name:'Stakeholder Confidence',    tier:'domain',   owner:'Comms', start:65,  min:0,   max:100, decayPerDay:0,  color:'var(--comms-col)' },
  { id:'COMMS.NARRATIVE_COHERENCE', name:'Narrative Coherence',       tier:'domain',   owner:'Comms', start:85,  min:0,   max:100, decayPerDay:0,  color:'var(--comms-col)' },
  { id:'COMMS.CRISIS_CAPACITY',     name:'Comms Capacity',            tier:'domain',   owner:'Comms', start:80,  min:0,   max:100, decayPerDay:0,  color:'var(--comms-col)' },

  { id:'THIRD_PARTY_TRUST',         name:'NovaCare Trust',            tier:'scenario', owner:'All',   start:45,  min:0,   max:100, decayPerDay:0,  color:'var(--scenario-col)' },
  { id:'PATIENT_CONFIDENCE',        name:'Patient Confidence',        tier:'scenario', owner:'All',   start:75,  min:0,   max:100, decayPerDay:0,  color:'var(--scenario-col)' },
  { id:'RESEARCHER_GOODWILL',       name:'Researcher Goodwill',       tier:'scenario', owner:'All',   start:40,  min:0,   max:100, decayPerDay:0,  color:'var(--scenario-col)' },
  { id:'DR_OBI_TRAJECTORY',         name:'Dr. Obi Trajectory',        tier:'scenario', owner:'All',   start:50,  min:0,   max:100, decayPerDay:0,  color:'var(--scenario-col)' },
];

const POOL_ALIAS = {
  'CISO.CONTROL_FRAMEWORK_INTEGRITY': 'CISO.CONTROL_FRAMEWORK',
  'CFO.FINANCIAL_REPORTING_RISK':     'CFO.FINANCIAL_RISK',
  'LEGAL.REGULATORY_RELATIONSHIPS':   'LEGAL.REG_RELATIONSHIPS',
  'COMMS.STAKEHOLDER_CONFIDENCE':     'COMMS.STAKEHOLDER_CONF',
};

export function resolvePool(id) {
  return POOL_ALIAS[id] ?? id;
}

export function poolDef(id) {
  return POOL_DEFS.find(p => p.id === resolvePool(id));
}

export function initialPoolState() {
  const s = {};
  POOL_DEFS.forEach(p => { s[p.id] = p.start; });
  return s;
}

export const CASCADE_RULES = [
  {
    id: 'cascade-time-low',
    check: s => s['TIME'] < 25,
    effects: [
      { pool: 'CAPACITY',          delta: -5,  note: 'TIME < 25 — time pressure consumes capacity' },
      { pool: 'INTELLIGENCE_QUALITY', delta: -3, note: 'TIME < 25 — hurried analysis loses quality' },
    ],
    label: 'TIME CRITICAL: Accelerated capacity and intelligence drain triggered.',
  },
  {
    id: 'cascade-rep-low',
    check: s => s['REPUTATION'] <= -20,
    effects: [
      { pool: 'REGULATORY_STANDING', delta: -5, note: 'REPUTATION ≤ -20 — regulator less forgiving' },
    ],
    label: 'REPUTATION CRITICAL: Regulatory Standing cascade triggered.',
  },
  {
    id: 'cascade-reg-low',
    check: s => s['REGULATORY_STANDING'] <= -20,
    effects: [
      { pool: 'CAPACITY', delta: -8, note: 'REGULATORY_STANDING ≤ -20 — Legal capacity consumed by proceedings' },
    ],
    label: 'REGULATORY STANDING CRITICAL: Legal capacity cascade triggered.',
  },
  {
    id: 'cascade-iq-low',
    check: s => s['INTELLIGENCE_QUALITY'] < 30,
    effects: [],
    label: 'INTELLIGENCE QUALITY LOW: Decision outcomes subject to ±20% noise band.',
    noteOnly: true,
  },
];
