"""
FASTAPI SERVER
Entry point for Codebase Review Agent
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel
import os
import tempfile
import shutil
import traceback
from agent import review_codebase
app = FastAPI(
    title="AI Codebase Review Agent",
    version="1.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ReviewRequest(BaseModel):
    project_path: str

@app.get("/")
def health():
    return {"status": "AI Code Review Agent Running 🚀"}

@app.post("/review")
def review_project(request: ReviewRequest):
    try:
        if not os.path.exists(request.project_path):
            raise HTTPException(status_code=400, detail="Invalid project path")
        return review_codebase(request.project_path)

    except Exception:
        print("ERROR:", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/review/file")
async def review_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        temp_dir = tempfile.mkdtemp()
        file_path = os.path.join(temp_dir, file.filename)
        with open(file_path, "wb") as f:
            f.write(content)
        result = review_codebase(temp_dir)
        shutil.rmtree(temp_dir, ignore_errors=True)
        return result
    except Exception:
        print("UPLOAD ERROR:", traceback.format_exc())
        raise HTTPException(status_code=500, detail="File processing failed")
