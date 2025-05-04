'use client'

import * as React from "react"
import { Waves } from "@/components/ui/wave-background"
import { sansation } from '../fonts/fonts';

function WavesDemo() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-black">
      {/* Centered content with aspect ratio */}
      <div className="w-full flex flex-col items-center">
        {/* Top border - thin white line */}
        <div className="w-full h-[1px] bg-white/80"></div>
        
        {/* 16:9 container that's full width */}
        <div className="w-[1080px] h-[800px] relative">
          <Waves className="h-full w-full" backgroundColor="transparent" />
        </div>
        
        {/* Bottom border - thin white line */}
        <div className="w-full h-[1px] bg-white/80"></div>
      </div>
      <h1 className={`${sansation.className} text-4xl font-bold text-white mt-4`}>vibe roadmap</h1>
      <p className={`${sansation.className} text-xl text-white mt-2`}>craft with love ❤️ by platohedro org</p>
    </div>
  )
}

export default function RoadmapPage() {
  return <WavesDemo />;
} 