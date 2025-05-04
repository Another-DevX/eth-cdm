import { NextResponse } from 'next/server';
import { talentProtocol } from '../../../services';
import { calculateLearningScore } from '../../helpers';
import badgesData from '../badges.json';
import { Badge, BadgeApiResponse } from '../../interfaces';

/**
 * GET handler for learning score
 * Returns the calculated learning score from user badges
 */
export async function GET(request: Request) {
  try {
    // Get userId from query parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    // Return error if userId is not provided
    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required', success: false },
        { status: 400 }
      );
    }

    // Comment out the actual API call
    // const badges = await talentProtocol.getBadges(userId);

    // Use mock data from badges.json instead
    const badges: BadgeApiResponse[] = badgesData


    // Calculate learning score using the dedicated function
    const { score, badges: matchingBadges } = calculateLearningScore(badges);

    return NextResponse.json({
      score,
      badges: matchingBadges,
    });
  } catch (error) {
    console.error('Error fetching learning score:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch learning score',
        success: false
      },
      { status: 500 }
    );
  }
}
