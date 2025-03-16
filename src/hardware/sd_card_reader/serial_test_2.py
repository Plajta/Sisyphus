import serial
import time
import argparse


class SerialCommunicator:
    def __init__(self, port='/dev/ttyACM0', baudrate=115200, timeout=1):
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
        if isinstance(command, str):
            if not command.endswith('\n'):
                command += '\n'

        try:
            # Send the command
            if isinstance(command, bytes):
                self.ser.write(command)
            else:
                self.ser.write(command.encode())

            print(f"Sent: {command.strip()}")

            if wait_for_response:
                # Wait a bit for device to process
                time.sleep(0.1)

                # Read response
                response = ""
                try:
                    while self.ser.in_waiting > 0:
                        line = self.ser.readline().decode().strip()
                        line = line.replace("\n", "")
                        response += line + "\n"

                    if command in response:
                        response = response.replace(command, "").strip()
                except Exception as E:
                    # Cannot decode (just forget it)
                    pass


                if response:
                    print("Received: " + response)
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
        elif 'send-file' in command.lower():
            file_path = command.split(" ")[1]
            with open(file_path, "rb") as byte_file:
                while True:
                    chunk = byte_file.read(512)
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
