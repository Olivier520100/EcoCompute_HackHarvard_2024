import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { Button } from "./ui/button";
import { Play, Plus, Trash } from "lucide-react";
import OutputCell from "./output-cell";

interface CodeCellProps {
  onCodeChange: (code: string) => void;
  onDelete: () => void;
  onAdd: () => void;
  id: number;
  initialCode: string;
}

export default function CodeCell({
  onDelete,
  onAdd,
  id,
  initialCode = "",
  onCodeChange,
}: CodeCellProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>("");

  const runCodeCell = async () => {
    try {
      const response = await fetch(`api/run-code-cell`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response:", data);
      setOutput(data.result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
            onClick={runCodeCell}
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
