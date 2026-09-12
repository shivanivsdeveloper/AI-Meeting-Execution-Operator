import { Router } from 'express';
import { orchestrator } from '../agents/agentOrchestrator.js';
import { whiteboardVision } from '../agents/whiteboardVision.js';
import { multilingualParser } from '../agents/multilingualParser.js';
import { store } from '../store.js';

const router = Router();

// AI Operator Chat
router.post('/chat', async (req, res) => {
  const { query } = req.body;
  const result = await orchestrator.handleOperatorChat(query || 'What should I focus on today?');
  
  store.addAuditLog('AI Operator', true, 'Processed Operator Natural Language Query', 'AI Chat Assistant', `Query: "${query}"`, 'AI Orchestrator');

  res.json(result);
});

// What-If Scenario Delay Simulator
router.post('/simulator', (req, res) => {
  const { taskId, delayDays } = req.body;
  const result = store.runWhatIfSimulation(taskId || 'tsk_01', Number(delayDays) || 3);
  res.json(result);
});

// Whiteboard / Image Architecture Processing
router.post('/whiteboard', (req, res) => {
  const { imageUrl } = req.body;
  const analysis = whiteboardVision.analyzeImage(imageUrl || '');
  res.json(analysis);
});

// Multilingual code-switch parsing
router.post('/multilingual', (req, res) => {
  const { text } = req.body;
  const result = multilingualParser.parseSegment(text || '');
  res.json(result);
});

// AI Agenda Generator for upcoming meetings
router.post('/generate-agenda', (req, res) => {
  const { meetingType, topic } = req.body;
  const unresolvedQuestions = store.questions.filter(q => q.status === 'Unresolved');
  const highRisks = store.risks.filter(r => r.level === 'High' || r.level === 'Critical');
  const pendingDecisions = store.decisions.filter(d => d.status === 'Proposed');

  const generatedAgenda = [
    `1. ${topic || 'Sprint Alignment'}: Core objectives & milestone targets`,
    `2. High-Risk Review: ${highRisks[0]?.title || 'Payment API & Staging QA Bottleneck'}`,
    `3. Unresolved Questions: "${unresolvedQuestions[0]?.question || 'Production credentials signoff'}"`,
    `4. Decision Verification: Confirm status on ${pendingDecisions[0]?.title || 'Architecture deliverables'}`,
    `5. Action Item Assignment & Next-Meeting Commitments`
  ];

  res.json({
    agenda: generatedAgenda,
    groundedContext: {
      activeRisksCount: highRisks.length,
      unresolvedQuestionsCount: unresolvedQuestions.length,
      pendingDecisionsCount: pendingDecisions.length
    }
  });
});

// Reset demo state
router.post('/reset-demo', (req, res) => {
  store.resetToDemo();
  res.json({ success: true, message: 'Workspace successfully restored to AuraPay Platform pristine demo state.' });
});

export default router;
