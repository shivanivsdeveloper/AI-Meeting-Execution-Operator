import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Meeting, Decision, Task, Risk, Question, Commitment, AIActionApproval, NotificationItem } from '../types';
import { api } from '../services/api';

interface MeetingContextType {
  meetings: Meeting[];
  decisions: Decision[];
  tasks: Task[];
  risks: Risk[];
  questions: Question[];
  commitments: Commitment[];
  approvals: AIActionApproval[];
  notifications: NotificationItem[];
  isLoading: boolean;
  refreshAll: () => Promise<void>;
  updateTaskStatus: (taskId: string, status: string) => Promise<void>;
  updateDecisionStatus: (decisionId: string, status: string) => Promise<void>;
  resolveConflict: (decisionId: string, resolutionChoice: string, note?: string) => Promise<void>;
  rebalanceWorkload: (fromUserId: string, toUserId: string, taskId: string) => Promise<void>;
  actOnApproval: (approvalId: string, action: 'approve' | 'reject') => Promise<void>;
  resetToDemo: () => Promise<void>;
}

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

export const MeetingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [approvals, setApprovals] = useState<AIActionApproval[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshAll = async () => {
    try {
      const [m, d, t, a, n] = await Promise.all([
        api.getMeetings(),
        api.getDecisions(),
        api.getTasks(),
        api.getApprovals(),
        api.getNotifications()
      ]);
      setMeetings(m);
      setDecisions(d);
      setTasks(t);
      setApprovals(a);
      setNotifications(n);

      // Extract risks, questions, commitments from initial meeting data
      if (m.length > 0) {
        const fullDetail = await api.getMeeting(m[0].id);
        if (fullDetail.risks) setRisks(fullDetail.risks);
        if (fullDetail.questions) setQuestions(fullDetail.questions);
        if (fullDetail.commitments) setCommitments(fullDetail.commitments);
      }
    } catch (err) {
      console.error('Failed to load meeting context', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const updateTaskStatus = async (taskId: string, status: string) => {
    const updated = await api.updateTaskStatus(taskId, status);
    setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
  };

  const updateDecisionStatus = async (decisionId: string, status: string) => {
    const updated = await api.updateDecisionStatus(decisionId, status);
    setDecisions(prev => prev.map(d => (d.id === decisionId ? updated : d)));
  };

  const resolveConflict = async (decisionId: string, resolutionChoice: string, note?: string) => {
    const res = await api.resolveConflict(decisionId, resolutionChoice, note);
    if (res.decision) {
      setDecisions(prev => prev.map(d => (d.id === decisionId ? res.decision : d)));
    }
  };

  const rebalanceWorkload = async (fromUserId: string, toUserId: string, taskId: string) => {
    const res = await api.rebalanceWorkload(fromUserId, toUserId, taskId);
    if (res.tasks) {
      setTasks(res.tasks);
    }
  };

  const actOnApproval = async (approvalId: string, action: 'approve' | 'reject') => {
    await api.actOnApproval(approvalId, action);
    await refreshAll();
  };

  const resetToDemo = async () => {
    setIsLoading(true);
    await api.resetDemo();
    await refreshAll();
    setIsLoading(false);
  };

  return (
    <MeetingContext.Provider
      value={{
        meetings,
        decisions,
        tasks,
        risks,
        questions,
        commitments,
        approvals,
        notifications,
        isLoading,
        refreshAll,
        updateTaskStatus,
        updateDecisionStatus,
        resolveConflict,
        rebalanceWorkload,
        actOnApproval,
        resetToDemo
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
};

export const useMeeting = () => {
  const context = useContext(MeetingContext);
  if (!context) throw new Error('useMeeting must be used within MeetingProvider');
  return context;
};
