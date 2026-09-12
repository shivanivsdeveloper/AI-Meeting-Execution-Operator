import { 
  User, Workspace, Meeting, Decision, Task, Risk, Question, 
  Commitment, Project, AIActionApproval, NotificationItem, 
  IntegrationStatus, AuditLogItem, KnowledgeNode, KnowledgeEdge 
} from '../src/types/index.js';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_shivani',
    name: 'Shivani Narayanan',
    email: 'shivani@meetflow.ai',
    role: 'VP of Engineering',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    skills: ['System Architecture', 'Strategy', 'Executive Oversight', 'Cloud Security'],
    currentWorkload: 55,
    onTimeCompletionRate: 98,
    activeTasksCount: 3
  },
  {
    id: 'usr_priya',
    name: 'Priya Sharma',
    email: 'priya.sharma@aurapay.io',
    role: 'Lead Backend Engineer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    skills: ['Go', 'Node.js', 'Payment APIs', 'PostgreSQL', 'Stripe Integrations'],
    currentWorkload: 87, // High workload
    onTimeCompletionRate: 91,
    activeTasksCount: 6
  },
  {
    id: 'usr_rahul',
    name: 'Rahul Verma',
    email: 'rahul.v@aurapay.io',
    role: 'Frontend Architect',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    skills: ['React', 'TypeScript', 'TailwindCSS', 'WebSockets', 'UI/UX'],
    currentWorkload: 48,
    onTimeCompletionRate: 94,
    activeTasksCount: 3
  },
  {
    id: 'usr_arun',
    name: 'Arun Kumar',
    email: 'arun.k@aurapay.io',
    role: 'QA & DevOps Engineer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    skills: ['End-to-End Testing', 'Docker', 'Kubernetes', 'CI/CD Pipelines', 'Load Testing'],
    currentWorkload: 41, // Available capacity for workload balancing
    onTimeCompletionRate: 96,
    activeTasksCount: 2
  },
  {
    id: 'usr_sarah',
    name: 'Sarah Chen',
    email: 'sarah.c@aurapay.io',
    role: 'Product Manager',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    skills: ['Product Strategy', 'Client Management', 'Roadmapping', 'Agile'],
    currentWorkload: 62,
    onTimeCompletionRate: 92,
    activeTasksCount: 4
  }
];

