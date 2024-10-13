"use client";

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Server, Zap, Leaf, Cpu, Database } from "lucide-react"
import Navbar from "@/components/navbar"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-green-800 mb-12">About EcoCompute</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-white bg-opacity-80 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-green-700">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Leaf className="w-16 h-16 text-green-500" />
              </div>
              <p className="text-green-800">
              EcoCompute's mission is to revolutionize the cloud computing industry by harnessing surplus renewable energy to provide affordable, flexible, and sustainable computing power. By transforming excess solar and wind energy into valuable computing resources, EcoCompute aims to maximize the utility of renewable energy, promote environmental sustainability, and create a win-win solution for both energy providers and users.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white bg-opacity-80 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-green-700">Our Approach</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Zap className="w-16 h-16 text-yellow-500" />
              </div>
              <p className="text-green-800">
              At EcoCompute, we harness surplus renewable energy to provide affordable and flexible computing power, allowing energy providers to monetize their excess solar and wind energy. This innovative approach transforms wasted energy into valuable resources, promoting sustainability and benefiting both energy providers and users.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-3xl font-bold text-center text-green-800 mb-8">Our Tech Stack</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white bg-opacity-80 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-green-700">Cloud Infrastructure</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Cloud className="w-16 h-16 text-blue-500" />
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary">Vercel</Badge>
                <Badge variant="secondary">Google Collab</Badge>
                <Badge variant="secondary">WebSocket</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white bg-opacity-80 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-green-700">Backend Technologies</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Server className="w-16 h-16 text-purple-500" />
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary">Node.js</Badge>
                <Badge variant="secondary">Python</Badge>
                <Badge variant="secondary">Docker</Badge>
                <Badge variant="secondary">Next.js</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white bg-opacity-80 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-green-700">AI</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Database className="w-16 h-16 text-red-500" />
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary">Prophet</Badge>
                <Badge variant="secondary">TenserFLow</Badge>
                <Badge variant="secondary">sklearn</Badge>
                <Badge variant="secondary">pandas</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-12 bg-white bg-opacity-80 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-green-700">Energy Efficiency</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Cpu className="w-16 h-16 text-green-500" />
            </div>
            <p className="text-green-800">
              
EcoCompute optimizes energy efficiency by converting excess renewable energy into valuable computing power, ensuring no generated energy goes to waste. This approach not only reduces energy waste but also promotes sustainable practices in the cloud computing industry.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}