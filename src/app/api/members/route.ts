import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const DATA_FILE = path.join(process.cwd(), 'data', 'family-members.json');

// Ensure data directory exists
async function ensureDir() {
  const dir = path.dirname(DATA_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

export async function GET() {
  try {
    await ensureDir();
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8');
      return NextResponse.json(JSON.parse(data));
    } catch {
      return NextResponse.json([]);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureDir();
    const newMember = await request.json();
    
    // Add pending status for admin approval
    const memberWithMeta = {
      ...newMember,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    let members = [];
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8');
      members = JSON.parse(data);
    } catch {
      // File doesn't exist yet
    }

    members.push(memberWithMeta);
    await fs.writeFile(DATA_FILE, JSON.stringify(members, null, 2));

    return NextResponse.json(memberWithMeta);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save member' }, { status: 500 });
  }
}