export const INITIAL_WORKSPACE: Workspace = {
  id: 'ws_aurapay_prod',
  name: "Shivani's Workspace",
  slug: 'aurapay-engineering',
  ownerId: 'usr_shivani',
  members: INITIAL_USERS.map(u => ({
    userId: u.id,
    user: u,
    workspaceRole: u.id === 'usr_shivani' ? 'Owner' : (u.id === 'usr_sarah' ? 'Manager' : 'Member'),
    joinedAt: '2026-08-01T09:00:00Z'
  })),
  projects: ['proj_aurapay', 'proj_infra_scale', 'proj_mobile_v2'],
  settings: {
    autonomyLevel: 'ask_before_executing',
    recordingRetentionDays: 90,
    redactionEnabled: true,
    aiProvider: 'hybrid',
    escalationThresholdHours: 24
  }
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_aurapay',
    workspaceId: 'ws_aurapay_prod',
    name: 'AuraPay Core Platform v2.0',
    description: 'Next-generation merchant payment processing gateway with real-time settlement and fraud scoring.',
    healthScore: 81,
    progressPercentage: 74,
    scheduleStatus: 'At Risk',
    totalTasks: 47,
    completedTasks: 34,
    activeRisksCount: 3,
    overdueTasksCount: 2,
    lead: INITIAL_USERS[0],
    members: INITIAL_USERS,
    milestones: [
      { title: 'Core Architecture Finalization', dueDate: '2026-08-28', completed: true },
      { title: 'Payment API & Gateway Complete', dueDate: '2026-09-18', completed: false },
      { title: 'Client Enterprise Demo', dueDate: '2026-09-21', completed: false },
      { title: 'Production Staging Rollout', dueDate: '2026-10-05', completed: false }
    ]
  },
  {
    id: 'proj_infra_scale',
    workspaceId: 'ws_aurapay_prod',
    name: 'Global Infrastructure & High-Availability',
    description: 'Multi-region failover, Redis cluster caching, and PCI-DSS Level 1 compliance verification.',
    healthScore: 94,
    progressPercentage: 88,
    scheduleStatus: 'On Track',
    totalTasks: 22,
    completedTasks: 19,
    activeRisksCount: 0,
    overdueTasksCount: 0,
    lead: INITIAL_USERS[3],
    members: [INITIAL_USERS[0], INITIAL_USERS[1], INITIAL_USERS[3]],
    milestones: [
      { title: 'Multi-Region VPC Peering', dueDate: '2026-09-05', completed: true },
      { title: 'Automated Disaster Recovery Testing', dueDate: '2026-09-25', completed: false }
    ]
  }
];

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'meet_sprint_aurapay_01',
    workspaceId: 'ws_aurapay_prod',
    projectId: 'proj_aurapay',
    projectName: 'AuraPay Core Platform v2.0',
    title: 'Sprint 24 Planning & Payment API Delivery',
    type: 'Planning',
    date: '2026-09-11T10:00:00Z',
    duration: '42m 15s',
    status: 'Completed',
    participants: INITIAL_USERS,
    agenda: [
      'Review pending dependencies from Architecture sync',
      'Payment API v3 delivery roadmap and SLA check',
      'Client enterprise demo milestone alignment',
      'QA automated test coverage allocation'
    ],
    transcript: [
      {
        id: 'tr_01',
        speaker: 'Sarah Chen',
        speakerAvatar: INITIAL_USERS[4].avatar,
        timestamp: '10:02:10',
        seconds: 130,
        text: 'Good morning team. Today we need to lock down the critical milestones for our enterprise client demo on Monday. Priya, how is the payment gateway API integration progressing?'
      },
      {
        id: 'tr_02',
        speaker: 'Priya Sharma',
        speakerAvatar: INITIAL_USERS[1].avatar,
        timestamp: '10:03:45',
        seconds: 225,
        text: 'We should finish the payment API by Friday. I will personally handle the backend integration with Stripe v3 and the webhook signature verification.',
        aiDetectedTypes: ['decision', 'task']
      },
      {
        id: 'tr_03',
        speaker: 'Rahul Verma',
        speakerAvatar: INITIAL_USERS[2].avatar,
        timestamp: '10:05:20',
        seconds: 320,
        text: 'The checkout UI and responsive payment modal are ready on frontend staging, but we cannot test real merchant flows until the payment API is deployed.'
      },
      {
        id: 'tr_04',
        speaker: 'Arun Kumar',
        speakerAvatar: INITIAL_USERS[3].avatar,
        timestamp: '10:07:05',
        seconds: 425,
        text: 'Testing should start immediately once the API is ready on Friday afternoon. If the API slips into the weekend, QA cannot guarantee end-to-end certification before Monday morning demo.',
        aiDetectedTypes: ['risk']
      },
      {
        id: 'tr_05',
        speaker: 'Shivani Narayanan',
        speakerAvatar: INITIAL_USERS[0].avatar,
        timestamp: '10:09:40',
        seconds: 580,
        text: 'Understood. It is decided: Payment API must be completed and deployed to staging by Friday 4 PM. Priya owns delivery, Arun will prepare the automated test suites beforehand so validation runs instantly.',
        aiDetectedTypes: ['decision', 'task']
      },
      {
        id: 'tr_06',
        speaker: 'Sarah Chen',
        speakerAvatar: INITIAL_USERS[4].avatar,
        timestamp: '10:11:15',
        seconds: 675,
        text: 'Also, who will approve the production deploy credentials and merchant sandboxes for the client demo?',
        aiDetectedTypes: ['question']
      },
      {
        id: 'tr_07',
        speaker: 'Priya Sharma',
        speakerAvatar: INITIAL_USERS[1].avatar,
        timestamp: '10:14:00',
        seconds: 840,
        text: 'Login module Friday-kulla complete panniduvom. Security token refresh is already optimized.',
        originalLanguage: 'Tamil / Hinglish Mix',
        translatedText: 'We will complete the login module before Friday.',
        aiDetectedTypes: ['task']
      }
    ],
    summary: {
      executive: 'The team finalized the commitment to deliver the Payment API v3 by Friday 4 PM to protect the high-stakes Monday enterprise client demo. Priya owns the backend integration, Rahul aligned the checkout frontend, and Arun is pre-configuring automated E2E test runs.',
      detailed: 'Deep dive on Stripe webhook security, transaction idempotency, and frontend modal readiness. Identified critical dependency path between API deployment and QA signoff before Monday demo.',
      agreements: [
        'Payment API staging deadline locked to Friday 4 PM',
        'Frontend checkout components verified ready on branch',
        'Automated regression tests will run immediately upon staging build'
      ],
      disagreements: [
        'Initial disagreement on whether Monday demo could proceed with sandbox mock data; Shivani confirmed live integration is required.'
      ],
      topics: ['Payment API v3', 'Monday Client Demo', 'QA Certification', 'Staging Deployments'],
      followUpRecommendations: [
        'Monitor Priya\'s API webhook branch progress on Thursday afternoon',
        'Ensure Arun has mock merchant test keys pre-configured',
        'Assign sandbox approval owner before Friday'
      ]
    },
    metrics: {
      effectivenessScore: 91,
      continuityScore: 88,
      decisionsCount: 3,
      tasksCount: 4,
      risksCount: 2,
      questionsCount: 1,
      wasteScore: 'Low'
    },
    whiteboardData: {
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
      extractedComponents: ['Next.js Client', 'Cloudflare API Gateway', 'Go Backend Worker', 'Redis Lock Service', 'PostgreSQL Cluster', 'Stripe v3 Webhooks'],
      architectureDescription: 'Identified decoupled asynchronous webhook processing pipeline with Redis idempotency cache to prevent double-charging.'
    }
  },
  {
    id: 'meet_arch_02',
    workspaceId: 'ws_aurapay_prod',
    projectId: 'proj_aurapay',
    projectName: 'AuraPay Core Platform v2.0',
    title: 'Architecture Review: Auth & Database Strategy',
    type: 'Review',
    date: '2026-09-08T14:30:00Z',
    duration: '38m 00s',
    status: 'Completed',
    participants: [INITIAL_USERS[0], INITIAL_USERS[1], INITIAL_USERS[2], INITIAL_USERS[3]],
    agenda: [
      'Database technology selection for transaction ledgers',
      'Authentication provider evaluation: Custom JWT vs Firebase Auth vs Supabase Auth',
      'Cross-region read replica strategy'
    ],
    transcript: [
      {
        id: 'tr_201',
        speaker: 'Shivani Narayanan',
        speakerAvatar: INITIAL_USERS[0].avatar,
        timestamp: '14:32:00',
        seconds: 120,
        text: 'Let us confirm the decision on Authentication. For rapid development and enterprise OAuth readiness, we will standardize on Firebase Authentication for identity with custom claims.'
      },
      {
        id: 'tr_202',
        speaker: 'Priya Sharma',
        speakerAvatar: INITIAL_USERS[1].avatar,
        timestamp: '14:34:10',
        seconds: 250,
        text: 'Agreed. And for the ACID financial ledger, we will use PostgreSQL with row-level encryption, rejecting document stores for ledger state.'
      }
    ],
    summary: {
      executive: 'Approved Firebase Authentication for identity and user auth, paired with PostgreSQL for relational transaction integrity.',
      detailed: 'Full architectural consensus reached after reviewing latency and compliance requirements.',
      agreements: [
        'Use Firebase Authentication for user accounts and role-based session tokens',
        'Use PostgreSQL for all financial ledger records with strict foreign keys'
      ],
      disagreements: [],
      topics: ['Authentication', 'PostgreSQL Ledger', 'Security Compliance'],
      followUpRecommendations: ['Draft architecture diagram and share in docs']
    },
    metrics: {
      effectivenessScore: 94,
      continuityScore: 92,
      decisionsCount: 2,
      tasksCount: 2,
      risksCount: 0,
      questionsCount: 0,
      wasteScore: 'Low'
    }
  }
];

