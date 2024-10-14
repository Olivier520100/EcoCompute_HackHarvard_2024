import docker
import random
import json
import time
import threading
import websocket
from websocket import WebSocketApp
from datetime import datetime, timedelta
from get_mean_wind_speed import get_wind_speed
import pandas as pd
import joblib
from node import Node

# Load models
try:
    power_model = joblib.load("./models/power_model.pkl")
    power_scaler = joblib.load("./models/power_scaler.pkl")
    price_model = joblib.load("./models/price_model.pkl")
except Exception as e:
    print(f"Error loading model: {e}")
    power_model = None

hourlyconsumption = []
hourlycontainers = []
hourlyproduction = []
hourlyprices = []

docker_client = docker.from_env()
nodes = {}

# Constants
CPU_POWER_CONSTANT = 100000
RANDOM_VARIANCE = 0.5

# Lock for docker access
docker_lock = threading.Lock()

def get_running_containers():
    return docker_client.containers.list()

def remove_old():
    current_time = datetime.now()
    hour_ago = current_time - timedelta(hours=1)
    
    global hourlyconsumption, hourlycontainers, hourlyproduction, hourlyprices
    
    hourlyconsumption = [entry for entry in hourlyconsumption if datetime.fromisoformat(entry["timestamp"]) > hour_ago]
    hourlycontainers = [entry for entry in hourlycontainers if datetime.fromisoformat(entry["timestamp"]) > hour_ago]
    hourlyproduction = [entry for entry in hourlyproduction if datetime.fromisoformat(entry["timestamp"]) > hour_ago]
    hourlyprices = [entry for entry in hourlyprices if datetime.fromisoformat(entry["timestamp"]) > hour_ago]

def get_power_production():
    wind_speed = get_wind_speed(52.52, 13.41)
    if not wind_speed:
        return None
    
    scaled_power = power_model.predict([[wind_speed]])
    power_production = power_scaler.inverse_transform(scaled_power)[0][0]
    return power_production

def get_power_price():
    power_production = get_power_production()
    if not power_production:
        return None
    
    last_train_date = pd.Timestamp('2023-10-11 00:00:00').date()
    now = pd.to_datetime("now").date()
    diff_in_days = (now - last_train_date).days
    
    future = price_model.make_future_dataframe(periods=diff_in_days, freq='D')
    power_price = price_model.predict(future).iloc[-1]["trend"]
    return power_price

def get_container_stats():
    with docker_lock:
        containers = get_running_containers()
        total_power_consumption = 0

        for container in containers:
            stats = container.stats(stream=False)
            cpu_usage = stats["cpu_stats"]["cpu_usage"]["total_usage"]
            cpu_percentage = (cpu_usage / stats["cpu_stats"]["system_cpu_usage"]) * 100.0 if stats["cpu_stats"]["system_cpu_usage"] > 0 else 0
            estimated_power = (cpu_percentage * CPU_POWER_CONSTANT) + random.uniform(-RANDOM_VARIANCE, RANDOM_VARIANCE)
            total_power_consumption += estimated_power

        current_datetime = datetime.now().strftime("%H:%M:%S")
        return [
            {"name": current_datetime, "value": total_power_consumption, "timestamp": datetime.now().isoformat()},
            {"name": current_datetime, "value": len(get_running_containers()), "timestamp": datetime.now().isoformat()},
            {"name": current_datetime, "value": get_power_production(), "timestamp": datetime.now().isoformat()},
            {"name": current_datetime, "value": get_power_price(), "timestamp": datetime.now().isoformat()},
        ]

def send_periodic_info(ws):
    while True:
        container_stats = get_container_stats()
        hourlyconsumption.append(container_stats[0])
        hourlycontainers.append(container_stats[1])
        hourlyproduction.append(container_stats[2])
        hourlyprices.append(container_stats[3])

        remove_old()

        output = {
            "consumption": {"hourly": hourlyconsumption},
            "containers": {"hourly": hourlycontainers},
            "production": {"hourly": hourlyproduction},
            "prices": {"hourly": hourlyprices},
        }

        ws.send(json.dumps(output))
        time.sleep(1)

def on_message_management(ws, message):
    print("Received message:", message)
    payload = json.loads(message)
    response = {"operation": payload["operation"], "status": "UNKNOWN", "result": None}
    
    if payload["operation"] == "CREATE":
        nodes[payload["container_id"]] = Node(payload["container_id"])
        response["status"] = "SUCCESS"
        response["result"] = f"Node {payload['container_id']} created."
    elif payload["operation"] == "STOP":
        if payload["container_id"] in nodes:
            nodes[payload["container_id"]].kill_node()
            del nodes[payload["container_id"]]
            response["status"] = "SUCCESS"
            response["result"] = f"Node {payload['container_id']} stopped."
        else:
            response["status"] = "FAILURE"
            response["result"] = f"Node {payload['container_id']} not found."
    elif payload["operation"] == "RUN":
        if payload["container_id"] in nodes:
            outputs = nodes[payload["container_id"]].run_cell(payload["code_lines"])
            response["status"] = "SUCCESS"
            response["result"] = [outputs]
        else:
            response["status"] = "FAILURE"
            response["result"] = f"Node {payload['container_id']} not found."
    
    ws.send(json.dumps(response))
    print("Sent response:", response)

def on_error(ws, error):
    print("Error:", error)

def on_close(ws, close_status_code, close_msg):
    print(f"### Connection closed ###\nStatus code: {close_status_code}, Message: {close_msg}")

def on_open_info(ws):
    print("Information WebSocket connection opened")
    threading.Thread(target=send_periodic_info, args=(ws,)).start()

def on_open_management(ws):
    print("Management WebSocket connection opened")

def start_ws_info():
    while True:
        try:
            ws_information = websocket.WebSocketApp(
                "wss://meerkat-expert-rarely.ngrok-free.app/containerinfo/fake_client_id",
                on_open=on_open_info,
                on_error=on_error,
                on_close=on_close,
            )
            ws_information.run_forever()
        except Exception as e:
            print(f"Information WebSocket error: {e}")
        time.sleep(5)  # Retry after 5 seconds

def start_ws_manager():
    while True:
        try:
            ws_manager = websocket.WebSocketApp(
                f"wss://meerkat-expert-rarely.ngrok-free.app/containermanagement/fake_client_id",
                on_open=on_open_management,
                on_message=on_message_management,
                on_error=on_error,
                on_close=on_close,
            )
            ws_manager.run_forever()
        except Exception as e:
            print(f"Management WebSocket error: {e}")
        time.sleep(5)  # Retry after 5 seconds

if __name__ == "__main__":
    # Run both WebSocket connections in separate threads with auto-restart logic
    threading.Thread(target=start_ws_info).start()
    threading.Thread(target=start_ws_manager).start()

    # Keep the main thread alive
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Exiting...")
