export interface LabeledMeetingUtterance {
  id: string;
  meetingTopic: string;
  speaker: string;
  text: string;
  // Multitask labels
  shouldSpeak: boolean; // Ground truth: should the AI speak right now?
  speakingIntent: 'silence' | 'direct_answer' | 'proactive_clarification' | 'conflict_warning' | 'decision_confirmation' | 'task_assignment_summary' | 'blocker_alert' | 'agenda_guidance';
  containsDecision: boolean;
  containsTask: boolean;
  containsBlocker: boolean;
  containsQuestion: boolean;
  // Extracted entities when present
  extractedOwner?: string;
  extractedDeadline?: string;
  extractedPriority?: 'Low' | 'Medium' | 'High' | 'Critical';
  decisionStatus?: 'Approved' | 'Proposed' | 'Rejected';
  // Difficulty & category
  sampleType: 'positive' | 'negative_silence' | 'ambiguous' | 'conflicting' | 'multilingual';
}

export const TRAINING_DATASET: LabeledMeetingUtterance[] = [
  // 1. Direct addressing & queries (Positive Speaking Triggers)
  {
    id: 'utt_001',
    meetingTopic: 'Sprint 24 Planning',
    speaker: 'Sarah Chen',
    text: 'MeetFlow, what is the status of the Stripe v3 payment integration task?',
    shouldSpeak: true,
    speakingIntent: 'direct_answer',
    containsDecision: false,
    containsTask: false,
    containsBlocker: false,
    containsQuestion: true,
    sampleType: 'positive'
  },
  {
    id: 'utt_002',
    meetingTopic: 'Architecture Review',
    speaker: 'Shivani Narayanan',
    text: 'AI Copilot, did we choose Firebase Auth or custom JWT during our previous architecture review?',
    shouldSpeak: true,
    speakingIntent: 'direct_answer',
    containsDecision: false,
    containsTask: false,
    containsBlocker: false,
    containsQuestion: true,
    sampleType: 'positive'
  },
  {
    id: 'utt_003',
    meetingTopic: 'Release Sync',
    speaker: 'Rahul Verma',
    text: 'Hey AI, can you summarize the remaining blockers before staging deployment?',
    shouldSpeak: true,
    speakingIntent: 'direct_answer',
    containsDecision: false,
    containsTask: false,
    containsBlocker: true,
    containsQuestion: true,
    sampleType: 'positive'
  },

  // 2. Action Items & Commitment Extraction (Positive Tasks)
  {
    id: 'utt_004',
    meetingTopic: 'Sprint 24 Planning',
    speaker: 'Priya Sharma',
    text: 'I will finalize the Stripe v3 webhook endpoints and idempotency logic by Friday 4 PM.',
    shouldSpeak: false,
    speakingIntent: 'silence',
    containsDecision: false,
    containsTask: true,
    containsBlocker: false,
    containsQuestion: false,
    extractedOwner: 'Priya Sharma',
    extractedDeadline: '2026-09-18',
    extractedPriority: 'Critical',
    sampleType: 'positive'
  },
  {
    id: 'utt_005',
    meetingTopic: 'Frontend Alignment',
    speaker: 'Rahul Verma',
    text: 'Rahul will build the responsive payment modal and checkout error boundaries before Thursday end of day.',
    shouldSpeak: false,
    speakingIntent: 'silence',
    containsDecision: false,
    containsTask: true,
    containsBlocker: false,
    containsQuestion: false,
    extractedOwner: 'Rahul Verma',
    extractedDeadline: '2026-09-17',
    extractedPriority: 'High',
    sampleType: 'positive'
  },
  {
    id: 'utt_006',
    meetingTopic: 'QA Automation',
    speaker: 'Arun Kumar',
    text: 'Arun is assigned to configure Playwright test suites and k6 load testing scripts by Friday 6 PM.',
    shouldSpeak: false,
    speakingIntent: 'silence',
    containsDecision: false,
    containsTask: true,
    containsBlocker: false,
    containsQuestion: false,
    extractedOwner: 'Arun Kumar',
    extractedDeadline: '2026-09-18',
    extractedPriority: 'High',
    sampleType: 'positive'
  },

  // 3. Decisions & Policy Locks (Positive Decisions)
  {
    id: 'utt_007',
    meetingTopic: 'Sprint 24 Planning',
    speaker: 'Shivani Narayanan',
    text: 'We all agree: Payment API delivery cutoff is strictly locked for Friday 4 PM with zero scope additions.',
    shouldSpeak: true,
    speakingIntent: 'decision_confirmation',
    containsDecision: true,
    containsTask: false,
    containsBlocker: false,
    containsQuestion: false,
    decisionStatus: 'Approved',
    sampleType: 'positive'
  },
  {
    id: 'utt_008',
    meetingTopic: 'Security & Auth Review',
    speaker: 'Sarah Chen',
    text: 'Let us approve standardizing on Firebase Authentication with custom claims for enterprise tenant isolation.',
    shouldSpeak: true,
    speakingIntent: 'decision_confirmation',
    containsDecision: true,
    containsTask: false,
    containsBlocker: false,
    containsQuestion: false,
    decisionStatus: 'Approved',
    sampleType: 'positive'
  },

  // 4. Critical Blocker & Conflict Alerts (Proactive Speaking Triggers)
  {
    id: 'utt_009',
    meetingTopic: 'QA Sync',
    speaker: 'Arun Kumar',
    text: 'If the Payment API staging deploy slips into Saturday, QA will be totally blocked and Monday client demo will fail.',
    shouldSpeak: true,
    speakingIntent: 'blocker_alert',
    containsDecision: false,
    containsTask: false,
    containsBlocker: true,
    containsQuestion: false,
    sampleType: 'positive'
  },
  {
    id: 'utt_010',
    meetingTopic: 'Partner Schedule',
    speaker: 'Sarah Chen',
    text: 'I just sent the partner client invite for Wednesday September 23 at 10 AM.',
    shouldSpeak: true,
    speakingIntent: 'conflict_warning',
    containsDecision: false,
    containsTask: false,
    containsBlocker: true,
    containsQuestion: false,
    sampleType: 'conflicting'
  },

  // 5. Ambiguous & Missing Information (Proactive Clarification Questions)
  {
    id: 'utt_011',
    meetingTopic: 'Deployment Sync',
    speaker: 'Sarah Chen',
    text: 'Someone needs to get the production sandbox credentials and merchant API keys approved sometime next week.',
    shouldSpeak: true,
    speakingIntent: 'proactive_clarification',
    containsDecision: false,
    containsTask: true,
    containsBlocker: true,
    containsQuestion: false,
    extractedPriority: 'High',
    sampleType: 'ambiguous'
  },
  {
    id: 'utt_012',
    meetingTopic: 'Database Migration',
    speaker: 'Rahul Verma',
    text: 'We should probably migrate the legacy ledger tables whenever we find free time.',
    shouldSpeak: true,
    speakingIntent: 'proactive_clarification',
    containsDecision: false,
    containsTask: true,
    containsBlocker: false,
    containsQuestion: false,
    sampleType: 'ambiguous'
  },

  // 6. Negative Examples: Normal conversation where AI MUST REMAIN SILENT
  {
    id: 'utt_013',
    meetingTopic: 'General Standup',
    speaker: 'Priya Sharma',
    text: 'Hey everyone, sorry for being two minutes late, my laptop was installing an update.',
    shouldSpeak: false,
    speakingIntent: 'silence',
    containsDecision: false,
    containsTask: false,
    containsBlocker: false,
    containsQuestion: false,
    sampleType: 'negative_silence'
  },
  {
    id: 'utt_014',
    meetingTopic: 'Sprint 24 Planning',
    speaker: 'Rahul Verma',
    text: 'Did anyone watch the football match yesterday evening? It was pretty intense.',
    shouldSpeak: false,
    speakingIntent: 'silence',
    containsDecision: false,
    containsTask: false,
    containsBlocker: false,
    containsQuestion: true,
    sampleType: 'negative_silence'
  },
  {
    id: 'utt_015',
    meetingTopic: 'Design Sync',
    speaker: 'Shivani Narayanan',
    text: 'I really like the new purple accent on the button hover states, it looks much cleaner.',
    shouldSpeak: false,
    speakingIntent: 'silence',
    containsDecision: false,
    containsTask: false,
    containsBlocker: false,
    containsQuestion: false,
    sampleType: 'negative_silence'
  },
  {
    id: 'utt_016',
    meetingTopic: 'Sprint 24 Planning',
    speaker: 'Arun Kumar',
    text: 'Yeah, I agree with that visual adjustment. Let us keep moving down the list.',
    shouldSpeak: false,
    speakingIntent: 'silence',
    containsDecision: false,
    containsTask: false,
    containsBlocker: false,
    containsQuestion: false,
    sampleType: 'negative_silence'
  },
  {
    id: 'utt_017',
    meetingTopic: 'Architecture Review',
    speaker: 'Priya Sharma',
    text: 'I think GraphQL might be interesting for v3, but we can explore that in Q4.',
    shouldSpeak: false,
    speakingIntent: 'silence',
    containsDecision: false,
    containsTask: false,
    containsBlocker: false,
    containsQuestion: false,
    decisionStatus: 'Proposed',
    sampleType: 'ambiguous'
  },
  {
    id: 'utt_018',
    meetingTopic: 'Sprint 24 Planning',
    speaker: 'Sarah Chen',
    text: 'Thanks Priya. Let us make sure we stay focused on our immediate milestone.',
    shouldSpeak: false,
    speakingIntent: 'silence',
    containsDecision: false,
    containsTask: false,
    containsBlocker: false,
    containsQuestion: false,
    sampleType: 'negative_silence'
  },

  // 7. Multilingual code-switching examples
  {
    id: 'utt_019',
    meetingTopic: 'Sprint 24 Planning',
    speaker: 'Priya Sharma',
    text: 'Login module Friday-kulla complete panniduvom, token refresh is already optimized.',
    shouldSpeak: false,
    speakingIntent: 'silence',
    containsDecision: false,
    containsTask: true,
    containsBlocker: false,
    containsQuestion: false,
    extractedOwner: 'Priya Sharma',
    extractedDeadline: '2026-09-18',
    extractedPriority: 'High',
    sampleType: 'multilingual'
  },
  {
    id: 'utt_020',
    meetingTopic: 'Dev Standup',
    speaker: 'Rahul Verma',
    text: 'Main staging build aaj shaam tak deploy kar dunga, QA ready rahe.',
    shouldSpeak: false,
    speakingIntent: 'silence',
    containsDecision: false,
    containsTask: true,
    containsBlocker: false,
    containsQuestion: false,
    extractedOwner: 'Rahul Verma',
    extractedDeadline: '2026-09-16',
    extractedPriority: 'Medium',
    sampleType: 'multilingual'
  }
];