export const INITIAL_DECISIONS: Decision[] = [
  {
    id: 'dec_01',
    workspaceId: 'ws_aurapay_prod',
    meetingId: 'meet_sprint_aurapay_01',
    meetingTitle: 'Sprint 24 Planning & Payment API Delivery',
    title: 'Payment API must be completed and deployed by Friday 4 PM',
    description: 'Strict delivery cutoff established to allow QA automated certification before the high-visibility Monday enterprise client demo.',
    status: 'Approved',
    date: '2026-09-11',
    confidence: 97,
    evidence: {
      timestamp: '10:09:40',
      quote: 'It is decided: Payment API must be completed and deployed to staging by Friday 4 PM.',
      speaker: 'Shivani Narayanan'
    },
    reason: 'Eliminate downstream testing bottlenecks and prevent high risk to client demonstration.',
    participantsCount: 5,
    projectId: 'proj_aurapay',
    projectName: 'AuraPay Core Platform v2.0',
    evolutionHistory: [
      { date: '2026-09-04', stage: 'Proposed', note: 'Initial proposal for next-week delivery' },
      { date: '2026-09-08', stage: 'Discussed', note: 'Pushed for earlier completion due to client demo scheduling' },
      { date: '2026-09-11', stage: 'Approved', note: 'Formally confirmed by Shivani in Sprint 24 Planning' }
    ]
  },
  {
    id: 'dec_02',
    workspaceId: 'ws_aurapay_prod',
    meetingId: 'meet_arch_02',
    meetingTitle: 'Architecture Review: Auth & Database Strategy',
    title: 'Use Firebase Authentication for user session & role-based claims',
    description: 'Selected Firebase Auth to accelerate time-to-market while retaining SOC2 compliant token validation.',
    status: 'Approved',
    date: '2026-09-08',
    confidence: 94,
    evidence: {
      timestamp: '14:32:00',
      quote: 'For rapid development and enterprise OAuth readiness, we will standardize on Firebase Authentication.',
      speaker: 'Shivani Narayanan'
    },
    reason: 'Rapid development, battle-tested security, and built-in multi-factor authentication.',
    participantsCount: 4,
    projectId: 'proj_aurapay',
    projectName: 'AuraPay Core Platform v2.0',
    evolutionHistory: [
      { date: '2026-08-20', stage: 'Proposed', note: 'Firebase Auth proposed as lightweight option' },
      { date: '2026-08-24', stage: 'Discussed', note: 'Compared Auth0 vs Supabase vs Firebase' },
      { date: '2026-08-28', stage: 'Approved', note: 'Team approved Firebase Auth' },
      { date: '2026-09-08', stage: 'Confirmed', note: 'Confirmed during architecture review' }
    ],
    driftDetected: {
      referenceDoc: 'README_SERVICES.md (PR #142)',
      driftStatement: 'PR #142 references a custom standalone JWT server for authentication instead of Firebase Auth.',
      severity: 'Medium'
    }
  },
  {
    id: 'dec_03',
    workspaceId: 'ws_aurapay_prod',
    meetingId: 'meet_arch_02',
    meetingTitle: 'Architecture Review: Auth & Database Strategy',
    title: 'Use PostgreSQL for Financial Transaction Ledgers',
    description: 'Strict relational ACID compliance required for all merchant balance movements and fee records.',
    status: 'Approved',
    date: '2026-09-08',
    confidence: 96,
    evidence: {
      timestamp: '14:34:10',
      quote: 'For the ACID financial ledger, we will use PostgreSQL with row-level encryption.',
      speaker: 'Priya Sharma'
    },
    reason: 'Guaranteed ACID transactions and auditability for financial regulatory compliance.',
    participantsCount: 4,
    projectId: 'proj_aurapay',
    projectName: 'AuraPay Core Platform v2.0',
    evolutionHistory: [
      { date: '2026-08-15', stage: 'Proposed', note: 'PostgreSQL vs DynamoDB evaluated' },
      { date: '2026-09-08', stage: 'Approved', note: 'PostgreSQL finalized' }
    ]
  },
  {
    id: 'dec_04',
    workspaceId: 'ws_aurapay_prod',
    meetingId: 'meet_sprint_aurapay_01',
    meetingTitle: 'Sprint 24 Planning & Payment API Delivery',
    title: 'Client Demo Target Date set to Monday Sept 21',
    description: 'Firm enterprise demonstration scheduled with key client stakeholders.',
    status: 'Approved',
    date: '2026-09-11',
    confidence: 98,
    evidence: {
      timestamp: '10:02:10',
      quote: 'Today we need to lock down the critical milestones for our enterprise client demo on Monday.',
      speaker: 'Sarah Chen'
    },
    reason: 'Strategic GTM milestone with AuraPay tier-1 prospective partner.',
    participantsCount: 5,
    projectId: 'proj_aurapay',
    projectName: 'AuraPay Core Platform v2.0',
    evolutionHistory: [
      { date: '2026-09-11', stage: 'Approved', note: 'Confirmed in Sprint Planning' }
    ],
    conflictWith: {
      meetingId: 'meet_marketing_03',
      meetingTitle: 'GTM & Partner Scheduling Sync',
      date: '2026-09-10',
      conflictingText: 'Partner calendar invite mentions demo on Wednesday Sept 23 instead of Monday Sept 21.'
    }
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'tsk_01',
    workspaceId: 'ws_aurapay_prod',
    meetingId: 'meet_sprint_aurapay_01',
    meetingTitle: 'Sprint 24 Planning & Payment API Delivery',
    projectId: 'proj_aurapay',
    projectName: 'AuraPay Core Platform v2.0',
    title: 'Complete Payment API & Stripe v3 Webhook Integration',
    description: 'Implement core payment intent endpoints, webhook signature verification, and idempotent ledger updates.',
    ownerId: 'usr_priya',
    owner: INITIAL_USERS[1],
    recommendedOwner: {
      user: INITIAL_USERS[1],
      reasons: [
        'Lead Backend Developer with Stripe v3 specialization',
        'Authored initial payment architecture',
        '91% on-time completion record on high-priority endpoints'
      ],
      confidence: 96
    },
    priority: 'Critical',
    status: 'In Progress',
    dueDate: '2026-09-18', // Friday
    dependencies: [],
    dependents: ['tsk_02', 'tsk_03'],
    riskScore: 82,
    riskReason: 'Testing dependency delayed; Progress is at 52% with deadline approaching on Friday.',
    aiConfidence: 97,
    evidence: {
      timestamp: '10:03:45',
      quote: 'We should finish the payment API by Friday. I will personally handle the backend integration.',
      speaker: 'Priya Sharma'
    },
    verifiedByAi: false,
    timeline: [
      { stage: 'Decision', timestamp: '10:09 AM', details: 'Decision confirmed in Sprint 24 Planning' },
      { stage: 'Created', timestamp: '10:15 AM', details: 'AI Operator extracted structured action item' },
      { stage: 'Assigned', timestamp: '10:16 AM', details: 'Assigned to Priya Sharma (Lead Backend)' },
      { stage: 'Started', timestamp: '11:00 AM', details: 'Branch feature/payment-api-v3 created' },
      { stage: 'Risk Detected', timestamp: '09:30 AM (Next Day)', details: 'AI predicted 82% delay risk due to tight QA window' }
    ]
  },
  {
    id: 'tsk_02',
    workspaceId: 'ws_aurapay_prod',
    meetingId: 'meet_sprint_aurapay_01',
    meetingTitle: 'Sprint 24 Planning & Payment API Delivery',
    projectId: 'proj_aurapay',
    projectName: 'AuraPay Core Platform v2.0',
    title: 'Execute Automated E2E Regression & Load Test Suites',
    description: 'Validate 250+ payment edge cases including 3D Secure, partial refunds, network drops, and webhook idempotency.',
    ownerId: 'usr_arun',
    owner: INITIAL_USERS[3],
    recommendedOwner: {
      user: INITIAL_USERS[3],
      reasons: [
        'QA & DevOps Engineer with Playwright & k6 expertise',
        'Current workload is 41% (Optimal availability)',
        '96% on-time completion rate'
      ],
      confidence: 98
    },
    priority: 'High',
    status: 'Blocked',
    dueDate: '2026-09-19', // Saturday morning
    dependencies: ['tsk_01'],
    dependents: ['tsk_04'],
    riskScore: 78,
    riskReason: 'Blocked until Priya completes Payment API staging deployment.',
    aiConfidence: 94,
    evidence: {
      timestamp: '10:07:05',
      quote: 'Testing should start immediately once the API is ready on Friday afternoon.',
      speaker: 'Arun Kumar'
    },
    timeline: [
      { stage: 'Created', timestamp: '10:15 AM', details: 'Created from Sprint Planning transcript' },
      { stage: 'Assigned', timestamp: '10:16 AM', details: 'Assigned to Arun Kumar' },
      { stage: 'Risk Detected', timestamp: '09:30 AM', details: 'Flagged as Blocked by Upstream Task tsk_01' }
    ]
  },
  {
    id: 'tsk_03',
    workspaceId: 'ws_aurapay_prod',
    meetingId: 'meet_sprint_aurapay_01',
    meetingTitle: 'Sprint 24 Planning & Payment API Delivery',
    projectId: 'proj_aurapay',
    projectName: 'AuraPay Core Platform v2.0',
    title: 'Connect Frontend Checkout UI to Staging API Endpoints',
    description: 'Wire up React Query hooks, live error toasts, and Stripe Elements iframe onto staging environment.',
    ownerId: 'usr_rahul',
    owner: INITIAL_USERS[2],
    priority: 'High',
    status: 'In Progress',
    dueDate: '2026-09-18',
    dependencies: ['tsk_01'],
    riskScore: 65,
    riskReason: 'Awaiting final Swagger/OpenAPI contracts from backend.',
    aiConfidence: 92,
    evidence: {
      timestamp: '10:05:20',
      quote: 'The checkout UI is ready, but we cannot test real merchant flows until the payment API is deployed.',
      speaker: 'Rahul Verma'
    },
    timeline: [
      { stage: 'Created', timestamp: '10:15 AM', details: 'Extracted automatically' },
      { stage: 'Assigned', timestamp: '10:16 AM', details: 'Assigned to Rahul Verma' },
      { stage: 'Started', timestamp: '11:30 AM', details: 'Drafted frontend mock adapters' }
    ]
  },
  {
    id: 'tsk_04',
    workspaceId: 'ws_aurapay_prod',
    meetingId: 'meet_sprint_aurapay_01',
    meetingTitle: 'Sprint 24 Planning & Payment API Delivery',
    projectId: 'proj_aurapay',
    projectName: 'AuraPay Core Platform v2.0',
    title: 'Enterprise Client Demonstration Walkthrough & Sign-off',
    description: 'Conduct high-stakes live merchant payment flow walkthrough with client leadership.',
    ownerId: 'usr_sarah',
    owner: INITIAL_USERS[4],
    priority: 'Critical',
    status: 'Not Started',
    dueDate: '2026-09-21', // Monday
    dependencies: ['tsk_02', 'tsk_03'],
    riskScore: 74,
    riskReason: 'Direct downstream impact if Friday API deployment or Saturday QA tests suffer delays.',
    aiConfidence: 99,
    evidence: {
      timestamp: '10:02:10',
      quote: 'Lock down critical milestones for enterprise client demo on Monday.',
      speaker: 'Sarah Chen'
    },
    timeline: [
      { stage: 'Created', timestamp: '10:15 AM', details: 'Created' },
      { stage: 'Assigned', timestamp: '10:16 AM', details: 'Assigned to Sarah Chen' }
    ]
  },
  {
    id: 'tsk_05',
    workspaceId: 'ws_aurapay_prod',
    meetingId: 'meet_arch_02',
    meetingTitle: 'Architecture Review: Auth & Database Strategy',
    projectId: 'proj_aurapay',
    projectName: 'AuraPay Core Platform v2.0',
    title: 'Configure Firebase Auth Custom Claims & Token Middleware',
    description: 'Set up JWT validation middleware in Go API Gateway verifying Firebase Auth tokens with organization ID claims.',
    ownerId: 'usr_priya',
    owner: INITIAL_USERS[1],
    priority: 'Medium',
    status: 'Completed',
    dueDate: '2026-09-10',
    dependencies: [],
    riskScore: 10,
    aiConfidence: 98,
    evidence: {
      timestamp: '14:32:00',
      quote: 'Standardize on Firebase Authentication for identity with custom claims.',
      speaker: 'Shivani Narayanan'
    },
    verifiedByAi: true,
    verifiedAt: '2026-09-10T16:45:00Z',
    timeline: [
      { stage: 'Decision', timestamp: '14:32 PM', details: 'Architecture consensus' },
      { stage: 'Created', timestamp: '14:40 PM', details: 'Task registered' },
      { stage: 'Assigned', timestamp: '14:41 PM', details: 'Assigned to Priya Sharma' },
      { stage: 'Started', timestamp: '15:00 PM', details: 'Commit d8f3a9 implemented middleware' },
      { stage: 'Completed', timestamp: '16:30 PM', details: 'PR merged' },
      { stage: 'Verified', timestamp: '16:45 PM', details: 'MeetFlow AI verified passing integration test' }
    ]
  }
];

