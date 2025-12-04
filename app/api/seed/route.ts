import { NextRequest, NextResponse } from 'next/server';
import { seedDatabases } from '@/lib/seed';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const eventCount = body.count || 500;

    const result = await seedDatabases({ eventCount });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Successfully seeded both databases',
        results: result.results
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Seeding completed with errors',
          results: result.results
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('💥 Seeding failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// Also support GET for easy testing
export async function GET() {
  return NextResponse.json({
    message:
      'Use POST to seed data. Include { "count": 500 } in body to customize event count.'
  });
}
