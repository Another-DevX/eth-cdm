'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { rewardsService } from '@/services';
import { Badge } from '@/app/api/talent/interfaces';

interface BadgeContextType {
  onchainScore: number;
  developerScore: number;
  learningScore: number;
  onchainBadges: Badge[];
  developerBadges: Badge[];
  learningBadges: Badge[];
  isLoading: boolean;
  error: Error | null;
  fetchBadges: (userId: string) => Promise<void>;
}

const BadgeContext = createContext<BadgeContextType | undefined>(undefined);

export function BadgeProvider({ children }: { children: ReactNode }) {
  const [onchainScore, setOnchainScore] = useState<number>(0);
  const [developerScore, setDeveloperScore] = useState<number>(0);
  const [learningScore, setLearningScore] = useState<number>(0);
  const [onchainBadges, setOnchainBadges] = useState<Badge[]>([]);
  const [developerBadges, setDeveloperBadges] = useState<Badge[]>([]);
  const [learningBadges, setLearningBadges] = useState<Badge[]>([]);
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
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch badges'));
      console.error('Error fetching badges:', err);
    } finally {
      setIsLoading(false);
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
        isLoading,
        error,
        fetchBadges
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
