def get_coaching_insights(phases):
    # This is a mock knowledge layer that returns insights based on detected phases
    insights = []
    for phase in phases:
        if phase['name'] == "Preparation":
            insights.append({
                "phase": "Preparation",
                "cues": ["Set your gaze", "Check your stance"],
                "mistakes": ["Leaning too far forward"]
            })
        elif phase['name'] == "Execution":
            insights.append({
                "phase": "Execution",
                "cues": ["Explode upwards", "Keep core tight"],
                "mistakes": ["Losing balance"]
            })
        elif phase['name'] == "Recovery":
            insights.append({
                "phase": "Recovery",
                "cues": ["Land softly", "Reset position"],
                "mistakes": ["Stiff landing"]
            })
    return insights

def get_related_movements(movement_type="General"):
    # Mock related movements from the "Knowledge Graph"
    return [
        {"name": "Squat", "relationship": "Prerequisite"},
        {"name": "Box Jump", "relationship": "Progression"},
        {"name": "Broad Jump", "relationship": "Variation"}
    ]
