import { Router } from 'express';
import { store } from '../store.js';
import { Task } from '../../src/types/index.js';

const router = Router();

// Get all tasks
router.get('/', (req, res) => {
  res.json(store.tasks);
});

// Create new task
router.post('/', (req, res) => {
  const { title, description, ownerId, priority, dueDate, projectId, meetingId } = req.body;
  const owner = store.users.find(u => u.id === ownerId) || store.users[1];
  const project = store.projects.find(p => p.id === projectId) || store.projects[0];

  const newTask: Task = {
    id: 'tsk_' + Date.now(),
    workspaceId: store.workspaces[0].id,
    meetingId: meetingId || store.meetings[0].id,
    meetingTitle: store.meetings[0].title,
    projectId: project.id,
    projectName: project.name,
    title,
    description: description || '',
    ownerId: owner.id,
    owner,
    priority: priority || 'Medium',
    status: 'Not Started',
    dueDate: dueDate || '2026-09-20',
    dependencies: [],
    riskScore: 25,
    aiConfidence: 95,
    evidence: {
      timestamp: new Date().toLocaleTimeString(),
      quote: 'Explicitly scheduled task.',
      speaker: 'User'
    },
    timeline: [
      { stage: 'Created', timestamp: new Date().toLocaleTimeString(), details: 'Task registered in workspace' },
      { stage: 'Assigned', timestamp: new Date().toLocaleTimeString(), details: `Assigned to ${owner.name}` }
    ]
  };

  store.tasks.unshift(newTask);
  store.addAuditLog('Shivani Narayanan', false, 'Created Action Item Task', newTask.title, `Assigned to ${owner.name}, Priority: ${newTask.priority}`);

  res.status(201).json(newTask);
});

// Update task status
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  const task = store.tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const oldStatus = task.status;
  task.status = status;

  if (status === 'Completed') {
    task.timeline.push({
      stage: 'Completed',
      timestamp: new Date().toLocaleTimeString(),
      details: 'Marked completed by owner'
    });
    task.timeline.push({
      stage: 'Verified',
      timestamp: new Date().toLocaleTimeString(),
      details: 'Verified by MeetFlow AI Execution Engine'
    });
    task.verifiedByAi = true;
    task.verifiedAt = new Date().toISOString();
  } else {
    task.timeline.push({
      stage: 'Started',
      timestamp: new Date().toLocaleTimeString(),
      details: `Status shifted to ${status}`
    });
  }

  store.addAuditLog('Priya Sharma', false, 'Updated Task Status', task.title, `Changed status from ${oldStatus} to ${status}`);

  res.json(task);
});

// Reassign task / balance workload
router.post('/rebalance', (req, res) => {
  const { fromUserId, toUserId, taskId } = req.body;
  store.rebalanceWorkload(fromUserId, toUserId, taskId);
  res.json({
    success: true,
    tasks: store.tasks,
    users: store.users
  });
});

export default router;
