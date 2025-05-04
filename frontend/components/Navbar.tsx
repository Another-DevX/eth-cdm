'use client';

import {
  Navbar as ResizableNavbar,
  NavBody,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '@/components/ui/resizable-navbar';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { getPlatoCoinBalance } from '@/services/platoCoin';
import { formatEther } from 'viem';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Coins } from 'lucide-react';

const SEASON_START_DATE = new Date('2024-01-01T00:00:00');
const SEASON_END_DATE = new Date('2025-12-31T23:59:59');

export function Navbar({
  onTabChange,
}: {
  onTabChange: (tab: string) => void;
}) {
  const { address } = useAccount();
  const { data: platoCoinBalance, isLoading } = useQuery({
    queryKey: ['platoCoinBalance', address],
    queryFn: () => getPlatoCoinBalance(address as `0x${string}`),
    enabled: !!address,
  });

  const [progress, setProgress] = useState<number>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const total = SEASON_END_DATE.getTime() - SEASON_START_DATE.getTime();
      const elapsed = now.getTime() - SEASON_START_DATE.getTime();
      const pct = Math.min(100, (elapsed / total) * 100);
      setProgress(pct);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : 'No conectado';

  const navItems = [
    {
      name: 'Dashboard',
      onClick: () => onTabChange('dashboard'),
    },
    {
      name: 'Liquidity',
      onClick: () => onTabChange('liquidity'),
    },
    {
      name: 'Swap',
      onClick: () => onTabChange('swap'),
    },
  ];

  return (
    <div className='relative w-full sticky top-0 z-50'>
      <ResizableNavbar>
        {/* Desktop Navigation */}
        <NavBody>
          <div className='flex items-center gap-6'>
            <div className='flex flex-col gap-2 w-64'>
              <div className='flex justify-between items-center text-xs'>
                <span className='text-purple-500 font-medium'>Season Progress</span>
                <span className='text-foreground font-semibold'>{Math.round(progress)}%</span>
              </div>
              <div className='relative'>
                <Progress 
                  value={progress} 
                  className='h-2 bg-purple-500/10 rounded-full overflow-hidden' 
                />
                <div 
                  className='absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300'
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className='flex items-center gap-2 text-sm'>
              <Coins className='w-4 h-4 text-purple-500' />
              <span className='text-purple-500 font-medium'>PlatoCoins:</span>
              {isLoading ? (
                <Skeleton className="h-4 w-20 bg-purple-500/20" />
              ) : (
                <span className='text-foreground font-semibold'>
                  {formatEther(platoCoinBalance || BigInt(0))}
                </span>
              )}
            </div>
          </div>
          <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-8'>
            {navItems.map((item, idx) => (
              <button
                key={`nav-item-${idx}`}
                onClick={item.onClick}
                className='text-sm text-purple-500 font-medium hover:text-purple-400 transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 relative group'
              >
                {item.name}
                <span className='absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300' />
              </button>
            ))}
          </div>
          <div className='flex items-center justify-end'>
            <appkit-button />
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <div className='flex items-center gap-2 text-sm'>
              <Coins className='w-4 h-4 text-purple-500' />
              <span className='text-purple-500 font-medium'>PlatoCoins:</span>
              {isLoading ? (
                <Skeleton className="h-4 w-20 bg-purple-500/20" />
              ) : (
                <span className='text-foreground font-semibold'>
                  {formatEther(platoCoinBalance || BigInt(0))}
                </span>
              )}
            </div>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <button
                key={`mobile-nav-${idx}`}
                onClick={() => {
                  item.onClick();
                  setIsMobileMenuOpen(false);
                }}
                className='relative text-neutral-600 dark:text-neutral-300 w-full text-left p-3 hover:bg-purple-50 dark:hover:bg-purple-900/10 rounded-lg transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 flex items-center gap-2'
              >
                <span className='w-1 h-1 rounded-full bg-purple-500' />
                {item.name}
              </button>
            ))}
          </MobileNavMenu>
        </MobileNav>
      </ResizableNavbar>
    </div>
  );
}
