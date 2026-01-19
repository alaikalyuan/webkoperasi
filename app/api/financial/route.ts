import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'financial.json');

export async function GET() {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read financial data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const newEntry = { id: Date.now(), ...body };
    data.push(newEntry);
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return NextResponse.json(newEntry);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add financial entry' }, { status: 500 });
  }
}