import { NextResponse } from 'next/server';
import { UserData, UserResponse } from '../interfaces';

export async function GET() {
  // Mock response for user ID
  const mockUserData: UserData = {
    userId: "usr_12345abcde",
    username: "platohedro_user",
    joinDate: "2024-03-10T08:00:00Z",
    totalPoints: 500,
    level: 3
  };

  const response: UserResponse = {
    success: true,
    user: mockUserData
  };

  return NextResponse.json(response);
}
