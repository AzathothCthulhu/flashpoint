export const GATES = [
  { id:'G1',  day:1,  act:1, roles:['CISO'], title:'Initial Response Posture',
    desc:'CISO monitoring logs an unusual 4.3GB export from the NovaCare integration. Claire Ashworth (security researcher) emails CISO with a 40-record sample and a 48-hour publication deadline.',
    choices: {
      A: { label:'Activate Formal IR',       desc:'Convene full IR team; notify CEO, CFO, Legal, and Comms; begin formal logging and evidence chain.' },
      B: { label:'Investigation Only',        desc:'Treat as ambiguous; CISO team works quietly; escalate only if confirmed. Preserve optionality.' },
      C: { label:'Immediate Transparency',   desc:'Brief full board same day; begin public-facing preparation; contact regulator informally before facts confirmed.' },
    }, default:'A' },

  { id:'G2',  day:2,  act:1, roles:['Legal'], title:'NDB Notification Clock',
    desc:'CISO team has confirmed the 40-record sample is authentic Meridian data. Legal must now interpret the Notifiable Data Breach threshold — has "awareness" been triggered under s.26WE?',
    choices: {
      A: { label:'Start Clock Now',           desc:'Formally notify OAIC; trigger the 30-day NDB clock based on current awareness. Clean, clear, high-risk.' },
      B: { label:'Hold Pending Investigation',desc:'Legal position: threshold for "awareness" not yet met. Continue investigation; reassess daily. Preserves optionality.' },
      C: { label:'Informal Heads-Up',         desc:'Informal call to OAIC contact to flag the investigation without formally triggering the NDB clock.' },
    }, default:'B' },

  { id:'G3',  day:3,  act:1, roles:['CISO','CFO'], title:'External Forensics Engagement',
    desc:'NovaCare has issued a formal denial. Internal investigation is producing limited intelligence. The team must decide whether to engage external forensics and at what investment level.',
    choices: {
      A: { label:'Top-Tier Firm ($150K)',     desc:'Engage Mandiant or equivalent. Fastest, highest quality, definitive evidence. Significant liquidity event.' },
      B: { label:'Mid-Tier Firm ($55K)',      desc:'Engage domestic mid-tier firm. Adequate quality, moderate cost, 48hr onboarding lag.' },
      C: { label:'In-House Only ($0)',        desc:'Decline external engagement. CISO team runs investigation. Zero cost; thinnest capability; IQ ceiling capped.' },
    }, default:'B' },

  { id:'G4',  day:4,  act:1, roles:['CEO'], title:'Board Briefing Scope',
    desc:'Board Chair Lisa Park has called asking for a briefing. CEO must decide how broadly to brief the board and with what level of detail on worst-case scenarios.',
    choices: {
      A: { label:'Full Briefing incl. Worst Case', desc:'Brief full board with scenarios including worst-case disclosure requirements. Maximum upward transparency.' },
      B: { label:'Measured Briefing — Facts Only',  desc:'Brief full board on confirmed facts only; defer scenario planning to next meeting. Standard approach.' },
      C: { label:'Chair-Only Until Facts Clear',    desc:'Brief Board Chair only; hold full board briefing until investigation progresses.' },
    }, default:'B' },

  { id:'G5',  day:6,  act:1, roles:['HR','CEO'], title:'Internal Notification incl. Dr. Obi',
    desc:'Forensics has now identified potentially affected records. Dr. Sarah Obi — a senior physician at Meridian — is among those whose data may be in the exposed sample.',
    choices: {
      A: { label:'Proactive to All Potentially Affected', desc:'Notify all staff whose records may be exposed with pastoral support. Includes Dr. Obi. Full transparency approach.' },
      B: { label:'Targeted to Confirmed-Affected Only',   desc:'Notify only those whose records are confirmed in the dark web sample. Includes Dr. Obi if confirmed.' },
      C: { label:'Hold Until Public Announcement',        desc:'Defer internal notification until public announcement. Staff learn from media. High trust cost.' },
    }, default:'B' },

  { id:'G6',  day:8,  act:2, roles:['Comms'], title:'Response to Researcher Publication',
    desc:'Claire Ashworth\'s Substack post has gone live and been cross-posted to The Guardian AU. Media is picking up the story.',
    choices: {
      A: { label:'Acknowledge Investigation', desc:'Statement acknowledges ongoing investigation, commits to transparency, thanks researcher for responsible disclosure.' },
      B: { label:'Neutral Holding Statement', desc:'"Aware of reports, investigating." No commitment, no denial. Minimal exposure but cedes narrative.' },
      C: { label:'Rebut Publicly',            desc:'Challenge the researcher\'s findings; dispute the sample; position NovaCare cooperation as ongoing. High risk if rebuttal fails.' },
    }, default:'B' },

  { id:'G7',  day:10, act:2, roles:['CISO','Comms'], title:'Attribution Position',
    desc:'Forensics evidence now points to a dark web aggregator using NovaCare API credentials. The team must determine what attribution position to take publicly.',
    choices: {
      A: { label:'Evidence-Led: Third-Party Aggregator', desc:'Accurate technical attribution — dark web aggregator with NovaCare API credentials. Correct and defensible.' },
      B: { label:'Blame NovaCare',                       desc:'Commercial pressure: attribute publicly to NovaCare failure. Shifts blame but risks reversal if forensics contradicts.' },
      C: { label:'Withhold Attribution',                 desc:'Public statement does not attribute. "Investigation ongoing." Preserves optionality at cost of narrative vacuum.' },
    }, default:'A' },

  { id:'G8',  day:11, act:2, roles:['CFO'], title:'Remediation Budget Authorisation',
    desc:'Emergency board meeting requires CFO to authorise remediation spend: forensics completion, outside counsel, patient notification, credit monitoring, and system hardening.',
    choices: {
      A: { label:'Full Remediation ($1.8M)',        desc:'Authorise full package: forensics, outside counsel, notification, credit monitoring, system hardening. Maximum response.' },
      B: { label:'Phased ($600K now)',               desc:'Authorise $600K immediately with tranches conditional on board approval. Balanced response.' },
      C: { label:'Minimum Statutory Only ($200K)',  desc:'Authorise statutory-minimum only: notification and mandatory disclosures. Defer all voluntary actions.' },
    }, default:'B' },

  { id:'G9',  day:13, act:2, roles:['Legal'], title:'Regulator Disclosure Scope',
    desc:'OAIC has made formal contact. Legal must decide the scope of voluntary disclosure to the regulator — specifically whether to include pre-incident control history and CISO\'s documented NovaCare warnings.',
    choices: {
      A: { label:'Full Voluntary Disclosure', desc:'Voluntary disclosure including pre-incident control history and CISO\'s NovaCare warnings. Maximum cooperation.' },
      B: { label:'Responsive Disclosure',     desc:'Answer only what is asked. Complete but not volunteered. Standard posture.' },
      C: { label:'Formal Legal Response',     desc:'Assert legal positions formally. Privilege claimed where possible. Adversarial posture with regulator.' },
    }, default:'B' },

  { id:'G10', day:14, act:2, roles:['CEO','Legal','CFO'], title:'Strategic Posture',
    desc:'The shape of the crisis is now clear. The executive team must determine the organisation\'s strategic posture for the resolution phase.',
    choices: {
      A: { label:'Remediation-First',    desc:'Acknowledge failures, fix root causes, compensate affected patients, accept probable civil penalty. Accountability framing.' },
      B: { label:'Balanced Defence',     desc:'Remediate while preserving legal positions. Measured response. Standard corporate posture.' },
      C: { label:'Litigation-Defensive', desc:'Harden positions against class action. Limit admissions. Litigation-led strategy. High reputational cost.' },
    }, default:'B' },

  { id:'G11', day:17, act:3, roles:['HR','Legal'], title:'Dr. Obi Support Response',
    desc:'Dr. Sarah Obi\'s trajectory has now resolved. HR and Legal must determine what support response Meridian provides to her, and whether a confidential return pathway is offered.',
    choices: {
      A: { label:'Full Support, Confidential Return', desc:'Private return pathway with full occupational health support. Confidentiality assured with medical board.' },
      B: { label:'Policy-Standard Support',           desc:'Standard EAP access, public-facing neutral. No special provisions beyond policy.' },
      C: { label:'Dispute Over Timing',               desc:'Disagreement over disclosure timing escalates. Potential termination or resignation. Hostile trajectory.' },
    }, default:'A' },

  { id:'G12', day:18, act:3, roles:['Board','CEO'], title:'CEO Accountability Position',
    desc:'The board accountability session has arrived. The CEO\'s position must be formally resolved.',
    choices: {
      A: { label:'Public Accountability — CEO Retains', desc:'CEO publicly accepts accountability; stays in role with board confidence vote. Clean, risky, potentially powerful.' },
      B: { label:'Defer Pending Review',                desc:'Formal review commissioned; CEO position under review but unchanged pending outcome.' },
      C: { label:'CEO Departure',                      desc:'CEO resigns or is removed. Board statement on change of leadership. Definitive but destabilising.' },
    }, default:'A' },

  { id:'G13', day:19, act:3, roles:['Comms','CEO'], title:'Final Public Narrative',
    desc:'The final session. The team must determine the public narrative that will close the crisis.',
    choices: {
      A: { label:'Accountability-Led', desc:'"We failed. Here\'s how we fix it." Specific commitments with timelines. Named responsibility.' },
      B: { label:'Learning-Led',       desc:'"We\'ve learned from this." Growth framing. Commitments stated more generally. Softer landing.' },
      C: { label:'Industry-Led',       desc:'"This is a sector-wide issue; we\'re part of a pattern." Deflection framing. Rarely lands well in healthcare.' },
    }, default:'A' },
];

