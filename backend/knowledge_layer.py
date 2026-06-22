def get_coaching_insights(result):
    metrics = result.get('metrics', {})

    insights = []

    # --- Tuck Analysis ---
    knee_flexion = metrics.get('max_knee_flexion', 180)
    # Evidence based on validation report showing mean success at 34deg vs failure at 66deg
    if knee_flexion > 55:
        insights.append({
            "type": "error",
            "phase": "Tuck",
            "message": "Weak Tuck",
            "detail": "Knee angle is too open, slowing down rotation.",
            "evidence": {
                "measurement": f"{knee_flexion:.1f}°",
                "method": "Minimum angle between Hip-Knee-Ankle during flight",
                "threshold": "< 55°",
                "impact": "Low angular velocity"
            }
        })
    else:
        insights.append({
            "type": "success",
            "phase": "Tuck",
            "message": "Strong Tuck",
            "detail": "Compact body shape achieved for rapid rotation.",
            "evidence": {
                "measurement": f"{knee_flexion:.1f}°",
                "method": "Minimum angle between Hip-Knee-Ankle during flight",
                "threshold": "< 55°",
                "impact": "High angular velocity"
            }
        })

    # --- Height Analysis ---
    height = metrics.get('peak_height_norm', 0)
    if height < 0.55:
        insights.append({
            "type": "warning",
            "phase": "Takeoff",
            "message": "Low Vertical Lift",
            "detail": "Insufficient height reduces the window for a safe rotation.",
            "evidence": {
                "measurement": f"{height:.2f}",
                "method": "Normalized peak height of Center of Mass (CoM)",
                "threshold": "> 0.55",
                "impact": "Short airtime"
            }
        })

    return insights

def calculate_scores(metrics):
    # Differentiated scoring system

    # 1. Jump Power (based on peak height)
    jump_power = min(100, (metrics.get('peak_height_norm', 0) / 0.7) * 100)

    # 2. Tuck Quality (inverse of knee flexion angle)
    # Elite is ~30deg, poor is >90deg
    tuck_val = metrics.get('max_knee_flexion', 180)
    tuck_quality = max(0, min(100, 100 - (tuck_val - 30) * 1.5))

    # 3. Rotation Efficiency (combining tuck and estimated airtime)
    # High tuck + low airtime for a success = very efficient
    rotation_efficiency = (tuck_quality * 0.7) + (jump_power * 0.3)

    # 4. Landing Control (Mocked for now as we need better impact detection)
    landing_control = 75

    return {
        "Jump Power": round(jump_power),
        "Tuck Quality": round(tuck_quality),
        "Rotation Efficiency": round(rotation_efficiency),
        "Landing Control": round(landing_control)
    }

def compare_to_reference(metrics):
    elite = {
        "max_knee_flexion": 30.0,
        "max_hip_flexion": 35.0,
        "peak_height_norm": 0.68
    }

    comparisons = []
    for key, elite_val in elite.items():
        user_val = metrics.get(key, 0)
        if "flexion" in key:
            diff = user_val - elite_val
            quality = "Elite" if diff < 5 else "Good" if diff < 20 else "Needs Work"
        else:
            diff = elite_val - user_val
            quality = "Elite" if diff < 0.03 else "Good" if diff < 0.1 else "Needs Work"

        comparisons.append({
            "metric": key.replace('_', ' ').title(),
            "user": round(user_val, 2),
            "elite": elite_val,
            "status": quality
        })
    return comparisons
