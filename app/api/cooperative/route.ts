import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { cooperative } from '@/db/schema';

export async function GET() {
  try {
    const data = await db.select().from(cooperative);
    return NextResponse.json(data[0] || {});
  } catch (error) {
    console.error('Failed to read cooperative info:', error);
    return NextResponse.json({ error: 'Failed to read cooperative info' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Delete existing record and insert new one
    await db.delete(cooperative);
    
    const [updated] = await db
      .insert(cooperative)
      .values(body)
      .returning();
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update cooperative info:', error);
    return NextResponse.json({ error: 'Failed to update cooperative info' }, { status: 500 });
  }
}