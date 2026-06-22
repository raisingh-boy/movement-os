# System Architecture and Acquisition Pipeline

## 1. Data Acquisition Pipeline (Question 1)

The platform employs a robust, multi-modal ingestion pipeline designed to extract movement knowledge from diverse sources.

### Data Collected
*   **Video Streams:** High-frame-rate and standard videos from YouTube, Instagram, and private courses.
*   **Audio Data:** Coaching cues, breath patterns, and rhythmic timing extracted from video soundtracks.
*   **Textual Descriptions:** Captions, comments, blog posts, course transcripts, and biomechanics textbooks.
*   **Metadata:** Originating source, practitioner identity, expertise level, stylistic context (e.g., "Parkour," "Contemporary Dance"), and environmental conditions.

### Video Processing Workflow (Honest Metrics Pipeline)
1.  **Ingestion & Quality Gate:** Standardizing resolutions/FPS and validating "Capture Standard" (light, plane, stability).
2.  **Segment Identification:** Precise detection of "Airtime" (Takeoff to Landing) without synthetic multipliers.
3.  **Pose Estimation (3D):** Extraction of joint coordinates using MediaPipe Tasks (standardized).
4.  **Dynamics Extraction:**
    *   **Airtime:** Mechanical timing of flight phase.
    *   **Total Rotation:** Integrated body angle over the duration.
    *   **Angular Velocity ($d\theta/dt$):** Temporal curve of rotation speed.
    *   **Tuck Timing & Compactness:** Relative timing of knee-to-chest proximity.
5.  **Contextual Feature Extraction:** Identification of stylistic markers for the **Similarity Engine**.

### Description & Metadata Extraction
*   **Speech-to-Text:** Transcribing coaching cues and somatic descriptions.
*   **NLP Entity Linking:** Mapping textual descriptions to nodes in the Movement Knowledge Graph.
*   **Sentiment and Intensity Analysis:** Capturing the "flavor" of the movement (e.g., "explosive," "fluid," "hesitant").

### Storage
*   **Raw Assets:** Distributed object storage (e.g., S3).
*   **Processed Metadata:** NoSQL document stores for flexible segment attributes.
*   **Embeddings:** Vector databases (e.g., Pinecone, Milvus) for similarity search and latent representation storage.

## 2. Scalable Architecture (Question 8)

To support 100,000+ videos and 1M+ segments, the system uses a distributed, event-driven architecture.

### High-Level Components
*   **Ingestion Engine:** A fleet of worker nodes consuming tasks from a message queue (Kafka/RabbitMQ) to process new content.
*   **Similarity Engine:** K-Nearest Neighbors (KNN) or vector search over "Style Signatures" to find "Who you are closer to."
*   **Ghost Synthesis Service:** Generating skeleton overlays from reference/past videos for "Ghost Playback."
*   **Skill Tree & Achievement Service:** Logic for discrete milestone verification (e.g., "First 360", "5 Clean Streak").
*   **Unified Graph Database:** (e.g., Neo4j or Neptune) to manage the complex relationships between movements, families, and practitioners.
*   **Analytics Hub:** Tracking "North Star" metrics (Weekly Active Recorders, Share Rate, Retention).
*   **API Gateway:** Providing authenticated access to the Knowledge Graph and visualization assets.

### Scaling Strategies
*   **Horizontal Scaling:** Auto-scaling compute clusters for video processing.
*   **Graph Partitioning:** Distributing the knowledge graph across multiple shards based on movement families.
*   **Data Tiering:** Keeping frequently accessed "core" movements in high-performance storage while archiving niche variations.
*   **Caching Layer:** Extensive use of Redis for frequently requested visualization data and graph queries.
