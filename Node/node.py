import docker
import time
import socket
import random

# Docker client setup
client = docker.from_env()

# Python script to run in the container
CONTAINER_SCRIPT = """
import socket
import sys
from io import StringIO
from contextlib import redirect_stdout, redirect_stderr

def execute_code(code):
    output = StringIO()
    with redirect_stdout(output), redirect_stderr(output):
        try:
            exec(code, globals())
        except Exception as e:
            print(f"Error: {str(e)}", file=sys.stderr)
    return output.getvalue()

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind(('', 12345))
    s.listen()
    print("Python process is running and waiting for connections...")
    while True:
        conn, addr = s.accept()
        with conn:
            data = conn.recv(1024).decode()
            if data == "EXIT":
                break
            result = execute_code(data)
            conn.sendall(result.encode())
"""


class Node:
    def __init__(self, id):
        self.id = id
        self.host_port = self._find_available_port()
        self.container = client.containers.run(
            "python:3.9",
            command=["python", "-c", CONTAINER_SCRIPT],
            detach=True,
            ports={"12345/tcp": self.host_port},
        )
        self.container_id = self.container.id
        self._wait_for_container_ready()

    def _find_available_port(self):
        while True:
            port = random.randint(10000, 65535)
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                if s.connect_ex(("localhost", port)) != 0:
                    return port

    def _wait_for_container_ready(self):
        max_attempts = 30
        for attempt in range(max_attempts):
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                    s.connect(("localhost", self.host_port))
                    return
            except ConnectionRefusedError:
                time.sleep(1)
        raise Exception(f"Container failed to start after {max_attempts} seconds")

    def kill_node(self):
        try:
            self.run_cell(["EXIT"])
        except:
            pass  # Ignore errors during exit
        self.container.stop()
        self.container.remove()

    def run_cell(self, cell: list[str]) -> str:
        # Join the lines into a single string with line breaks
        code_to_execute = "\n".join(cell)

        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.connect(("localhost", self.host_port))
            s.sendall(code_to_execute.encode())
            output = s.recv(4096).decode()

        # Strip leading/trailing whitespace and return the output
        return output.strip().replace("\n", " ")  # Combine output into a single line
