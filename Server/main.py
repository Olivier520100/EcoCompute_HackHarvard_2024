# server.py

import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import json
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Be cautious with '*' in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


manager = ConnectionManager()


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            response = f"Message text was: {data}"
            await websocket.send_text(response)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print(f"Client {client_id} disconnected")
    except Exception as e:
        print(f"Error in websocket connection with client {client_id}: {e}")
    finally:
        await websocket.close()


@app.get("/")
async def read_root():
    return {"message": "Hello, World!"}


class CodeCellRequest(BaseModel):
    code_lines: str


import io
import sys


def run_python_code(code_string):
    # Redirect stdout to capture print statements
    old_stdout = sys.stdout
    new_stdout = io.StringIO()
    sys.stdout = new_stdout

    try:
        # Execute the code string
        exec(code_string)
    except Exception as e:
        # In case of an error, return the exception message
        return f"Error: {str(e)}"
    finally:
        # Restore stdout to the original state
        sys.stdout = old_stdout

    # Get the output from the code execution
    output = new_stdout.getvalue()
    return output


@app.post("/run-code-cell")
async def run_code_cell(request: CodeCellRequest):
    code_lines = request.code_lines
    return {"result": run_python_code(code_lines)}
