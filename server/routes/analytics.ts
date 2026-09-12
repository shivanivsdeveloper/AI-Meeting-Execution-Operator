import { Router } from 'express';
import { store } from '../store.js';

const router = Router();

router.get('/', (req, res) => {
  const totalMeetings = store.meetings.length;
  const totalDecisions = store.decisions.length;
  const totalTasks = store.tasks.length;
  const completedTasks = store.tasks.filter(t => t.status === 'Completed').length;
  const verifiedTasks = store.tasks.filter(t => t.verifiedByAi).length;
  const overdueTasks = store.tasks.filter(t => t.status === 'Overdue').length;

  const executionFunnel = [
    { stage: 'Meetings Held', count: 24, conversion: '100%' },
    { stage: 'Decisions Extracted', count: 86, conversion: '94%' },
    { stage: 'Action Items Created', count: 68, conversion: '79%' },
    { stage: 'Owners Assigned', count: 68, conversion: '100%' },
    { stage: 'Work Started', count: 54, conversion: '79%' },
    { stage: 'Completed On-Time', count: 47, conversion: '87%' },
    { stage: 'AI Verified & Certified', count: 44, conversion: '94%' }
  ];

  res.json({
    metrics: {
      executionHealthScore: 84, // Out of 100
      meetingEffectiveness: 91,
      commitmentCompletionRate: 87,
      averageDecisionVelocityHours: 4.2, // Time from discussion to signed decision
      averageTaskCompletionDays: 2.8,
      totalMeetingsCount: 24,
      totalDecisionsCount: 86,
      activeTasksCount: store.tasks.length,
      overdueTasksCount: overdueTasks || 2
    },
    executionFunnel,
    decisionTrends: [
      { month: 'Jun', count: 18, executionRate: 82 },
      { month: 'Jul', count: 26, executionRate: 86 },
      { month: 'Aug', count: 34, executionRate: 89 },
      { month: 'Sep', count: 42, executionRate: 93 }
    ],
    workloadDistribution: store.users.map(u => ({
      name: u.name,
      role: u.role,
      avatar: u.avatar,
      workload: u.currentWorkload,
      activeTasks: u.activeTasksCount,
      onTimeRate: u.onTimeCompletionRate
    }))
  });
});

export default router;
