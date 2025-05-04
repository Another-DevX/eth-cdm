'use client';

import { rewardsService } from '@/services';

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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { getPlatoCoinBalance } from '@/services/platoCoin';
import { useBadges } from '@/lib/badgeContext';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';
import { formatEther } from 'viem';
import { toast } from "sonner";
import { BadgeRevealEffect } from './BadgeRevealEffect';
import { PlatoCoinsClaimEffect } from './PlatoCoinsClaimEffect';

interface Badge {
  name: string;
  points: number;
  icon: React.ReactNode;
  color: string;
}


const SEASON_START_DATE = new Date('2024-01-01T00:00:00');
const SEASON_END_DATE = new Date('2025-12-31T23:59:59');

export function Dashboard() {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [canClaim, setCanClaim] = useState(false);
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);
  const [temporaryHover, setTemporaryHover] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [showPlatoCoinsEffect, setShowPlatoCoinsEffect] = useState(false);
  const [claimedBadges, setClaimedBadges] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const { address } = useAccount();


  // Get badge data from context
  const {
    onchainScore,
    developerScore,
    learningScore,
    isLoading: isBadgesLoading,
    error: badgesError,
    fetchBadges,
    platoCoinBalance,
    resetPlatoCoinBalance
  } = useBadges();


  // Fetch badge data on mount - only once when address is available
  useEffect(() => {
    if (address && !onchainScore && !developerScore && !learningScore) {
      fetchBadges(address);
    }
  }, [address, fetchBadges, onchainScore, developerScore, learningScore]);

  useEffect(() => {
    let hoverTimeout: NodeJS.Timeout;
    let hoverTimeoutNullifier = false;
    const timer = setInterval(() => {
      const now = new Date();
      const totalDuration =
        SEASON_END_DATE.getTime() - SEASON_START_DATE.getTime();
      const elapsed = now.getTime() - SEASON_START_DATE.getTime();
      const remaining = SEASON_END_DATE.getTime() - now.getTime();

      const progressPercentage = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(progressPercentage);

      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }

      if (!hoverTimeoutNullifier) {
        hoverTimeoutNullifier = true;
        setTemporaryHover(true);
        hoverTimeout = setTimeout(() => {
          setTemporaryHover(false);
        }, 200);
      }

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

    return () => {
      clearInterval(timer);
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, []);

  const totalPoints = onchainScore + developerScore + learningScore;
  const totalPlatoCoins = totalPoints * 10;

  const handleClaim = async (badge: Badge) => {
    try {
      // Determine category from badge name
      let category: 'onchain' | 'developer' | 'learning';

      if (badge.name === 'Onchain Activity') {
        category = 'onchain';
      } else if (badge.name === 'Developer') {
        category = 'developer';
      } else if (badge.name === 'Learning') {
        category = 'learning';
      } else {
        throw new Error(`Unknown badge type: ${badge.name}`);
      }

      // Call the claim API directly
      const result = await axios.post('/api/talent/badges', {
        category,
        userId: address
      });

      // Show success message
      toast.success(`Claimed ${result.data.data.rewardType}: ${result.data.data.currentWithdrawAmount}`);

      // Set the selected badge for animation
      setSelectedBadge(badge);

      // Add badge to claimed badges
      setClaimedBadges(prev => [...prev, badge.name]);
      
      // Refetch badges and points
      queryClient.invalidateQueries({ queryKey: ['badges'] });
      fetchBadges(address as string);
    } catch (error) {
      console.error('Error claiming badge:', error);
      toast.error('Failed to claim badge. Please try again.');
    }
  };

  const handleCloseReveal = () => {
    setSelectedBadge(null);
  };

  const handlePlatoCoinsClaim = async () => {
    try {
      await rewardsService.claim(address as `0x${string}`);
      setShowPlatoCoinsEffect(true);
      resetPlatoCoinBalance();
      // Refetch badges and points after claiming
      fetchBadges(address as string);
    } catch (error) {
      console.error('Error claiming PlatoCoins:', error);
      toast.error('Failed to claim PlatoCoins. Please try again.');
    }
  };

  const handleClosePlatoCoinsEffect = () => {
    setShowPlatoCoinsEffect(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const resetClaimedBadges = () => {
    setClaimedBadges([]);
  };

  useEffect(() => {
    toast(
      <span>
        Roadmap: <a href="/roadmap" className="text-purple-400 underline">Ver Roadmap</a>
      </span>
    );
  }, []);

  return (
    <div className='min-h-screen p-8 bg-background'>
      <div className='container mx-auto max-w-6xl'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='lg:col-span-2'
          >
            <Card className='border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)] bg-background/80 backdrop-blur-sm hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-all duration-300'>
              <CardHeader className='border-b border-purple-500/10'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <Trophy className='w-6 h-6 text-purple-500' />
                    <CardTitle className='text-foreground'>
                      Your Achievements
                    </CardTitle>
                  </div>
                  {claimedBadges.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetClaimedBadges}
                      className="text-purple-500 hover:text-purple-600"
                    >
                      Reset Badges
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className='p-6'>
                <div className='flex flex-col md:flex-row gap-8 justify-center items-center'>
                  {[
                    {
                      name: 'Onchain Activity',
                      points: onchainScore,
                      icon: <Activity className='w-12 h-12 text-purple-500' />,
                      color: 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]',
                    },
                    {
                      name: 'Developer',
                      points: developerScore,
                      icon: <Code2 className='w-12 h-12 text-purple-500' />,
                      color: 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]',
                    },
                    {
                      name: 'Learning',
                      points: learningScore,
                      icon: <GraduationCap className='w-12 h-12 text-purple-500' />,
                      color: 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]',
                    },
                  ].map((badge, index) => (
                    <motion.div
                      key={badge.name}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      className='relative flex flex-col items-center w-80 p-6 space-y-6 group'
                    >
                      <div className='rounded-3xl p-1 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-700 shadow-[0_0_40px_rgba(168,85,247,0.3)] w-full flex-1'>
                        <div className='rounded-2xl bg-black w-full h-full flex items-center justify-center'>
                          <EvervaultCard
                            isHovered={temporaryHover || claimedBadges.includes(badge.name)}
                          >
                            <div className='flex flex-col items-center justify-center w-full'>
                              <div className='mb-2'>{badge.icon}</div>
                              <span className='text-lg font-bold text-black dark:text-white text-center'>
                                {badge.name}
                              </span>
                              <span className='text-base text-purple-500 font-semibold'>
                                {badge.points} points
                              </span>
                              {isBadgesLoading && (
                                <span className='text-xs text-gray-400 mt-1'>Loading...</span>
                              )}
                            </div>
                          </EvervaultCard>
                        </div>
                      </div>
                      <div className='w-full flex flex-col items-center'>
                        <p className='text-sm text-gray-400 text-center mb-4'>
                          Claim this badge for your outstanding achievement!
                        </p>
                        <Button
                          className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 border-0 ${claimedBadges.includes(badge.name) ? 'opacity-50 cursor-not-allowed' :
                            isBadgesLoading ? 'opacity-70 cursor-wait' : ''
                            }`}
                          onClick={() => handleClaim(badge)}
                          disabled={
                            claimedBadges.includes(badge.name) ||
                            isBadgesLoading
                          }
                        >
                          {claimedBadges.includes(badge.name) ? 'Claimed' :
                            isBadgesLoading ? 'Loading...' : 'Claim Badge'}
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
                        Total claimable PlatoCoins
                      </span>
                    </div>
                    {platoCoinBalance ? (
                      <span className='text-2xl font-bold text-purple-500'>
                        {(platoCoinBalance || BigInt(0))}
                      </span>) : (
                      <>  </>
                    )}
                  </div>
                  <Button
                    onClick={handlePlatoCoinsClaim}
                    className={`w-full transition-all duration-300 ${'bg-purple-500/90 hover:bg-purple-500 border border-purple-400/50 hover:scale-[1.02]'}`}
                  >
                    Claim Your PlatoCoins
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {selectedBadge && (
        <BadgeRevealEffect
          isOpen={!!selectedBadge}
          onClose={handleCloseReveal}
          badgeName={selectedBadge.name}
          badgeIcon={selectedBadge.icon}
        />
      )}

      {showPlatoCoinsEffect && (
        <PlatoCoinsClaimEffect
          isOpen={showPlatoCoinsEffect}
          onClose={handleClosePlatoCoinsEffect}
          amount={totalPlatoCoins}
        />
      )}
    </div>
  );
}
