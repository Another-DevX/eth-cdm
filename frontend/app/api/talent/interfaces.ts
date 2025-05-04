// User badge interface
export interface Badge {
  id: number;
  name: string;
  description: string;
  points: number;
  dateEarned: string;
  imageUrl: string;
}

// User data interface
export interface UserData {
  userId: string;
  username: string;
  joinDate: string;
  totalPoints: number;
  level: number;
}

// Response interfaces
export interface BadgesResponse {
  success: boolean;
  badges: Badge[];
}

export interface UserResponse {
  success: boolean;
  user: UserData;
}
