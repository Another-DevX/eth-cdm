import { NextResponse } from 'next/server';
import { Badge, BadgesResponse } from '../interfaces';

export async function GET() {
  // Mock response for user badges
  const mockBadges: Badge[] = [
    {
      id: 1,
      name: "Early Adopter",
      description: "Joined during the platform's beta phase",
      points: 100,
      dateEarned: "2024-04-15T10:30:00Z",
      imageUrl: "/badges/early-adopter.png"
    },
    {
      id: 2,
      name: "Community Builder",
      description: "Contributed to community growth and engagement",
      points: 250,
      dateEarned: "2024-04-28T14:45:00Z",
      imageUrl: "/badges/community-builder.png"
    },
    {
      id: 3,
      name: "Knowledge Sharer",
      description: "Shared valuable insights with the community",
      points: 150,
      dateEarned: "2024-05-01T09:15:00Z",
      imageUrl: "/badges/knowledge-sharer.png"
    }
  ];

  const response: BadgesResponse = {
    success: true,
    badges: mockBadges
  };

  return NextResponse.json(response);
}
