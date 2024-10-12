// biome-ignore lint/style/useImportType: <explanation>
import { Cell } from "@/components/notebook";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleDownload = (cells: Cell[]) => {
  // Structure of a Jupyter Notebook (.ipynb) file
  const notebook = {
    cells: cells.map((cell) => ({
      cell_type: "code",
      execution_count: null,
      metadata: {},
      outputs: [],
      // biome-ignore lint/style/useTemplate: <explanation>
      source: cell.code.split("\n").map((line) => line + "\n"), // Split code into lines
    })),
    metadata: {
      kernelspec: {
        display_name: "Python 3",
        language: "python",
        name: "python3",
      },
      language_info: {
        codemirror_mode: {
          name: "ipython",
          version: 3,
        },
        file_extension: ".py",
        mimetype: "text/x-python",
        name: "python",
        nbconvert_exporter: "python",
        pygments_lexer: "ipython3",
        version: "3.x.x", // Update based on the Python version you want to support
      },
    },
    nbformat: 4,
    nbformat_minor: 2,
  };

  // Create a Blob from the JSON string of the notebook
  const notebookBlob = new Blob([JSON.stringify(notebook, null, 2)], {
    type: "application/json",
  });

  // Create a link element to trigger the download
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(notebookBlob);
  downloadLink.download = "notebook.ipynb"; // File name for the downloaded notebook
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}; 
