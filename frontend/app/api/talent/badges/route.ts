import { NextResponse } from 'next/server';
import { BadgesResponse } from '../interfaces';
import { talentProtocol } from '../../services';
import { calculateScores } from '../helpers';

export async function GET() {
  try {
    // Get badges from the Talent Protocol service
    const badges = await talentProtocol.getBadges();
    
    // Calculate all scores in a single iteration
    const { onchainActivity, developer, learning } = calculateScores(badges);
    
    const response: BadgesResponse = {
      badges: badges,
      onchainActivity,
      developer,
      learning
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
