import { Router } from 'express';
import { store } from '../store.js';

const router = Router();

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = store.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase()) || store.users[0];

  res.json({
    token: 'jwt_mock_token_' + user.id + '_' + Date.now(),
    user,
    workspace: store.workspaces[0]
  });
});

// Register
router.post('/register', (req, res) => {
  const { name, email, role } = req.body;
  const newUser = {
    id: 'usr_' + Date.now(),
    name: name || 'New User',
    email: email || `user_${Date.now()}@meetflow.ai`,
    role: role || 'Engineering Manager',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    skills: ['Productivity', 'Agile', 'Team Lead'],
    currentWorkload: 40,
    onTimeCompletionRate: 95,
    activeTasksCount: 1
  };

  store.users.push(newUser);
  store.workspaces[0].members.push({
    userId: newUser.id,
    user: newUser,
    workspaceRole: 'Member',
    joinedAt: new Date().toISOString()
  });

  store.addAuditLog(newUser.name, false, 'User Registered & Joined Workspace', 'MeetFlow Workspace', 'Created account and joined workspace.');

  res.json({
    token: 'jwt_mock_token_' + newUser.id + '_' + Date.now(),
    user: newUser,
    workspace: store.workspaces[0]
  });
});

// Get Current Profile
router.get('/me', (req, res) => {
  res.json({
    user: store.users[0],
    workspace: store.workspaces[0],
    users: store.users
  });
});

// Update Onboarding preferences
router.post('/onboarding', (req, res) => {
  const { role, goals, workspaceName } = req.body;
  if (workspaceName) {
    store.workspaces[0].name = workspaceName;
  }
  store.addAuditLog('Shivani Narayanan', false, 'Completed Onboarding Setup', 'Workspace Settings', `Role: ${role}, Goals: ${goals?.join(', ')}`);
  res.json({ success: true, workspace: store.workspaces[0] });
});

export default router;
