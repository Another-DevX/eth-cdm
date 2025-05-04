import { NextResponse } from 'next/server';
import { BadgesResponse, Badge, BadgeApiResponse } from '../interfaces';
import { talentProtocol } from '../../services';
import {
  calculateScores,
  calculateOnchainActivityScore,
  calculateDeveloperScore,
  calculateLearningScore,
  convertApiResponseToBadge
} from '../helpers';
import badgesData from './badges.json';

export async function GET(request: Request) {
  try {
    // Get userId from query parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    // Return error if userId is not provided
    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Comment out the actual API call
    // const badges = await talentProtocol.getBadges(userId);

    // Use mock data from badges.json instead
    const badges: BadgeApiResponse[] = badgesData

    // Option 2: Convert from API format (commented out as example)
    // const apiResponses: BadgeApiResponse[] = badgesData.badgesApi;
    // const badgesFromApi: Badge[] = apiResponses.map(convertApiResponseToBadge);

    const { 
      onchainActivity: onchainScore, 
      onchainBadges,
      developer: developerScore, 
      developerBadges,
      learning: learningScore,
      learningBadges
    } = calculateScores(badges);

    const response: BadgesResponse = {
      badges: badges,
      scores: {
        onchain: onchainScore,
        developer: developerScore,
        learning: learningScore
      },
      categorizedBadges: {
        onchain: onchainBadges,
        developer: developerBadges,
        learning: learningBadges
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching badges:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch badges'
      },
      { status: 500 }
    );
  }
}
