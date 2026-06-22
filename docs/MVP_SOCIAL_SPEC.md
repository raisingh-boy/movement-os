# Technical Specification: Backflip Social (MVP v1)

## 1. Core Mission
Test the product hypothesis: "Do users engage with backflip analysis as a social game?"
This MVP prioritizes **Engagement** over **Scientific Validity**.

## 2. Honest Metrics (The Engine)
To maintain trust, the system uses only "Honest Signals" that can be reliably measured from single-view mobile video.

| Metric | Measurement Method | User Presentation |
| :--- | :--- | :--- |
| **Airtime** | Frame count between $Y_{com}$ acceleration spikes (Takeoff/Landing) | Precise seconds (e.g. 0.65s) |
| **Total Rotation** | Integrated torso angle change over duration | Completion % (e.g. "360° Complete") |
| **Rotation Speed** | Max $d\theta/dt$ | Peak deg/sec (Relative scale) |
| **Tuck Timing** | Frame of min hip/knee angle relative to airtime | "Early" / "Late" / "Optimal" |
| **Compactness** | Minimum hip/knee angle achieved | "Tight" / "Open" |
| **Sensation** | User Self-Assessment (1-5 scale) | Confidence & Subjective Feel |

## 3. Game Mechanics

### 3.1 Ghost Playback (The Progress Hook)
*   **Mechanic:** Overlay a semi-transparent skeleton of the user's "Personal Best" or a "Reference Pro" on top of the current video.
*   **Value:** Instant visual feedback on "where you are" vs "where you were."

### 3.2 Similarity Engine (The Social Hook)
*   **Mechanic:** Compute a "Style Signature" vector (Airtime, Speed, Tuck Timing). Find the nearest neighbor in the community.
*   **Value:** "Your style is 92% similar to [Athlete X]."

### 3.3 Skill Tree & Achievements
*   **Milestones:**
    *   First 360° (Verified)
    *   5 Consecutive Landings
    *   Style Master (High Compactness)
*   **Verification:** Peer/Community social proof + AI confirmation.

### 3.4 Challenges & Duels
*   **Ranked Challenge:** "Standardized Capture" (fixed distance/FPS) for fair leaderboard ranking on Airtime.
*   **Asynchronous Duel:** Side-by-side video comparison for community voting.

## 4. Guardrails (The Integrity Layer)
*   **NO Absolute Power/Height:** Do not show CM/Watts as points unless using a "Verified Capture" standard.
*   **NO "Pro" Diagnosis:** Do not claim AI "cures" technique; frame feedback as "Commonly used coaching cues for this pattern."
*   **Quality Gate:** Reject videos with poor lighting, high motion blur, or off-plane recording.

## 5. Technical Stack (MVP)
*   **Frontend:** React Native (Mobile-first) with Three.js skeleton overlays.
*   **Backend:** FastAPI + MediaPipe Tasks for pose extraction.
*   **Analytics:** Segment/PostHog for tracking "Share Rate" and "Return Frequency."
*   **Storage:** S3 for videos, Neo4j for the Movement Knowledge Graph (Backflip Sub-graph).

## 6. Success Metrics (KPIs)
*   **Activation:** % of installers who record $\ge 1$ backflip.
*   **Core Loop:** Avg. recordings per user per week.
*   **Viral Coefficient:** % of users who share a "Signature Card" to Instagram/TikTok.
