import React, { useState } from 'react'
import { ChevronDown, FileText, Folder, Play, Plus, Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Component() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

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
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <h1 className="text-xl font-bold">Green Notebook</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="text-white border-white hover:bg-green-500 transition-colors duration-200">
            Share
          </Button>
          <Button variant="outline" size="sm" className="text-white border-white hover:bg-green-500 transition-colors duration-200">
            Save
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`w-64 bg-green-100 p-4 overflow-y-auto transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-green-800">Files</h2>
            <Button size="icon" variant="ghost" className="hover:bg-green-200 text-green-700">
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
          {/* Markdown cell */}
          <div className="mb-6 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h2 className="text-2xl font-semibold mb-3 text-green-800">Welcome to Green Notebook</h2>
            <p className="text-gray-700 leading-relaxed">This is a markdown cell. You can write explanations and documentation here. The sleek design enhances readability and focus.</p>
          </div>

          {/* Code cell */}
          <div className="mb-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            <div className="bg-green-100 p-3 flex justify-between items-center">
              <span className="text-green-800 font-mono text-sm">In [1]:</span>
              <Button size="sm" variant="ghost" className="hover:bg-green-200 text-green-700 transition-colors duration-200">
                <Play className="h-4 w-4 mr-1" />
                Run
              </Button>
            </div>
            <div className="p-4 bg-gray-50">
              <pre className="font-mono text-sm text-gray-800">
                <code>
                  {`import pandas as pd
import matplotlib.pyplot as plt

# Load data
data = pd.read_csv('data.csv')

# Create a plot
plt.figure(figsize=(10, 6))
plt.plot(data['x'], data['y'])
plt.title('Sample Plot')
plt.xlabel('X-axis')
plt.ylabel('Y-axis')
plt.show()`}
                </code>
              </pre>
            </div>
          </div>

          {/* Output cell */}
          <div className="mb-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            <div className="bg-green-50 p-3">
              <span className="text-green-800 font-mono text-sm">Out [1]:</span>
            </div>
            <div className="p-4">
              <div className="bg-gray-100 h-48 flex items-center justify-center text-gray-500 rounded-md">
                [Plot output would be displayed here]
              </div>
            </div>
          </div>

          {/* New cell input */}
          <div className="flex items-center space-x-2">
            <Button size="icon" variant="outline" className="hover:bg-green-100 text-green-700 transition-colors duration-200">
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
  )
}