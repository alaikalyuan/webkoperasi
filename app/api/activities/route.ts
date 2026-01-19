import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'activities.json');

export async function GET() {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read activities' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const newActivity = { id: Date.now(), ...body };
    data.push(newActivity);
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return NextResponse.json(newActivity);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add activity' }, { status: 500 });
  }
}