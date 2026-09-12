import { Router } from 'express';
import { store } from '../store.js';
import { orchestrator } from '../agents/agentOrchestrator.js';
import { Meeting } from '../../src/types/index.js';

const router = Router();

// Get all meetings
router.get('/', (req, res) => {
  res.json(store.meetings);
});

// Get meeting by ID
router.get('/:id', (req, res) => {
  const meeting = store.meetings.find(m => m.id === req.params.id);
  if (!meeting) {
    return res.status(404).json({ error: 'Meeting not found' });
  }
  
  // Include associated decisions, tasks, risks
  const meetingDecisions = store.decisions.filter(d => d.meetingId === meeting.id);
  const meetingTasks = store.tasks.filter(t => t.meetingId === meeting.id);
  const meetingRisks = store.risks.filter(r => r.sourceMeetingId === meeting.id);
  const meetingQuestions = store.questions.filter(q => q.meetingId === meeting.id);
  const meetingCommitments = store.commitments.filter(c => c.meetingId === meeting.id);

  res.json({
    meeting,
    decisions: meetingDecisions,
    tasks: meetingTasks,
    risks: meetingRisks,
    questions: meetingQuestions,
    commitments: meetingCommitments
  });
});

// Create / Schedule Meeting
router.post('/', (req, res) => {
  const { title, type, date, duration, agenda, projectId } = req.body;
  const project = store.projects.find(p => p.id === projectId) || store.projects[0];

  const newMeeting: Meeting = {
    id: 'meet_' + Date.now(),
    workspaceId: store.workspaces[0].id,
    projectId: project.id,
    projectName: project.name,
    title: title || 'New Strategic Alignment Meeting',
    type: type || 'Team',
    date: date || new Date().toISOString(),
    duration: duration || '30m',
    status: 'Scheduled',
    participants: store.users.slice(0, 4),
    agenda: agenda || ['Review progress', 'Align on blockers', 'Assign deliverables'],
    transcript: []
  };

  store.meetings.unshift(newMeeting);
  store.addAuditLog('Shivani Narayanan', false, 'Scheduled New Meeting', newMeeting.title, `Type: ${newMeeting.type}, Project: ${newMeeting.projectName}`);
  store.addNotification('New Meeting Scheduled', `${newMeeting.title} has been scheduled.`, 'Normal', 'meeting_prepared', `/meetings/${newMeeting.id}`);

  res.status(201).json(newMeeting);
});

// Process Meeting via AI Multi-Agent Pipeline
router.post('/:id/process', async (req, res) => {
  const meeting = store.meetings.find(m => m.id === req.params.id);
  if (!meeting) {
    return res.status(404).json({ error: 'Meeting not found' });
  }

  const transcriptText = req.body.transcriptText || meeting.transcript.map(t => `${t.speaker}: ${t.text}`).join('\n');
  const result = await orchestrator.analyzeMeeting(meeting.id, transcriptText);

  // Update meeting state
  meeting.status = 'Completed';
  meeting.summary = {
    executive: result.executiveSummary,
    detailed: result.detailedSummary,
    agreements: ['Staging deadline locked to Friday 4 PM', 'E2E test suite prepared beforehand'],
    disagreements: [],
    topics: ['Payment API v3', 'Monday Demo', 'Staging Deployments'],
    followUpRecommendations: result.recommendations
  };
  meeting.metrics = {
    effectivenessScore: result.effectivenessScore,
    continuityScore: result.continuityScore,
    decisionsCount: result.decisions.length,
    tasksCount: result.tasks.length,
    risksCount: result.risks.length,
    questionsCount: result.questions.length,
    wasteScore: 'Low'
  };

  // Merge into store if not already present
  result.decisions.forEach(d => {
    if (!store.decisions.some(existing => existing.title === d.title)) {
      store.decisions.unshift(d);
    }
  });

  result.tasks.forEach(t => {
    if (!store.tasks.some(existing => existing.title === t.title)) {
      store.tasks.unshift(t);
    }
  });

  result.risks.forEach(r => {
    if (!store.risks.some(existing => existing.title === r.title)) {
      store.risks.unshift(r);
    }
  });

  res.json({
    success: true,
    meeting,
    extractedResult: result
  });
});

export default router;
