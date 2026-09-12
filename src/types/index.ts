export type Role = 'Owner' | 'Admin' | 'Manager' | 'Member' | 'Viewer' | 'Guest';

export type AutonomyLevel = 'suggest_only' | 'ask_before_executing' | 'execute_approved' | 'fully_autonomous';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  skills: string[];
  currentWorkload: number; // 0 - 100 percentage
  onTimeCompletionRate: number; // e.g. 91%
  activeTasksCount: number;
}

export interface WorkspaceMember {
  userId: string;
  user: User;
  workspaceRole: Role;
  joinedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  members: WorkspaceMember[];
  projects: string[];
  settings: {
    autonomyLevel: AutonomyLevel;
    recordingRetentionDays: number;
    redactionEnabled: boolean;
    aiProvider: 'gemini' | 'openai' | 'hybrid';
    escalationThresholdHours: number;
  };
}

export interface TranscriptSegment {
  id: string;
  speaker: string;
  speakerAvatar?: string;
  timestamp: string; // e.g. "10:32:14"
  seconds: number;
  text: string;
  originalLanguage?: string;
  translatedText?: string;
  aiDetectedTypes?: ('decision' | 'task' | 'risk' | 'question' | 'conflict')[];
}

export type MeetingType = 
  | 'Team' 
  | 'Standup' 
  | 'Client' 
  | 'Project' 
  | 'Planning' 
  | 'Review' 
  | 'Interview' 
  | 'Brainstorm' 
  | 'Strategy' 
  | 'One-on-one';

export interface Meeting {
  id: string;
  workspaceId: string;
  projectId?: string;
  projectName?: string;
  title: string;
  type: MeetingType;
  date: string;
  duration: string;
  status: 'Scheduled' | 'Live' | 'Completed';
  participants: User[];
  agenda: string[];
  transcript: TranscriptSegment[];
  summary?: {
    executive: string;
    detailed: string;
    agreements: string[];
    disagreements: string[];
    topics: string[];
    followUpRecommendations: string[];
  };
  metrics?: {
    effectivenessScore: number; // e.g. 89%
    continuityScore: number; // e.g. 88%
    decisionsCount: number;
    tasksCount: number;
    risksCount: number;
    questionsCount: number;
    wasteScore: 'Low' | 'Medium' | 'High';
  };
  whiteboardData?: {
    imageUrl: string;
    extractedComponents: string[];
    architectureDescription: string;
  };
}

export type DecisionStatus = 'Proposed' | 'Discussed' | 'Approved' | 'Rejected' | 'Revisited' | 'Superseded';

export interface Decision {
  id: string;
  workspaceId: string;
  meetingId: string;
  meetingTitle: string;
  title: string;
  description: string;
  status: DecisionStatus;
  date: string;
  confidence: number; // 0 - 100
  evidence: {
    timestamp: string;
    quote: string;
    speaker: string;
  };
  reason: string;
  participantsCount: number;
  projectId?: string;
  projectName?: string;
  evolutionHistory: {
    date: string;
    stage: string;
    note: string;
  }[];
  conflictWith?: {
    meetingId: string;
    meetingTitle: string;
    date: string;
    conflictingText: string;
  };
  driftDetected?: {
    referenceDoc: string;
    driftStatement: string;
    severity: 'Low' | 'Medium' | 'High';
  };
}

export type TaskStatus = 'Not Started' | 'In Progress' | 'Blocked' | 'Completed' | 'Cancelled' | 'Overdue';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Task {
  id: string;
  workspaceId: string;
  meetingId: string;
  meetingTitle: string;
  projectId?: string;
  projectName?: string;
  title: string;
  description: string;
  ownerId: string;
  owner: User;
  recommendedOwner?: {
    user: User;
    reasons: string[];
    confidence: number;
  };
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  dependencies: string[]; // Task IDs this depends on
  dependents?: string[]; // Task IDs that depend on this
  riskScore: number; // 0 - 100
  riskReason?: string;
  aiConfidence: number;
  evidence: {
    timestamp: string;
    quote: string;
    speaker: string;
  };
  verifiedByAi?: boolean;
  verifiedAt?: string;
  timeline: {
    stage: 'Decision' | 'Created' | 'Assigned' | 'Started' | 'Risk Detected' | 'Completed' | 'Verified';
    timestamp: string;
    details: string;
  }[];
}

