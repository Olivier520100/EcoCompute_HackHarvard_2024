import websocket
from websocket import WebSocketApp
import time
import threading
from node import Node
import json
import uuid


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

nodes = {}
def send_periodic(ws):
    while True:
        time.sleep(1)  # Sleep for 1 second between messages


def on_error(ws, error):
    print("Error:", error)

def on_close(ws, close_status_code, close_msg):
    print(f"### Connection closed ###\nStatus code: {close_status_code}, Message: {close_msg}")

def on_open(ws):
    print("Connection opened")
    # Start a separate thread to send messages periodically
    threading.Thread(target=send_periodic, args=(ws,)).start()

if __name__ == "__main__":

    ws_manager = websocket.WebSocketApp(f"ws://127.0.0.1:8000/containermanagement/{id}",on_open=on_open,on_message=on_message,on_error=on_error,on_close=on_close)
    # ws_information = websocket.WebSocketApp(f"ws://127.0.0.1:8000/containermanagement/{id}",on_open=on_open,on_message=on_message,on_error=on_error,on_close=on_close)

    ws_manager.run_forever()
        