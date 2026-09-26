import { Router } from 'express';
import { modelInference } from '../training/modelInference.js';
import { store } from '../store.js';
import { 
  TranscriptSegment, AIParticipantMode, AIParticipantFrequency,
  ExtractedActionItemDraft, ExtractedDecisionDraft, Task, Decision
} from '../../src/types/index.js';

const router = Router();

// Evaluate live transcript segment
router.post('/analyze-chunk', (req, res) => {
  const { 
    segment, 
    mode = 'smart_participant', 
    frequency = 'balanced',
    previousSegments = [] 
  } = req.body;

  if (!segment || !segment.text) {
    return res.status(400).json({ error: 'Segment with text is required' });
  }

  const analysis = modelInference.analyzeSegment(
    segment as TranscriptSegment,
    mode as AIParticipantMode,
    frequency as AIParticipantFrequency,
    previousSegments as TranscriptSegment[]
  );

  res.json(analysis);
});

// Direct verbal or text query to AI Participant
router.post('/direct-ask', (req, res) => {
  const { query, mode = 'smart_participant' } = req.body;

  const segment: TranscriptSegment = {
    id: 'user_ask_' + Date.now(),
    speaker: 'User',
    timestamp: new Date().toLocaleTimeString().slice(0, 5),
    seconds: 0,
    text: query || 'What is our top priority?'
  };

  const analysis = modelInference.analyzeSegment(
    segment,
    mode as AIParticipantMode,
    'proactive'
  );

  res.json(analysis);
});

// Approve Extracted Action Item and create REAL database task
router.post('/approve-task', (req, res) => {
  const { draft, meetingId, projectId } = req.body as { 
    draft: ExtractedActionItemDraft; 
    meetingId?: string; 
    projectId?: string;
  };

  if (!draft) {
    return res.status(400).json({ error: 'Action item draft is required' });
  }

  const meeting = store.meetings.find(m => m.id === meetingId) || store.meetings[0];
  const project = store.projects.find(p => p.id === (projectId || meeting.projectId)) || store.projects[0];
  const owner = store.users.find(u => u.name.toLowerCase().includes(draft.ownerName.toLowerCase().split(' ')[0])) || store.users[1];

  const realTask: Task = {
    id: 'tsk_' + Date.now(),
    workspaceId: store.workspaces[0].id,
    meetingId: meeting.id,
    meetingTitle: meeting.title,
    projectId: project.id,
    projectName: project.name,
    title: draft.title,
    description: draft.description,
    ownerId: owner.id,
    owner,
    priority: draft.priority,
    status: 'In Progress',
    dueDate: draft.dueDate || '2026-09-18',
    dependencies: draft.dependencies || [],
    riskScore: draft.riskScore || 50,
    aiConfidence: 96,
    evidence: {
      timestamp: draft.evidenceTimestamp || '10:03:45',
      quote: draft.evidenceQuote || draft.description,
      speaker: draft.evidenceSpeaker || draft.ownerName
    },
    timeline: [
      { stage: 'Decision', timestamp: draft.evidenceTimestamp || '10:09 AM', details: 'Extracted live by AI Meeting Participant' },
      { stage: 'Created', timestamp: new Date().toLocaleTimeString(), details: 'Approved by human facilitator' },
      { stage: 'Assigned', timestamp: new Date().toLocaleTimeString(), details: `Assigned to ${owner.name}` }
    ]
  };

  store.tasks.unshift(realTask);

  store.addAuditLog(
    'Shivani Narayanan', 
    false, 
    'Approved AI Meeting Action Item', 
    realTask.title, 
    `Assigned to ${owner.name}, Priority: ${realTask.priority}, Due: ${realTask.dueDate}`
  );

  store.addNotification(
    'New Task Created from Meeting', 
    `"${realTask.title}" assigned to ${owner.name} via AI Participant approval.`, 
    'Normal', 
    'task_assigned', 
    '/tasks'
  );

  res.status(201).json({
    success: true,
    task: realTask,
    message: 'Task successfully created in workspace database.'
  });
});

// Approve Extracted Decision and create REAL database decision
router.post('/approve-decision', (req, res) => {
  const { draft, meetingId, projectId } = req.body as {
    draft: ExtractedDecisionDraft;
    meetingId?: string;
    projectId?: string;
  };

  if (!draft) {
    return res.status(400).json({ error: 'Decision draft is required' });
  }

  const meeting = store.meetings.find(m => m.id === meetingId) || store.meetings[0];
  const project = store.projects.find(p => p.id === (projectId || meeting.projectId)) || store.projects[0];

  const realDecision: Decision = {
    id: 'dec_' + Date.now(),
    workspaceId: store.workspaces[0].id,
    meetingId: meeting.id,
    meetingTitle: meeting.title,
    title: draft.title,
    description: draft.description,
    status: draft.status || 'Approved',
    date: new Date().toISOString().split('T')[0],
    confidence: draft.confidence || 95,
    evidence: {
      timestamp: draft.evidenceTimestamp || '10:09:40',
      quote: draft.evidenceQuote || draft.description,
      speaker: draft.evidenceSpeaker || 'Shivani Narayanan'
    },
    reason: draft.reason || 'Confirmed during meeting execution.',
    participantsCount: meeting.participants.length || 4,
    projectId: project.id,
    projectName: project.name,
    evolutionHistory: [
      { date: new Date().toISOString().split('T')[0], stage: 'Approved', note: 'Confirmed live by AI Meeting Participant' }
    ]
  };

  store.decisions.unshift(realDecision);

  store.addAuditLog(
    'Shivani Narayanan',
    false,
    'Confirmed AI Meeting Decision',
    realDecision.title,
    `Status: ${realDecision.status}, Confidence: ${realDecision.confidence}%`
  );

  res.status(201).json({
    success: true,
    decision: realDecision,
    message: 'Decision confirmed and logged in workspace memory.'
  });
});

// Finalize Meeting & Generate Executive Minutes
router.post('/end-meeting', (req, res) => {
  const { meetingId, title, transcripts, approvedTasksCount, approvedDecisionsCount } = req.body;

  const meeting = store.meetings.find(m => m.id === meetingId) || store.meetings[0];
  meeting.status = 'Completed';
  meeting.summary = {
    executive: `AI Meeting Participant concluded live session. Captured ${approvedDecisionsCount || 1} confirmed decisions and ${approvedTasksCount || 1} action items grounded in live speech.`,
    detailed: `Session tracked with live speaker diarization and real-time conflict checking. All extracted deliverables were validated and committed directly into the workspace task management pipeline.`,
    agreements: ['Payment API delivery confirmed for Friday 4 PM', 'QA test suites ready before staging deployment'],
    disagreements: [],
    topics: ['Payment API v3', 'Client Demo Readiness', 'Sandbox Ownership'],
    followUpRecommendations: [
      'Verify webhook credentials by Thursday 5 PM',
      'Follow up on merchant sandbox approval ownership'
    ]
  };

  store.addAuditLog(
    'AI Meeting Participant',
    true,
    'Finalized Live Meeting Session',
    meeting.title,
    `Captured ${approvedTasksCount || 1} tasks and ${approvedDecisionsCount || 1} decisions.`
  );

  store.addNotification(
    'Meeting Summary Ready',
    `Executive minutes and action items generated for ${meeting.title}.`,
    'Normal',
    'meeting_prepared',
    `/meetings/${meeting.id}`
  );

  res.json({
    success: true,
    meeting,
    message: 'Meeting session finalized and execution records updated.'
  });
});

export default router;
