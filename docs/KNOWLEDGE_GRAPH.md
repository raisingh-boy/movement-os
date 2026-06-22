# Movement Knowledge Graph (MKG)

## Graph Design (Question 3)

The Movement Knowledge Graph (MKG) is the central intelligence core of the platform. It is a heterogeneous graph where nodes represent entities and edges represent multifaceted relationships.

### Node Types
*   **Movement Node:** A specific movement pattern (e.g., "Back Tuck").
*   **Family Node:** Broader categories (e.g., "Saltos," "Inversions," "Rotations").
*   **Capacity Node:** Physical requirements (e.g., "Hip Mobility," "Explosive Leg Power").
*   **Strategy Node:** Attentional or somatic strategies (e.g., "External Focus," "Center-Initiated Movement").
*   **Method Node:** Coaching systems or styles (e.g., "Feldenkrais," "Art du Déplacement," "Vaganova").
*   **Sensation Node:** Qualities of experience (e.g., "Buoyancy," "Grounding").

### Edge Types (Relationships)
*   **IS_A / PART_OF:** Hierarchy (e.g., "Back Tuck" IS_A "Salto").
*   **PREREQUISITE_FOR:** Learning dependencies (e.g., "Hollow Body Hold" PREREQUISITE_FOR "Handstand").
*   **VARIATION_OF:** Stylistic or difficulty changes (e.g., "Layout" VARIATION_OF "Back Tuck").
*   **REQUIRES_CAPACITY:** Link to physical needs (e.g., "Split" REQUIRES_CAPACITY "Hamstring Flexibility").
*   **PROVOKES_SENSATION:** Connecting physical form to experience.
*   **CORRECTED_BY:** Linking common mistakes to specific coaching cues.
*   **SYNONYMOUS_WITH:** Mapping different names for the same pattern across disciplines (e.g., Parkour's "Dash Vault" vs Gymnastics' "Hecht").

### Graph Utilization
*   **Pathfinding:** Recommending learning paths from a current skill to a goal skill.
*   **Cross-Disciplinary Discovery:** Finding movements in dance that share biomechanical signatures with parkour.
*   **Automated Taxonomy:** Using graph embeddings to discover naturally occurring clusters of movements that haven't been formally named.
