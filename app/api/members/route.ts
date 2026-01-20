import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { members } from '@/db/schema';

export async function GET() {
  try {
    const data = await db.select().from(members);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to read members:', error);
    return NextResponse.json({ error: 'Failed to read members' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [newMember] = await db
      .insert(members)
      .values({
        id: Date.now(),
        ...body,
      })
      .returning();
    
    return NextResponse.json(newMember);
  } catch (error) {
    console.error('Failed to add member:', error);
    return NextResponse.json({ error: 'Failed to add member' }, { status: 500 });
  }
}