export const INITIAL_RISKS: Risk[] = [
  {
    id: 'rsk_01',
    workspaceId: 'ws_aurapay_prod',
    projectId: 'proj_aurapay',
    projectName: 'AuraPay Core Platform v2.0',
    title: 'Payment API & Staging QA Dependency Bottleneck',
    level: 'High',
    probabilityScore: 82,
    impact: 'If Payment API staging deployment slips past Friday 4 PM, QA automation will fail to certify the build before the Monday 9 AM client demo.',
    affectedTaskIds: ['tsk_01', 'tsk_02', 'tsk_04'],
    mitigation: 'Pair Priya with Arun on Thursday to pre-generate automated test fixtures; reassign non-critical tasks from Priya to balance workload.',
    sourceMeetingId: 'meet_sprint_aurapay_01',
    sourceMeetingTitle: 'Sprint 24 Planning & Payment API Delivery',
    detectedAt: '2026-09-11T10:15:00Z'
  },
  {
    id: 'rsk_02',
    workspaceId: 'ws_aurapay_prod',
    projectId: 'proj_aurapay',
    projectName: 'AuraPay Core Platform v2.0',
    title: 'Unassigned Production Sandbox Credentials Approval',
    level: 'Medium',
    probabilityScore: 68,
    impact: 'Sandbox keys cannot be issued to client testing team without verified owner sign-off.',
    affectedTaskIds: ['tsk_04'],
    mitigation: 'Assign Sarah Chen as explicit owner of merchant credentials verification before Friday.',
    sourceMeetingId: 'meet_sprint_aurapay_01',
    sourceMeetingTitle: 'Sprint 24 Planning & Payment API Delivery',
    detectedAt: '2026-09-11T10:15:00Z'
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'qst_01',
    workspaceId: 'ws_aurapay_prod',
    meetingId: 'meet_sprint_aurapay_01',
    meetingTitle: 'Sprint 24 Planning & Payment API Delivery',
    question: 'Who owns production deployment credential approval for client merchant sandboxes?',
    askedBy: 'Sarah Chen',
    priority: 'High',
    status: 'Unresolved',
    firstRaisedDate: '2026-09-11',
    meetingsSeenCount: 2
  },
  {
    id: 'qst_02',
    workspaceId: 'ws_aurapay_prod',
    meetingId: 'meet_arch_02',
    meetingTitle: 'Architecture Review: Auth & Database Strategy',
    question: 'Which key management service (AWS KMS vs Google Cloud KMS) will encrypt PostgreSQL row-level ledgers?',
    askedBy: 'Arun Kumar',
    priority: 'Medium',
    status: 'Resolved',
    resolutionMeetingId: 'meet_arch_02',
    resolutionAnswer: 'Standardized on Google Cloud KMS due to multi-region envelope encryption support.',
    firstRaisedDate: '2026-09-08',
    meetingsSeenCount: 1
  }
];

