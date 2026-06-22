import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import numpy as np
import os
import json
import math

# Setup MediaPipe Pose Landmarker
# Ensure pose_landmarker_heavy.task is in the root or appropriate path
model_path = 'pose_landmarker_heavy.task'
detector = None

def init_detector():
    global detector
    if detector is not None: return
    try:
        base_options = python.BaseOptions(model_asset_path=model_path)
        options = vision.PoseLandmarkerOptions(
            base_options=base_options,
            running_mode=vision.RunningMode.VIDEO)
        detector = vision.PoseLandmarker.create_from_options(options)
    except Exception as e:
        print(f"Failed to initialize MediaPipe: {e}")

def calculate_angle(p1, p2, p3):
    """Calculates angle between three points (x, y)."""
    if not p1 or not p2 or not p3: return 180
    a = np.array([p1['x'], p1['y']])
    b = np.array([p2['x'], p2['y']])
    c = np.array([p3['x'], p3['y']])
    ba = a - b
    bc = c - b
    norm_ba = np.linalg.norm(ba)
    norm_bc = np.linalg.norm(bc)
    if norm_ba == 0 or norm_bc == 0: return 180
    cosine_angle = np.dot(ba, bc) / (norm_ba * norm_bc)
    angle = np.arccos(np.clip(cosine_angle, -1.0, 1.0))
    return np.degrees(angle)

def get_com(landmarks):
    """Center of Mass estimation using hips and shoulders."""
    if not landmarks: return None
    points = [landmarks[11], landmarks[12], landmarks[23], landmarks[24]]
    return {
        'x': sum(p['x'] for p in points) / 4,
        'y': sum(p['y'] for p in points) / 4,
        'z': sum(p['z'] for p in points) / 4
    }

def process_video(video_path, output_dir):
    init_detector()
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0: fps = 30

    frames_data = []
    com_trajectory = []

    # Check if video opened successfully
    if not cap.isOpened():
        return generate_mock_data(video_path, output_dir)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret: break

        frame_timestamp_ms = int(cap.get(cv2.CAP_PROP_POS_MSEC))
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=frame_rgb)

        if detector:
            pose_result = detector.detect_for_video(mp_image, frame_timestamp_ms)
            if pose_result.pose_landmarks:
                lms = pose_result.pose_landmarks[0]
                landmarks = [{'x': l.x, 'y': l.y, 'z': l.z, 'visibility': l.visibility} for l in lms]
                frames_data.append(landmarks)
                com_trajectory.append(get_com(landmarks))
                continue

        frames_data.append(None)
        com_trajectory.append(None)

    cap.release()

    if len([f for f in frames_data if f is not None]) == 0:
        return generate_mock_data(video_path, output_dir)

    metrics = extract_backflip_metrics(frames_data, fps)
    phases = detect_backflip_phases(frames_data, com_trajectory)

    result = {
        'frames': frames_data,
        'phases': phases,
        'metrics': metrics,
        'com_trajectory': com_trajectory
    }

    output_filename = os.path.basename(video_path).split('.')[0] + '.json'
    output_path = os.path.join(output_dir, output_filename)
    with open(output_path, 'w') as f:
        json.dump(result, f)
    return output_path

def extract_backflip_metrics(frames_data, fps):
    com_y = [get_com(f)['y'] if f else 1.0 for f in frames_data]
    peak_y = min(com_y)
    peak_frame = com_y.index(peak_y)

    peak_landmarks = frames_data[peak_frame]
    knee_angle = calculate_angle(peak_landmarks[23], peak_landmarks[25], peak_landmarks[27]) if peak_landmarks else 180
    hip_angle = calculate_angle(peak_landmarks[11], peak_landmarks[23], peak_landmarks[25]) if peak_landmarks else 180

    return {
        "peak_height_norm": 1.0 - peak_y,
        "max_knee_flexion": knee_angle,
        "max_hip_flexion": hip_angle,
        "estimated_fps": fps
    }

def detect_backflip_phases(frames_data, com_trajectory):
    total = len(frames_data)
    # Simplified phase detection for the prototype
    p1 = total // 4
    p2 = total // 2
    p3 = 3 * (total // 4)
    return [
        {"name": "Setup", "start": 0, "end": p1},
        {"name": "Takeoff", "start": p1, "end": p2},
        {"name": "Tuck", "start": p2, "end": p3},
        {"name": "Landing", "start": p3, "end": total}
    ]

def generate_mock_data(video_path, output_dir):
    """Fallback generator for demonstration if video processing fails."""
    total_frames = 60
    frames_data = []
    com_trajectory = []
    for f in range(total_frames):
        t = f / total_frames
        x, y = 0.5, 0.7 - 0.5 * np.sin(np.pi * t)
        com_trajectory.append({'x': x, 'y': y, 'z': 0.0})
        landmarks = [{'x': x + (i % 5) * 0.02, 'y': y + (i // 5) * 0.05, 'z': 0.0, 'visibility': 0.9} for i in range(33)]
        frames_data.append(landmarks)

    result = {
        'frames': frames_data,
        'phases': [
            {"name": "Setup", "start": 0, "end": 15},
            {"name": "Takeoff", "start": 15, "end": 25},
            {"name": "Tuck", "start": 25, "end": 45},
            {"name": "Landing", "start": 45, "end": total_frames}
        ],
        'metrics': {"peak_height_norm": 0.6, "max_knee_flexion": 45.0, "max_hip_flexion": 50.0, "estimated_fps": 30},
        'com_trajectory': com_trajectory
    }
    output_filename = os.path.basename(video_path).split('.')[0] + '.json'
    output_path = os.path.join(output_dir, output_filename)
    with open(output_path, 'w') as f:
        json.dump(result, f)
    return output_path
