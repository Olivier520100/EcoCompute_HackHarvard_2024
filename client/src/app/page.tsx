'use client'

import dynamic from "next/dynamic"
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false })
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf, TreePine } from "lucide-react"
import Image from "next/image"
import logo from "@/lib/LogoGif.gif"
import Navbar from "@/components/navbar"

export default function VideoPlayer() {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-green-50 to-blue-100 overflow-hidden">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl shadow-xl p-4 w-full h-full max-w-[1400px] max-h-[calc(100vh-6rem)] overflow-auto">
          <div className="flex flex-col lg:flex-row h-full">
            <div className="flex flex-col items-center justify-center lg:w-2/5 p-4 space-y-6">
              <div className="w-64 h-64 md:w-80 md:h-80 relative">
                <Image
                  src={logo}
                  alt="EcoCompute Logo Animation"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div className="flex flex-col space-y-4 w-full max-w-xs">
                <Link href="/dashboard" className="w-full">
                  <Button className="w-full h-12 text-base bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md transition-all hover:scale-105">
                    <Leaf className="mr-2 h-5 w-5" />
                    Eco Dashboard
                  </Button>
                </Link>
                <Link href="/computing" className="w-full">
                  <Button className="w-full h-12 text-base bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md transition-all hover:scale-105">
                    <TreePine className="mr-2 h-5 w-5" />
                    Eco Computing
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-3/5 p-4 flex flex-col justify-center space-y-4 overflow-auto">
              <h2 className="text-2xl font-bold text-green-800 text-center lg:text-left">
                What is EcoCompute? 🌍
              </h2>
              <p className="text-green-700 text-base leading-relaxed">
                EcoCompute is an innovative platform that combines the power of cloud computing with environmental consciousness. Our mission is to provide efficient, scalable computing solutions while minimizing the carbon footprint of digital operations. By leveraging renewable energy sources and optimizing resource allocation, we're paving the way for a more sustainable future in the tech industry.
              </p>
              <div className="w-full max-w-2xl mx-auto aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
                <ReactPlayer
                  url="https://youtu.be/JjOpGL7QK-4"
                  playing={false}
                  width="100%"
                  height="100%"
                  controls={true}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}