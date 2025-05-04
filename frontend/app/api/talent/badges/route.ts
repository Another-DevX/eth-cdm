import { NextResponse } from 'next/server';
import { BadgesResponse, Badge } from '../interfaces';
import { talentProtocol } from '../../services';

export async function GET() {
  try {
    // Get badges from the Talent Protocol service
    const badges = await talentProtocol.getBadges();
    
    // Calculate onchain activity score
    const onchainActivity = calculateOnchainActivityScore(badges);
    
    // Calculate developer score
    const developer = calculateDeveloperScore(badges);
    
    // Calculate learning score
    const learning = calculateLearningScore(badges);
    
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

/**
 * Calculate onchain activity score from badges
 * @param badges Array of badges
 * @returns Total score for onchain activity
 */
function calculateOnchainActivityScore(badges: Badge[]): number {
  const onchainActivityKeywords = ["onchain-activity"];
  
  return badges.reduce((total, badge) => {
    // Check if the badge slug contains any of the onchain activity keywords
    const isOnchainActivity = onchainActivityKeywords.some(keyword => 
      badge.badgeSlug.toLowerCase().includes(keyword.toLowerCase())
    );
    
    // Add the score if it's an onchain activity badge
    return isOnchainActivity ? total + badge.score : total;
  }, 0);
}

/**
 * Calculate developer score from badges
 * @param badges Array of badges
 * @returns Total score for developer activities
 */
function calculateDeveloperScore(badges: Badge[]): number {
  const developerKeywords = ["eth global", "github", "developerdao", "devfolio", "build"];
  
  return badges.reduce((total, badge) => {
    // Check if the badge slug contains any of the developer keywords
    const isDeveloperBadge = developerKeywords.some(keyword => 
      badge.badgeSlug.toLowerCase().includes(keyword.toLowerCase())
    );
    
    // Add the score if it's a developer badge
    return isDeveloperBadge ? total + badge.score : total;
  }, 0);
}

/**
 * Calculate learning score from badges
 * @param badges Array of badges
 * @returns Total score for learning activities
 */
function calculateLearningScore(badges: Badge[]): number {
  const learningKeywords = ["base", "stack"];
  
  return badges.reduce((total, badge) => {
    // Check if the badge slug contains any of the learning keywords
    const isLearningBadge = learningKeywords.some(keyword => 
      badge.badgeSlug.toLowerCase().includes(keyword.toLowerCase())
    );
    
    // Add the score if it's a learning badge
    return isLearningBadge ? total + badge.score : total;
  }, 0);
}
