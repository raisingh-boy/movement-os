# Movement Intelligence Platform

Welcome to the Movement Intelligence Platform—an AI-native system for the collective mastery of human movement.

## Prototype v0.1

This repository contains the first working prototype of the platform, demonstrating an end-to-end flow from video upload to 3D movement analysis.

### Core Features
- **Video Ingestion:** Upload any movement video (MP4/MOV).
- **3D Pose Extraction:** Powered by MediaPipe Pose Landmarker (Heavy).
- **Phase Detection:** Automatic segmentation of movement into Preparation, Execution, and Recovery.
- **3D Visualization:** Interactive skeleton playback using Three.js and React Three Fiber.
- **Coaching Layer:** Contextual insights and cues based on detected movement phases.
- **Knowledge Graph:** Discovery of related movements and progressions.

### Getting Started

#### Backend
1. Navigate to the `backend/` directory.
2. Install dependencies: `pip install mediapipe opencv-python fastapi uvicorn python-multipart`.
3. The model `pose_landmarker_heavy.task` should be present in the root directory.
4. Run the server: `python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000`.

#### Frontend
1. Navigate to the `frontend/` directory.
2. Install dependencies: `npm install`.
3. Run the development server: `npm run dev -- --host 0.0.0.0`.
4. Open your browser at `http://localhost:5173`.

### Documentation Index
Architectural design and long-term vision can be found in the `docs/` directory:
*   [**Overview**](docs/OVERVIEW.md)
*   [**System Architecture**](docs/ARCHITECTURE.md)
*   [**Data Model & Diversity**](docs/DATA_MODEL.md)
*   [**Knowledge Graph**](docs/KNOWLEDGE_GRAPH.md)
*   [**Learning Loop & Experts**](docs/LEARNING_LOOP.md)
*   [**Visualization**](docs/VISUALIZATION.md)
*   [**Roadmap**](docs/ROADMAP.md)

---
*Note: This is an early-stage prototype. Pose extraction performance may vary based on video quality and lighting.*
