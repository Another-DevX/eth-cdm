import axios from 'axios';
import { Badge } from '../app/api/talent/interfaces';

// Base URL for API calls
const API_BASE_URL = '/api/talent/badges';

// Interface for badge response
interface BadgeResponse {
  score: number;
  badges: Badge[];
}

// Interface for all badges response
interface AllBadgesResponse {
  badges: Badge[];
  scores?: {
    onchain: number;
    developer: number;
    learning: number;
  };
  categorizedBadges?: {
    onchain: Badge[];
    developer: Badge[];
    learning: Badge[];
  };
}

/**
 * Rewards service for fetching badge data and claiming rewards
 */
const rewardsService = {
  /**
   * Get all badges for a user
   * @param userId User ID
   * @returns Promise with all badges data
   */
  getAllBadges: async (userId: string): Promise<AllBadgesResponse> => {
    try {
      const response = await axios.get<AllBadgesResponse>(`${API_BASE_URL}`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all badges:', error);
      throw error;
    }
  },

  /**
   * Get onchain badges for a user
   * @param userId User ID
   * @returns Promise with onchain badges data
   */
  getOnchainBadges: async (userId: string): Promise<BadgeResponse> => {
    try {
      const response = await axios.get<BadgeResponse>(`${API_BASE_URL}/onchain`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching onchain badges:', error);
      throw error;
    }
  },

  /**
   * Get developer badges for a user
   * @param userId User ID
   * @returns Promise with developer badges data
   */
  getDeveloperBadges: async (userId: string): Promise<BadgeResponse> => {
    try {
      const response = await axios.get<BadgeResponse>(`${API_BASE_URL}/developer`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching developer badges:', error);
      throw error;
    }
  },

  /**
   * Get learning badges for a user
   * @param userId User ID
   * @returns Promise with learning badges data
   */
  getLearningBadges: async (userId: string): Promise<BadgeResponse> => {
    try {
      const response = await axios.get<BadgeResponse>(`${API_BASE_URL}/learning`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching learning badges:', error);
      throw error;
    }
  },

  /**
   * Claim rewards for a specific badge category
   * @param category Badge category (onchain, developer, learning)
   * @param userId User ID to claim rewards for
   * @returns Promise with claim response
   */
  claimRewards: async (category: 'onchain' | 'developer' | 'learning', userId?: string): Promise<any> => {
    try {
      const response = await axios.post(`${API_BASE_URL}`, {
        category,
        userId
      });
      return response.data;
    } catch (error) {
      console.error(`Error claiming ${category} rewards:`, error);
      throw error;
    }
  }
};

export default rewardsService;
