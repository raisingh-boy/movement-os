from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import uuid
from .processor import process_video
from .knowledge_layer import get_coaching_insights, compare_to_reference, calculate_scores
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
RESULTS_DIR = "results"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)

jobs = {}

@app.post("/upload")
async def upload_video(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    job_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{job_id}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    jobs[job_id] = {"status": "processing"}
    background_tasks.add_task(run_processing, job_id, file_path)
    return {"job_id": job_id}

def run_processing(job_id, file_path):
    try:
        output_path = process_video(file_path, RESULTS_DIR)
        with open(output_path, 'r') as f:
            data = json.load(f)

        insights = get_coaching_insights(data)
        comparison = compare_to_reference(data['metrics'])
        scores = calculate_scores(data['metrics'])

        jobs[job_id] = {
            "status": "completed",
            "result": {
                "skeleton_data": data['frames'],
                "com_trajectory": data['com_trajectory'],
                "phases": data['phases'],
                "metrics": data['metrics'],
                "insights": insights,
                "comparison": comparison,
                "scores": scores
            }
        }
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        jobs[job_id] = {"status": "failed", "error": str(e)}

@app.get("/status/{job_id}")
async def get_status(job_id: str):
    return jobs.get(job_id, {"status": "not_found"})

@app.get("/validation-report")
async def get_validation_report():
    if os.path.exists("validation_report.json"):
        with open("validation_report.json", "r") as f:
            return json.load(f)
    return {"error": "Report not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
