import { Router } from 'express';
import { store } from '../store.js';

const router = Router();

// Audit logs
router.get('/audit', (req, res) => {
  res.json(store.auditLogs);
});

// Notifications
router.get('/notifications', (req, res) => {
  res.json(store.notifications);
});

router.patch('/notifications/:id/read', (req, res) => {
  const notif = store.notifications.find(n => n.id === req.params.id);
  if (notif) {
    notif.read = true;
  }
  res.json({ success: true, notification: notif });
});

router.post('/notifications/mark-all-read', (req, res) => {
  store.notifications.forEach(n => n.read = true);
  res.json({ success: true, notifications: store.notifications });
});

// Projects
router.get('/projects', (req, res) => {
  res.json(store.projects);
});

// Knowledge Graph
router.get('/knowledge', (req, res) => {
  res.json(store.knowledgeGraph);
});

// Semantic Search across meetings, decisions, tasks, documents
router.get('/search', (req, res) => {
  const q = ((req.query.q as string) || '').toLowerCase();
  
  const matchedMeetings = store.meetings.filter(m => 
    m.title.toLowerCase().includes(q) || 
    m.transcript.some(t => t.text.toLowerCase().includes(q))
  );

  const matchedDecisions = store.decisions.filter(d => 
    d.title.toLowerCase().includes(q) || 
    d.description.toLowerCase().includes(q) ||
    d.evidence.quote.toLowerCase().includes(q)
  );

  const matchedTasks = store.tasks.filter(t => 
    t.title.toLowerCase().includes(q) || 
    t.description.toLowerCase().includes(q)
  );

  const matchedUsers = store.users.filter(u => 
    u.name.toLowerCase().includes(q) || 
    u.skills.some(s => s.toLowerCase().includes(q))
  );

  res.json({
    query: q,
    results: {
      meetings: matchedMeetings,
      decisions: matchedDecisions,
      tasks: matchedTasks,
      people: matchedUsers
    }
  });
});

export default router;
