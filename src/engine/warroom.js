export const ESCALATION_RULES = [
  { id:'ESC-01', type:'SPEND', urgency:'high', icon:'💰',
    title:'Forensics spend unreconciled with CFO', from:'CISO', to:'CFO',
    desc:'External forensics commitment has created an unplanned liquidity event. CFO domain was affected without direct consultation. Spend-authorisation protocol gap.',
    check:(s,d) => (d['G3']==='A'||d['G3']==='B') && !d['G8'] },

  { id:'ESC-02', type:'CONFLICT', urgency:'high', icon:'⚡',
    title:'NDB clock held — ethical tension accumulating', from:'Legal', to:'CEO',
    desc:'Legal is holding the NDB notification clock but Ethical Tension in the Legal domain is rising. CEO should assess whether to intervene.',
    check:(s,d,day) => d['G2']==='B' && day >= 5 && s['LEGAL.ETHICAL_TENSION'] > 45 },

  { id:'ESC-03', type:'ALERT', urgency:'medium', icon:'⚠️',
    title:'Narrative coherence below warning threshold', from:'Comms', to:'All',
    desc:'Comms Narrative Coherence has dropped below 60. Public statements may be diverging from visible facts.',
    check:(s,d) => s['COMMS.NARRATIVE_COHERENCE'] < 60 && !!d['G6'] },

  { id:'ESC-04', type:'ALERT', urgency:'high', icon:'🔴',
    title:'Security team morale at critical level', from:'CISO', to:'CEO',
    desc:'CISO team morale has dropped into the critical zone (below 40). Burnout risk is material and will degrade decision quality.',
    check:(s) => s['CISO.TEAM_MORALE'] < 40 },

  { id:'ESC-05', type:'CONFLICT', urgency:'high', icon:'⚡',
    title:'Attribution decision vs. evidence quality mismatch', from:'CISO+Comms', to:'Legal',
    desc:'A public attribution position has been taken but Intelligence Quality is below 50. Attribution reversal risk is elevated.',
    check:(s,d) => d['G7']==='B' && s['INTELLIGENCE_QUALITY'] < 50 },

  { id:'ESC-06', type:'ALERT', urgency:'medium', icon:'⚠️',
    title:'Researcher Goodwill approaching adversarial threshold', from:'Comms', to:'All',
    desc:'Researcher Goodwill has dropped below 25. Claire Ashworth is approaching an adversarial posture.',
    check:(s,d,day) => s['RESEARCHER_GOODWILL'] < 25 && day >= 6 },

  { id:'ESC-07', type:'SPEND', urgency:'medium', icon:'💰',
    title:'Remediation budget decision approaching — liquidity low', from:'CFO', to:'All',
    desc:'G8 remediation budget authorisation is approaching and CFO liquidity is already under pressure.',
    check:(s,d,day) => day >= 9 && !d['G8'] && s['CFO.LIQUIDITY'] < 60 },

  { id:'ESC-08', type:'INFO', urgency:'low', icon:'ℹ️',
    title:'Dr. Obi trajectory requires cross-role monitoring', from:'HR/CEO', to:'Legal',
    desc:'Dr. Obi Trajectory pool is below neutral. G11 resolution outcome will depend heavily on current trajectory.',
    check:(s,d,day) => s['DR_OBI_TRAJECTORY'] < 40 && day >= 8 },

  { id:'ESC-09', type:'CONFLICT', urgency:'high', icon:'⚡',
    title:'Regulatory Standing collapse — cascade imminent', from:'Legal', to:'CEO+CFO',
    desc:'Regulatory Standing has reached a critical threshold. If it drops to −20, an automatic capacity cascade will fire.',
    check:(s) => s['REGULATORY_STANDING'] <= -15 },

  { id:'ESC-10', type:'ALERT', urgency:'medium', icon:'⚠️',
    title:'Intelligence Quality degraded — decision reliability affected', from:'CISO', to:'All',
    desc:'Intelligence Quality is below 30. All pending decisions are now subject to a ±20% noise band.',
    check:(s) => s['INTELLIGENCE_QUALITY'] < 30 },
];

export function activeEscalations(state, decisions, day) {
  return ESCALATION_RULES.filter(r => r.check(state, decisions, day));
}
