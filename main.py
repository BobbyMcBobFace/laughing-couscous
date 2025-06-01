from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from schemas import RunRequest, RunResponse
from runner import run_code

app = FastAPI()

# Serve frontend files from /static folder
app.mount("/static", StaticFiles(directory="static", html=True), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/run", response_model=RunResponse)
def run(request: RunRequest):
    result = run_code(request.language, request.code, request.input or "")
    return RunResponse(**result)

