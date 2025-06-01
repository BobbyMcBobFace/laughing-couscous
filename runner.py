import subprocess
import tempfile
import os
import shutil
import time

def run_code(language: str, code: str, input_data: str):
    temp_dir = tempfile.mkdtemp()
    try:
        # Language-specific setup
        if language == "cpp":
            code_file = os.path.join(temp_dir, "main.cpp")
            image = "gcc"
            compile_cmd = "g++ main.cpp -o main"
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
            }

        # Write code to file
        with open(code_file, "w", encoding="utf-8") as f:
            f.write(code)

        # Build docker command
        docker_script_parts = []
        if compile_cmd:
            docker_script_parts.append(compile_cmd)
        docker_script_parts.append(run_cmd)
        docker_script = " && ".join(docker_script_parts)

        docker_cmd = [
            "docker", "run", "--rm",
            "-v", f"{temp_dir}:/code",
            "-w", "/code",
            image,
            "/bin/bash", "-c", docker_script
        ]

        # Run code
        start_time = time.time()
        proc = subprocess.run(
            docker_cmd,
            capture_output=True,
            text=True,
            input=input_data,
            timeout=10
        )
        exec_time = time.time() - start_time

        return {
            "stdout": proc.stdout,
            "stderr": proc.stderr,
            "exit_code": proc.returncode,
            "exec_time_ms": int(exec_time * 1000),
        }

    except subprocess.TimeoutExpired:
        return {
            "stdout": "",
            "stderr": "Execution timed out.",
            "exit_code": 1,
            "exec_time_ms": 10000,
        }
    finally:
        shutil.rmtree(temp_dir)