export interface Risk {
  id: string;
  workspaceId: string;
  projectId: string;
  projectName: string;
  title: string;
  level: 'Low' | 'Medium' | 'High' | 'Critical';
  probabilityScore: number; // 0 - 100
  impact: string;
  affectedTaskIds: string[];
  mitigation: string;
  sourceMeetingId: string;
  sourceMeetingTitle: string;
  detectedAt: string;
}

export interface Question {
  id: string;
  workspaceId: string;
  meetingId: string;
  meetingTitle: string;
  question: string;
  askedBy: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Unresolved' | 'Resolved';
  resolutionMeetingId?: string;
  resolutionAnswer?: string;
  firstRaisedDate: string;
  meetingsSeenCount: number;
}

export interface Commitment {
  id: string;
  workspaceId: string;
  meetingId: string;
  meetingTitle: string;
  personName: string;
  personAvatar: string;
  commitment: string;
  dueDate: string;
  status: 'Completed' | 'In Progress' | 'Overdue' | 'Delayed';
  delayHistoryCount: number;
  evidence: {
    timestamp: string;
    quote: string;
  };
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  healthScore: number; // 0 - 100
  progressPercentage: number;
  scheduleStatus: 'On Track' | 'At Risk' | 'Delayed';
  totalTasks: number;
  completedTasks: number;
  activeRisksCount: number;
  overdueTasksCount: number;
  lead: User;
  members: User[];
  milestones: {
    title: string;
    dueDate: string;
    completed: boolean;
  }[];
}

export interface AIInsight {
  id: string;
  type: 'decision' | 'task' | 'risk' | 'question' | 'conflict' | 'recommendation' | 'drift';
  title: string;
  description: string;
  confidence: number;
  timestamp: string;
  evidenceQuote?: string;
  suggestedAction?: {
    label: string;
    actionType: string;
    payload: any;
  };
}

export interface AIActionApproval {
  id: string;
  type: 'external_email' | 'reassign_task' | 'schedule_meeting' | 'escalate_risk' | 'update_spec';
  title: string;
  summary: string;
  confidence: number;
  status: 'Awaiting Approval' | 'Approved' | 'Rejected' | 'Executed';
  createdAt: string;
  details: any;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  priority: 'Low' | 'Normal' | 'High' | 'Critical';
  timestamp: string;
  read: boolean;
  type: 'task_assigned' | 'risk_detected' | 'deadline_approaching' | 'approval_required' | 'conflict_detected' | 'meeting_prepared';
  actionUrl?: string;
  smartAction?: {
    label: string;
    actionKey: string;
  };
}

export interface IntegrationStatus {
  id: string;
  name: string;
  icon: string;
  category: 'calendar' | 'communication' | 'project_management' | 'storage';
  connected: boolean;
  lastSynced?: string;
  accountEmail?: string;
  syncItemsCount?: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: {
    name: string;
    isAi: boolean;
    agentName?: string;
  };
  action: string;
  target: string;
  details: string;
  approvalStatus?: string;
}

export interface WhatIfSimulationResult {
  taskDelayedId: string;
  taskTitle: string;
  delayDays: number;
  cascadingDelays: {
    taskId: string;
    taskTitle: string;
    originalDueDate: string;
    newDueDate: string;
    delayDays: number;
  }[];
  predictedMilestoneDelay: {
    milestoneName: string;
    delayDays: number;
    riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  };
  affectedTasksCount: number;
  affectedTeamMembers: {
    name: string;
    avatar: string;
    impactedTasks: string[];
  }[];
}

export interface KnowledgeNode {
  id: string;
  type: 'Person' | 'Meeting' | 'Decision' | 'Project' | 'Task' | 'Document';
  label: string;
  sublabel?: string;
  status?: string;
}

export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  relation: string;
}
