import { Router } from 'express';
import { store } from '../store.js';

const router = Router();

// Get all decisions
router.get('/', (req, res) => {
  res.json(store.decisions);
});

// Update decision status
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  const decision = store.decisions.find(d => d.id === req.params.id);
  if (!decision) {
    return res.status(404).json({ error: 'Decision not found' });
  }

  const oldStatus = decision.status;
  decision.status = status;
  decision.evolutionHistory.push({
    date: new Date().toISOString().split('T')[0],
    stage: status,
    note: `Status updated from ${oldStatus} to ${status}`
  });

  store.addAuditLog('Shivani Narayanan', false, 'Updated Decision Status', decision.title, `Changed status to ${status}.`);

  res.json(decision);
});

// Resolve a detected conflict
router.post('/:id/resolve-conflict', (req, res) => {
  const { resolutionChoice, note } = req.body;
  const decision = store.decisions.find(d => d.id === req.params.id);
  if (!decision) {
    return res.status(404).json({ error: 'Decision not found' });
  }

  decision.conflictWith = undefined;
  decision.evolutionHistory.push({
    date: new Date().toISOString().split('T')[0],
    stage: 'Conflict Resolved',
    note: note || `Conflict resolved in favor of: ${resolutionChoice}`
  });

  store.addAuditLog('Shivani Narayanan', false, 'Resolved Deadline Conflict', decision.title, `Resolved conflict with note: ${note || resolutionChoice}`);
  store.addNotification('Conflict Resolved', `Conflict on "${decision.title}" has been successfully resolved.`, 'Normal', 'conflict_detected', '/decisions');

  res.json({ success: true, decision });
});

export default router;
