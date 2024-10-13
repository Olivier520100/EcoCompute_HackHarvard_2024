'use client'

import { useEffect, useRef } from 'react'
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Leaf, TreePine } from 'lucide-react'
import Image from 'next/image'
import logo from '@/lib/LogoGif.gif'
import dynamic from 'next/dynamic'

export default function VideoPlayer() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-100 to-green-200">
      <header className="w-full bg-green-600 p-4 flex items-center">
        <Leaf className="h-6 w-6 text-white mr-2" />
        <h1 className="text-2xl font-bold text-white">EcoCompute</h1>
      </header>
      <div className="flex-grow flex items-center justify-center p-8">
        <div className="relative flex items-stretch bg-white rounded-3xl shadow-lg p-8 space-x-8">
          <div className="flex flex-col items-center space-y-8">
            <div className="w-96 h-96 flex items-center justify-center">
              <Image
                src={logo}
                alt="EcoCompute Logo Animation"
                width={300}
                height={300}
                className="object-cover rounded-full"
              />
            </div>
            <div className="flex space-x-4">
              <Link href="/dashboard">
                <Button className="w-48 h-16 text-lg bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md transition-all hover:scale-105">
                  <Leaf className="mr-2 h-6 w-6" />
                  Eco Dashboard
                </Button>
              </Link>
              <Link href="/computing">
                <Button className="w-48 h-16 text-lg bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md transition-all hover:scale-105">
                  <TreePine className="mr-2 h-6 w-6" />
                  Green Computing
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-grow bg-green-50 rounded-3xl shadow-md overflow-hidden border-4 border-green-300">
            <h2 className="text-2xl font-bold p-4 text-center text-green-800 bg-green-200">
              What is EcoCompute? 🌍
            </h2>
            <div className="flex justify-center bg-black">
              <div className="w-full aspect-video">
                <ReactPlayer
                  url="https://youtu.be/JjOpGL7QK-4"
                  playing={false}
                  width="100%"
                  height="100%"
                />
              </div>
            </div>
            <div className="p-4 bg-green-200">
              <p className="text-sm text-green-800 text-center font-medium">
                Join us in our eco-friendly adventure to make sustainable computing! 🌱💻
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-blue-300 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-4xl">🌊</span>
          </div>
        </div>
      </div>
    </div>
  )
}