import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";

interface WebSocketContextType {
	ws: WebSocket | null;
	isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
	ws: null,
	isConnected: false,
});

export const useWebSocket = () => {
	return useContext(WebSocketContext);
};

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> =
	React.memo(({ children }) => {
		const ws = useRef<WebSocket | null>(null);
		const [isConnected, setIsConnected] = useState(false);
		const [clientId, setClientId] = useState(
			Math.floor(new Date().getTime() / 1000),
		);

		useEffect(() => {
			console.log("WebSocketProvider mounted");
			ws.current = new WebSocket(
				`ws://127.0.0.1:8000/notebookconnection/${clientId}`,
			);

			ws.current.onopen = () => {
				console.log("WebSocket connected");
				setIsConnected(true);
			};

			ws.current.onclose = (event) => {
				console.log("WebSocket disconnected:", event);
				setIsConnected(false);
			};

			ws.current.onerror = (error) => {
				console.error("WebSocket error observed:", error);
			};

			return () => {
				console.log("WebSocketProvider unmounted");
				ws.current?.close();
			};
		}, [clientId]);

		return (
			<WebSocketContext.Provider value={{ ws: ws.current, isConnected }}>
				{children}
			</WebSocketContext.Provider>
		);
	});
