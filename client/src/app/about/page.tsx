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
                EcoCompute is dedicated to revolutionizing cloud computing by providing efficient, scalable solutions while minimizing environmental impact. We leverage cutting-edge technology and renewable energy to create a sustainable future for the tech industry.
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
                We combine state-of-the-art cloud infrastructure with innovative energy management systems. Our platform optimizes resource allocation, utilizes renewable energy sources, and implements advanced cooling techniques to reduce carbon footprint without compromising performance.
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
                <Badge variant="secondary">AWS</Badge>
                <Badge variant="secondary">Google Cloud</Badge>
                <Badge variant="secondary">Azure</Badge>
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
                <Badge variant="secondary">Go</Badge>
                <Badge variant="secondary">Kubernetes</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white bg-opacity-80 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-green-700">Data Management</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Database className="w-16 h-16 text-red-500" />
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary">PostgreSQL</Badge>
                <Badge variant="secondary">MongoDB</Badge>
                <Badge variant="secondary">Redis</Badge>
                <Badge variant="secondary">Apache Kafka</Badge>
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
              Our proprietary algorithms continuously monitor and optimize energy consumption across our infrastructure. We employ machine learning techniques to predict usage patterns and dynamically allocate resources, ensuring maximum efficiency and minimal waste.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}