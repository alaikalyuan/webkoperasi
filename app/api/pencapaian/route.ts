import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { pencapaian } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select().from(pencapaian);
    // Return the latest pencapaian record, or default values if none exist
    if (data.length === 0) {
      return NextResponse.json({
        id: null,
        totalAssets: 'Rp 500.000.000',
        totalMembers: 150,
        updatedAt: new Date().toISOString(),
      });
    }
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Failed to read pencapaian:', error);
    return NextResponse.json({ error: 'Failed to read pencapaian' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { totalAssets, totalMembers } = body;

    if (!totalAssets || !totalMembers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if a record exists
    const existing = await db.select().from(pencapaian);
    
    let result;
    if (existing.length === 0) {
      // Create new record
      [result] = await db
        .insert(pencapaian)
        .values({
          totalAssets,
          totalMembers,
          updatedAt: new Date().toISOString(),
        })
        .returning();
    } else {
      // Update existing record
      [result] = await db
        .update(pencapaian)
        .set({
          totalAssets,
          totalMembers,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(pencapaian.id, existing[0].id))
        .returning();
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to save pencapaian:', error);
    return NextResponse.json({ error: 'Failed to save pencapaian' }, { status: 500 });
  }
}