export const INITIAL_COMMITMENTS: Commitment[] = [
  {
    id: 'cmt_01',
    workspaceId: 'ws_aurapay_prod',
    meetingId: 'meet_sprint_aurapay_01',
    meetingTitle: 'Sprint 24 Planning & Payment API Delivery',
    personName: 'Priya Sharma',
    personAvatar: INITIAL_USERS[1].avatar,
    commitment: 'Complete Stripe v3 Payment API and webhook verification by Friday 4 PM.',
    dueDate: '2026-09-18',
    status: 'In Progress',
    delayHistoryCount: 1,
    evidence: {
      timestamp: '10:03:45',
      quote: 'We should finish the payment API by Friday. I will personally handle the backend integration.'
    }
  },
  {
    id: 'cmt_02',
    workspaceId: 'ws_aurapay_prod',
    meetingId: 'meet_sprint_aurapay_01',
    meetingTitle: 'Sprint 24 Planning & Payment API Delivery',
    personName: 'Arun Kumar',
    personAvatar: INITIAL_USERS[3].avatar,
    commitment: 'Pre-configure automated regression tests prior to Friday staging deploy.',
    dueDate: '2026-09-18',
    status: 'In Progress',
    delayHistoryCount: 0,
    evidence: {
      timestamp: '10:07:05',
      quote: 'Testing should start immediately once the API is ready on Friday afternoon.'
    }
  },
  {
    id: 'cmt_03',
    workspaceId: 'ws_aurapay_prod',
    meetingId: 'meet_arch_02',
    meetingTitle: 'Architecture Review: Auth & Database Strategy',
    personName: 'Rahul Verma',
    personAvatar: INITIAL_USERS[2].avatar,
    commitment: 'Complete UI payment modal and responsive checkout layouts on frontend.',
    dueDate: '2026-09-10',
    status: 'Completed',
    delayHistoryCount: 0,
    evidence: {
      timestamp: '14:38:00',
      quote: 'I will finish the checkout UI templates before Thursday.'
    }
  }
];

