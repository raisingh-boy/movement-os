# Visualization and User Experience

## Visualization System Design (Question 5)

The platform provides a multi-dimensional interface for exploring movement knowledge, moving beyond simple video playback.

### Core Visualization Components
*   **3D Multi-Layer Playback:**
    *   **Ghost Overlay:** Semi-transparent "ghost" skeleton of a past attempt or a reference athlete (Pro) synchronized with the current attempt.
    *   Toggleable overlays: skeleton, muscle activation (estimated), and center of mass.
    *   Adjustable camera angles in a virtual 3D space.
*   **Phase-by-Phase Timeline:**
    *   A nonlinear timeline that breaks movement into functional phases (e.g., Load, Launch, Flight, Land).
    *   Synchronized display of coaching cues and biomechanical peaks (e.g., max vertical force).
*   **Aura Overlays (Sensation/Attention):**
    *   Visual heatmaps representing where the practitioner's attention is focused (e.g., a glow around the hands or feet).
    *   Color-coded "auras" representing internal sensations (e.g., red for tension, blue for fluidity).
*   **Variation Maps:**
    *   A 2D or 3D manifold view where similar movements are clustered. Users can "fly" through the map to see how a "Squat" evolves into a "Jump."
*   **Family Tree Explorer:**
    *   An interactive graph visualization allowing users to expand/collapse movement families and trace prerequisites.

### User Interaction Models
*   **The "Coach's View":** Side-by-side comparison of a "Master" vs. a "Novice" with automatic highlighting of discrepancies in timing or alignment.
*   **The "Social Signature Card":** A shareable infographic showing the "Style Signature," airtime, rotation speed, and "Similarity Match" with a pro athlete.
*   **The "Researcher's View":** Access to raw data, biomechanical graphs, and cross-disciplinary links.
*   **The "Practitioner's View":** Focus on progressions, sensations, and "the feel" of the movement to guide their own training.
