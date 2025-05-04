import { Badge, BadgeApiResponse } from '../interfaces';
import keywordsData from './keywords.json';

// Extract keywords from JSON file
const onchainActivityKeywords = keywordsData.onchain;
const developerKeywords = keywordsData.developer;
const learningKeywords = keywordsData.learning;



/**
 * Calculate onchain activity score from badges
 * @param badges Array of badges
 * @returns Object with score and matching badges array
 */
export function calculateOnchainActivityScore(badges: BadgeApiResponse[]): { score: number, badges: Badge[] } {
  const matchingBadges: Badge[] = [];
  const score = badges.reduce((total, badge) => {
    const credentialName = badge['Credential Name']?.toLowerCase();
    if (onchainActivityKeywords.some(keyword => credentialName.includes(keyword.toLowerCase()))) {
      // Add to matching badges array
      matchingBadges.push({
        ...badge,
        badgeName: badge['Credential Name'] || '',
        badgeSlug: (badge['Credential Name'] || '').toLowerCase().replace(/\s+/g, '-'),
        score: badge.valueRange?.min || 0,
        maxScore: badge.valueRange?.max || 0
      });
      return total + (badge.valueRange?.min || 0);
    }
    return total;
  }, 0);

  return { score, badges: matchingBadges };
}

/**
 * Calculate developer score from badges
 * @param badges Array of badges
 * @returns Object with score and matching badges array
 */
export function calculateDeveloperScore(badges: BadgeApiResponse[]): { score: number, badges: Badge[] } {
  const matchingBadges: Badge[] = [];
  const score = badges.reduce((total, badge) => {
    const credentialName = badge['Credential Name']?.toLowerCase();
    if (developerKeywords.some(keyword => credentialName.includes(keyword.toLowerCase()))) {
      // Add to matching badges array
      matchingBadges.push({
        ...badge,
        badgeName: badge['Credential Name'] || '',
        badgeSlug: (badge['Credential Name'] || '').toLowerCase().replace(/\s+/g, '-'),
        score: badge.valueRange?.min || 0,
        maxScore: badge.valueRange?.max || 0
      });
      return total + (badge.valueRange?.min || 0);
    }
    return total;
  }, 0);

  return { score, badges: matchingBadges };
}

/**
 * Calculate learning score from badges
 * @param badges Array of badges
 * @returns Object with score and matching badges array
 */
export function calculateLearningScore(badges: BadgeApiResponse[]): { score: number, badges: Badge[] } {
  const matchingBadges: Badge[] = [];
  const score = badges.reduce((total, badge) => {
    const credentialName = badge['Credential Name']?.toLowerCase();
    if (learningKeywords.some(keyword => credentialName.includes(keyword.toLowerCase()))) {
      // Add to matching badges array
      matchingBadges.push({
        ...badge,
        badgeName: badge['Credential Name'] || '',
        badgeSlug: (badge['Credential Name'] || '').toLowerCase().replace(/\s+/g, '-'),
        score: badge.valueRange?.min || 0,
        maxScore: badge.valueRange?.max || 0
      });
      return total + (badge.valueRange?.min || 0);
    }
    return total;
  }, 0);

  return { score, badges: matchingBadges };
}

/**
 * Calculate all scores from badges
 * @param badges Array of badges
 * @returns Object containing all calculated scores and matching badges
 */
export function calculateScores(badges: BadgeApiResponse[]) {
  const onchainResults = calculateOnchainActivityScore(badges);
  const developerResults = calculateDeveloperScore(badges);
  const learningResults = calculateLearningScore(badges);

  return {
    onchainActivity: onchainResults.score,
    onchainBadges: onchainResults.badges,
    developer: developerResults.score,
    developerBadges: developerResults.badges,
    learning: learningResults.score,
    learningBadges: learningResults.badges
  };
}

/**
 * Convert BadgeApiResponse to Badge
 * @param apiResponse Badge API response
 * @returns Converted Badge object
 */
export function convertApiResponseToBadge(apiResponse: BadgeApiResponse): Badge {
  return {
    // Required Badge properties
    badgeName: apiResponse['Credential Name'],
    badgeSlug: apiResponse['Credential Name'].toLowerCase().replace(/\s+/g, '-'),
    score: apiResponse.valueRange.min,
    maxScore: apiResponse.valueRange.max,

    // Include all original BadgeApiResponse properties
    'Data Issuer': apiResponse['Data Issuer'],
    'Credential Name': apiResponse['Credential Name'],
    valueRange: apiResponse.valueRange
  };
}
