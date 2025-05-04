import axios from 'axios';
import { Badge, UserData } from '../talent/interfaces';

// Define the base URL for the Talent Protocol API
const baseUrl = process.env.TALENT_API_URL;

// Create an axios instance with default configuration
const talentApi = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': process.env.TALENT_API_KEY || ''
  }
});

/**
 * Helper function to parse credential data into Badge interface
 * @param credentialData Raw credential data from API
 * @returns Formatted Badge object
 */
const parseBadgeData = (credentialData: any): Badge => {
  return {
    badgeName: credentialData.name || 'Unknown Badge',
    badgeSlug: credentialData.slug || 'unknown-badge',
    score: credentialData.points || 0,
    maxScore: credentialData.max_score || 100
  };
};

/**
 * Get badges for a user
 * @returns Promise with badges data
 */
const getBadges = async (): Promise<Badge[]> => {
  try {
    // Comment out the actual API call
    // const response = await talentApi.get<BadgesApiResponse>('/credentials');
    // return response.data.credentials.map(parseBadgeData);

    // Use mock data instead
    const mockData = {
      "credentials": [
        {
          "category": "Activity",
          "data_issuer_name": "text",
          "data_issuer_slug": "text",
          "name": "text",
          "slug": "text",
          "updated_at": "2025-05-02T23:34:32.269Z",
          "points": 1,
          "external_url": "text",
          "uom": "text",
          "max_score": 1,
          "calculating_score": true
        }
      ]
    };

    // Transform the mock data using the helper function
    return mockData.credentials.map(parseBadgeData);
  } catch (error) {
    console.error('Error fetching badges:', error);
    throw error;
  }
};

/**
 * Helper function to parse profile data into UserData interface
 * @param profileData Raw profile data from API
 * @returns Formatted UserData object
 */
const parseUserData = (profileData: any): UserData => {
  return {
    userId: profileData.id || '',
    userName: profileData.display_name || profileData.name || 'Anonymous User',
    image: profileData.image_url
  };
};

/**
 * Get user data by wallet address
 * @param address Wallet address of the user
 * @param queryParams Optional query parameters for the API request
 * @returns Promise with user data
 */
const getUserByAddress = async (address: string): Promise<UserData> => {
  try {
    // Prepare the search query with the wallet address
    const searchQuery = {
      query: {
        walletAddresses: [address]
      },
      sort: {
        id: {
          order: "asc"
        }
      },
      page: 1,
      per_page: 25
    };

    // Make the API call with the search query
    const response = await talentApi.post('/search/advanced/profiles', searchQuery);

    // Check if profiles exist in the response
    if (!response.data.profiles || response.data.profiles.length === 0) {
      throw new Error('No user found with the provided wallet address');
    }

    // Parse and return the user data
    return parseUserData(response.data.profiles[0]);
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

// Export the service methods as an object
export const talentProtocolService = {
  getBadges,
  getUserByAddress
};
