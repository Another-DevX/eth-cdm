import { NextResponse } from 'next/server';
import { BadgesResponse, Badge, BadgeApiResponse } from '../interfaces';
import { talentProtocol } from '../../services';
import {
  calculateScores,
  calculateOnchainActivityScore,
  calculateDeveloperScore,
  calculateLearningScore,
  convertApiResponseToBadge
} from '../helpers';
import badgesData from './badges.json';
import fs from 'fs';
import path from 'path';

/**
 * GET handler for badge withdrawal amount
 * Returns the current withdrawal amount from the JSON file
 */
export async function GET() {
  try {
    // Load the current withdrawal amount from the file
    const filePath = path.join(process.cwd(), 'app/api/talent/badges/withdrawal.json');
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
      success: true
    });
  } catch (error) {
    console.error('Error fetching withdrawal amount:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch withdrawal amount',
        success: false
      },
      { status: 500 }
    );
  }
}

/**
 * POST handler for badge withdrawal
 * Accepts a badge category and writes the withdrawal amount to a local file
 */
export async function POST(request: Request) {
  try {
    // Get request body
    const body = await request.json();
    const { category, userId } = body;

    // Validate category
    if (!category || !['onchain', 'developer', 'learning'].includes(category)) {
      return NextResponse.json(
        { message: 'Valid badge category is required (onchain, developer, or learning)' },
        { status: 400 }
      );
    }

    // Get badges from JSON file
    const badges: BadgeApiResponse[] = badgesData

    // Calculate score based on category
    let score = 0;

    switch (category) {
      case 'onchain':
        const onchainResult = calculateOnchainActivityScore(badges);
        score = onchainResult.score;
        break;
      case 'developer':
        const developerResult = calculateDeveloperScore(badges);
        score = developerResult.score;
        break;
      case 'learning':
        const learningResult = calculateLearningScore(badges);
        score = learningResult.score;
        break;
    }

    // Load the current withdrawal amount from the file
    const filePath = path.join(process.cwd(), 'app/api/talent/badges/withdrawal.json');
    let currentData = { currentWithdrawAmount: 0 };

    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        currentData = JSON.parse(fileContent);
      }
    } catch (err) {
      console.error('Error reading withdrawal file:', err);
    }

    // Add the score to the current withdrawal amount
    const newAmount = currentData.currentWithdrawAmount + score;

    // Create the updated data
    const withdrawalData = {
      currentWithdrawAmount: newAmount
    };

    // Write to local file
    fs.writeFileSync(filePath, JSON.stringify(withdrawalData, null, 2));

    return NextResponse.json({
      message: `Successfully processed withdrawal for ${category} badges`,
      data: withdrawalData,
      success: true
    });
  } catch (error) {
    console.error('Error processing badge withdrawal:', error);
    return NextResponse.json(
      {
        message: 'Failed to process badge withdrawal',
        success: false
      },
      { status: 500 }
    );
  }
}
