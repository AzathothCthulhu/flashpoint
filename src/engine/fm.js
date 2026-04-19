export const AP_BUDGETS = { CISO:30, CFO:25, Legal:25, Comms:25, CEO:30 };

export const DOMAIN_ACTIONS = {
  CISO: [
    { id:'ciso-control-review', label:'Conduct control review',       ap:12, desc:'Strengthen control documentation and identify gaps.',
      effects:[{pool:'CISO.CONTROL_FRAMEWORK',delta:4},{pool:'CISO.AUDIT_READINESS',delta:2}] },
    { id:'ciso-team-brief',     label:'Brief security team',          ap:8,  desc:'Structured briefing to maintain morale and situational awareness.',
      effects:[{pool:'CISO.TEAM_MORALE',delta:7}] },
    { id:'ciso-threat-intel',   label:'Threat intelligence review',   ap:10, desc:'Review external threat intelligence feeds for scenario context.',
      effects:[{pool:'INTELLIGENCE_QUALITY',delta:5}] },
    { id:'ciso-audit-docs',     label:'Audit documentation prep',     ap:12, desc:'Prepare documentation for potential regulatory audit.',
      effects:[{pool:'CISO.AUDIT_READINESS',delta:10}] },
    { id:'ciso-ceo-brief',      label:'Technical brief to CEO',       ap:8,  desc:'Translate technical findings for CEO/board consumption.',
      effects:[{pool:'CISO.EXECUTIVE_TRUST',delta:6}] },
    { id:'ciso-advisory',       label:'Emergency security advisory',  ap:6,  desc:'Issue advisory to systems teams — speeds posture, pressures team.',
      effects:[{pool:'CISO.SECURITY_POSTURE',delta:5},{pool:'CISO.TEAM_MORALE',delta:-4}] },
    { id:'ciso-forensics-ws',   label:'Invest: Forensics workstream', ap:14, desc:'Dedicated investment in forensics capability and output quality.',
      workstream:'forensics', wsProgress:20, effects:[] },
  ],
  CFO: [
    { id:'cfo-liquidity-review',label:'Liquidity position review',    ap:8,  desc:'Review and optimise current cash and reserve position.',
      effects:[{pool:'CFO.LIQUIDITY',delta:3}] },
    { id:'cfo-budget-analysis', label:'Budget variance analysis',     ap:10, desc:'Identify and document all unplanned spend for board visibility.',
      effects:[{pool:'CFO.BUDGET_INTEGRITY',delta:5}] },
    { id:'cfo-vendor-review',   label:'Vendor contract review',       ap:8,  desc:'Review NovaCare and key vendor contracts for liability provisions.',
      effects:[{pool:'CFO.VENDOR_RELATIONSHIPS',delta:5}] },
    { id:'cfo-risk-assess',     label:'Financial risk assessment',    ap:10, desc:'Formal assessment of financial exposure and disclosure obligations.',
      effects:[{pool:'CFO.FINANCIAL_RISK',delta:-6}] },
    { id:'cfo-audit-brief',     label:'Brief audit committee',        ap:6,  desc:'Proactive audit committee communication to maintain governance posture.',
      effects:[{pool:'CFO.BUDGET_INTEGRITY',delta:3},{pool:'CFO.FINANCIAL_RISK',delta:-3}] },
    { id:'cfo-financial-ws',    label:'Invest: Financial workstream', ap:12, desc:'Build financial modelling capability for remediation cost scenarios.',
      workstream:'financial', wsProgress:20, effects:[] },
  ],
  Legal: [
    { id:'legal-privilege-memo',label:'Privilege memo update',            ap:10, desc:'Update privilege documentation to capture recent communications.',
      effects:[{pool:'LEGAL.PRIVILEGE_INTEGRITY',delta:8}] },
    { id:'legal-reg-maint',     label:'Regulator relationship maint.',    ap:8,  desc:'Invest in regulator relationship through informal briefing.',
      effects:[{pool:'LEGAL.REG_RELATIONSHIPS',delta:5}] },
    { id:'legal-contract',      label:'Contract position review',         ap:8,  desc:'Strengthen contractual position vis-à-vis NovaCare.',
      effects:[{pool:'LEGAL.CONTRACT_POSITION',delta:5}] },
    { id:'legal-ethics',        label:'Ethics & obligations review',      ap:6,  desc:'Structured review of competing obligations to reduce tension.',
      effects:[{pool:'LEGAL.ETHICAL_TENSION',delta:-8}] },
    { id:'legal-exposure',      label:'Legal exposure assessment',        ap:10, desc:'Formal assessment and mitigation of known legal exposures.',
      effects:[{pool:'LEGAL.LEGAL_EXPOSURE',delta:-5}] },
    { id:'legal-regulatory-ws', label:'Invest: Regulatory workstream',    ap:12, desc:'Build regulatory engagement strategy and documentation.',
      workstream:'regulatory', wsProgress:20, effects:[] },
  ],
  Comms: [
    { id:'comms-media-outreach',label:'Media relationship outreach',      ap:8,  desc:'Proactive journalist briefing to maintain relationship capital.',
      effects:[{pool:'COMMS.MEDIA_RELATIONSHIPS',delta:5}] },
    { id:'comms-stakeholder',   label:'Stakeholder briefing prep',        ap:10, desc:'Prepare key stakeholder briefing materials for coming days.',
      effects:[{pool:'COMMS.STAKEHOLDER_CONF',delta:7}] },
    { id:'comms-msg-test',      label:'Message testing & refinement',     ap:8,  desc:'Test draft messages with focus groups for clarity and tone.',
      effects:[{pool:'COMMS.MESSAGE_CONTROL',delta:5}] },
    { id:'comms-narrative',     label:'Narrative coherence audit',        ap:10, desc:'Audit all issued statements against narrative framework.',
      effects:[{pool:'COMMS.NARRATIVE_COHERENCE',delta:6}] },
    { id:'comms-capacity',      label:'Crisis capacity build',            ap:8,  desc:'Onboard additional Comms support for sustained crisis load.',
      effects:[{pool:'COMMS.CRISIS_CAPACITY',delta:8}] },
    { id:'comms-media-ws',      label:'Invest: Media workstream',         ap:12, desc:'Build media engagement capability for Act 2 publication wave.',
      workstream:'media', wsProgress:20, effects:[] },
    { id:'comms-stakeholder-ws',label:'Invest: Stakeholder workstream',   ap:12, desc:'Build patient and stakeholder communication infrastructure.',
      workstream:'stakeholder', wsProgress:20, effects:[] },
  ],
  CEO: [
    { id:'ceo-allhands',        label:'Internal all-hands prep',          ap:10, desc:'Prepare and deliver internal all-hands to maintain staff confidence.',
      effects:[{pool:'COMMS.STAKEHOLDER_CONF',delta:5},{pool:'REPUTATION',delta:2}] },
    { id:'ceo-board-rel',       label:'Board relationship maintenance',   ap:8,  desc:'Maintain board chair confidence through proactive communication.',
      effects:[{pool:'CISO.EXECUTIVE_TRUST',delta:3}] },
    { id:'ceo-staff-msg',       label:'Staff confidence message',         ap:8,  desc:'Direct CEO message to all staff on organisational commitment.',
      effects:[{pool:'COMMS.STAKEHOLDER_CONF',delta:8}] },
    { id:'ceo-strategy',        label:'Strategic posture review',         ap:12, desc:'Review and confirm strategic response posture with executive team.',
      effects:[{pool:'CAPACITY',delta:5}] },
    { id:'ceo-crisis-comms',    label:'Crisis leadership communication',  ap:10, desc:'Public CEO statement on the organisation\'s response posture.',
      effects:[{pool:'REPUTATION',delta:3}] },
    { id:'ceo-patient',         label:'Patient stakeholder management',   ap:10, desc:'CEO personal engagement with affected patient groups.',
      effects:[{pool:'PATIENT_CONFIDENCE',delta:5},{pool:'DR_OBI_TRAJECTORY',delta:5}] },
  ],
};