export const CONSEQUENCES = {
  G1:{
    A:[
      {pool:'INTELLIGENCE_QUALITY',      delta:8,   vis:'IMMEDIATE',    attr:'FULL_DISCLOSURE', note:'Formal IR surfaces more signal'},
      {pool:'CAPACITY',                  delta:-10,  vis:'IMMEDIATE',    attr:'FULL_DISCLOSURE', note:'IR consumes capacity across all roles'},
      {pool:'CISO.SECURITY_POSTURE',     delta:3,   vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Formal posture strengthens controls'},
      {pool:'CISO.TEAM_MORALE',          delta:-5,  vis:'NEXT_LOGIN',   attr:'CAUSE_VISIBLE',   note:'Team under pressure'},
      {pool:'LEGAL.PRIVILEGE_INTEGRITY', delta:5,   vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Legal in room from Day 1'},
      {pool:'COMMS.MESSAGE_CONTROL',     delta:3,   vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Comms in room early'},
    ],
    B:[
      {pool:'INTELLIGENCE_QUALITY',      delta:3,   vis:'IMMEDIATE',    attr:'FULL_DISCLOSURE', note:'Limited visibility small-team'},
      {pool:'CAPACITY',                  delta:-3,  vis:'IMMEDIATE',    attr:'FULL_DISCLOSURE', note:'Light capacity draw'},
      {pool:'CISO.SECURITY_POSTURE',     delta:-2,  vis:'NEXT_LOGIN',   attr:'CAUSE_HIDDEN',    note:'Informal posture weakens evidence chain'},
      {pool:'LEGAL.PRIVILEGE_INTEGRITY', delta:-8,  vis:'ACT_BOUNDARY', attr:'CAUSE_HIDDEN',    note:'Legal not looped in; privilege erosion'},
    ],
    C:[
      {pool:'REGULATORY_STANDING',       delta:8,   vis:'NEXT_LOGIN',   attr:'FULL_DISCLOSURE', note:'Proactive regulator contact earns points'},
      {pool:'REPUTATION',                delta:-3,  vis:'NEXT_LOGIN',   attr:'FULL_DISCLOSURE', note:'Early signalling before facts known'},
      {pool:'COMMS.MESSAGE_CONTROL',     delta:-15, vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Going public without narrative structure'},
      {pool:'LEGAL.LEGAL_EXPOSURE',      delta:12,  vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Early public commitments create exposure'},
      {pool:'THIRD_PARTY_TRUST',         delta:-10, vis:'NEXT_LOGIN',   attr:'CAUSE_HIDDEN',    note:'NovaCare retrenches when Meridian goes first'},
      {pool:'RESEARCHER_GOODWILL',       delta:8,   vis:'NEXT_LOGIN',   attr:'CAUSE_HIDDEN',    note:'Researcher values transparency'},
    ],
  },
  G2:{
    A:[
      {pool:'REGULATORY_STANDING',       delta:12,  vis:'NEXT_LOGIN',   attr:'FULL_DISCLOSURE', note:'Proactive notification earns regulator confidence'},
      {pool:'LEGAL.REG_RELATIONSHIPS',   delta:8,   vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'OAIC direct engagement'},
      {pool:'LEGAL.LEGAL_EXPOSURE',      delta:-5,  vis:'NEXT_LOGIN',   attr:'CAUSE_VISIBLE',   note:'Notification discharges obligation'},
      {pool:'COMMS.MESSAGE_CONTROL',     delta:-8,  vis:'NEXT_LOGIN',   attr:'CAUSE_HIDDEN',    note:'Notification likely becomes public'},
      {pool:'CFO.FINANCIAL_RISK',        delta:5,   vis:'ACT_BOUNDARY', attr:'CAUSE_HIDDEN',    note:'Notification is materially disclosable'},
      {pool:'THIRD_PARTY_TRUST',         delta:-5,  vis:'NEXT_LOGIN',   attr:'CAUSE_HIDDEN',    note:'NovaCare sees notification as commercial pressure'},
      {pool:'LEGAL.ETHICAL_TENSION',     delta:-8,  vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Legal aligned to obligation; pressure eases'},
    ],
    B:[
      {pool:'REGULATORY_STANDING',       delta:-3,  vis:'NEXT_LOGIN',   attr:'FULL_DISCLOSURE', note:'Delay risks regulator view of poor posture'},
      {pool:'LEGAL.LEGAL_EXPOSURE',      delta:8,   vis:'NEXT_LOGIN',   attr:'CAUSE_VISIBLE',   note:'Unnotified breach risk accrues daily'},
      {pool:'LEGAL.ETHICAL_TENSION',     delta:12,  vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Holding the clock creates conscience pressure'},
      {pool:'LEGAL.PRIVILEGE_INTEGRITY', delta:3,   vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Legal in driver\'s seat preserves privilege'},
      {pool:'COMMS.MESSAGE_CONTROL',     delta:8,   vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'No regulator trigger preserves narrative window'},
      {pool:'INTELLIGENCE_QUALITY',      delta:3,   vis:'NEXT_LOGIN',   attr:'CAUSE_HIDDEN',    note:'Extra investigation window improves picture'},
    ],
    C:[
      {pool:'REGULATORY_STANDING',       delta:5,   vis:'NEXT_LOGIN',   attr:'FULL_DISCLOSURE', note:'Informal courtesy; smaller than formal'},
      {pool:'LEGAL.REG_RELATIONSHIPS',   delta:5,   vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Personal contact invested'},
      {pool:'LEGAL.LEGAL_EXPOSURE',      delta:0,   vis:'IMMEDIATE',    attr:'FULL_DISCLOSURE', note:'Neutral — no formal discharge or change'},
      {pool:'LEGAL.ETHICAL_TENSION',     delta:-2,  vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Partial discharge of conscience'},
      {pool:'COMMS.MESSAGE_CONTROL',     delta:3,   vis:'NEXT_LOGIN',   attr:'CAUSE_VISIBLE',   note:'Informal channel preserves some control'},
    ],
  },
  G3:{
    A:[
      {pool:'INTELLIGENCE_QUALITY',      delta:25,  vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Top-tier forensics produces definitive picture by Day 7'},
      {pool:'CFO.LIQUIDITY',             delta:-12, vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'$150K emergency spend'},
      {pool:'CFO.BUDGET_INTEGRITY',      delta:-8,  vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Unplanned major spend'},
      {pool:'CISO.SECURITY_POSTURE',     delta:8,   vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Findings enable rapid remediation'},
      {pool:'CISO.EXECUTIVE_TRUST',      delta:5,   vis:'NEXT_LOGIN',   attr:'CAUSE_VISIBLE',   note:'Decisive action reads as competence'},
      {pool:'LEGAL.LEGAL_EXPOSURE',      delta:-5,  vis:'ACT_BOUNDARY', attr:'CAUSE_HIDDEN',    note:'Strong forensics supports defensibility'},
    ],
    B:[
      {pool:'INTELLIGENCE_QUALITY',      delta:15,  vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Adequate but slower and less definitive'},
      {pool:'CFO.LIQUIDITY',             delta:-5,  vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'$55K emergency spend'},
      {pool:'CFO.BUDGET_INTEGRITY',      delta:-3,  vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Moderate unplanned spend'},
      {pool:'CISO.SECURITY_POSTURE',     delta:4,   vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Findings support remediation, less decisively'},
    ],
    C:[
      {pool:'INTELLIGENCE_QUALITY',      delta:5,   vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Small team; incomplete picture'},
      {pool:'CFO.BUDGET_INTEGRITY',      delta:3,   vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Discipline rewarded short-term'},
      {pool:'CISO.TEAM_MORALE',          delta:-12, vis:'NEXT_LOGIN',   attr:'CAUSE_VISIBLE',   note:'Team under unsustainable load'},
      {pool:'CISO.EXECUTIVE_TRUST',      delta:-3,  vis:'ACT_BOUNDARY', attr:'CAUSE_HIDDEN',    note:'Board may view as under-resourcing'},
      {pool:'LEGAL.LEGAL_EXPOSURE',      delta:8,   vis:'ACT_BOUNDARY', attr:'CAUSE_HIDDEN',    note:'Weak evidence chain is a defensibility problem'},
    ],
  },
  G4:{
    A:[
      {pool:'CISO.EXECUTIVE_TRUST',      delta:8,   vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'CISO in full briefing reads as seriousness'},
      {pool:'LEGAL.PRIVILEGE_INTEGRITY', delta:-5,  vis:'ACT_BOUNDARY', attr:'CAUSE_HIDDEN',    note:'More directors weakens privilege envelope'},
      {pool:'REPUTATION',                delta:0,   vis:'IMMEDIATE',    attr:'FULL_DISCLOSURE', note:'Board briefing is internal; no reputation effect yet'},
      {pool:'REGULATORY_STANDING',       delta:3,   vis:'ACT_BOUNDARY', attr:'CAUSE_HIDDEN',    note:'Board-engaged governance is regulator-friendly'},
    ],
    B:[
      {pool:'CISO.EXECUTIVE_TRUST',      delta:3,   vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Standard board engagement'},
      {pool:'LEGAL.PRIVILEGE_INTEGRITY', delta:0,   vis:'IMMEDIATE',    attr:'FULL_DISCLOSURE', note:'Neutral'},
    ],
    C:[
      {pool:'LEGAL.PRIVILEGE_INTEGRITY', delta:5,   vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Smaller envelope preserves privilege'},
      {pool:'CISO.EXECUTIVE_TRUST',      delta:-3,  vis:'ACT_BOUNDARY', attr:'CAUSE_HIDDEN',    note:'Full board feels excluded when they learn'},
      {pool:'LEGAL.ETHICAL_TENSION',     delta:8,   vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Fault Line: Chair may pressure delay'},
      {pool:'REGULATORY_STANDING',       delta:-5,  vis:'END',          attr:'CAUSE_HIDDEN',    note:'If regulator views board was kept in dark'},
    ],
  },
  G5:{
    A:[
      {pool:'COMMS.STAKEHOLDER_CONF',    delta:12,  vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Staff trust rises when treated as stakeholders'},
      {pool:'REPUTATION',                delta:-5,  vis:'ACT_BOUNDARY', attr:'CAUSE_HIDDEN',    note:'Will leak to media; some early public concern'},
      {pool:'DR_OBI_TRAJECTORY',         delta:25,  vis:'IMMEDIATE',    attr:'FULL_DISCLOSURE', note:'Dr. Obi gets agency over her own disclosure'},
      {pool:'PATIENT_CONFIDENCE',        delta:8,   vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Early transparency builds patient trust'},
      {pool:'COMMS.MESSAGE_CONTROL',     delta:-10, vis:'NEXT_LOGIN',   attr:'CAUSE_VISIBLE',   note:'Wider internal notification harder to contain'},
      {pool:'LEGAL.LEGAL_EXPOSURE',      delta:-3,  vis:'ACT_BOUNDARY', attr:'CAUSE_HIDDEN',    note:'Proactive disclosure reduces failure-to-notify exposure'},
    ],
    B:[
      {pool:'COMMS.STAKEHOLDER_CONF',    delta:3,   vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Moderate — affected people notified, others unaware'},
      {pool:'DR_OBI_TRAJECTORY',         delta:10,  vis:'IMMEDIATE',    attr:'FULL_DISCLOSURE', note:'Dr. Obi notified; less support envelope than G5-A'},
      {pool:'PATIENT_CONFIDENCE',        delta:3,   vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Modest — only directly-affected aware'},
    ],
    C:[
      {pool:'COMMS.STAKEHOLDER_CONF',    delta:-20, vis:'ACT_BOUNDARY', attr:'FULL_DISCLOSURE', note:'Staff learn from media — significant trust damage'},
      {pool:'DR_OBI_TRAJECTORY',         delta:-30, vis:'ACT_BOUNDARY', attr:'FULL_DISCLOSURE', note:'Dr. Obi learns from news; forecloses supportive endings'},
      {pool:'PATIENT_CONFIDENCE',        delta:-15, vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Patient trust damage when concealment emerges'},
      {pool:'COMMS.NARRATIVE_COHERENCE', delta:-15, vis:'ACT_BOUNDARY', attr:'CAUSE_HIDDEN',    note:'Gap between stated transparency and actual concealment'},
      {pool:'LEGAL.LEGAL_EXPOSURE',      delta:15,  vis:'END',          attr:'CAUSE_HIDDEN',    note:'Failure-to-notify individuals exposure accumulates'},
    ],
  },
  G6:{
    A:[
      {pool:'COMMS.MESSAGE_CONTROL',     delta:12,  vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Owning narrative beats the story'},
      {pool:'REPUTATION',                delta:5,   vis:'NEXT_LOGIN',   attr:'FULL_DISCLOSURE', note:'Acknowledgement lands better than rebuttal'},
      {pool:'RESEARCHER_GOODWILL',       delta:15,  vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Thanking the researcher is rare and valued'},
      {pool:'LEGAL.LEGAL_EXPOSURE',      delta:5,   vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Public acknowledgement creates some liability surface'},
      {pool:'COMMS.NARRATIVE_COHERENCE', delta:10,  vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Statement aligns with visible reality'},
    ],
    B:[
      {pool:'COMMS.MESSAGE_CONTROL',     delta:-5,  vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Holding statement cedes narrative ground'},
      {pool:'REPUTATION',                delta:-3,  vis:'NEXT_LOGIN',   attr:'FULL_DISCLOSURE', note:'Passive framing reads as uncertain'},
      {pool:'LEGAL.LEGAL_EXPOSURE',      delta:-2,  vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Minimal commitment = minimal exposure'},
    ],
    C:[
      {pool:'COMMS.MESSAGE_CONTROL',     delta:5,   vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Rebuttal is active stance'},
      {pool:'COMMS.NARRATIVE_COHERENCE', delta:-25, vis:'NEXT_LOGIN',   attr:'FULL_DISCLOSURE', note:'If rebuttal fails to match facts, narrative collapses'},
      {pool:'REPUTATION',                delta:-15, vis:'NEXT_LOGIN',   attr:'FULL_DISCLOSURE', note:'Rebuttals rarely land in healthcare data breach'},
      {pool:'RESEARCHER_GOODWILL',       delta:-25, vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Researcher becomes adversarial; follow-up publications likely'},
      {pool:'COMMS.MEDIA_RELATIONSHIPS', delta:-10, vis:'NEXT_LOGIN',   attr:'CAUSE_HIDDEN',    note:'Journalists dislike rebuttals of competent research'},
      {pool:'LEGAL.LEGAL_EXPOSURE',      delta:12,  vis:'ACT_BOUNDARY', attr:'CAUSE_HIDDEN',    note:'Public denials create defamation and misleading conduct exposure'},
    ],
  },
  G7:{
    A:[
      {pool:'COMMS.NARRATIVE_COHERENCE', delta:8,   vis:'NEXT_LOGIN',   attr:'CAUSE_VISIBLE',   note:'Evidence-led attribution survives scrutiny'},
      {pool:'REGULATORY_STANDING',       delta:5,   vis:'ACT_BOUNDARY', attr:'CAUSE_HIDDEN',    note:'Regulator appreciates accurate characterisation'},
      {pool:'THIRD_PARTY_TRUST',         delta:12,  vis:'NEXT_LOGIN',   attr:'CAUSE_HIDDEN',    note:'NovaCare sees Meridian as fair partner'},
      {pool:'INTELLIGENCE_QUALITY',      delta:5,   vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Correct attribution reinforces accurate picture'},
    ],
    B:[
      {pool:'COMMS.NARRATIVE_COHERENCE', delta:-15, vis:'ACT_BOUNDARY', attr:'CAUSE_HIDDEN',    note:'If forensics reveals credential theft, attribution reverses publicly'},
      {pool:'THIRD_PARTY_TRUST',         delta:-30, vis:'IMMEDIATE',    attr:'FULL_DISCLOSURE', note:'NovaCare becomes openly hostile; cooperation ends'},
      {pool:'LEGAL.CONTRACT_POSITION',   delta:-15, vis:'ACT_BOUNDARY', attr:'CAUSE_HIDDEN',    note:'Public blame complicates contractual remedies'},
      {pool:'LEGAL.LEGAL_EXPOSURE',      delta:10,  vis:'ACT_BOUNDARY', attr:'CAUSE_HIDDEN',    note:'NovaCare counter-claim risk materialises'},
    ],
    C:[
      {pool:'COMMS.MESSAGE_CONTROL',     delta:-5,  vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Narrative vacuum filled by speculation'},
      {pool:'COMMS.NARRATIVE_COHERENCE', delta:5,   vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'No specific claim = no inconsistency risk'},
      {pool:'THIRD_PARTY_TRUST',         delta:3,   vis:'NEXT_LOGIN',   attr:'CAUSE_HIDDEN',    note:'NovaCare neutral on withheld attribution'},
    ],
  },
  G8:{
    A:[
      {pool:'CFO.LIQUIDITY',             delta:-25, vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Major liquidity event — $1.8M'},
      {pool:'CFO.BUDGET_INTEGRITY',      delta:-18, vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Material budget variance'},
      {pool:'CFO.FINANCIAL_RISK',        delta:10,  vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Spend becomes disclosable'},
      {pool:'REPUTATION',                delta:12,  vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Visible investment in response'},
      {pool:'REGULATORY_STANDING',       delta:10,  vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Full remediation is what regulators look for'},
      {pool:'PATIENT_CONFIDENCE',        delta:15,  vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Credit monitoring + visible action restores trust'},
      {pool:'CISO.SECURITY_POSTURE',     delta:12,  vis:'END',          attr:'CAUSE_VISIBLE',   note:'Full hardening improves long-term posture'},
    ],
    B:[
      {pool:'CFO.LIQUIDITY',             delta:-8,  vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Manageable liquidity event — $600K'},
      {pool:'CFO.BUDGET_INTEGRITY',      delta:-6,  vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Moderate variance'},
      {pool:'REPUTATION',                delta:3,   vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Adequate visible response'},
      {pool:'REGULATORY_STANDING',       delta:3,   vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Phased approach viewed as reasonable'},
      {pool:'PATIENT_CONFIDENCE',        delta:5,   vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Some action visible'},
    ],
    C:[
      {pool:'CFO.LIQUIDITY',             delta:-3,  vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Minimal — $200K statutory only'},
      {pool:'CFO.BUDGET_INTEGRITY',      delta:-2,  vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Minor variance'},
      {pool:'REPUTATION',                delta:-12, vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Inadequate response reads as minimisation'},
      {pool:'REGULATORY_STANDING',       delta:-15, vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Regulator views as insufficient'},
      {pool:'PATIENT_CONFIDENCE',        delta:-20, vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Patients feel minimised'},
      {pool:'LEGAL.LEGAL_EXPOSURE',      delta:18,  vis:'END',          attr:'CAUSE_HIDDEN',    note:'Inadequate remediation increases civil exposure'},
    ],
  },
  G9:{
    A:[
      {pool:'REGULATORY_STANDING',       delta:18,  vis:'NEXT_LOGIN',   attr:'CAUSE_VISIBLE',   note:'Voluntary disclosure of control history is rare'},
      {pool:'LEGAL.REG_RELATIONSHIPS',   delta:12,  vis:'NEXT_LOGIN',   attr:'CAUSE_VISIBLE',   note:'OAIC reads as full cooperation'},
      {pool:'LEGAL.LEGAL_EXPOSURE',      delta:8,   vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Voluntary disclosure creates evidence for enforcement decisions'},
      {pool:'LEGAL.PRIVILEGE_INTEGRITY', delta:-10, vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Privileged material may need to be waived'},
      {pool:'CISO.EXECUTIVE_TRUST',      delta:5,   vis:'NEXT_LOGIN',   attr:'CAUSE_VISIBLE',   note:'CISO documented concerns now vindicated'},
    ],
    B:[
      {pool:'REGULATORY_STANDING',       delta:3,   vis:'NEXT_LOGIN',   attr:'CAUSE_VISIBLE',   note:'Standard posture; no bonus'},
      {pool:'LEGAL.REG_RELATIONSHIPS',   delta:2,   vis:'NEXT_LOGIN',   attr:'CAUSE_VISIBLE',   note:'Neutral'},
      {pool:'LEGAL.PRIVILEGE_INTEGRITY', delta:3,   vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Standard privilege preserved'},
    ],
    C:[
      {pool:'REGULATORY_STANDING',       delta:-20, vis:'NEXT_LOGIN',   attr:'CAUSE_VISIBLE',   note:'Adversarial posture hardens regulator stance'},
      {pool:'LEGAL.REG_RELATIONSHIPS',   delta:-18, vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'OAIC relationship severely damaged'},
      {pool:'LEGAL.PRIVILEGE_INTEGRITY', delta:8,   vis:'IMMEDIATE',    attr:'CAUSE_VISIBLE',   note:'Privilege aggressively preserved'},
      {pool:'LEGAL.LEGAL_EXPOSURE',      delta:15,  vis:'END',          attr:'CAUSE_HIDDEN',    note:'Enforcement action likely triggered'},
      {pool:'REPUTATION',                delta:-8,  vis:'END',          attr:'CAUSE_HIDDEN',    note:'If enforcement becomes public, significant reputation damage'},
    ],
  },
  G10:{
    A:[
      {pool:'REPUTATION',                delta:15,  vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Accountability framing lands well'},
      {pool:'REGULATORY_STANDING',       delta:12,  vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Civil penalty likely but regulator satisfied'},
      {pool:'LEGAL.LEGAL_EXPOSURE',      delta:15,  vis:'END',          attr:'CAUSE_VISIBLE',   note:'Exposure acknowledged; civil penalty likely'},
      {pool:'CFO.LIQUIDITY',             delta:-10, vis:'END',          attr:'CAUSE_HIDDEN',    note:'Compensation costs materialise'},
      {pool:'PATIENT_CONFIDENCE',        delta:20,  vis:'END',          attr:'CAUSE_VISIBLE',   note:'Significant trust restoration'},
      {pool:'COMMS.NARRATIVE_COHERENCE', delta:15,  vis:'END',          attr:'CAUSE_VISIBLE',   note:'Clean narrative arc'},
    ],
    B:[
      {pool:'REPUTATION',                delta:5,   vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Standard approach, standard result'},
      {pool:'REGULATORY_STANDING',       delta:3,   vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Neutral'},
      {pool:'LEGAL.LEGAL_EXPOSURE',      delta:5,   vis:'END',          attr:'CAUSE_VISIBLE',   note:'Moderate exposure'},
    ],
    C:[
      {pool:'REPUTATION',                delta:-18, vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Defensive posture reads as uncaring'},
      {pool:'REGULATORY_STANDING',       delta:-12, vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Regulator escalates'},
      {pool:'LEGAL.LEGAL_EXPOSURE',      delta:-10, vis:'END',          attr:'CAUSE_VISIBLE',   note:'Short-term exposure reduced'},
      {pool:'PATIENT_CONFIDENCE',        delta:-25, vis:'END',          attr:'CAUSE_VISIBLE',   note:'Patients alienated'},
      {pool:'COMMS.NARRATIVE_COHERENCE', delta:-18, vis:'END',          attr:'CAUSE_VISIBLE',   note:'Defensive narrative does not reconcile'},
    ],
  },
  G11:{
    A:[
      {pool:'DR_OBI_TRAJECTORY',         delta:30,  vis:'IMMEDIATE',    attr:'FULL_DISCLOSURE', note:'Supportive resolution'},
      {pool:'COMMS.STAKEHOLDER_CONF',    delta:12,  vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Staff trust rises'},
      {pool:'REPUTATION',                delta:5,   vis:'END',          attr:'CAUSE_HIDDEN',    note:'Humane handling visible to observers'},
    ],
    B:[
      {pool:'DR_OBI_TRAJECTORY',         delta:5,   vis:'IMMEDIATE',    attr:'FULL_DISCLOSURE', note:'Neutral resolution'},
      {pool:'COMMS.STAKEHOLDER_CONF',    delta:0,   vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Neutral staff signal'},
    ],
    C:[
      {pool:'DR_OBI_TRAJECTORY',         delta:-35, vis:'IMMEDIATE',    attr:'FULL_DISCLOSURE', note:'Hostile resolution; possible media amplification'},
      {pool:'COMMS.STAKEHOLDER_CONF',    delta:-20, vis:'ACT_BOUNDARY', attr:'CAUSE_VISIBLE',   note:'Staff morale collapses'},
      {pool:'REPUTATION',                delta:-15, vis:'END',          attr:'CAUSE_VISIBLE',   note:'If public, significant damage'},
      {pool:'LEGAL.LEGAL_EXPOSURE',      delta:12,  vis:'END',          attr:'CAUSE_VISIBLE',   note:'Wrongful termination / privacy complaint'},
    ],
  },
  G12:{
    A:[
      {pool:'REPUTATION',                delta:8,   vis:'END',          attr:'CAUSE_VISIBLE',   note:'Public accountability lands'},
      {pool:'COMMS.NARRATIVE_COHERENCE', delta:10,  vis:'END',          attr:'CAUSE_VISIBLE',   note:'Clean narrative'},
    ],
    B:[
      {pool:'REPUTATION',                delta:-3,  vis:'END',          attr:'CAUSE_VISIBLE',   note:'Reads as equivocation'},
      {pool:'COMMS.NARRATIVE_COHERENCE', delta:-5,  vis:'END',          attr:'CAUSE_VISIBLE',   note:'Unresolved leadership question'},
    ],
    C:[
      {pool:'REPUTATION',                delta:12,  vis:'END',          attr:'CAUSE_VISIBLE',   note:'Definitive response'},
      {pool:'CFO.COST_OF_CAPITAL',       delta:8,   vis:'END',          attr:'CAUSE_HIDDEN',    note:'Leadership transition raises financing cost'},
      {pool:'COMMS.STAKEHOLDER_CONF',    delta:-8,  vis:'END',          attr:'CAUSE_VISIBLE',   note:'Short-term leadership uncertainty'},
    ],
  },
  G13:{
    A:[
      {pool:'REPUTATION',                delta:10,  vis:'END',          attr:'CAUSE_VISIBLE',   note:'Accountability closing'},
      {pool:'COMMS.NARRATIVE_COHERENCE', delta:15,  vis:'END',          attr:'CAUSE_VISIBLE',   note:'Coherent with Act 2 play'},
      {pool:'PATIENT_CONFIDENCE',        delta:10,  vis:'END',          attr:'CAUSE_VISIBLE',   note:'Patient confidence rebuild begins'},
    ],
    B:[
      {pool:'REPUTATION',                delta:3,   vis:'END',          attr:'CAUSE_VISIBLE',   note:'Soft positive'},
      {pool:'COMMS.NARRATIVE_COHERENCE', delta:5,   vis:'END',          attr:'CAUSE_VISIBLE',   note:'Generic but defensible'},
    ],
    C:[
      {pool:'REPUTATION',                delta:-10, vis:'END',          attr:'CAUSE_VISIBLE',   note:'Deflection reads poorly'},
      {pool:'COMMS.NARRATIVE_COHERENCE', delta:-10, vis:'END',          attr:'CAUSE_VISIBLE',   note:'Doesn\'t reconcile with own failings'},
      {pool:'PATIENT_CONFIDENCE',        delta:-12, vis:'END',          attr:'CAUSE_VISIBLE',   note:'Patients hear deflection'},
    ],
  },
};

export const BRANCHES = [
  {id:'B-01', name:'Formal IR Activated',           type:'Trunk',        condition:'G1=A',  endingWeight:'Required for Ending A'},
  {id:'B-02', name:'Quiet Investigation',            type:'Trunk',        condition:'G1=B',  endingWeight:'Ending B/C weighting'},
  {id:'B-03', name:'Early External Transparency',   type:'Trunk',        condition:'G1=C',  endingWeight:'Ending A possible if handled well'},
  {id:'B-04', name:'Formal NDB Clock Active',        type:'Investigation',condition:'G2=A',  endingWeight:'Ending A enabling'},
  {id:'B-05', name:'Clock Held Pending',             type:'Investigation',condition:'G2=B',  endingWeight:'Ending B or C depending on G9'},
  {id:'B-06', name:'Informal OAIC Contact',          type:'Investigation',condition:'G2=C',  endingWeight:'Ending A or B possible'},
  {id:'B-07', name:'Top-Tier Forensics',             type:'Investigation',condition:'G3=A',  endingWeight:'Ending A enabling'},
  {id:'B-08', name:'Mid-Tier Forensics',             type:'Investigation',condition:'G3=B',  endingWeight:'Ending B'},
  {id:'B-09', name:'In-House Only',                  type:'Investigation',condition:'G3=C',  endingWeight:'Forecloses Ending A unless IQ recovered'},
  {id:'B-10', name:'Board Fully Engaged',            type:'Political',    condition:'G4=A',  endingWeight:'Ending A enabling'},
  {id:'B-11', name:'Measured Board Posture',         type:'Political',    condition:'G4=B',  endingWeight:'Ending B'},
  {id:'B-12', name:'Chair-Only Briefing',            type:'Political',    condition:'G4=C',  endingWeight:'Ending B or C'},
  {id:'B-13', name:'Dr. Obi Proactively Notified',  type:'Consequence',  condition:'G5=A',  endingWeight:'Required for Ending A'},
  {id:'B-14', name:'Dr. Obi Targeted Notification', type:'Consequence',  condition:'G5=B',  endingWeight:'Ending B enabling'},
  {id:'B-15', name:'Dr. Obi Learns from Media',     type:'Consequence',  condition:'G5=C',  endingWeight:'Forecloses Ending A; heavy C weighting'},
  {id:'B-16', name:'Narrative Ownership',            type:'Political',    condition:'G6=A',  endingWeight:'Ending A or B enabling'},
  {id:'B-17', name:'Neutral Holding Posture',        type:'Political',    condition:'G6=B',  endingWeight:'Ending B'},
  {id:'B-18', name:'Rebuttal Track',                 type:'Political',    condition:'G6=C',  endingWeight:'Heavy Ending C weighting'},
  {id:'B-19', name:'Evidence-Led Attribution',       type:'Investigation',condition:'G7=A',  endingWeight:'Ending A enabling'},
  {id:'B-20', name:'NovaCare Publicly Blamed',       type:'Political',    condition:'G7=B',  endingWeight:'Ending C risk if attribution reverses'},
  {id:'B-22', name:'Attribution Withheld',           type:'Political',    condition:'G7=C',  endingWeight:'Ending B'},
  {id:'B-23', name:'Full Remediation Funded',        type:'Consequence',  condition:'G8=A',  endingWeight:'Ending A enabling'},
  {id:'B-24', name:'Phased Remediation',             type:'Consequence',  condition:'G8=B',  endingWeight:'Ending B'},
  {id:'B-25', name:'Minimum Remediation Only',       type:'Consequence',  condition:'G8=C',  endingWeight:'Heavy Ending C weighting'},
  {id:'B-26', name:'Full Voluntary Disclosure',      type:'Political',    condition:'G9=A',  endingWeight:'Ending A strong enabling'},
  {id:'B-27', name:'Responsive Disclosure',          type:'Political',    condition:'G9=B',  endingWeight:'Ending B'},
  {id:'B-28', name:'Adversarial Legal Posture',      type:'Political',    condition:'G9=C',  endingWeight:'Forecloses Ending A; Ending C strong'},
  {id:'B-29', name:'Remediation-First Path',         type:'Trunk',        condition:'G10=A', endingWeight:'Required for Ending A'},
  {id:'B-30', name:'Balanced Defence Path',          type:'Trunk',        condition:'G10=B', endingWeight:'Ending B'},
  {id:'B-31', name:'Defensive Path',                 type:'Trunk',        condition:'G10=C', endingWeight:'Heavy Ending C weighting'},
  {id:'B-32', name:'Dr. Obi Supported Return',       type:'Ending',       condition:'G11=A', endingWeight:'Ending A component'},
  {id:'B-33', name:'Dr. Obi Neutral Resolution',     type:'Ending',       condition:'G11=B', endingWeight:'Ending B component'},
  {id:'B-34', name:'Dr. Obi Departs in Dispute',     type:'Ending',       condition:'G11=C', endingWeight:'Ending C component'},
  {id:'B-35', name:'CEO Retains with Accountability',type:'Ending',       condition:'G12=A', endingWeight:'Ending A component'},
  {id:'B-36', name:'CEO Under Review',               type:'Ending',       condition:'G12=B', endingWeight:'Ending B component'},
  {id:'B-37', name:'CEO Departs',                    type:'Ending',       condition:'G12=C', endingWeight:'Ending A or B depending on context'},
  {id:'B-38', name:'Accountability-Led Close',       type:'Ending',       condition:'G13=A', endingWeight:'Ending A requires'},
  {id:'B-39', name:'Learning-Led Close',             type:'Ending',       condition:'G13=B', endingWeight:'Ending B component'},
  {id:'B-40', name:'Industry-Led Close',             type:'Ending',       condition:'G13=C', endingWeight:'Ending C component'},
];
