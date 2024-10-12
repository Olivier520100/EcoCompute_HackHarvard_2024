import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { Button } from "./ui/button";
import { Play, Plus, Trash } from "lucide-react";
import OutputCell from "./output-cell";
import { useWebSocket } from "@/app/WebSocketContext";

interface CodeCellProps {
	onCodeChange: (code: string) => void;
	onDelete: () => void;
	onAdd: () => void;
	id: number;
	initialCode: string;
	children?: React.ReactNode; // This allows you to pass OutputCell as a child
}

export default function CodeCell({
	onDelete,
	onAdd,
	id,
	initialCode = "",
	onCodeChange,
}: CodeCellProps) {
	const [code, setCode] = useState(initialCode);

	const { ws, isConnected } = useWebSocket();

	const handleRun = () => {
		if (isConnected && ws && ws.readyState === WebSocket.OPEN) {
			ws.send(JSON.stringify({ cellId: id, code }));
		} else {
			console.error("WebSocket is not open");
		}
	};

	useEffect(() => {
		if (!ws) return;

		const handleMessage = (event: MessageEvent) => {
			const data = JSON.parse(event.data);
			console.log("🚀 ~ handleMessage ~ data:", data);

			if (data.cellId === id) {
				setOutput(data.code);
			}
		};

		ws.addEventListener("message", handleMessage);

		return () => {
			ws.removeEventListener("message", handleMessage);
		};
	}, [ws, id]);

	const [output, setOutput] = useState<string>("");

	return (
		<div className="mb-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
			<div className="bg-green-100 p-3 flex justify-between items-center">
				{/* Add Plus button next to 'In [1]:' */}
				<div className="flex items-center space-x-2">
					<Button
						size="sm"
						variant="ghost"
						onClick={onAdd} // Call the onAdd prop when clicked
						className="hover:bg-green-200 text-green-700 transition-colors duration-200"
					>
						<Plus className="h-4 w-4 mr-1" />
					</Button>
					<span className="text-green-800 font-mono text-sm">In [{id}]:</span>
				</div>

				{/* Run and Delete buttons */}
				<div className="flex space-x-2 items-center">
					<Button
						onClick={handleRun}
						size="sm"
						variant="ghost"
						className="hover:bg-green-200 text-green-700 transition-colors duration-200"
					>
						<Play className="h-4 w-4 mr-1" />
						Run
					</Button>
					<Button
						size="sm"
						variant="ghost"
						onClick={onDelete}
						className="hover:bg-red-200 text-red-700 transition-colors duration-200"
					>
						<Trash className="h-4 w-4 mr-1" />
						Delete
					</Button>
				</div>
			</div>

			{/* Auto-resizing CodeMirror */}
			<div className="p-4 bg-gray-50">
				<CodeMirror
					value={code}
					extensions={[python()]}
					onChange={(value) => {
						onCodeChange(value);
						setCode(value);
					}}
					theme="light"
					basicSetup={{
						lineNumbers: true,
						foldGutter: true,
						highlightActiveLineGutter: true,
					}}
					style={{
						maxHeight: "400px",
						overflow: "auto",
					}}
				/>
			</div>

			{output && <OutputCell id={id} output={output} />}
		</div>
	);
}
