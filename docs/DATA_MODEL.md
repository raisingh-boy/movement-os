# Data Model and Human Diversity

## 1. Multi-Layer Movement Representation (Question 2)

A movement is represented as a "Deep Movement Object" (DMO), consisting of several synchronized layers:

### Layer 1: Physical Manifestation
*   **Skeletal Motion:** 3D coordinates of joints over time.
*   **Body Positions:** Keyframes identifying fundamental shapes (e.g., "tuck," "hollow," "bridge").
*   **Timing:** Phase decomposition (prep, execution, recovery), rhythm, and tempo.

### Layer 2: Biomechanical Analysis
*   **Kinetics:** Estimates of forces, torques, and energy transfer.
*   **Center of Mass:** Pathing and stability metrics.
*   **Range of Motion:** Joint-specific mobility utilization.

### Layer 3: Cognitive & Somatic
*   **Movement Intention:** The goal of the movement (e.g., "reach," "propel," "resist").
*   **Attention Cues:** Where the focus is directed (e.g., "eyes on the horizon," "feel the weight in the heels").
*   **Sensations:** Descriptive labels for internal feedback (e.g., "lightness," "compression," "torque").

### Layer 4: Instructional Context
*   **Coaching Cues:** Specific verbal commands used to guide the movement.
*   **Common Mistakes:** Identified deviations from "efficient" or "safe" patterns.
*   **Variations & Progressions:** Logical links to easier/harder versions or stylistic alternatives.

### Layer 5: Social & Gamification (Honest-Core)
*   **Skill Tree Position:** Discrete milestones achieved (e.g., "Backflip - Level 1: Standard").
*   **Style Signature:** A unique vector representing the athlete's specific technique (timing/compactness/velocity).
*   **Challenge History:** Participation in ranked/community challenges.
*   **Trust Badge:** Verification of capture standard (e.g., "Verified Capture").

## 2. Normalization Strategies for Human Diversity (Question 4)

To ensure fair comparison across diverse populations, the system employs several normalization techniques:

### Anthropometric Normalization
*   **Joint-Length Scaling:** Normalizing skeletal data based on segment proportions (e.g., ratio of femur to tibia) rather than absolute height.
*   **Normalized Center of Mass:** Expressing CoM height relative to total stature.

### Performance Normalization
*   **Mobility Indexing:** Adjusting "ideal" form expectations based on the individual's measured range of motion.
*   **Style-Invariant Embeddings:** Using contrastive learning (e.g., SimCLR or CLIP-like architectures) to learn representations that are invariant to body size or video lighting but sensitive to movement quality.

### Diversity-Aware Comparison
*   **Cluster-Based Norms:** Instead of one "gold standard," the system identifies multiple "successful patterns" for different body types and experience levels.
*   **Relative Timing:** Normalizing movement phases to a percentage of total duration (0-100%) to compare timing regardless of absolute speed.
