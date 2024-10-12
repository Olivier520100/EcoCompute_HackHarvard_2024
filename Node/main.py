import websocket
from websocket import WebSocketApp
import time
import threading
from node import Node
import json


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

nodes = {}
def send_periodic(ws):
    while True:
        ws.send("RETURN")
        time.sleep(1)  # Sleep for 1 second between messages

def on_message(ws, message):
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
            response["result"] = outputs
        else:
            response["status"] = "FAILURE"
            response["result"] = f"Node {payload['container_id']} not found."
    
    ws.send(json.dumps(response))
    print("Sent response:", response)

def on_error(ws, error):
    print("Error:", error)

def on_close(ws, close_status_code, close_msg):
    print(f"### Connection closed ###\nStatus code: {close_status_code}, Message: {close_msg}")

def on_open(ws):
    print("Connection opened")
    # Start a separate thread to send messages periodically
    threading.Thread(target=send_periodic, args=(ws,)).start()



if __name__ == "__main__":

    
    ws = websocket.WebSocketApp("ws://127.0.0.1:8000/abcdefg/ws",on_open=on_open,on_message=on_message,on_error=on_error,on_close=on_close)
    ws.run_forever()
        