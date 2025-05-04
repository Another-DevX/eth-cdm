import { Badge } from '../interfaces';

/**
 * Calculate all scores from badges in a single iteration
 * @param badges Array of badges
 * @returns Object containing all calculated scores
 */
export function calculateScores(badges: Badge[]) {
  const onchainActivityKeywords = ["onchain-activity"];
  const developerKeywords = ["eth global", "github", "developerdao", "devfolio", "build"];
  const learningKeywords = ["base", "stack"];
  
  // Initialize scores
  const scores = {
    onchainActivity: 0,
    developer: 0,
    learning: 0
  };
  
  // Single iteration through badges
  badges.forEach(badge => {
    const badgeSlug = badge.badgeSlug.toLowerCase();
    
    // Check for onchain activity
    if (onchainActivityKeywords.some(keyword => badgeSlug.includes(keyword.toLowerCase()))) {
      scores.onchainActivity += badge.score;
    }
    
    // Check for developer activity
    if (developerKeywords.some(keyword => badgeSlug.includes(keyword.toLowerCase()))) {
      scores.developer += badge.score;
    }
    
    // Check for learning activity
    if (learningKeywords.some(keyword => badgeSlug.includes(keyword.toLowerCase()))) {
      scores.learning += badge.score;
    }
  });
  
  return scores;
}
