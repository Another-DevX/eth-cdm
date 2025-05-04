'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Clock,
  Coins,
  CheckCircle2,
  Sun,
  Moon,
  Activity,
  Code2,
  GraduationCap,
} from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { EvervaultCard, Icon } from './ui/evervault-card';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { getPlatoCoinBalance } from '@/services/platoCoin';
import { Skeleton } from '@/components/ui/skeleton';
import { formatEther } from 'viem';

interface Badge {
  name: string;
  points: number;
  icon: React.ReactNode;
  color: string;
}

const mockBadges: Badge[] = [
  {
    name: 'Onchain Activity',
    points: 100,
    icon: <Activity className='w-12 h-12 text-purple-500' />,
    color: 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]',
  },
  {
    name: 'Developer',
    points: 200,
    icon: <Code2 className='w-12 h-12 text-purple-500' />,
    color: 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]',
  },
  {
    name: 'Learning',
    points: 150,
    icon: <GraduationCap className='w-12 h-12 text-purple-500' />,
    color: 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]',
  },
];

const SEASON_START_DATE = new Date('2024-01-01T00:00:00');
const SEASON_END_DATE = new Date('2025-12-31T23:59:59');

export function Dashboard() {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [canClaim, setCanClaim] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { address } = useAccount();

  const { data: platoCoinBalance, isLoading: isPlatoCoinBalanceLoading } = useQuery({
    queryKey: ['platoCoinBalance', address],
    queryFn: () => getPlatoCoinBalance(address as `0x${string}`),
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const totalDuration =
        SEASON_END_DATE.getTime() - SEASON_START_DATE.getTime();
      const elapsed = now.getTime() - SEASON_START_DATE.getTime();
      const remaining = SEASON_END_DATE.getTime() - now.getTime();

      const progressPercentage = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(progressPercentage);

      if (remaining <= 0) {
        setTimeLeft('Season ended');
        setCanClaim(true);
        return;
      }

      const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const totalPoints = mockBadges.reduce((sum, badge) => sum + badge.points, 0);
  const totalPlatoCoins = totalPoints * 10;

  const handleClaim = () => {
    alert(`You have claimed ${totalPlatoCoins} PlatoCoins!`);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className='min-h-screen p-8 bg-background'>
      <div className='container mx-auto max-w-6xl'>
        <div className='flex justify-end mb-6'>
          <Button
            onClick={toggleTheme}
            variant='outline'
            size='icon'
            className='rounded-full border-purple-500/50 text-purple-500 hover:bg-purple-500/10 transition-all duration-300 hover:scale-110'
          >
            {theme === 'dark' ? (
              <Sun className='h-5 w-5' />
            ) : (
              <Moon className='h-5 w-5' />
            )}
          </Button>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='lg:col-span-2'
          >
            <Card className='border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)] bg-background/80 backdrop-blur-sm hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-all duration-300'>
              <CardHeader className='border-b border-purple-500/10'>
                <div className='flex items-center space-x-2'>
                  <Trophy className='w-6 h-6 text-purple-500' />
                  <CardTitle className='text-foreground'>
                    Your Achievements
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className='p-6'>
                <div className='flex flex-col md:flex-row gap-6 justify-center items-center'>
                  {mockBadges.map((badge, index) => (
                    <motion.div
                      key={badge.name}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      className='relative flex flex-col items-center justify-between w-80 h-96 p-4 group'
                    >
                      {/* Borde gradiente exterior */}
                      <div className='rounded-3xl p-1 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-700 shadow-[0_0_40px_rgba(168,85,247,0.3)] w-full'>
                        <div className='rounded-2xl bg-black w-full h-full flex items-center justify-center'>
                          <EvervaultCard>
                            <div className='flex flex-col items-center justify-center w-full'>
                              <div className='mb-2'>{badge.icon}</div>
                              <span className='text-lg font-bold text-black dark:text-white text-center'>
                                {badge.name}
                              </span>
                              <span className='text-base text-purple-500 font-semibold'>
                                {badge.points} puntos
                              </span>
                            </div>
                          </EvervaultCard>
                        </div>
                      </div>
                      <div className='w-full mt-6 flex flex-col items-center'>
                        <p className='text-sm text-gray-400 text-center mb-4'>
                          ¡Reclama este badge por tu logro destacado!
                        </p>
                        <Button
                          className='w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 border-0'
                          onClick={() =>
                            alert(`¡Has reclamado el badge: ${badge.name}!`)
                          }
                        >
                          Reclamar Badge
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className='border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)] bg-background/80 backdrop-blur-sm hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-all duration-300 h-full'>
              <CardHeader className='border-b border-purple-500/10'>
                <div className='flex items-center space-x-2'>
                  <Clock className='w-6 h-6 text-purple-500' />
                  <CardTitle className='text-foreground'>
                    Season Progress
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className='p-6'>
                <div className='space-y-6'>
                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-purple-300'>Time Remaining</span>
                      <span className='text-purple-500 font-medium'>
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className='h-2 bg-purple-500/10 rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-purple-500 rounded-full transition-all duration-300'
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <div className='text-center space-y-4'>
                    <p className='text-3xl font-bold text-purple-500'>
                      {timeLeft}
                    </p>
                    <div className='text-sm text-purple-300 space-y-2'>
                      <p className='bg-purple-500/10 p-2 rounded-lg'>
                        Start: {formatDate(SEASON_START_DATE)}
                      </p>
                      <p className='bg-purple-500/10 p-2 rounded-lg'>
                        End: {formatDate(SEASON_END_DATE)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className='border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)] bg-background/80 backdrop-blur-sm hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-all duration-300 h-full'>
              <CardHeader className='border-b border-purple-500/10'>
                <div className='flex items-center space-x-2'>
                  <Coins className='w-6 h-6 text-purple-500' />
                  <CardTitle className='text-foreground'>
                    Your Rewards
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className='p-6'>
                <div className='space-y-6'>
                  <div className='flex justify-between items-center p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300'>
                    <div className='flex items-center space-x-3'>
                      <Coins className='w-6 h-6 text-purple-500' />
                      <span className='font-medium text-foreground'>
                        Total PlatoCoins
                      </span>
                    </div>
                    {isPlatoCoinBalanceLoading ? (
                      <Skeleton className="h-8 w-24 bg-purple-500/20" />
                    ) : (
                      <span className='text-2xl font-bold text-purple-500'>
                        {formatEther(platoCoinBalance || BigInt(0))}
                      </span>
                    )}
                  </div>
                  <Button
                    onClick={handleClaim}
                    disabled={!canClaim}
                    className={`w-full transition-all duration-300 ${
                      canClaim
                        ? 'bg-purple-500/90 hover:bg-purple-500 border border-purple-400/50 hover:scale-[1.02]'
                        : 'bg-gray-400/50 cursor-not-allowed'
                    }`}
                  >
                    <div className='flex items-center space-x-2'>
                      {canClaim ? (
                        <>
                          <CheckCircle2 className='w-5 h-5' />
                          <span>Claim Your PlatoCoins</span>
                        </>
                      ) : (
                        <>
                          <Clock className='w-5 h-5' />
                          <span>Waiting for season end</span>
                        </>
                      )}
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
