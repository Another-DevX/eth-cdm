// app/api/test/route.ts
import { NextRequest, NextResponse } from 'next/server';

export function GET(request: NextRequest) {
    return NextResponse.json({ message: 'Hello, World!' });
}
