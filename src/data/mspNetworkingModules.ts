import type { AssessmentDifficulty, AssessmentQuestion, WeakTopicKey } from '../types/assessment';
import type { Flashcard, ModuleLevel, TrainingModule } from '../types/training';
import { markdownToPlainText, networkingCurriculum, type NetModule } from './networking/networkingCurriculum';

// MSP networking series: the ten topics that follow subnetting (DHCP through
// AD/Microsoft 365). Content is shared with the other Parris Tech learning
// apps (./networking/networkingCurriculum.ts); this file adapts it to this
// app's modules, adds a school (DCS) angle and turns each ticket scenario
// into an interactive lab.

const reviewSchedule = 'Again today. Hard tomorrow. Good in 3 days. Easy in 7 days.';

const DCS_CONTEXT: Record<string, string> = {
  'net-dhcp': 'In a school, a full guest or student Wi-Fi scope at the start of term looks exactly like scope exhaustion: early arrivals work, later devices get 169.254 addresses.',
  'net-dns': 'School web filtering, internal Schoolbox/Sentral links and staff email all depend on DNS; "the internet is down" in a classroom is often a DNS or filtering issue.',
  'net-vlans': 'Schools separate staff, student, guest, AV/displays and CCTV networks; a classroom display that suddenly can\'t be found is often a port in the wrong VLAN.',
  'net-routing': 'Separate student and staff subnets only talk through the core switch or firewall, so "works in the library but not the classroom" can be a routing or rule difference.',
  'net-nat-firewall': 'School firewalls filter student traffic and block inbound access; ask before requesting any port forward, and never expose admin interfaces.',
  'net-ports': 'Printing (SMB 445), Teams, web filtering and remote support all use known ports, which helps you describe a symptom clearly when escalating.',
  'net-vpn': 'Staff working from home reach school systems over VPN or cloud services; a home router on the same range as the school network breaks access.',
  'net-wifi': 'Classrooms full of devices stress Wi-Fi: channel planning, AP placement and separate student/staff SSIDs matter more than raw speed.',
  'net-troubleshooting': 'Scope first: one student device, one classroom or the whole campus point to very different causes and escalation paths.',
  'net-ad-m365': 'School logins, Group Policy and Microsoft 365 depend on AD DNS and correct time; a wrong clock after a power cut can stop staff signing in.',
};

const LEVEL: Record<string, ModuleLevel> = {
  'net-dhcp': 'L1 Support', 'net-dns': 'L1 Support', 'net-vlans': 'L1 Support', 'net-routing': 'L2 Support',
  'net-nat-firewall': 'L2 Support', 'net-ports': 'L1 Support', 'net-vpn': 'L2 Support', 'net-wifi': 'L1 Support',
  'net-troubleshooting': 'L1 Support', 'net-ad-m365': 'L2 Support',
};

const WEAK_TOPIC: Record<string, WeakTopicKey> = {
  'net-dhcp': 'dns-dhcp-gateway', 'net-dns': 'dns-dhcp-gateway', 'net-vlans': 'vlan-firewall-rules',
  'net-routing': 'dns-dhcp-gateway', 'net-nat-firewall': 'vlan-firewall-rules', 'net-ports': 'ports-protocols',
  'net-vpn': 'a-plus-network-services', 'net-wifi': 'a-plus-networking', 'net-troubleshooting': 'a-plus-troubleshooting',
  'net-ad-m365': 'a-plus-network-services',
};

const DIFFICULTY: AssessmentDifficulty[] = ['foundation', 'foundation', 'stretch', 'stretch', 'challenge', 'challenge'];

function quiz(m: NetModule): AssessmentQuestion[] {
  return m.quiz.map((q, i) => ({
    type: 'mcq' as const,
    id: `msp-${q.id}`,
    prompt: q.question,
    options: q.options.map((label, j) => ({ id: `${q.id}-${String.fromCharCode(97 + j)}`, label })),
    correctOptionId: `${q.id}-${String.fromCharCode(97 + q.answerIndex)}`,
    domain: m.title,
    difficulty: DIFFICULTY[i] ?? 'challenge',
    explanation: q.explanation,
    modelAnswer: q.options[q.answerIndex],
    commonMistakes: q.options.filter((_, j) => j !== q.answerIndex).map((o) => `Choosing "${o}"`),
    dcsContext: DCS_CONTEXT[m.id],
    reviewSchedule,
    recommendedModuleId: m.id,
    weakTopic: WEAK_TOPIC[m.id],
  }));
}

