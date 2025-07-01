import os
import subprocess

# Get code from ENV variable
code = os.environ.get("CODE")

# Save to a temp file
with open("user_code.py", "w") as f:
    f.write(code)

# Execute it
result = subprocess.run(["python3", "user_code.py"], capture_output=True, text=True)

print(result.stdout)
print(result.stderr)
