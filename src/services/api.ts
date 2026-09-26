import { 
  Meeting, Decision, Task, Risk, Question, Commitment, 
  Project, AIActionApproval, NotificationItem, IntegrationStatus, 
  AuditLogItem, WhatIfSimulationResult, KnowledgeNode, KnowledgeEdge 
} from '../types';

const API_BASE = '/api';

export const api = {
  // Auth
  async login(email?: string, password?: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async register(name: string, email: string, role: string) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, role })
    });
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`);
    return res.json();
  },

  async submitOnboarding(data: { role: string; goals: string[]; workspaceName: string }) {
    const res = await fetch(`${API_BASE}/auth/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Meetings
  async getMeetings(): Promise<Meeting[]> {
    const res = await fetch(`${API_BASE}/meetings`);
    return res.json();
  },

  async getMeeting(id: string) {
    const res = await fetch(`${API_BASE}/meetings/${id}`);
    return res.json();
  },

  async createMeeting(data: Partial<Meeting>) {
    const res = await fetch(`${API_BASE}/meetings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async processMeeting(id: string, transcriptText?: string) {
    const res = await fetch(`${API_BASE}/meetings/${id}/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcriptText })
    });
    return res.json();
  },

  // Decisions
  async getDecisions(): Promise<Decision[]> {
    const res = await fetch(`${API_BASE}/decisions`);
    return res.json();
  },

  async updateDecisionStatus(id: string, status: string) {
    const res = await fetch(`${API_BASE}/decisions/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  async resolveConflict(id: string, resolutionChoice: string, note?: string) {
    const res = await fetch(`${API_BASE}/decisions/${id}/resolve-conflict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolutionChoice, note })
    });
    return res.json();
  },

  // Tasks
  async getTasks(): Promise<Task[]> {
    const res = await fetch(`${API_BASE}/tasks`);
    return res.json();
  },

  async createTask(data: Partial<Task>) {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateTaskStatus(id: string, status: string) {
    const res = await fetch(`${API_BASE}/tasks/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  async rebalanceWorkload(fromUserId: string, toUserId: string, taskId: string) {
    const res = await fetch(`${API_BASE}/tasks/rebalance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromUserId, toUserId, taskId })
    });
    return res.json();
  },

  // AI & Simulator
  async askAIOperator(query: string) {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    return res.json();
  },

  async runWhatIfSimulation(taskId: string, delayDays: number): Promise<WhatIfSimulationResult> {
    const res = await fetch(`${API_BASE}/ai/simulator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, delayDays })
    });
    return res.json();
  },

  async analyzeWhiteboard(imageUrl: string) {
    const res = await fetch(`${API_BASE}/ai/whiteboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl })
    });
    return res.json();
  },

  async parseMultilingual(text: string) {
    const res = await fetch(`${API_BASE}/ai/multilingual`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    return res.json();
  },

  async generateAgenda(topic?: string) {
    const res = await fetch(`${API_BASE}/ai/generate-agenda`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    });
    return res.json();
  },

  async resetDemo() {
    const res = await fetch(`${API_BASE}/ai/reset-demo`, {
      method: 'POST'
    });
    return res.json();
  },

  // Analytics
  async getAnalytics() {
    const res = await fetch(`${API_BASE}/analytics`);
    return res.json();
  },

  // Approvals
  async getApprovals(): Promise<AIActionApproval[]> {
    const res = await fetch(`${API_BASE}/approvals`);
    return res.json();
  },

  async actOnApproval(id: string, action: 'approve' | 'reject') {
    const res = await fetch(`${API_BASE}/approvals/${id}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });
    return res.json();
  },

  // Integrations
  async getIntegrations(): Promise<IntegrationStatus[]> {
    const res = await fetch(`${API_BASE}/integrations`);
    return res.json();
  },

  async toggleIntegration(id: string) {
    const res = await fetch(`${API_BASE}/integrations/${id}/toggle`, {
      method: 'POST'
    });
    return res.json();
  },

  async syncIntegration(id: string) {
    const res = await fetch(`${API_BASE}/integrations/${id}/sync`, {
      method: 'POST'
    });
    return res.json();
  },

  // Shared: Audit, Notifications, Knowledge, Search, Projects
  async getAuditLogs(): Promise<AuditLogItem[]> {
    const res = await fetch(`${API_BASE}/audit`);
    return res.json();
  },

  async getNotifications(): Promise<NotificationItem[]> {
    const res = await fetch(`${API_BASE}/notifications`);
    return res.json();
  },

  async markNotificationRead(id: string) {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PATCH'
    });
    return res.json();
  },

  async markAllNotificationsRead() {
    const res = await fetch(`${API_BASE}/notifications/mark-all-read`, {
      method: 'POST'
    });
    return res.json();
  },

  async getProjects(): Promise<Project[]> {
    const res = await fetch(`${API_BASE}/projects`);
    return res.json();
  },

  async getKnowledgeGraph(): Promise<{ nodes: KnowledgeNode[]; edges: KnowledgeEdge[] }> {
    const res = await fetch(`${API_BASE}/knowledge`);
    return res.json();
  },

  async searchGlobal(q: string) {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(q)}`);
    return res.json();
  },

  // AI Meeting Participant
  async analyzeMeetingChunk(data: {
    segment: any;
    mode: string;
    frequency: string;
    previousSegments?: any[];
  }) {
    const res = await fetch(`${API_BASE}/participant/analyze-chunk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async directAskParticipant(query: string, mode: string = 'smart_participant') {
    const res = await fetch(`${API_BASE}/participant/direct-ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, mode })
    });
    return res.json();
  },

  async approveExtractedTask(draft: any, meetingId?: string, projectId?: string) {
    const res = await fetch(`${API_BASE}/participant/approve-task`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ draft, meetingId, projectId })
    });
    return res.json();
  },

  async approveExtractedDecision(draft: any, meetingId?: string, projectId?: string) {
    const res = await fetch(`${API_BASE}/participant/approve-decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ draft, meetingId, projectId })
    });
    return res.json();
  },

  async endParticipantMeeting(data: {
    meetingId: string;
    title: string;
    transcripts: any[];
    approvedTasksCount: number;
    approvedDecisionsCount: number;
  }) {
    const res = await fetch(`${API_BASE}/participant/end-meeting`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // AI Model & Training
  async getModelTrainingStatus() {
    const res = await fetch(`${API_BASE}/training/status`);
    return res.json();
  },

  async trainModel(epochs: number = 40, learningRate: number = 0.15) {
    const res = await fetch(`${API_BASE}/training/train`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ epochs, learningRate })
    });
    return res.json();
  }
};

