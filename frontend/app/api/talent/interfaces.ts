// User badge interface
export interface Badge {
  badgeName: string;
  badgeSlug: string;
  score: number;
  maxScore: number;
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
  onchainActivity: number;
  developer: number;
  learning: number;
}

export interface UserResponse {
  user: UserData;
}
