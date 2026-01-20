import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { financial } from '@/db/schema';

export async function GET() {
  try {
    const data = await db.select().from(financial);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to read financial data:', error);
    return NextResponse.json({ error: 'Failed to read financial data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [newEntry] = await db
      .insert(financial)
      .values({
        id: Date.now(),
        ...body,
      })
      .returning();
    
    return NextResponse.json(newEntry);
  } catch (error) {
    console.error('Failed to add financial entry:', error);
    return NextResponse.json({ error: 'Failed to add financial entry' }, { status: 500 });
  }
}