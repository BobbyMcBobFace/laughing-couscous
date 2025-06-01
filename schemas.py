# backend/schemas.py

from pydantic import BaseModel
from typing import Optional, List

class RunRequest(BaseModel):
    language: str
    code: str
    input: Optional[str] = ""

class CompilerError(BaseModel):
    line: int
    column: int
    message: str

class RunResponse(BaseModel):
    exit_code: int
    stdout: str
    stderr: str
    exec_time_ms: int
    errors: Optional[List[CompilerError]] = []

