import subprocess
import tempfile
import os
import shutil
import time
import re

def parse_errors(stderr: str):
    errors = []
    # Regex for GCC/clang style errors: filename:line:column: error: message
    pattern = re.compile(r'^(.*):(\d+):(\d+): error: (.*)$', re.MULTILINE)
    for match in pattern.finditer(stderr):
        line = int(match.group(2))
        column = int(match.group(3))
        message = match.group(4)
        errors.append({"line": line, "column": column, "message": message})
    return errors

def run_code(language: str, code: str, input_data: str):
    temp_dir = tempfile.mkdtemp()
    try:
        if language == "cpp":
            code_file = os.path.join(temp_dir, "main.cpp")
            image = "gcc"  # Consider using a newer image for g++ 9.4.0+
            # Updated compile command with -O2 and C++17
            compile_cmd = "g++ -O2 -std=c++17 main.cpp -o main"
            run_cmd = "./main"
        elif language == "python38":
            code_file = os.path.join(temp_dir, "main.py")
            image = "python:3.8-slim"
            compile_cmd = None
            run_cmd = "python3 main.py"
        else:
            return {
                "stdout": "",
                "stderr": f"Unsupported language: {language}",
                "exit_code": 1,
                "exec_time_ms": 0,
                "errors": []
            }

        with open(code_file, "w", encoding="utf-8") as f:
            f.write(code)

        docker_script_parts = []
        if compile_cmd:
            docker_script_parts.append(compile_cmd)
        docker_script_parts.append(run_cmd)
        docker_script = " && ".join(docker_script_parts)

        docker_cmd = [
            "docker", "run", "--rm", "-i",
            "-v", f"{temp_dir}:/code",
            "-w", "/code",
            image,
            "/bin/bash", "-c", docker_script
        ]

        start_time = time.time()
        proc = subprocess.run(
            docker_cmd,
            capture_output=True,
            text=True,
            input=input_data,
            timeout=10
        )
        exec_time = time.time() - start_time

        errors = []
        if compile_cmd and proc.returncode != 0:
            errors = parse_errors(proc.stderr)

        return {
            "stdout": proc.stdout,
            "stderr": proc.stderr,
            "exit_code": proc.returncode,
            "exec_time_ms": int(exec_time * 1000),
            "errors": errors,
        }

    except subprocess.TimeoutExpired:
        return {
            "stdout": "",
            "stderr": "Execution timed out.",
            "exit_code": 1,
            "exec_time_ms": 10000,
            "errors": []
        }
    finally:
        shutil.rmtree(temp_dir)

