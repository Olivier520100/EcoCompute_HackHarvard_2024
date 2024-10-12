from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
import docker
import time
import socket
import random


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.nodes: Dict[int, 'Node'] = {}  

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, data: str):
        for connection in self.active_connections:
            await connection.send_text(data)

    async def execute_code(self, code: str) -> str:
        
        try:
            exec_globals = {}
            exec(code, exec_globals)
            return str(exec_globals)
        except Exception as e:
            return f"Error: {str(e)}"

    async def create_node(self, node_id: int):
        node = Node(node_id)
        self.nodes[node_id] = node
        return f"Node {node_id} created."

    async def destroy_node(self, node_id: int):
        if node_id in self.nodes:
            self.nodes[node_id].kill_node()
            del self.nodes[node_id]
            return f"Node {node_id} destroyed."
        return f"Node {node_id} does not exist."

    async def run_code_on_node(self, node_id: int, code: str):
        if node_id in self.nodes:
            result = self.nodes[node_id].run_cell([code])
            return "\n".join(result)
        return f"Node {node_id} does not exist."

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            command = data.split(" ", 1)  

            if command[0] == "CREATE":
                node_id = int(command[1])
                response = await manager.create_node(node_id)
                await websocket.send_text(response)

            elif command[0] == "DESTROY":
                node_id = int(command[1])
                response = await manager.destroy_node(node_id)
                await websocket.send_text(response)

            elif command[0] == "RUN":
                node_id, code = command[1].split(" ", 1)
                response = await manager.run_code_on_node(int(node_id), code)
                await websocket.send_text(response)

            elif data == "EXIT":
                await websocket.send_text("Connection closed")
                break  

    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast("A client disconnected")

@app.get("/")
async def read_root():
    return {"message": "Hello, World!"}