export const INITIAL_APPROVALS: AIActionApproval[] = [
  {
    id: 'appr_01',
    type: 'reassign_task',
    title: 'Workload Rebalancing: Offload API Integration Testing to Arun',
    summary: 'Priya is currently at 87% capacity with high-risk Payment API deliverables. Arun is at 41% capacity with exact skillset match.',
    confidence: 96,
    status: 'Awaiting Approval',
    createdAt: '2026-09-12T09:00:00Z',
    details: {
      taskId: 'tsk_02',
      taskTitle: 'Execute Automated E2E Regression & Load Test Suites',
      currentOwner: 'Priya Sharma (87% workload)',
      recommendedOwner: 'Arun Kumar (41% workload)',
      predictedWorkloadDrop: 'Priya drops from 87% to 74%; Arun moves from 41% to 54%.'
    }
  },
  {
    id: 'appr_02',
    type: 'external_email',
    title: 'Draft Enterprise Client Milestone Update to Acme Corp',
    summary: 'Proactively notify enterprise client stakeholder David Vance regarding Monday demo agenda and staging sandbox requirements.',
    confidence: 94,
    status: 'Awaiting Approval',
    createdAt: '2026-09-12T10:15:00Z',
    details: {
      recipient: 'david.vance@acme-enterprise.com',
      subject: 'AuraPay v2.0 Platform Demo — Monday Sept 21 Schedule & Sandbox Verification',
      body: 'Hi David,\n\nFollowing our sprint planning, we have locked in our AuraPay v2.0 live merchant payment walkthrough for Monday Sept 21 at 10:00 AM EST.\n\nOur team is finalizing the Stripe v3 webhook test endpoints and will share the sandbox credentials by Friday evening.\n\nBest regards,\nSarah Chen & Shivani Narayanan'
    }
  },
  {
    id: 'appr_03',
    type: 'schedule_meeting',
    title: 'Schedule 15-min Emergency Sync on Production Credentials Owner',
    summary: 'Unresolved Question #qst_01 has persisted across 2 meetings with no explicit owner assigned.',
    confidence: 91,
    status: 'Awaiting Approval',
    createdAt: '2026-09-12T10:45:00Z',
    details: {
      meetingTitle: 'Rapid Sync: Production Credential Signoff Owner',
      proposedTime: 'Today at 3:00 PM',
      participants: ['Shivani Narayanan', 'Sarah Chen', 'Priya Sharma']
    }
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_01',
    title: 'High Risk Detected on Payment API',
    message: 'Payment API has an 82% delay probability affecting Monday client demo. QA test dependency is at risk.',
    priority: 'Critical',
    timestamp: '10 min ago',
    read: false,
    type: 'risk_detected',
    actionUrl: '/tasks',
    smartAction: {
      label: 'View Risk & Rebalance',
      actionKey: 'view_risk_payment'
    }
  },
  {
    id: 'notif_02',
    title: 'AI Action Awaiting Your Approval',
    message: 'Workload Optimizer drafted a reassignment recommendation from Priya to Arun.',
    priority: 'High',
    timestamp: '25 min ago',
    read: false,
    type: 'approval_required',
    actionUrl: '/approvals',
    smartAction: {
      label: 'Review Approval Queue',
      actionKey: 'open_approvals'
    }
  },
  {
    id: 'notif_03',
    title: 'Deadline Conflict Flagged',
    message: 'GTM Invite (Wed Sept 23) contradicts confirmed Demo decision (Mon Sept 21).',
    priority: 'High',
    timestamp: '1 hour ago',
    read: false,
    type: 'conflict_detected',
    actionUrl: '/decisions',
    smartAction: {
      label: 'Resolve Conflict',
      actionKey: 'resolve_conflict_demo'
    }
  },
  {
    id: 'notif_04',
    title: 'Next Meeting Brief Generated',
    message: 'Pre-meeting brief for "Client Demo Alignment" is prepared with 3 pending decisions and 2 risks.',
    priority: 'Normal',
    timestamp: '2 hours ago',
    read: true,
    type: 'meeting_prepared',
    actionUrl: '/meetings'
  }
];

