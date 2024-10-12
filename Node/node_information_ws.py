import websocket
from websocket import WebSocketApp
import time
import threading
from node import Node
import json
import uuid
import random


id = uuid.uuid4()


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

import docker

# Generate a unique identifier for the client session
client_id = str(uuid.uuid4())

# Docker client instance to interact with Docker containers
docker_client = docker.from_env()
# Constants
CPU_POWER_CONSTANT = 0.1  # Power consumption multiplier for CPU usage (Watts per CPU usage unit)
RANDOM_VARIANCE = 5  # Add or subtract up to 5W of random variation

def mock_cpu_usage():
    """
    Generate random CPU usage to simulate container stats.
    """
    return random.uniform(10, 90)  # Mock CPU usage as a percentage (10% to 90%)

def mock_memory_usage():
    """
    Generate random memory usage to simulate container stats.
    """
    return random.randint(500, 4000) * 1024 * 1024  # Random memory usage between 500MB to 4GB

def mock_container_stats():
    """
    Create a list of mocked container stats, including CPU and memory usage.
    """
    container_stats = []
    
    # Mock stats for 5 containers
    for i in range(5):
        cpu_usage = mock_cpu_usage()
        memory_usage = mock_memory_usage()
        
        container_stats.append({
            "id": f"container_{i}",
            "cpu_usage": cpu_usage,
            "memory_usage": memory_usage
        })
    
    return container_stats

def send_periodic(ws):
    """
    Periodically collect Docker container information and send it over WebSocket.
    """
    while True:
        container_info = get_container_info()
        ws.send(json.dumps(container_info))  # Send container info as JSON
        time.sleep(5)  # Send updates every 5 seconds


def on_error(ws, error):
    print("Error:", error)

def on_close(ws, close_status_code, close_msg):
    print(f"### Connection closed ###\nStatus code: {close_status_code}, Message: {close_msg}")

def on_open(ws):
    print("Connection opened")
    # Start a separate thread to send messages periodically
    threading.Thread(target=send_periodic, args=(ws,)).start()

if __name__ == "__main__":

    ws_information = websocket.WebSocketApp(f"ws://127.0.0.1:8000/containerinfo/{id}",on_open=on_open,on_error=on_error,on_close=on_close)

    ws_information.run_forever()
        