def get_coaching_insights(result):
    metrics = result.get('metrics', {})
    phases = result.get('phases', [])

    insights = []

    # Biomechanical rules for backflips
    knee_flexion = metrics.get('max_knee_flexion', 180)
    hip_flexion = metrics.get('max_hip_flexion', 180)

    if knee_flexion > 60:
        insights.append({
            "type": "error",
            "phase": "Tuck",
            "message": "Weak Tuck",
            "detail": f"Knee angle was {knee_flexion:.1f}°. Elite athletes pull knees closer to chest (under 45°)."
        })
    else:
        insights.append({
            "type": "success",
            "phase": "Tuck",
            "message": "Strong Tuck",
            "detail": "Great compression during rotation."
        })

    # Rotation speed / Height heuristic
    height = metrics.get('peak_height_norm', 0)
    if height < 0.4:
        insights.append({
            "type": "warning",
            "phase": "Takeoff",
            "message": "Low Jump Height",
            "detail": "Insufficient vertical lift. Focus on explosive leg extension and arm swing."
        })

    return insights

def compare_to_reference(metrics):
    # Reference "Elite" backflip metrics
    elite = {
        "max_knee_flexion": 35.0,
        "max_hip_flexion": 40.0,
        "peak_height_norm": 0.65
    }

    score = 0
    comparisons = []

    for key, elite_val in elite.items():
        user_val = metrics.get(key, 0)
        # For angles, lower is better (more tuck)
        if "flexion" in key:
            diff = user_val - elite_val
            quality = "Elite" if diff < 10 else "Good" if diff < 30 else "Needs Work"
        else: # For height, higher is better
            diff = elite_val - user_val
            quality = "Elite" if diff < 0.05 else "Good" if diff < 0.15 else "Needs Work"

        comparisons.append({
            "metric": key.replace('_', ' ').title(),
            "user": round(user_val, 2),
            "elite": elite_val,
            "status": quality
        })

    return comparisons
