import { NextRequest, NextResponse } from 'next/server';
import { UserResponse } from '../interfaces';
import { talentProtocol } from '../../services';

export async function GET(request: NextRequest) {
  try {
    // Get the wallet address from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const walletAddress = searchParams.get('address');

    if (!walletAddress) {
      return NextResponse.json(
        {
          message: 'Wallet address is required'
        },
        { status: 400 }
      );
    }

    // Get user data from the Talent Protocol service
    const userData = await talentProtocol.getUserByAddress(walletAddress);

    const response: UserResponse = {
      user: userData
    };

    console.log(response);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch user data',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
