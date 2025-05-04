'use client';

import {
  Navbar as ResizableNavbar,
  NavBody,
  MobileNav,
  NavbarButton,
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
          <div className='flex items-center gap-4'>
            <div className='flex flex-col gap-1 w-56'>
              <div className='flex justify-between text-xs'>
                <span className='text-purple-500 font-medium'>Progress</span>
                <span className='text-foreground'>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className='h-1 bg-purple-500/10' />
            </div>
            <div className='text-sm text-purple-500 font-medium'>
              PlatoCoins:{' '}
              <span className='text-foreground'>
                {isLoading
                  ? 'loading...'
                  : formatEther(platoCoinBalance || BigInt(0))}
              </span>
            </div>
          </div>
          <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-8'>
            {navItems.map((item, idx) => (
              <button
                key={`nav-item-${idx}`}
                onClick={item.onClick}
                className='text-sm text-purple-500 font-medium hover:text-purple-400 transition-all duration-300 ease-in-out cursor-pointer hover:scale-105'
              >
                {item.name}
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
            <div className='text-sm text-purple-500 font-medium'>
              PlatoCoins:{' '}
              {isLoading
                ? 'cargando...'
                : formatEther(platoCoinBalance || BigInt(0))}
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
                className='relative text-neutral-600 dark:text-neutral-300 w-full text-left p-2 hover:bg-purple-50 dark:hover:bg-purple-900/10 rounded transition-all duration-300 ease-in-out cursor-pointer hover:scale-105'
              >
                {item.name}
              </button>
            ))}
          </MobileNavMenu>
        </MobileNav>
      </ResizableNavbar>
    </div>
  );
}
