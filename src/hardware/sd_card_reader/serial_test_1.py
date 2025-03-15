import base64
import time
import subprocess
import os
from pathlib import Path

abs_path = Path(__file__).parent
print(abs_path)

if __name__ == "__main__":
    file_path = input("File path: ")

    if not os.path.isabs(file_path):
        file_path = os.path.join(abs_path, file_path.replace("./", ""))

    with open(file_path, "rb") as file:
        encoded_string = base64.b64encode(file.read()).decode("utf-8")

    with open("koule.txt", "w") as in_file:  # Changed from "a" to "w" to avoid appending
        in_file.write(encoded_string)

    print("Finished")
