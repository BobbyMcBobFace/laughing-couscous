# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas import RunRequest, RunResponse
from runner import run_code

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/run", response_model=RunResponse)
def execute_code(req: RunRequest):
    result = run_code(req.language, req.code, req.input or "")
    return result

