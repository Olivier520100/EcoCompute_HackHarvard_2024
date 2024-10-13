"use client";

import NoteBook from "@/components/notebook";
import { WebSocketProvider } from "../WebSocketContext";

export default function Home() {
	return (
		<WebSocketProvider>
			<NoteBook />
		</WebSocketProvider>
	);
}