export const INITIAL_INTEGRATIONS: IntegrationStatus[] = [
  { id: 'int_github', name: 'GitHub', icon: 'Github', category: 'project_management', connected: true, lastSynced: '2 mins ago', accountEmail: 'org/aurapay-core', syncItemsCount: 48 },
  { id: 'int_jira', name: 'Jira Software', icon: 'Trello', category: 'project_management', connected: true, lastSynced: '15 mins ago', accountEmail: 'aurapay.atlassian.net', syncItemsCount: 34 },
  { id: 'int_slack', name: 'Slack', icon: 'Slack', category: 'communication', connected: true, lastSynced: 'Just now', accountEmail: '#aurapay-engineering', syncItemsCount: 112 },
  { id: 'int_teams', name: 'Microsoft Teams', icon: 'MessageSquare', category: 'communication', connected: false },
  { id: 'int_gmeet', name: 'Google Meet', icon: 'Video', category: 'communication', connected: true, lastSynced: '1 hour ago', accountEmail: 'shivani@meetflow.ai', syncItemsCount: 14 },
  { id: 'int_zoom', name: 'Zoom Enterprise', icon: 'Video', category: 'communication', connected: false },
  { id: 'int_gcal', name: 'Google Calendar', icon: 'Calendar', category: 'calendar', connected: true, lastSynced: '5 mins ago', accountEmail: 'shivani@meetflow.ai', syncItemsCount: 26 },
  { id: 'int_notion', name: 'Notion Workspace', icon: 'FileText', category: 'storage', connected: true, lastSynced: '30 mins ago', accountEmail: 'AuraPay Product Hub', syncItemsCount: 19 }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud_01',
    timestamp: '2026-09-12 11:32 AM',
    actor: { name: 'MeetFlow AI Engine', isAi: true, agentName: 'TaskAgent' },
    action: 'Extracted Structured Task',
    target: 'Complete Payment API & Stripe v3 Integration',
    details: 'Parsed commitment from Priya Sharma at 10:03:45 with 97% confidence score.',
    approvalStatus: 'Auto-Created'
  },
  {
    id: 'aud_02',
    timestamp: '2026-09-12 11:34 AM',
    actor: { name: 'Shivani Narayanan', isAi: false },
    action: 'Approved & Assigned Task',
    target: 'Complete Payment API & Stripe v3 Integration',
    details: 'Confirmed task creation and locked priority to Critical.',
    approvalStatus: 'Approved'
  },
  {
    id: 'aud_03',
    timestamp: '2026-09-12 11:36 AM',
    actor: { name: 'MeetFlow AI Engine', isAi: true, agentName: 'RiskAgent' },
    action: 'Computed Risk Forecast',
    target: 'Payment API & Staging QA Dependency',
    details: 'Identified 82% delay risk due to tight Friday staging window.',
    approvalStatus: 'Alert Dispatched'
  },
  {
    id: 'aud_04',
    timestamp: '2026-09-12 12:15 PM',
    actor: { name: 'Priya Sharma', isAi: false },
    action: 'Updated Task Status',
    target: 'Complete Payment API & Stripe v3 Integration',
    details: 'Status changed from Not Started to In Progress.',
    approvalStatus: 'Executed'
  }
];

