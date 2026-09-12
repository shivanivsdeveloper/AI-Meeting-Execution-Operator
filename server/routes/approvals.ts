import { Router } from 'express';
import { store } from '../store.js';

const router = Router();

// Get approvals queue
router.get('/', (req, res) => {
  res.json(store.approvals);
});

// Update approval item (Approve / Reject)
router.post('/:id/action', (req, res) => {
  const { action } = req.body; // 'approve' | 'reject'
  const approval = store.approvals.find(a => a.id === req.params.id);
  if (!approval) {
    return res.status(404).json({ error: 'Approval item not found' });
  }

  if (action === 'approve') {
    approval.status = 'Approved';
    store.addAuditLog('Shivani Narayanan', false, 'Approved AI Action', approval.title, `Human approved action: ${approval.type}`);

    // If it's a reassign task approval, execute the rebalance
    if (approval.type === 'reassign_task') {
      const priya = store.users.find(u => u.id === 'usr_priya');
      const arun = store.users.find(u => u.id === 'usr_arun');
      if (priya && arun) {
        store.rebalanceWorkload(priya.id, arun.id, 'tsk_02');
      }
    }

    approval.status = 'Executed';
    store.addNotification('AI Action Executed', `"${approval.title}" has been successfully executed.`, 'Normal', 'approval_required', '/approvals');
  } else {
    approval.status = 'Rejected';
    store.addAuditLog('Shivani Narayanan', false, 'Rejected AI Action', approval.title, 'Human rejected proposed AI action.');
  }

  res.json({ success: true, approval });
});

export default router;
