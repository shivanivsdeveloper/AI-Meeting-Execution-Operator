import { Router } from 'express';
import { trainingEngine } from '../training/trainModel.js';
import { modelInference } from '../training/modelInference.js';
import { TRAINING_DATASET } from '../training/dataset.js';
import { store } from '../store.js';

const router = Router();

// Get model training status and metrics
router.get('/status', (req, res) => {
  res.json({
    modelName: 'MeetFlow-NeuroExtract Intent & Entity Classifier',
    activeVersion: modelInference.getModelVersion(),
    datasetSize: TRAINING_DATASET.length,
    datasetBreakdown: {
      positiveSamples: TRAINING_DATASET.filter(d => d.sampleType === 'positive').length,
      negativeSilenceSamples: TRAINING_DATASET.filter(d => d.sampleType === 'negative_silence').length,
      ambiguousSamples: TRAINING_DATASET.filter(d => d.sampleType === 'ambiguous').length,
      conflictingSamples: TRAINING_DATASET.filter(d => d.sampleType === 'conflicting').length,
      multilingualSamples: TRAINING_DATASET.filter(d => d.sampleType === 'multilingual').length
    },
    metrics: modelInference.getModelMetrics(),
    lastTrained: new Date().toISOString()
  });
});

// Run a real model training job with progress and metric calculation
router.post('/train', async (req, res) => {
  const { epochs = 40, learningRate = 0.15 } = req.body;

  try {
    store.addAuditLog(
      'Shivani Narayanan (Admin)', 
      false, 
      'Initiated AI Model Training', 
      'MeetFlow-NeuroExtract Classifier', 
      `Epochs: ${epochs}, Learning Rate: ${learningRate}, Dataset Size: ${TRAINING_DATASET.length}`
    );

    const trainingResult = await trainingEngine.train(
      TRAINING_DATASET,
      epochs,
      learningRate
    );

    // Reload latest weights in inference engine
    modelInference.loadLatestCheckpoint();

    store.addAuditLog(
      'MeetFlow ML Pipeline', 
      true, 
      'Completed Model Training & Checkpoint Promotion', 
      `Version ${trainingResult.version}`, 
      `Final F1: ${trainingResult.finalF1}%, Precision: ${trainingResult.metrics.precision}%, Task Owner Acc: ${trainingResult.metrics.taskOwnerAccuracy}%`
    );

    res.json({
      success: true,
      trainingJob: trainingResult
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Training failed: ' + err.message });
  }
});

export default router;
