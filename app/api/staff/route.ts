import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { staff } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = db.select().from(staff);
    
    if (category) {
      query = db.select().from(staff).where(eq(staff.category, category));
    }

    const data = await query;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to read staff data:', error);
    return NextResponse.json({ error: 'Failed to read staff data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const [created] = await db
      .insert(staff)
      .values(body)
      .returning();
    
    return NextResponse.json(created);
  } catch (error) {
    console.error('Failed to create staff:', error);
    return NextResponse.json({ error: 'Failed to create staff' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const [updated] = await db
      .update(staff)
      .set(data)
      .where(eq(staff.id, id))
      .returning();
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update staff:', error);
    return NextResponse.json({ error: 'Failed to update staff' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await db.delete(staff).where(eq(staff.id, parseInt(id)));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete staff:', error);
    return NextResponse.json({ error: 'Failed to delete staff' }, { status: 500 });
  }
}
