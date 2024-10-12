import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { Button } from "./ui/button";
import { Play, Plus, Trash } from "lucide-react";

export default function CodeCell() {
  const [code, setCode] = useState("");

  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="bg-green-100 p-3 flex justify-between items-center">
        {/* Add Plus button next to 'In [1]:' */}
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            className="hover:bg-green-200 text-green-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-1" />
          </Button>
          <span className="text-green-800 font-mono text-sm">In [1]:</span>
        </div>

        {/* Run and Delete buttons */}
        <div className="flex space-x-2 items-center">
          <Button
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
            className="hover:bg-red-200 text-red-700 transition-colors duration-200"
          >
            <Trash className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      <div className="p-4 bg-gray-50">
        <CodeMirror
          value={code}
          height="200px"
          extensions={[python()]} // Add Python syntax highlighting
          onChange={(value) => {
            setCode(value); // Update the code state on change
          }}
          theme="light"
        />
      </div>
    </div>
  );
}
