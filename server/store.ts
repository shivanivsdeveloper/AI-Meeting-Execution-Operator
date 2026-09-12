import { 
  User, Workspace, Meeting, Decision, Task, Risk, Question, 
  Commitment, Project, AIActionApproval, NotificationItem, 
  IntegrationStatus, AuditLogItem, WhatIfSimulationResult,
  KnowledgeNode, KnowledgeEdge
} from '../src/types/index.js';
import { 
  INITIAL_USERS, INITIAL_WORKSPACE, INITIAL_PROJECTS, 
  INITIAL_MEETINGS, INITIAL_DECISIONS, INITIAL_TASKS, 
  INITIAL_RISKS, INITIAL_QUESTIONS, INITIAL_COMMITMENTS, 
  INITIAL_APPROVALS, INITIAL_NOTIFICATIONS, INITIAL_INTEGRATIONS, 
  INITIAL_AUDIT_LOGS, INITIAL_KNOWLEDGE_GRAPH 
} from './seedData.js';

class DataStore {
  public users: User[] = JSON.parse(JSON.stringify(INITIAL_USERS));
  public workspaces: Workspace[] = [JSON.parse(JSON.stringify(INITIAL_WORKSPACE))];
  public projects: Project[] = JSON.parse(JSON.stringify(INITIAL_PROJECTS));
  public meetings: Meeting[] = JSON.parse(JSON.stringify(INITIAL_MEETINGS));
  public decisions: Decision[] = JSON.parse(JSON.stringify(INITIAL_DECISIONS));
  public tasks: Task[] = JSON.parse(JSON.stringify(INITIAL_TASKS));
  public risks: Risk[] = JSON.parse(JSON.stringify(INITIAL_RISKS));
  public questions: Question[] = JSON.parse(JSON.stringify(INITIAL_QUESTIONS));
  public commitments: Commitment[] = JSON.parse(JSON.stringify(INITIAL_COMMITMENTS));
  public approvals: AIActionApproval[] = JSON.parse(JSON.stringify(INITIAL_APPROVALS));
  public notifications: NotificationItem[] = JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS));
  public integrations: IntegrationStatus[] = JSON.parse(JSON.stringify(INITIAL_INTEGRATIONS));
  public auditLogs: AuditLogItem[] = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));
  public knowledgeGraph = JSON.parse(JSON.stringify(INITIAL_KNOWLEDGE_GRAPH));

  // Reset to initial demo state
  public resetToDemo() {
    this.users = JSON.parse(JSON.stringify(INITIAL_USERS));
    this.workspaces = [JSON.parse(JSON.stringify(INITIAL_WORKSPACE))];
    this.projects = JSON.parse(JSON.stringify(INITIAL_PROJECTS));
    this.meetings = JSON.parse(JSON.stringify(INITIAL_MEETINGS));
    this.decisions = JSON.parse(JSON.stringify(INITIAL_DECISIONS));
    this.tasks = JSON.parse(JSON.stringify(INITIAL_TASKS));
    this.risks = JSON.parse(JSON.stringify(INITIAL_RISKS));
    this.questions = JSON.parse(JSON.stringify(INITIAL_QUESTIONS));
    this.commitments = JSON.parse(JSON.stringify(INITIAL_COMMITMENTS));
    this.approvals = JSON.parse(JSON.stringify(INITIAL_APPROVALS));
    this.notifications = JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS));
    this.integrations = JSON.parse(JSON.stringify(INITIAL_INTEGRATIONS));
    this.auditLogs = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));
    this.knowledgeGraph = JSON.parse(JSON.stringify(INITIAL_KNOWLEDGE_GRAPH));
  }

  public addAuditLog(actorName: string, isAi: boolean, action: string, target: string, details: string, agentName?: string, approvalStatus?: string) {
    const log: AuditLogItem = {
      id: 'aud_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toLocaleString(),
      actor: { name: actorName, isAi, agentName },
      action,
      target,
      details,
      approvalStatus: approvalStatus || (isAi ? 'AI Dispatched' : 'Executed')
    };
    this.auditLogs.unshift(log);
    return log;
  }

  public addNotification(title: string, message: string, priority: 'Low' | 'Normal' | 'High' | 'Critical', type: NotificationItem['type'], actionUrl?: string) {
    const notif: NotificationItem = {
      id: 'notif_' + Date.now(),
      title,
      message,
      priority,
      timestamp: 'Just now',
      read: false,
      type,
      actionUrl
    };
    this.notifications.unshift(notif);
    return notif;
  }

  // Workload rebalancing simulation
  public rebalanceWorkload(fromUserId: string, toUserId: string, taskId: string) {
    const task = this.tasks.find(t => t.id === taskId);
    const fromUser = this.users.find(u => u.id === fromUserId);
    const toUser = this.users.find(u => u.id === toUserId);

    if (task && fromUser && toUser) {
      task.ownerId = toUser.id;
      task.owner = toUser;
      
      // Update workload estimates
      fromUser.currentWorkload = Math.max(20, fromUser.currentWorkload - 13);
      fromUser.activeTasksCount = Math.max(1, fromUser.activeTasksCount - 1);
      
      toUser.currentWorkload = Math.min(95, toUser.currentWorkload + 13);
      toUser.activeTasksCount += 1;

      // Lower risk score on task
      task.riskScore = Math.max(20, task.riskScore - 28);
      task.riskReason = `Workload balanced. Reassigned to ${toUser.name} with optimal capacity.`;

      this.addAuditLog('MeetFlow AI Workload Optimizer', true, 'Reassigned Task for Workload Balance', task.title, `Reassigned from ${fromUser.name} to ${toUser.name}.`, 'ExecutionAgent', 'Approved & Executed');
    }
  }

  // Run What-If Scenario Delay Simulator
  public runWhatIfSimulation(taskId: string, delayDays: number): WhatIfSimulationResult {
    const targetTask = this.tasks.find(t => t.id === taskId) || this.tasks[0];
    
    // Find downstream tasks that depend on targetTask
    const cascading: WhatIfSimulationResult['cascadingDelays'] = [];
    const affectedMembersMap = new Map<string, { name: string; avatar: string; impactedTasks: string[] }>();

    const checkDownstream = (currentId: string, addedDays: number) => {
      const dependents = this.tasks.filter(t => t.dependencies.includes(currentId));
      for (const dep of dependents) {
        const origDate = new Date(dep.dueDate || '2026-09-19');
        const newDate = new Date(origDate.getTime() + addedDays * 24 * 60 * 60 * 1000);
        
        cascading.push({
          taskId: dep.id,
          taskTitle: dep.title,
          originalDueDate: dep.dueDate,
          newDueDate: newDate.toISOString().split('T')[0],
          delayDays: addedDays
        });

        const owner = dep.owner;
        if (owner) {
          if (!affectedMembersMap.has(owner.id)) {
            affectedMembersMap.set(owner.id, {
              name: owner.name,
              avatar: owner.avatar,
              impactedTasks: [dep.title]
            });
          } else {
            affectedMembersMap.get(owner.id)!.impactedTasks.push(dep.title);
          }
        }

        // Recursively check deeper dependents
        checkDownstream(dep.id, addedDays);
      }
    };

    checkDownstream(targetTask.id, delayDays);

    return {
      taskDelayedId: targetTask.id,
      taskTitle: targetTask.title,
      delayDays,
      cascadingDelays: cascading,
      predictedMilestoneDelay: {
        milestoneName: 'Client Enterprise Demo',
        delayDays: Math.min(delayDays, 2),
        riskLevel: delayDays >= 3 ? 'Critical' : 'High'
      },
      affectedTasksCount: cascading.length + 1,
      affectedTeamMembers: Array.from(affectedMembersMap.values())
    };
  }
}

export const store = new DataStore();