export const DEFAULTS = {
  CISO:  [{pool:'CISO.CONTROL_FRAMEWORK',delta:-2},{pool:'CISO.TEAM_MORALE',delta:-3}],
  CFO:   [{pool:'CFO.BUDGET_INTEGRITY',delta:-2}],
  Legal: [{pool:'LEGAL.PRIVILEGE_INTEGRITY',delta:-4},{pool:'LEGAL.ETHICAL_TENSION',delta:5}],
  Comms: [{pool:'COMMS.MESSAGE_CONTROL',delta:-5},{pool:'COMMS.CRISIS_CAPACITY',delta:-3}],
  CEO:   [{pool:'REPUTATION',delta:-2}],
};

export const WORKSTREAM_PAYOFFS = {
  forensics: [
    { at:25,  label:'Initial Forensics Signal',     effects:[{pool:'INTELLIGENCE_QUALITY',delta:5}] },
    { at:50,  label:'Forensics Mid-Point',           effects:[{pool:'INTELLIGENCE_QUALITY',delta:8},{pool:'CISO.SECURITY_POSTURE',delta:3}] },
    { at:75,  label:'Forensics Evidence Strong',     effects:[{pool:'INTELLIGENCE_QUALITY',delta:12},{pool:'LEGAL.LEGAL_EXPOSURE',delta:-5}] },
    { at:100, label:'Forensics Complete',            effects:[{pool:'INTELLIGENCE_QUALITY',delta:15},{pool:'CISO.AUDIT_READINESS',delta:10},{pool:'LEGAL.LEGAL_EXPOSURE',delta:-8}] },
  ],
  regulatory: [
    { at:25,  label:'Regulatory Relationship Est.',  effects:[{pool:'REGULATORY_STANDING',delta:3}] },
    { at:50,  label:'Regulatory Credibility',        effects:[{pool:'REGULATORY_STANDING',delta:5},{pool:'LEGAL.REG_RELATIONSHIPS',delta:5}] },
    { at:75,  label:'Regulatory Strong Posture',     effects:[{pool:'REGULATORY_STANDING',delta:8},{pool:'LEGAL.LEGAL_EXPOSURE',delta:-8}] },
    { at:100, label:'Regulatory Strategy Complete',  effects:[{pool:'REGULATORY_STANDING',delta:12},{pool:'LEGAL.REG_RELATIONSHIPS',delta:10}] },
  ],
  media: [
    { at:25,  label:'Media Relationships Init.',     effects:[{pool:'COMMS.MEDIA_RELATIONSHIPS',delta:5}] },
    { at:50,  label:'Media Position Strengthened',   effects:[{pool:'COMMS.MEDIA_RELATIONSHIPS',delta:8},{pool:'COMMS.MESSAGE_CONTROL',delta:5}] },
    { at:75,  label:'Media Strategy Executing',      effects:[{pool:'REPUTATION',delta:5},{pool:'COMMS.MEDIA_RELATIONSHIPS',delta:10}] },
    { at:100, label:'Media Campaign Complete',       effects:[{pool:'REPUTATION',delta:10},{pool:'COMMS.NARRATIVE_COHERENCE',delta:10}] },
  ],
  financial: [
    { at:25,  label:'Financial Model Init.',         effects:[{pool:'CFO.BUDGET_INTEGRITY',delta:3}] },
    { at:50,  label:'Financial Modelling Credible',  effects:[{pool:'CFO.BUDGET_INTEGRITY',delta:5},{pool:'CFO.FINANCIAL_RISK',delta:-5}] },
    { at:75,  label:'Financial Strategy Clear',      effects:[{pool:'CFO.LIQUIDITY',delta:5},{pool:'CFO.BUDGET_INTEGRITY',delta:8}] },
    { at:100, label:'Financial Recovery Complete',   effects:[{pool:'CFO.LIQUIDITY',delta:10},{pool:'CFO.FINANCIAL_RISK',delta:-10}] },
  ],
  stakeholder: [
    { at:25,  label:'Stakeholder Framework Est.',    effects:[{pool:'COMMS.STAKEHOLDER_CONF',delta:5}] },
    { at:50,  label:'Stakeholder Engagement Active', effects:[{pool:'COMMS.STAKEHOLDER_CONF',delta:8},{pool:'PATIENT_CONFIDENCE',delta:5}] },
    { at:75,  label:'Stakeholder Confidence Rising', effects:[{pool:'REPUTATION',delta:5},{pool:'PATIENT_CONFIDENCE',delta:8}] },
    { at:100, label:'Stakeholder Strategy Complete', effects:[{pool:'REPUTATION',delta:10},{pool:'PATIENT_CONFIDENCE',delta:12},{pool:'DR_OBI_TRAJECTORY',delta:10}] },
  ],
};

export const ROLES = ['CISO','CFO','Legal','Comms','CEO'];

export function emptyRoleMap(value = false) {
  return Object.fromEntries(ROLES.map(r => [r, typeof value === 'function' ? value() : value]));
}