// At least ten cards per module: the curriculum's cards, topped up with
// key-term cards.
function flashcards(m: NetModule): Flashcard[] {
  const cards: Flashcard[] = m.flashcards.map((f) => ({ id: `msp-${f.id}`, front: f.front, back: f.back }));
  for (const [i, k] of m.keyTerms.entries()) {
    if (cards.length >= 10) break;
    cards.push({ id: `msp-${m.id}-term-${i + 1}`, front: `What is ${k.term}?`, back: k.definition });
  }
  return cards;
}

function toModule(m: NetModule): TrainingModule {
  const s = m.scenario;
  return {
    id: m.id,
    title: `MSP Networking: ${m.title}`,
    description: m.summary,
    domain: 'Networking',
    level: LEVEL[m.id],
    estimatedMinutes: 30,
    tags: ['msp networking', m.shortTitle.toLowerCase(), ...m.keyTerms.slice(0, 4).map((k) => k.term.toLowerCase())],
    careerTrack: 'MSP Support',
    contextTags: ['MSP', 'Networking'],
    certificationTags: ['CompTIA Network+'],
    transferableSkills: ['Methodical troubleshooting', 'Evidence-based ticket notes'],
    learningObjectives: m.objectives,
    dcsRelevance: [DCS_CONTEXT[m.id], m.whyItMatters],
    sections: [
      ...m.sections.map((sec) => ({ id: `${m.id}-${sec.id}`, title: sec.title, bodyMarkdown: markdownToPlainText(sec.body) })),
      { id: `${m.id}-terms`, title: 'Key terms', bodyMarkdown: m.keyTerms.map((k) => `- ${k.term}: ${k.definition}`).join('\n') },
      { id: `${m.id}-commands`, title: 'Commands to know', bodyMarkdown: m.commands.map((c) => `- ${c.command}: ${c.purpose}`).join('\n') },
      {
        id: `${m.id}-mistakes`,
        title: 'Common mistakes',
        bodyMarkdown: m.commonMistakes.map((x) => `- ${x}`).join('\n'),
        takeaway: m.commonMistakes[0],
      },
      { id: `${m.id}-sources`, title: 'Sources', bodyMarkdown: m.sources.map((src) => `- ${src.title}: ${src.url}`).join('\n') },
    ],
    flashcards: flashcards(m),
    quiz: quiz(m),
    scenarioPrompts: [
      {
        id: `${m.id}-scenario`,
        title: s.title,
        prompt: `${s.ticket.client}: "${s.ticket.summary}" ${s.ticket.symptoms.join(' ')} Recent change: ${s.ticket.recentChanges.join(' ')} What do you check first, what do you expect to find, and what would you change?`,
      },
    ],
    practicalOutputs: [
      {
        id: `${m.id}-ticket-note`,
        title: 'Write the ticket note',
        description: `Write the resolution note for "${s.title}" (cause, evidence, exact change, verification). Then compare it with this example: ${s.ticketNote}`,
      },
    ],
    interactiveLabs: [
      {
        id: `${m.id}-lab`,
        title: s.title,
        scenario: `${s.ticket.requester}, ${s.ticket.client} (${s.ticket.priority} priority): "${s.ticket.summary}" ${s.ticket.symptoms.join(' ')} Recent change: ${s.ticket.recentChanges.join(' ')}`,
        decisionPoints: s.steps.map((step) => ({
          id: step.id,
          question: step.prompt,
          options: step.options.map((o, j) => ({ id: `${step.id}-${j + 1}`, label: o.text, feedback: o.feedback, isCorrect: o.correct })),
        })),
        dcsApplication: DCS_CONTEXT[m.id],
        retrievalQuestion: m.quiz[0].question,
        reflectionPrompt: `What was the root cause in "${s.title}", which single test proved it, and how would you stop it happening again?`,
      },
    ],
  };
}

export const mspNetworkingModules: TrainingModule[] = networkingCurriculum.map(toModule);
