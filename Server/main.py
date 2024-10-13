import asyncio
import math
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
import docker
import time
import socket
import random
import json
import uuid

from pydantic import BaseModel

queues = {
    "test": [
        {"operation": "CREATE", "container_id": 1},
        {"operation": "RUN", "container_id": 1, "code_lines": ["print('x')"]},
        {"operation": "STOP", "container_id": 1},
    ]
}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

runjson = {"operation": "RUN", "container_id": "", "code_lines": []}
stopjson = {"operation": "STOP", "container_id": ""}
startjson = {"operation": "CREATE", "container_id": ""}

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.notebook_connections: Dict[str, WebSocket] = {}
        self.information_connections: Dict[str, WebSocket] = {}
        self.node_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        print("🚀 ~ websocketConnect:", websocket)
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        print("🚀 ~ websocketDisconnect:", websocket)
        self.active_connections.remove(websocket)



manager = ConnectionManager()


@app.websocket("/containermanagement/{provider_id}")
async def websocket_endpoint_management(websocket: WebSocket, provider_id: str):
    await manager.connect(websocket)
    try:
        if provider_id not in queues:
            queues[provider_id] = []
        while True:
            if len(queues[provider_id]) > 0:
                command = queues[provider_id][0]
                await websocket.send_json(command)
                response = await websocket.receive_text()
                queues[provider_id].pop(0)
                print(f"Operation completed for {provider_id}: {command['operation']}")
                print(f"Response: {response}")

                # Send the result back to the notebook connection
                if (
                    command["operation"] == "RUN"
                    and command["container_id"] in manager.notebook_connections
                ):
                    notebook_ws = manager.notebook_connections[command["container_id"]]
                    await notebook_ws.send_json(
                        {
                            "status": "executed",
                            "container_id": command.get("container_id"),
                            "result": response,
                            "cellId": command.get("cellId"),
                        }
                    )
            else:
                await asyncio.sleep(0.1)

    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f"Provider {provider_id} disconnected")
        # Delete the queue for this provider
        if provider_id in queues:
            del queues[provider_id]


@app.websocket("/containerinfo/{provider_id}")
async def websocket_endpoint_info(websocket: WebSocket, provider_id: str):
    await manager.connect(websocket)
    manager.node_connections[provider_id] = websocket
    try:
        while True:
            response = await websocket.receive_text()
            print(f"🚀 ~ Received data from node {provider_id}: ", response)
            if provider_id in manager.information_connections:
                await manager.information_connections[provider_id].send_text(response)
            else:
                print(f"No React client connected for provider {provider_id}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print(f"Node {provider_id} disconnected")
        if provider_id in manager.node_connections:
            del manager.node_connections[provider_id]



@app.websocket("/notebookconnection")
async def websocket_notebook_connection(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        if not queues:
            raise ValueError("No available providers in the queue")
        provider_id = random.choice(list(queues.keys()))
        container_id = str(uuid.uuid4())

        print(
            f"Connected to existing provider. Provider ID: {provider_id}, Container ID: {container_id}"
        )

        # Store the notebook connection
        manager.notebook_connections[container_id] = websocket

        # Send the provider_id to the client
        await websocket.send_json(
            {
                "status": "connected",
                "provider_id": provider_id,
                "container_id": container_id,
            }
        )

        # Add CREATE operation to the queue
        queues[provider_id].append(
            {"operation": "CREATE", "container_id": container_id}
        )

        while True:
            data = await websocket.receive_text()
            print(f"🚀 ~ Received data for {provider_id}: ", data)
            response_data = json.loads(data)

            if "cellId" in response_data and "code" in response_data:
                # Add RUN operation to the queue
                queues[provider_id].append(
                    {
                        "operation": "RUN",
                        "container_id": container_id,
                        "code_lines": response_data["code"],
                        "cellId": response_data["cellId"],
                    }
                )

                print(
                    f"Added to queue for provider {provider_id}: {queues[provider_id][-1]}"
                )

                # Acknowledge receipt of the code
                await websocket.send_json(
                    {
                        "status": "queued",
                        "cellId": response_data["cellId"],
                        "message": "Code has been queued for execution",
                    }
                )
            else:
                await websocket.send_json(
                    {
                        "status": "error",
                        "message": "Invalid data received. Expected 'cellId' and 'code'.",
                    }
                )

    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print(f"Notebook for container {container_id} disconnected")

        # Add STOP operation to the queue
        queues[provider_id].append({"operation": "STOP", "container_id": container_id})

        # Remove the notebook connection
        if container_id in manager.notebook_connections:
            del manager.notebook_connections[container_id]

    except ValueError as ve:
        print(f"Error: {str(ve)}")
        await websocket.close()

    except Exception as e:
        print(f"Error in websocket connection for container {container_id}: {e}")

    finally:
        await websocket.close()
        await manager.broadcast(f"Notebook for container {container_id} disconnected")


@app.websocket("/infoconnection/{provider_id}")
async def websocket_info_connection(websocket: WebSocket, provider_id: str):
    await manager.connect(websocket)
    manager.information_connections[provider_id] = websocket
    try:
        while True:
            data = await websocket.receive_text()
            print(f"🚀 ~ Received data from React client {provider_id}: ", data)
            # Handle any data sent from the React client if necessary
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print(f"React client {provider_id} disconnected")
        if provider_id in manager.information_connections:
            del manager.information_connections[provider_id]

