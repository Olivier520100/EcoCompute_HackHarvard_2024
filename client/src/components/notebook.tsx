import React, { useState } from "react";
import { FileText, Folder, Plus, Menu, X, Trees } from "lucide-react";
import { Button } from "@/components/ui/button";
import CodeCell from "./code-cell";
import MarkdownCell from "./markdown-cell";

type Cell = {
  id: number;
  type: "markdown" | "code";
};

export default function NoteBook() {
  const [cellCount, setCellCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cells, setCells] = useState<Cell[]>([]);

  const addCell = (type: "markdown" | "code") => {
    setCells([...cells, { id: cellCount, type }]);
    setCellCount((prev) => prev + 1);
  };

  const addMarkdownCell = () => addCell("markdown");
  const addCodeCell = () => addCell("code");

  const removeCell = (id: number) => {
    setCells(cells.filter((cell) => cell.id !== id));
  };

  const clearAll = () => {
    setCells([]);
    setCellCount(0);
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
          <h1 className="text-xl font-bold">Eco Compute</h1>
        </div>
        <div className="flex space-x-2">
          {/* <Button
            onClick={addMarkdownCell}
            variant="outline"
            size="sm"
            className="text-white border-white hover:bg-green-500 transition-colors duration-200"
          >
            + Add Markdown
          </Button> */}
          <Button
            onClick={addCodeCell}
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
        <aside
          className={`w-64 bg-green-100 p-4 overflow-y-auto transition-all duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-green-800">Files</h2>
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-green-200 text-green-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-green-700 hover:bg-green-200 p-2 rounded-md transition-colors duration-200">
              <Folder className="h-4 w-4" />
              <span>Project</span>
            </div>
            <div className="flex items-center space-x-2 text-green-700 hover:bg-green-200 p-2 rounded-md transition-colors duration-200 ml-4">
              <FileText className="h-4 w-4" />
              <span>notebook.ipynb</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {cells.map((cell) =>
            cell.type === "markdown" ? (
              <MarkdownCell key={cell.id} />
            ) : (
              <CodeCell
                key={cell.id}
                id={cell.id}
                onDelete={() => removeCell(cell.id)}
                onAdd={addCodeCell}
              />
            )
          )}
        </main>
      </div>
    </div>
  );
}
