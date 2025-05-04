import { NextRequest, NextResponse } from 'next/server';
import { parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { kv } from '@vercel/kv';
import { client, walletClient } from '@/services/platoCoin';
import { givePlatoCoinsToBenefactor } from '@/services/stakingPool';
import { calculateScores } from '@/app/api/talent/helpers';
import { talentProtocol } from '@/app/api/services';

// Get private key from environment variable
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';

// Create account from private key
const account = privateKeyToAccount(`0x${PRIVATE_KEY}`);

export async function POST(request: NextRequest) {
  try {
    // Get wallet address from request body
    const body = await request.json();
    const { walletAddress } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { message: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Get badges from the Talent Protocol service
    const badges = await talentProtocol.getBadges();

    // Calculate all scores
    const scores = calculateScores(badges);

    // Calculate total score (this is the amount of tokens to mint)
    const totalScore = scores.onchainActivity + scores.developer + scores.learning;

    // Convert score to token amount (with 18 decimals)
    const tokenAmount = parseEther(totalScore.toString());

    // Give PlatoCoins to the benefactor (user)
    const hash = await givePlatoCoinsToBenefactor(
      tokenAmount,
      `0x${walletAddress}`,
      `0x${account.address}`,
      walletClient
    );

    // Wait for transaction to be mined
    await client.waitForTransactionReceipt({ hash });
    
    // Store the claim timestamp in Vercel KV
    const timestamp = new Date().toISOString();
    await kv.set(`claim:${walletAddress}`, {
      timestamp,
      amount: totalScore,
      txHash: hash
    });

    return NextResponse.json({
      success: true,
      amount: totalScore,
      timestamp,
      txHash: hash
    });

  } catch (error: any) {
    console.error('Error claiming tokens:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to claim tokens',
        error: error.message
      },
      { status: 500 }
    );
  }
}
