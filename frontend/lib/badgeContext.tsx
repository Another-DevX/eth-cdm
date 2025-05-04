'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { rewardsService } from '@/services';
import { Badge } from '@/app/api/talent/interfaces';
import axios from 'axios';

interface BadgeContextType {
  onchainScore: number;
  developerScore: number;
  learningScore: number;
  onchainBadges: Badge[];
  developerBadges: Badge[];
  learningBadges: Badge[];
  platoCoinBalance: bigint;
  isLoading: boolean;
  error: Error | null;
  fetchBadges: (userId: string) => Promise<void>;
  getCurrentWithdrawAmount: () => Promise<bigint>;
}

const BadgeContext = createContext<BadgeContextType | undefined>(undefined);

export function BadgeProvider({ children }: { children: ReactNode }) {
  const [onchainScore, setOnchainScore] = useState<number>(0);
  const [developerScore, setDeveloperScore] = useState<number>(0);
  const [learningScore, setLearningScore] = useState<number>(0);
  const [onchainBadges, setOnchainBadges] = useState<Badge[]>([]);
  const [developerBadges, setDeveloperBadges] = useState<Badge[]>([]);
  const [learningBadges, setLearningBadges] = useState<Badge[]>([]);
  const [platoCoinBalance, setPlatoCoinBalance] = useState<bigint>(BigInt(0));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBadges = async (userId: string) => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch all badge types in parallel
      const [onchainData, developerData, learningData] = await Promise.all([
        rewardsService.getOnchainBadges(userId),
        rewardsService.getDeveloperBadges(userId),
        rewardsService.getLearningBadges(userId)
      ]);
      
      // Update state with fetched data
      setOnchainScore(onchainData.score);
      setDeveloperScore(developerData.score);
      setLearningScore(learningData.score);
      
      setOnchainBadges(onchainData.badges);
      setDeveloperBadges(developerData.badges);
      setLearningBadges(learningData.badges);
      
      // Also fetch the current withdraw amount
      const withdrawAmount = await getCurrentWithdrawAmount();
      setPlatoCoinBalance(withdrawAmount);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch badges'));
      console.error('Error fetching badges:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Get the current withdraw amount from the API
   * @returns Promise with the current withdraw amount as bigint
   */
  const getCurrentWithdrawAmount = async (): Promise<bigint> => {
    try {
      const response = await axios.get('/api/talent/badges');
      const amount = response.data.currentWithdrawAmount || 0;
      setPlatoCoinBalance(BigInt(amount));
      return BigInt(amount);
    } catch (err) {
      console.error('Error fetching withdraw amount:', err);
      return BigInt(0);
    }
  };

  return (
    <BadgeContext.Provider
      value={{
        onchainScore,
        developerScore,
        learningScore,
        onchainBadges,
        developerBadges,
        learningBadges,
        platoCoinBalance,
        isLoading,
        error,
        fetchBadges,
        getCurrentWithdrawAmount
      }}
    >
      {children}
    </BadgeContext.Provider>
  );
}

export function useBadges() {
  const context = useContext(BadgeContext);
  if (context === undefined) {
    throw new Error('useBadges must be used within a BadgeProvider');
  }
  return context;
}
