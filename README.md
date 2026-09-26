# MeetFlow AI — AI Meeting Execution Operator

> **From conversations to execution. Automatically.**  
> *Meet. Decide. Execute. Verify.*

MeetFlow AI is an Agentic AI Meeting Execution Platform that transforms spoken conversations into decisions, structured action items, intelligent owner assignments, predictive risk modeling, automated follow-ups, autonomous verification, and cross-meeting organizational memory.

---

## 🌟 Core Architecture & Capabilities

```text
MEETING
   ↓
UNDERSTAND
   ↓
DECIDE
   ↓
PLAN
   ↓
ASSIGN
   ↓
EXECUTE
   ↓
MONITOR
   ↓
PREDICT
   ↓
FOLLOW UP
   ↓
VERIFY
   ↓
LEARN
   ↓
PREPARE NEXT MEETING
```

### Key Highlights
- **Interactive 13-Step Guided Master Tour**: 1-click end-to-end demonstration featuring the *AuraPay Platform* sprint planning scenario.
- **Interactive AI Meeting Participant Studio**:
  - Live virtual team member that listens, speaks via SpeechSynthesis, and directly participates in discussions.
  - 4 Configurable Participation Modes: *Silent Observer*, *Smart Participant*, *Decision Advisor*, and *Meeting Facilitator*.
  - Speaking frequency controls (*Conservative*, *Balanced*, *Proactive*) with conversational silence precision.
  - Barge-In interrupt capability ("Stop Speaking" control) to immediately yield floor to humans.
  - Cross-meeting conflict detection, missing ownership/deadline clarification, and decision confirmation.
  - Real-time Action & Decision Review Queue: 1-click approval directly creating database records in the workspace task management engine.
- **Reproducible ML Training & Evaluation Pipeline**:
  - Task-specific classifier & entity extractor fine-tuned for meeting intent classification, action-item extraction, blocker detection, and conversational silence trigger suppression.
  - Built-in dataset partitioning (Train/Val/Test) without topic leakage.
  - Comprehensive held-out test set evaluation: Precision, Recall, F1, Task Owner Accuracy, Deadline Accuracy, and False-Positive Speaking Trigger Rate.
  - Interactive training console & checkpoint version management (`/model-training`).
- **Signature Visualizations**:
  - **Execution Orbit**: Meeting center orbited by live interactive Decision, Task, Risk, Commitment, and Verification nodes.
  - **Decision-to-Execution Timeline**: Multi-stage chronological pipeline tracking progress from spoken words to verified code.
  - **Task Dependency Graph**: Real-time DAG critical path modeling with delay cascade highlights.
  - **What-If Scenario Simulator**: Delay propagation calculations (+X days) showing downstream milestone impact.
- **Live Meeting Studio**: Real-time audio waveform, speaker diarization, real-time AI copilot side-panel, and multi-agent execution pipeline.
- **Decisions Hub & History**: Decision evolution trails, contradiction/conflict detection with side-by-side resolvers, and architecture decision drift detection.
- **Multimodal & Multilingual AI**: Whiteboard/system architecture diagram OCR extractor and code-switched Hindi/Tamil (Hinglish/Tanglish) speech parser.
- **AI Operator Command Center**: Grounded cross-meeting answers citing specific transcript evidence, timestamps, and workload metrics.
- **Human Approval Center**: Governance queue ensuring high-impact actions (client emails, task reassignments, emergency syncs) require 1-click human confirmation.
- **Organizational Memory & Knowledge Graph**: 2D associative network linking People, Meetings, Decisions, Projects, Tasks, and Documents.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **NPM**: v9+

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Full-Stack Application (Development)
```bash
npm run dev
```

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:5000](http://localhost:5000)

### 3. Run ML Pipeline Verification Tests
```bash
npx tsx server/testParticipant.ts
```

### 4. Build for Production
```bash
npm run build
```

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas & SVG Visualizations, Web Speech API / SpeechSynthesis
- **Backend**: Node.js, Express, TypeScript, TSX, JWT Auth, Relational In-Memory Store with Demo Seed Data
- **AI & Multi-Agent Engine**: Multi-head TF-IDF & Logistic Gradient Descent Classifier + Multi-agent pipeline (Transcript Agent, Decision Agent, Task Agent, Risk Agent, Execution Agent, Follow-up Agent, Verification Agent, Moderator Agent) with Gemini & OpenAI provider abstraction hooks

