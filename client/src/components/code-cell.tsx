import { useState } from "react"
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';

export default function CodeCell() {
    const [code, setCode] = useState('')
    return (
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
      );
};
