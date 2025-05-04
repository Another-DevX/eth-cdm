// API response interface for badges
export interface BadgeApiResponse {
  'Data Issuer': string;
  'Credential Name': string;
  valueRange: {
    min: number;
    max: number;
  };
}

// User badge interface - extends BadgeApiResponse to include all properties
export interface Badge extends Partial<BadgeApiResponse> {
  badgeName: string;
  badgeSlug: string;
  score: number;
  maxScore: number;
  [key: string]: any; // Allow any additional properties
}

// User data interface
export interface UserData {
  userId: string;
  userName: string;
  image: string | null;
}

// Response interfaces
export interface BadgesResponse {
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

export interface UserResponse {
  user: UserData;
}
