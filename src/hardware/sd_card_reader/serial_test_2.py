import serial
import time
import argparse

import os

class SerialCommunicator:
    def __init__(self, port='/dev/ttyACM0', baudrate=9600, timeout=1):
        """Initialize the serial connection."""
        self.port = port
        self.baudrate = baudrate
        self.timeout = timeout
        self.ser = None

    def connect(self):
        """Establish connection to the serial port."""
        try:
            self.ser = serial.Serial(
                port=self.port,
                baudrate=self.baudrate,
                timeout=self.timeout
            )
            print(f"Connected to {self.port} at {self.baudrate} baud")
            return True
        except serial.SerialException as e:
            print(f"Error connecting to {self.port}: {e}")
            return False

    def disconnect(self):
        """Close the serial connection."""
        if self.ser and self.ser.is_open:
            self.ser.close()
            print(f"Disconnected from {self.port}")

    def send_command(self, command, wait_for_response=True):
        """Send a command to the device and return the response."""
        if not self.ser or not self.ser.is_open:
            print("Not connected to any device")
            return None

        # Add newline if not present
        if not command.endswith('\n'):
            command += '\n'

        try:
            # Send the command
            self.ser.write(command.encode('utf-8'))
            print(f"Sent: {command.strip()}")

            if wait_for_response:
                # Wait a bit for device to process
                time.sleep(0.1)

                # Read response
                response = ""
                while self.ser.in_waiting > 0:
                    line = self.ser.readline().decode('utf-8').strip()
                    line = line.replace("\n", "")
                    response += line + "\n"

                if response:

                    print("Received: " + response.replace(command, ""))
                    return response
                else:
                    print("No response received")
                    return None
            return None
        except Exception as e:
            print(f"Error sending command: {e}")
            return None


def interactive_mode(communicator):
    """Run an interactive serial console."""
    print("Enter commands (type 'exit' to quit):")

    while True:
        command = input("> ")

        if command.lower() in ['exit', 'quit']:
            break
        elif command.lower() in ['send-file']:
            file_path = command[1]
            with open(file_path, "rb") as byte_file:
                while True:
                    chunk = byte_file.read(256)
                    if not chunk:
                        break

                    communicator.send_command(chunk)
        else:
            communicator.send_command(command)


def main():
    parser = argparse.ArgumentParser(description="Simple Serial Communicator")
    parser.add_argument("--port", default="/dev/ttyACM0", help="Serial port to use")
    parser.add_argument("--baudrate", type=int, default=9600, help="Baud rate")
    parser.add_argument("--command", help="Single command to send (if not specified, enters interactive mode)")

    args = parser.parse_args()

    # Create and connect the communicator
    comm = SerialCommunicator(port=args.port, baudrate=args.baudrate)
    if not comm.connect():
        return

    try:
        interactive_mode(comm)
    finally:
        comm.disconnect()


if __name__ == "__main__":
    main()
