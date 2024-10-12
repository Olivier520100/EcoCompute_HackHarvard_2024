import docker
import random
import json
import time
import threading
import websocket
from websocket import WebSocketApp
import docker
import random

# Initialize Docker client to interact with the Docker engine
docker_client = docker.from_env()


def get_running_containers():
    """
    Fetch a list of currently running containers using the Docker client.
    """
    return docker_client.containers.list()

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



# Constants
CPU_POWER_CONSTANT = 20  # Example constant for power consumption per CPU usage
RANDOM_VARIANCE = 0.5  # A random variance factor for power consumption

def get_running_containers():
    """Fetch real running containers from Docker."""
    client = docker.from_env()
    return client.containers.list()  # List of running containers

def get_container_stats():
    """
    Fetch stats for each running container and calculate total power consumption, 
    total CPU usage percentage, and total memory usage.
    Returns a dictionary containing total stats.
    """
    total_stats = {
        "total_cpu_usage_percent": 0,
        "total_memory_usage_mb": 0,
        "total_power_consumption_watts": 0
    }

    containers = get_running_containers()  # Fetch running containers

    for container in containers:
        # Fetch real-time stats from Docker
        stats = container.stats(stream=False)  # Get stats without streaming

        # Extract CPU and memory usage
        cpu_usage = stats["cpu_stats"]["cpu_usage"]["total_usage"]
        memory_usage = stats["memory_stats"]["usage"]

        # Convert CPU usage to percentage (if you need it as a percentage)
        cpu_percentage = (cpu_usage / stats["cpu_stats"]["system_cpu_usage"]) * 100.0 if stats["cpu_stats"]["system_cpu_usage"] > 0 else 0
        
        # Calculate estimated power consumption
        estimated_power = (cpu_percentage * CPU_POWER_CONSTANT) + random.uniform(-RANDOM_VARIANCE, RANDOM_VARIANCE)

        # Update total stats
        total_stats["total_cpu_usage_percent"] += cpu_percentage
        total_stats["total_memory_usage_mb"] += memory_usage / (1024 * 1024)  # Convert bytes to MB
        total_stats["total_power_consumption_watts"] += estimated_power

    # If you want to get average values, you can divide by the number of containers
    container_count = len(containers)
    if container_count > 0:
        total_stats["average_cpu_usage_percent"] = total_stats["total_cpu_usage_percent"] / container_count
        total_stats["average_memory_usage_mb"] = total_stats["total_memory_usage_mb"] / container_count
        total_stats["average_power_consumption_watts"] = total_stats["total_power_consumption_watts"] / container_count
    else:
        total_stats["average_cpu_usage_percent"] = 0
        total_stats["average_memory_usage_mb"] = 0
        total_stats["average_power_consumption_watts"] = 0

    return total_stats


def send_periodic(ws):
    """
    Periodically send mocked container stats over WebSocket.
    """
    while True:
        # Get stats for all running containers
        container_stats = get_container_stats()

        # Convert to JSON and send over WebSocket
        ws.send(json.dumps(container_stats))
        print(f"Sent container stats: {json.dumps(container_stats, indent=2)}")
        
        time.sleep(1)  # Send updates every 5 seconds


def on_error(ws, error):
    print("Error:", error)

def on_close(ws, close_status_code, close_msg):
    print(f"### Connection closed ###\nStatus code: {close_status_code}, Message: {close_msg}")

def on_open(ws):
    print("Connection opened")
    # Start sending container stats periodically
    threading.Thread(target=send_periodic, args=(ws,)).start()

if __name__ == "__main__":
    # Initialize WebSocket connection to the server
    ws_information = websocket.WebSocketApp(
        "ws://127.0.0.1:8000/containerinfo/fake_client_id",
        on_open=on_open,
        on_error=on_error,
        on_close=on_close
    )

    # Run the WebSocket connection
    ws_information.run_forever()
