import { NextRequest, NextResponse } from 'next/server';
import { parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { walletClient as client } from '@/services/client';
import { givePlatoCoinsToBenefactor } from '@/services/stakingPool';
import { calculateScores } from '@/app/api/talent/helpers';
import badgesData from '../talent/badges/badges.json';

import path from 'path';
import fs from 'fs';

// // Get private key from environment variable
// const PRIVATE_KEY = process.env.PRIVATE_KEY;

// if (!PRIVATE_KEY) {
//   throw new Error('PRIVATE_KEY is not set');
// }
// // // Create account from private key
// const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);

export async function POST(request: NextRequest) {
  try {
    //     // Get wallet address from request body
    const body = await request.json();
    const { walletAddress } = body;

    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);

    // if (!walletAddress) {
    //   return NextResponse.json(
    //     { message: 'Wallet address is required' },
    //     { status: 400 }
    //   );
    // }

    //     // Get badges from the Talent Protocol service
    //const badges = await talentProtocol.getBadges();
    const badges: any= badgesData ;
 
    //     // Calculate all scores
    const scores = calculateScores(badges);

    //     // Calculate total score (this is the amount of tokens to mint)
    const totalScore =
      scores.onchainActivity + scores.developer + scores.learning;

    //     // Convert score to token amount (with 18 decimals)
    const tokenAmount = parseEther(totalScore.toString());

    //     // Give PlatoCoins to the benefactor (user)
    const hash = await givePlatoCoinsToBenefactor(
      tokenAmount,
      walletAddress,
      account,
      client
    );
    console.log(hash);

    const filePath = path.join(
      process.cwd(),
      'app/api/talent/badges/withdrawal.json'
    );

    // Create the updated data
    const withdrawalData = {
      currentWithdrawAmount: 0,
    };

    // Write to local file
    fs.writeFileSync(filePath, JSON.stringify(withdrawalData, null, 2));

    return NextResponse.json({
      amount: totalScore,
    });
  } catch (error: any) {
    console.error('Error claiming tokens:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to claim tokens',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Load the current withdrawal amount from the file
    const filePath = path.join(
      process.cwd(),
      'app/api/talent/badges/withdrawal.json'
    );
    let currentData = { currentWithdrawAmount: 0 };

    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        currentData = JSON.parse(fileContent);
      }
    } catch (err) {
      console.error('Error reading withdrawal file:', err);
    }

    return NextResponse.json({
      currentWithdrawAmount: currentData.currentWithdrawAmount,
      success: true,
    });
  } catch (error) {
    console.error('Error fetching withdrawal amount:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch withdrawal amount',
        success: false,
      },
      { status: 500 }
    );
  }
}
