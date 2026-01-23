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
    
    const imageFiles = [
      formData.get('image1') as File | null,
      formData.get('image2') as File | null,
      formData.get('image3') as File | null,
      formData.get('image4') as File | null,
    ];

    const imageUrls: (string | null)[] = [];

    // Handle image uploads
    for (const imageFile of imageFiles) {
      if (imageFile && imageFile.size > 0) {
        const buffer = await imageFile.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        imageUrls.push(`data:${imageFile.type};base64,${base64}`);
      } else {
        imageUrls.push(null);
      }
    }

    const [newActivity] = await db
      .insert(activities)
      .values({
        id: Date.now(),
        title,
        description,
        date,
        imageUrl: imageUrls[0],
        imageUrl2: imageUrls[1],
        imageUrl3: imageUrls[2],
        imageUrl4: imageUrls[3],
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