// NoteBook.tsx
import { useEffect, useState } from "react";
import { Menu, X, Trees } from "lucide-react";
import { Button } from "@/components/ui/button";
import CodeCell from "./code-cell";
import { handleDownload } from "@/lib/utils";
import OutputCell from "./output-cell";
import Link from "next/link";

export type Cell = {
	id: number;
	code: string;
};

export default function NoteBook() {
	const [cellCount, setCellCount] = useState(0);
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [cells, setCells] = useState<Cell[]>([]);
	const [output, setOutput] = useState<string>("");

	const [websocket, setWebsocket] = useState<WebSocket | null>(null);
	const [clientId, setClientId] = useState(
		Math.floor(new Date().getTime() / 1000),
	);
		

	const addCodeCell = (code: string = "") => {
		setCells([...cells, { id: cellCount, code }]);
		setCellCount((prev) => prev + 1);
	};

	const removeCodeCell = (id: number) => {
		setCells(cells.filter((cell) => cell.id !== id));
	};

	const clearAll = () => {
		setCells([]);
		setCellCount(0);
	};

	const handleCodeChange = (id: number, newCode: string) => {
		setCells((prevCells) =>
			prevCells.map((cell) =>
				cell.id === id ? { ...cell, code: newCode } : cell,
			),
		);
	};

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				try {
					const notebookContent = JSON.parse(event.target?.result as string);
					let i = cellCount;

					if (notebookContent.cells) {
						const codeCells: Cell[] = notebookContent.cells
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							.filter((cell: any) => cell.cell_type === "code")
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							.map((cell: any) => {
								const newCell: Cell = {
									id: i++,
									code: cell.source.join(""),
								};
								return newCell;
							});

						setCellCount(i);
						setCells([...codeCells]);
					} else {
						console.error("Invalid .ipynb file format");
					}
				} catch (error) {
					console.error("Error parsing the .ipynb file:", error);
				}
			};

			reader.readAsText(file);

			e.target.value = "";
		}
	};

	return (
		<div className="flex flex-col h-screen bg-green-50">
			{/* Header */}
			<header className="bg-green-600 text-white p-3 flex justify-between items-center shadow-md">
				<div className="flex items-center space-x-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="text-white hover:bg-green-500 transition-colors duration-200"
					>
						{sidebarOpen ? (
							<X className="h-5 w-5" />
						) : (
							<Menu className="h-5 w-5" />
						)}
					</Button>
					<Trees className="h-8 w-8" />
					<Link href="/">
					  <h1 className="text-xl font-bold">EcoCompute</h1>
				  </Link>
				</div>
				<div className="flex space-x-2">
					<Button
						onClick={() => addCodeCell()}
						variant="outline"
						size="sm"
						className="text-green-700 border-green-500 bg-white hover:bg-green-500 hover:text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
					>
						+ Add Code
					</Button>
					<Button
						onClick={clearAll}
						variant="outline"
						size="sm"
						className="text-red-700 border-red-500 bg-white hover:bg-red-500 hover:text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
					>
						Clear All
					</Button>
				</div>
			</header>

			<div className="flex flex-1 overflow-hidden">
				{/* Sidebar */}
				{sidebarOpen && (
					<aside className="bg-green-100 p-4 overflow-y-auto transition-all duration-300 ease-in-out sm:transition-none sm:duration-0 md:w-1/4">
						<div className="flex justify-between items-center mb-4">
							<h2 className="font-semibold text-green-800">Settings</h2>
						</div>

						<div className="space-y-4">
							{/* Upload Notebook Button */}
							<div className="flex items-center space-x-2">
								<Button className="bg-green-200 p-2 rounded-md text-green-700 hover:bg-green-300 transition-colors duration-200 w-full">
									<input
										type="file"
										accept=".ipynb"
										id="uploadNotebook"
										className="hidden"
										onChange={handleFileUpload}
									/>
									<label
										htmlFor="uploadNotebook"
										className="cursor-pointer bg-green-200 p-2 rounded-md text-green-700 hover:bg-green-300 transition-colors duration-200 w-full text-center"
									>
										Upload Notebook
									</label>
								</Button>
							</div>

							{/* Download Notebook Button */}
							<div className="flex items-center space-x-2">
								<Button
									onClick={() => handleDownload(cells)}
									className="bg-green-200 p-2 rounded-md text-green-700 hover:bg-green-300 transition-colors duration-200 w-full"
								>
									Download Notebook
								</Button>
							</div>
						</div>
					</aside>
				)}

				{/* Main Content */}
				<main className="flex-1 p-6 overflow-y-auto">
					{cells.map((cell) => (
						<CodeCell
							key={cell.id}
							id={cell.id}
							initialCode={cell.code}
							onCodeChange={(newCode) => handleCodeChange(cell.id, newCode)}
							onDelete={() => removeCodeCell(cell.id)}
							onAdd={() => addCodeCell()}
						/>
							
					))}
				</main>
			</div>
		</div>
	);
}
