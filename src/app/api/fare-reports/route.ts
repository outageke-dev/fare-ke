import { NextRequest, NextResponse } from 'next/server';
import { createFareReport, getReportedFareSummaries } from '@/lib/fare-reports';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const reports = await getReportedFareSummaries();
    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Failed to load fare reports:', error);
    return NextResponse.json({ reports: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const report = await createFareReport({
      from: body.from,
      to: body.to,
      operatorName: body.operatorName ?? body.operator,
      farePaid: Number(body.farePaid ?? body.fare),
      traffic: body.traffic,
      weather: body.weather,
      notes: body.notes,
      userId: body.userId,
    });

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Failed to submit fare report:', error);
    return NextResponse.json(
      { error: 'Unable to submit fare report right now.' },
      { status: 500 }
    );
  }
}
