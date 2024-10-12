import threading
import docker
import time
import socket
import random
import websocket
from websocket import WebSocketApp


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
            ports={'12345/tcp': self.host_port}
        )
        self.container_id = self.container.id
        self._wait_for_container_ready()

    def _find_available_port(self):
        while True:
            port = random.randint(10000, 65535)
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                if s.connect_ex(('localhost', port)) != 0:
                    return port

    def _wait_for_container_ready(self):
        max_attempts = 30
        for attempt in range(max_attempts):
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                    s.connect(('localhost', self.host_port))
                    return
            except ConnectionRefusedError:
                time.sleep(1)
        raise Exception(f"Container failed to start after {max_attempts} seconds")

    def kill_node(self):
        try:
            self.run_cell(["EXIT"])
        except:
            pass  
        self.container.stop()
        self.container.remove()

    def run_cell(self, cell: list[str]) -> list[str]:
        outputs = []
        for line in cell:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.connect(('localhost', self.host_port))
                s.sendall(line.encode())
                output = s.recv(4096).decode()
                outputs.append(output.strip())
        return outputs
    
def on_message(ws, message):
    print("Received message:", message)

    if message.startswith("START"):
        node_id = int(message.split(" ")[1])
        print(f"Starting container with ID: {node_id}")

    elif message.startswith("STOP"):
        node_id = int(message.split(" ")[1])
        print(f"Stopping container with ID: {node_id}")

    
def on_error(ws,error):
        print("Error:", error)
    
def on_close(ws):
        print("### Connection closed ###")
        
def on_open(ws):
        ws.send("START 1")
    

if __name__ == "__main__":
    ws = websocket.WebSocketApp("ws://localhost:8000/ws",on_message=on_message,on_error=on_error,on_close=on_close)
    ws.on_open = on_open
    ws.run_forever()
        # Cleanup
        