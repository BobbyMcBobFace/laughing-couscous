from pydantic import BaseModel
from typing import Optional

class RunRequest(BaseModel):
    language: str
    code: str
    input: Optional[str] = None

class RunResponse(BaseModel):
    exit_code: int
    stdout: str
    stderr: str
    exec_time_ms: int

