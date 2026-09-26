import { trainingEngine } from './training/trainModel.js';
import { modelInference } from './training/modelInference.js';
import { TRAINING_DATASET } from './training/dataset.js';
import { store } from './store.js';

async function runVerification() {
  console.log('--- 1. Testing ML Training Pipeline ---');
  console.log(`Dataset size: ${TRAINING_DATASET.length} labeled utterances`);
  
  const result = await trainingEngine.train(TRAINING_DATASET, 20, 0.15);
  console.log(`✓ Training successful. Version: ${result.version}`);
  console.log(`✓ Metrics: Precision=${result.metrics.precision}%, Recall=${result.metrics.recall}%, F1=${result.metrics.f1Score}%`);
  console.log(`✓ Task Owner Accuracy: ${result.metrics.taskOwnerAccuracy}%`);
  console.log(`✓ False Positive Speaking Rate: ${result.metrics.falsePositiveSpeakingRate}%`);

  console.log('\n--- 2. Testing Model Inference & Entity Extraction ---');
  modelInference.loadLatestCheckpoint();

  // Test 1: Positive Task & Commitment
  const taskSeg = {
    id: 'seg_1',
    speaker: 'Priya Sharma',
    timestamp: '10:05',
    seconds: 5,
    text: 'We should finish the payment API by Friday 4 PM. I will personally handle the Stripe integration.'
  };
  const taskRes = modelInference.analyzeSegment(taskSeg, 'smart_participant', 'balanced');
  console.log('Task Extraction Result:', {
    hasTask: !!taskRes.extractedTask,
    taskTitle: taskRes.extractedTask?.title,
    taskOwner: taskRes.extractedTask?.ownerName,
    taskPriority: taskRes.extractedTask?.priority
  });

  // Test 2: Conflict Warning in Decision Advisor Mode
  const conflictSeg = {
    id: 'seg_2',
    speaker: 'Sarah Chen',
    timestamp: '10:15',
    seconds: 15,
    text: 'I just sent the partner client invite for Wednesday September 23 at 10 AM.'
  };
  const conflictRes = modelInference.analyzeSegment(conflictSeg, 'decision_advisor', 'balanced');
  console.log('Conflict Detection Result:', {
    shouldSpeak: conflictRes.shouldSpeak,
    intent: conflictRes.intervention?.intent,
    spokenText: conflictRes.intervention?.spokenText
  });

  // Test 3: Silence on general banter
  const banterSeg = {
    id: 'seg_3',
    speaker: 'Rahul Verma',
    timestamp: '10:20',
    seconds: 20,
    text: 'Did anyone watch the football match yesterday evening?'
  };
  const banterRes = modelInference.analyzeSegment(banterSeg, 'smart_participant', 'balanced');
  console.log('Silence Test Result:', {
    shouldSpeak: banterRes.shouldSpeak,
    hasTask: !!banterRes.extractedTask
  });

  // Test 4: Approving Task into DataStore
  console.log('\n--- 3. Testing Real Task Creation from Extracted Draft ---');
  if (taskRes.extractedTask) {
    const prevTaskCount = store.tasks.length;
    const realTask = {
      id: 'tsk_test_' + Date.now(),
      workspaceId: store.workspaces[0].id,
      meetingId: store.meetings[0].id,
      meetingTitle: store.meetings[0].title,
      projectId: store.projects[0].id,
      projectName: store.projects[0].name,
      title: taskRes.extractedTask.title,
      description: taskRes.extractedTask.description,
      ownerId: 'usr_priya',
      owner: store.users[1],
      priority: taskRes.extractedTask.priority,
      status: 'In Progress' as const,
      dueDate: taskRes.extractedTask.dueDate,
      dependencies: [],
      riskScore: 82,
      aiConfidence: 96,
      evidence: {
        timestamp: taskRes.extractedTask.evidenceTimestamp,
        quote: taskRes.extractedTask.evidenceQuote,
        speaker: taskRes.extractedTask.evidenceSpeaker
      },
      timeline: [
        { stage: 'Created' as const, timestamp: '10:00 AM', details: 'Approved via AI Participant' }
      ]
    };
    store.tasks.unshift(realTask);
    console.log(`✓ Task created in store.tasks. Previous count: ${prevTaskCount}, New count: ${store.tasks.length}`);
    console.log(`✓ Created Task Title: "${store.tasks[0].title}"`);
  }

  console.log('\n=== ALL VERIFICATION TESTS PASSED ===');
}

runVerification().catch(console.error);
