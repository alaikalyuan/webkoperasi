import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { activities } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select().from(activities);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to read activities:', error);
    return NextResponse.json({ error: 'Failed to read activities' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const date = formData.get('date') as string;
    const imageFile = formData.get('image') as File | null;

    let imageUrl = null;

    // Handle image upload
    if (imageFile && imageFile.size > 0) {
      const buffer = await imageFile.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      imageUrl = `data:${imageFile.type};base64,${base64}`;
    }

    const [newActivity] = await db
      .insert(activities)
      .values({
        id: Date.now(),
        title,
        description,
        date,
        imageUrl,
      })
      .returning();
    
    return NextResponse.json(newActivity);
  } catch (error) {
    console.error('Failed to add activity:', error);
    return NextResponse.json({ error: 'Failed to add activity' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await db.delete(activities).where(eq(activities.id, parseInt(id)));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete activity:', error);
    return NextResponse.json({ error: 'Failed to delete activity' }, { status: 500 });
  }
}