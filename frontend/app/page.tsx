'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SparklesCore } from '@/components/ui/sparkles';
import { FlipWords } from '@/components/ui/flip-words';
import { sansation } from './fonts/fonts';
import { HeroHighlight } from '@/components/ui/hero-highlight';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const handleClick = () => {
      router.push('/dashboard');
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);

  const words = ['Platonautas', 'Platonautas', 'Platonautas'];

  return (
    <main className='min-h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden'>
        <h1
          className={`${sansation.className} md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20 tracking-wider`}
        >
          Platonautas
        </h1>
        <div className="text-center mt-2">
          <div className="text-lg md:text-xl font-normal text-white">
            Tu puerta a la{' '}
            <FlipWords 
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent" 
              words={['Web3', 'Blockchain', 'Innovación']} 
            />
          </div>
        </div>
        <div className='w-[40rem] h-40 relative mt-4'>
          {/* Gradients */}
          <div className='absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent h-[2px] w-3/4 blur-sm' />
          <div className='absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent h-px w-3/4' />
          <div className='absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-pink-500 to-transparent h-[5px] w-1/4 blur-sm' />
          <div className='absolute inset-x-60 tAceternityop-0 bg-gradient-to-r from-transparent via-pink-500 to-transparent h-px w-1/4' />

          {/* Core component */}
          <SparklesCore
            background='transparent'
            minSize={0.3}
            maxSize={1.5}
            particleDensity={60}
            className='w-full h-full'
            particleColor='#FFFFFF'
            speed={1.5}
          />

          {/* Radial Gradient to prevent sharp edges */}
          <div className='absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]'></div>
        </div>
    </main>
  );
}
