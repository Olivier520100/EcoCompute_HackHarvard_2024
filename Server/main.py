# server.py

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
import json

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
        print("🚀 ~ websocketConnect:", websocket)

        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        print("🚀 ~ websocketDisconnect:", websocket)

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
            print("🚀 ~ data:", data)

            response = f"Message text was: {json.loads(data)}"
            response_data = json.loads(data)

            print("🚀 ~ response:", response)
            await websocket.send(
                json.dumps({"cellId": response_data.cellId, "data": response_data.code})
            )
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print(f"Client {client_id} disconnected")
    except Exception as e:
        print(f"Error in websocket connection with client {client_id}: {e}")
    finally:
        await websocket.close()


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
