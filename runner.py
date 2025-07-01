import subprocess

try:
    result = subprocess.run(
        ["python3", "user_code.py"],
        capture_output=True,
        text=True,
        timeout=3
    )
    print(result.stdout or result.stderr)
except subprocess.TimeoutExpired:
    print("Execution timed out")
except Exception as e:
    print("Error:", str(e))
