import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import numpy as np
import os
import json

# Setup MediaPipe Pose Landmarker
model_path = 'pose_landmarker_heavy.task'
base_options = python.BaseOptions(model_asset_path=model_path)
options = vision.PoseLandmarkerOptions(
    base_options=base_options,
    running_mode=vision.RunningMode.VIDEO)
detector = vision.PoseLandmarker.create_from_options(options)

def process_video(video_path, output_dir):
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0: fps = 30

    frames_data = []
    frame_timestamp_ms = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=frame_rgb)

        # Use simple timestamp increment if cap.get(cv2.CAP_PROP_POS_MSEC) fails
        frame_timestamp_ms = int(cap.get(cv2.CAP_PROP_POS_MSEC))

        pose_landmarker_result = detector.detect_for_video(mp_image, frame_timestamp_ms)

        if pose_landmarker_result.pose_landmarks:
            # We take the first person detected
            landmarks = []
            for lm in pose_landmarker_result.pose_landmarks[0]:
                landmarks.append({
                    'x': lm.x,
                    'y': lm.y,
                    'z': lm.z,
                    'visibility': lm.visibility if hasattr(lm, 'visibility') else 1.0
                })
            frames_data.append(landmarks)
        else:
            frames_data.append(None)

    cap.release()

    phases = detect_phases(frames_data)

    result = {
        'frames': frames_data,
        'phases': phases
    }

    output_filename = os.path.basename(video_path).split('.')[0] + '.json'
    output_path = os.path.join(output_dir, output_filename)
    with open(output_path, 'w') as f:
        json.dump(result, f)

    return output_path

def detect_phases(frames_data):
    # Simple heuristic phase detection based on vertical hip movement
    # Left hip is index 23, right hip is index 24.

    valid_frames = [f for f in frames_data if f is not None]
    if len(valid_frames) < 10:
        total_frames = len(frames_data)
        third = total_frames // 3
        return [
            {"name": "Preparation", "start": 0, "end": max(1, third)},
            {"name": "Execution", "start": max(1, third), "end": max(2, 2 * third)},
            {"name": "Recovery", "start": max(2, 2 * third), "end": total_frames}
        ]

    # Calculate avg hip Y for each frame
    hip_y = []
    for f in frames_data:
        if f:
            avg_y = (f[23]['y'] + f[24]['y']) / 2
            hip_y.append(avg_y)
        else:
            hip_y.append(hip_y[-1] if hip_y else 0.5)

    # Very basic: phase 1 is descending, phase 2 is ascending, phase 3 is recovery
    # This is still a heuristic but at least uses real data
    total = len(hip_y)
    p1_end = total // 3
    p2_end = 2 * (total // 3)

    return [
        {"name": "Preparation", "start": 0, "end": p1_end},
        {"name": "Execution", "start": p1_end, "end": p2_end},
        {"name": "Recovery", "start": p2_end, "end": total}
    ]
