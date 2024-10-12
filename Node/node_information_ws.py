import docker
import random
import json
import time
import threading
import websocket
from websocket import WebSocketApp
import docker
import random
from datetime import datetime, timedelta

hourlyconsumption = []
hourlycontainers = []


# Initialize Docker client to interact with the Docker engine
docker_client = docker.from_env()


def get_running_containers():
    """
    Fetch a list of currently running containers using the Docker client.
    """
    return docker_client.containers.list()

def remove_old():
    """
    Remove power consumption data that is older than one hour.
    """
    current_time = datetime.now()
    hour_ago = current_time - timedelta(hours=1)
    
    # Keep only entries from the last hour
    global hourlyconsumption
    global hourlycontainers
    hourlyconsumption = [entry for entry in hourlyconsumption if datetime.fromisoformat(entry['timestamp']) > hour_ago]
    hourlycontainers = [entry for entry in hourlycontainers if datetime.fromisoformat(entry['timestamp']) > hour_ago]




# Constants
CPU_POWER_CONSTANT = 100000  # Example constant for power consumption per CPU usage
RANDOM_VARIANCE = 0.5  # A random variance factor for power consumption
def get_container_stats():
    """
    Fetch stats for each running container and calculate total power consumption.
    Returns a dictionary containing total power consumption and the current date and time.
    """

    containers = get_running_containers()  # Fetch running containers
    total_power_consumption = 0

    for container in containers:
        # Fetch real-time stats from Docker
        stats = container.stats(stream=False)  # Get stats without streaming

        # Extract CPU usage
        cpu_usage = stats["cpu_stats"]["cpu_usage"]["total_usage"]

        # Convert CPU usage to percentage
        cpu_percentage = (cpu_usage / stats["cpu_stats"]["system_cpu_usage"]) * 100.0 if stats["cpu_stats"]["system_cpu_usage"] > 0 else 0

        # Calculate estimated power consumption
        estimated_power = (cpu_percentage * CPU_POWER_CONSTANT) + random.uniform(-RANDOM_VARIANCE, RANDOM_VARIANCE)

        # Update total power consumption
        total_power_consumption += estimated_power

    # Get the current date and time
    current_datetime = datetime.now().strftime("%H:%M:%S")

    return [{
        "name": current_datetime,
        "value": total_power_consumption,
        "timestamp": datetime.now().isoformat()  # Convert timestamp to ISO format for JSON serialization        
        },
    {"name": current_datetime,
        "value": len(get_running_containers()),
        "timestamp": datetime.now().isoformat()  # Convert timestamp to ISO format for JSON serialization        
        }]

def send_periodic(ws):
    """
    Periodically send mocked container stats over WebSocket.
    """
    while True:
        # Get stats for all running containers
        container_stats = get_container_stats()
        hourlyconsumption.append(container_stats[0])
        hourlycontainers.append(container_stats[1])

        remove_old()
        
        output = {"consumption": {
            "hourly": hourlyconsumption
        },
        "containers": {
            "hourly": hourlycontainers
        }}

        # Convert to JSON and send over WebSocket
        ws.send(json.dumps(output))
        print(f"Sent container stats: {json.dumps(output, indent=2)}")
        time.sleep(1)
        


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
