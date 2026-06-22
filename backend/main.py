from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import uuid
from .processor import process_video
from .knowledge_layer import get_coaching_insights, get_related_movements
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

# In-memory storage for job status
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

        insights = get_coaching_insights(data['phases'])
        related = get_related_movements()

        jobs[job_id] = {
            "status": "completed",
            "result": {
                "skeleton_data": data['frames'],
                "phases": data['phases'],
                "insights": insights,
                "related_movements": related
            }
        }
    except Exception as e:
        jobs[job_id] = {"status": "failed", "error": str(e)}

@app.get("/status/{job_id}")
async def get_status(job_id: str):
    return jobs.get(job_id, {"status": "not_found"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
