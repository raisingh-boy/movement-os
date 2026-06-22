# Backflip AI Coach: Provenance Report

This document provides complete transparency regarding the origins of the benchmarks, thresholds, metrics, and coaching rules used in the current version of the Backflip AI Coach.

## 1. Biomechanical Benchmarks (Elite Ranges)

| Metric | Source | Data Origin | Video Count | Method | Confidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Tuck Angle (Gymnastics)** | Hardcoded MVP Assumption | Synthetic | 0 | Approximation of elite tuck depth. | Low |
| **Airtime (Gymnastics)** | Hardcoded MVP Assumption | Synthetic | 0 | Estimated flight time for 1.2m+ jump. | Low |
| **Peak Height (Norm)** | Hardcoded MVP Assumption | Synthetic | 0 | Approximation of jump height relative to height. | Low |
| **Rotation Speed** | Hardcoded MVP Assumption | Synthetic | 0 | Estimate based on degrees/total airtime. | Low |

*Note: All values in `backend/reference_library.json` are currently **synthetic placeholders** created to test the comparison engine UI.*

## 2. Coaching Thresholds

| Rule | Threshold | Source | Data Origin | Method | Confidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Weak Tuck** | > 55° | MVP Hardcoded | Synthetic | Invented for MVP classification. | Low |
| **Low Vertical Lift** | < 0.55 | MVP Hardcoded | Synthetic | Invented for MVP classification. | Low |
| **Elite Comparison (Good)** | < 20° diff | MVP Hardcoded | Synthetic | Hardcoded tolerance for comparison UI. | Low |

## 3. Scoring Formulas

| Score | Formula | Source | Type |
| :--- | :--- | :--- | :--- |
| **Jump Power** | `min(100, (peak_height_norm / 0.7) * 100)` | Hardcoded MVP Placeholder | Synthetic Assumption |
| **Tuck Quality** | `max(0, min(100, 100 - (knee_flexion - 30) * 1.5))` | Hardcoded MVP Placeholder | Synthetic Assumption |
| **Rotation Efficiency** | `(Tuck * 0.7) + (Jump * 0.3)` | Hardcoded MVP Placeholder | Synthetic Assumption |
| **Landing Control** | `75` (Constant) | Hardcoded MVP Placeholder | **Hardcoded Placeholder** |

## 4. Analysis Methodology Provenance

| Component | Status | Source |
| :--- | :--- | :--- |
| **Pose Estimation** | Evidence-Based | MediaPipe Pose Landmarker (Pre-trained Model) |
| **Phase Detection** | Hardcoded Heuristic | Fixed frame-division (e.g., `total // 4`) |
| **CoM Estimation** | Simplified Model | Average of Hips and Shoulders (Standard biomechanical proxy) |
| **Angle Calculation** | Geometric | Standard 2D Law of Cosines |

## Summary of Evidence vs. Assumptions

*   **Evidence-Based:** Raw coordinate data (MediaPipe), basic geometry (Angle calculations), CoM estimation model.
*   **Assumptions/Placeholders:** ALL coaching thresholds, ALL elite reference ranges, ALL scoring weights and formulas, phase detection timing.

**Status:** The system is currently a **Technical Framework**. The analysis engine is functional, but the knowledge layer is populated with **synthetic placeholders** for demonstration purposes.
