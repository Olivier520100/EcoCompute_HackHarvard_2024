# FastAPI Server (server.py)
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
import docker
import time
import socket
import random
import time
import json

from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


runjson = {
    "operation": "RUN",
    "container_id": "",
    "code_lines": [
    ]
}
stopjson = {
    "operation": "STOP",
    "container_id": "",
}
startjson = {
    "operation": "START",
    "container_id": "",
}


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

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

manager = ConnectionManager()


@app.websocket("/containermanagement/{client_id}")
async def websocket_endpoint_management(websocket: WebSocket, client_id: str):
    await manager.connect(websocket)
    try:
        while True:

            a = json.loads(input())
            await websocket.send_json(a)
            response = await websocket.receive_text()
            print(response)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast("A client disconnected")

@app.websocket("/containerinfo/{client_id}")
async def websocket_endpoint_info(websocket: WebSocket, client_id: str):
    await manager.connect(websocket)
    try:
        while True:


            response = await websocket.receive_text()
            print(response)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast("A client disconnected")
        
            
@app.get("/")
async def read_root():
    return {"message": "Hello, World!"}

class CodeCellRequest(BaseModel):
    code: str

@app.post("/run-code-cell")
async def run_code_cell(request: CodeCellRequest):
    code_lines = request.code_lines
    output = "\n".join([f"Output of line {i}: {line}" for i, line in enumerate(code_lines)])
    return {"output": output}
