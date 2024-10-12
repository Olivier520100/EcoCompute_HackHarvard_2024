import React, { useState } from "react";
import {
  FileText,
  Folder,
  Plus,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CodeCell from "./code-cell";
import MarkdownCell from "./markdown-cell";
import OutputCell from "./output-cell";

export default function NoteBook() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
          <h1 className="text-xl font-bold">Green Notebook</h1>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-white border-white hover:bg-green-500 transition-colors duration-200"
          >
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-white border-white hover:bg-green-500 transition-colors duration-200"
          >
            Save
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

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <MarkdownCell />

          <CodeCell />
          <CodeCell />

          <OutputCell />

          {/* New cell input */}
          <div className="flex items-center space-x-2">
            <Button
              size="icon"
              variant="outline"
              className="hover:bg-green-100 text-green-700 transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Type '/' for commands"
              className="flex-1 border-green-200 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
