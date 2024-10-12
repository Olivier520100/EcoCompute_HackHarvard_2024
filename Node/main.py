import websocket
from websocket import WebSocketApp
import time
import threading

def send_periodic(ws):
    while True:
        ws.send("RETARD")
        time.sleep(1)  # Sleep for 1 second between messages

def on_message(ws, message):
    print("Received message:", message)
    if message.startswith("START"):
        print("Hello")

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
        