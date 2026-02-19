import os
import io
import shutil
import zipfile
import tempfile
import traceback
import asyncio
import logging
import httpx
from typing import Optional

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agent import review_codebase


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)



app = FastAPI(
    title="AI Codebase Review Agent (LangGraph)",
    version="2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class GitHubBranchRequest(BaseModel):
    repo_url: str  
    branch_name: str
    github_token: Optional[str] = None


class ReviewRequest(BaseModel):
    project_path: str



def parse_github_repo(repo_string: str):
    try:

        clean_str = repo_string.replace("https://github.com/", "").replace("http://github.com/", "")
        parts = clean_str.rstrip("/").split("/")
        
        if len(parts) < 2:
            raise ValueError
            
        return parts[-2], parts[-1]
    except Exception:
        raise HTTPException(
            status_code=400, 
            detail="Invalid GitHub format. Please use 'owner/repo' (e.g., 'octocat/Hello-World')."
        )


async def safe_cleanup(temp_dir: Optional[str]):
    """Safely delete temporary directory."""
    try:
        if temp_dir and os.path.exists(temp_dir):
            await asyncio.to_thread(shutil.rmtree, temp_dir, ignore_errors=True)
    except Exception:
        logger.warning("⚠️ Cleanup failed but ignored.")



@app.get("/")
def health():
    return {"status": "AI Code Review Agent Running 🚀"}



@app.post("/review")
async def review_project(request: ReviewRequest):
    try:
        if not os.path.exists(request.project_path):
            raise HTTPException(status_code=400, detail="Invalid project path")

        result = await asyncio.to_thread(review_codebase, request.project_path)
        return result

    except HTTPException:
        raise

    except Exception:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal server error")



@app.post("/review/file")
async def review_file(file: UploadFile = File(...)):
    temp_dir = None

    try:
        temp_dir = tempfile.mkdtemp()
        file_path = os.path.join(temp_dir, file.filename)

        content = await file.read()

        def write_file():
            with open(file_path, "wb") as f:
                f.write(content)
        await asyncio.to_thread(write_file)

        result = await review_codebase(temp_dir)

        return {
            "source": f"file:{file.filename}",
            "result": result
        }

    except Exception:
        logger.error(f"FILE_UPLOAD_ERROR: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail="File processing failed")

    finally:
        await safe_cleanup(temp_dir)



@app.post("/review/github-branch")
async def review_github_branch(request: GitHubBranchRequest):
    temp_dir = None

    try:
        temp_dir = tempfile.mkdtemp()
        owner, repo = parse_github_repo(request.repo_url)
        logger.info(f"🚀 Initializing review for {owner}/{repo} on branch: {request.branch_name}")

        headers = {
            "Accept": "application/vnd.github+json"
        }
        if request.github_token:
            headers["Authorization"] = f"Bearer {request.github_token}"

        async with httpx.AsyncClient(timeout=120, follow_redirects=True) as client:
            archive_url = f"https://api.github.com/repos/{owner}/{repo}/zipball/{request.branch_name}"
            archive_resp = await client.get(archive_url, headers=headers)

            if archive_resp.status_code != 200:
                logger.error(f"GitHub Download Failed: {archive_resp.status_code}")
                raise HTTPException(
                    status_code=archive_resp.status_code, 
                    detail=f"GitHub Access Error: {archive_resp.status_code}"
                )

        def extract_zip():
            try:
                with zipfile.ZipFile(io.BytesIO(archive_resp.content)) as zip_ref:
                    zip_ref.extractall(temp_dir)
            except zipfile.BadZipFile:
                raise ValueError("Downloaded file is not a valid ZIP archive")

        await asyncio.to_thread(extract_zip)

        extracted_content = os.listdir(temp_dir)
        if not extracted_content:
            raise HTTPException(status_code=400, detail="Repository archive is empty")
            
        project_root = os.path.join(temp_dir, extracted_content[0])

        result = await review_codebase(project_root)

        return {
            "source": f"github:{owner}/{repo}@{request.branch_name}",
            "result": result
        }

    except HTTPException as he:
        raise he
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception:
        logger.error(f"GITHUB_PROCESS_ERROR: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail="Critical failure during GitHub analysis")

    finally:
        # Cleanup temp files regardless of success or failure
        await safe_cleanup(temp_dir)