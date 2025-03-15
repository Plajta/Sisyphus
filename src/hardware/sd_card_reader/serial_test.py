import base64
import serial
import time

import subprocess
import os
from pathlib import Path

abs_path = Path(__file__).parent
print(abs_path)

if __name__ == "__main__":
    file_path = input("File path: ")
    destination = input("Destination path: ")
    if not os.path.isabs(file_path):
        file_path = os.path.join(abs_path, file_path.replace("./", ""))

    with open(file_path, "rb") as file:
        encoded_string = base64.b64encode(file.read()).decode("utf-8")
    with open("temp.txt", "a") as in_file:
        in_file.write(encoded_string)

    in_file_path = os.path.join(abs_path, "temp.txt")

    # Start serial connection
    ser_connection = serial.Serial(destination, 115200)
    ser_connection.flush()

    file_name = os.path.basename(destination)
    file_size = os.path.getsize(destination)

    ser_connection.write("start-data\n")
    ser_connection.write(f"${file_name}\n".encode())

    bytes_sent = 0
    with open("temp.txt", "rb") as byte_file:
        while True:
            chunk = file.read(1024)
            if not chunk:
                break

            ser_connection.write(chunk)
            time.sleep(0.5)

            # Update progress
            bytes_sent += len(chunk)
            progress = (bytes_sent / file_size) * 100
            print(f"Progress: {progress:.2f}% ({bytes_sent}/{file_size} bytes)")

    ser_connection.write("end-data\n")

    # subprocess.run(["cp", str(in_file_path), str(destination)]) TODO?
    print("Finished")