export const INITIAL_KNOWLEDGE_GRAPH: { nodes: KnowledgeNode[]; edges: KnowledgeEdge[] } = {
  nodes: [
    { id: 'kn_meet_01', type: 'Meeting', label: 'Sprint 24 Planning', sublabel: 'Sept 11, 2026', status: 'Completed' },
    { id: 'kn_meet_02', type: 'Meeting', label: 'Architecture Review', sublabel: 'Sept 08, 2026', status: 'Completed' },
    { id: 'kn_dec_01', type: 'Decision', label: 'Payment API by Friday', sublabel: 'Approved (97%)', status: 'Active' },
    { id: 'kn_dec_02', type: 'Decision', label: 'Use Firebase Auth', sublabel: 'Approved (94%)', status: 'Active' },
    { id: 'kn_dec_03', type: 'Decision', label: 'PostgreSQL Ledger', sublabel: 'Approved (96%)', status: 'Active' },
    { id: 'kn_proj_01', type: 'Project', label: 'AuraPay v2.0', sublabel: 'Health: 81%', status: 'At Risk' },
    { id: 'kn_usr_priya', type: 'Person', label: 'Priya Sharma', sublabel: 'Lead Backend', status: 'Workload: 87%' },
    { id: 'kn_usr_arun', type: 'Person', label: 'Arun Kumar', sublabel: 'QA & DevOps', status: 'Workload: 41%' },
    { id: 'kn_usr_rahul', type: 'Person', label: 'Rahul Verma', sublabel: 'Frontend Arch', status: 'Workload: 48%' },
    { id: 'kn_usr_sarah', type: 'Person', label: 'Sarah Chen', sublabel: 'Product Manager', status: 'Workload: 62%' },
    { id: 'kn_usr_shivani', type: 'Person', label: 'Shivani Narayanan', sublabel: 'VP Engineering', status: 'Lead' },
    { id: 'kn_tsk_01', type: 'Task', label: 'Payment API v3', sublabel: 'Due Friday', status: 'In Progress' },
    { id: 'kn_tsk_02', type: 'Task', label: 'E2E Testing Suite', sublabel: 'Due Saturday', status: 'Blocked' },
    { id: 'kn_tsk_04', type: 'Task', label: 'Client Demo Walkthrough', sublabel: 'Due Monday', status: 'Critical' },
    { id: 'kn_doc_01', type: 'Document', label: 'Stripe v3 API Spec', sublabel: 'Technical Doc', status: 'Synced' }
  ],
  edges: [
    { id: 'ke_01', source: 'kn_meet_01', target: 'kn_dec_01', relation: 'Decided' },
    { id: 'ke_02', source: 'kn_dec_01', target: 'kn_tsk_01', relation: 'Generates' },
    { id: 'ke_03', source: 'kn_tsk_01', target: 'kn_usr_priya', relation: 'Assigned To' },
    { id: 'ke_04', source: 'kn_tsk_01', target: 'kn_tsk_02', relation: 'Blocks' },
    { id: 'ke_05', source: 'kn_tsk_02', target: 'kn_usr_arun', relation: 'Assigned To' },
    { id: 'ke_06', source: 'kn_tsk_02', target: 'kn_tsk_04', relation: 'Blocks' },
    { id: 'ke_07', source: 'kn_tsk_04', target: 'kn_usr_sarah', relation: 'Assigned To' },
    { id: 'ke_08', source: 'kn_meet_02', target: 'kn_dec_02', relation: 'Decided' },
    { id: 'ke_09', source: 'kn_meet_02', target: 'kn_dec_03', relation: 'Decided' },
    { id: 'ke_10', source: 'kn_dec_02', target: 'kn_usr_shivani', relation: 'Confirmed By' },
    { id: 'ke_11', source: 'kn_proj_01', target: 'kn_tsk_01', relation: 'Includes' },
    { id: 'ke_12', source: 'kn_proj_01', target: 'kn_doc_01', relation: 'References' }
  ]
};
