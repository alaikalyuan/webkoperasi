import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { financialReports } from '@/db/schema';
import { put, del } from '@vercel/blob';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const reports = await db.select().from(financialReports).orderBy((t) => t.month);
    return NextResponse.json(reports);
  } catch (error) {
    console.error('Failed to read financial reports:', error);
    return NextResponse.json({ error: 'Failed to read financial reports' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const month = formData.get('month') as string;

    if (!file || !month) {
      return NextResponse.json({ error: 'File and month are required' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only PDF and Excel are allowed.' }, { status: 400 });
    }

    // Upload to Vercel Blob
    const buffer = await file.arrayBuffer();
    const blobResult = await put(`financial-reports/${month}-${file.name}`, buffer, {
      access: 'public',
      contentType: file.type,
    });

    // Determine file type
    const fileType = file.type.includes('pdf') ? 'pdf' : 'excel';

    // Check if report for this month already exists and delete it
    const existingReport = await db
      .select()
      .from(financialReports)
      .where(eq(financialReports.month, month));

    if (existingReport.length > 0) {
      // Delete the old blob URL reference (you may want to actually delete the blob too)
      await db
        .delete(financialReports)
        .where(eq(financialReports.month, month));
    }

    // Save metadata to database
    const [newReport] = await db
      .insert(financialReports)
      .values({
        month,
        fileName: file.name,
        blobUrl: blobResult.url,
        fileType,
        uploadedAt: new Date().toISOString(),
        uploadedBy: formData.get('uploadedBy') as string || 'admin',
      })
      .returning();

    return NextResponse.json(newReport);
  } catch (error) {
    console.error('Failed to upload financial report:', error);
    return NextResponse.json({ error: 'Failed to upload financial report' }, { status: 500 });
  }
}