import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { financialReports } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { del } from '@vercel/blob';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);

    // Get the report to find the blob URL
    const report = await db
      .select()
      .from(financialReports)
      .where(eq(financialReports.id, idNum))
      .limit(1);

    if (report.length === 0) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Delete from blob storage
    try {
      await del(report[0].blobUrl);
    } catch (error) {
      console.error('Failed to delete blob:', error);
      // Continue even if blob deletion fails
    }

    // Delete from database
    await db
      .delete(financialReports)
      .where(eq(financialReports.id, idNum));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete financial report:', error);
    return NextResponse.json({ error: 'Failed to delete financial report' }, { status: 500 });
  }
}
