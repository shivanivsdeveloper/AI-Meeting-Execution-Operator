import { Router } from 'express';
import { store } from '../store.js';

const router = Router();

router.get('/', (req, res) => {
  res.json(store.integrations);
});

router.post('/:id/toggle', (req, res) => {
  const integration = store.integrations.find(i => i.id === req.params.id);
  if (!integration) {
    return res.status(404).json({ error: 'Integration not found' });
  }

  integration.connected = !integration.connected;
  integration.lastSynced = integration.connected ? 'Just now' : undefined;

  store.addAuditLog('Shivani Narayanan', false, integration.connected ? 'Connected Integration' : 'Disconnected Integration', integration.name, `Integration state changed to ${integration.connected ? 'Active' : 'Disabled'}`);

  res.json(integration);
});

router.post('/:id/sync', (req, res) => {
  const integration = store.integrations.find(i => i.id === req.params.id);
  if (!integration) {
    return res.status(404).json({ error: 'Integration not found' });
  }

  integration.lastSynced = 'Just now';
  store.addAuditLog('MeetFlow AI Sync Engine', true, 'Executed Integration Sync', integration.name, 'Synchronized latest issues, transcripts, and calendar events.', 'ExecutionAgent');

  res.json({ success: true, integration });
});

export default router;
