import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const DATA_FILE = path.join(process.cwd(), 'data', 'family-members.json');

export async function POST(request: Request) {
  try {
    const { id, action } = await request.json(); // action: 'approve' | 'reject'
    
    const data = await fs.readFile(DATA_FILE, 'utf8');
    let members = JSON.parse(data);

    if (action === 'approve') {
      members = members.map((m: any) => m.id === id ? { ...m, status: 'approved' } : m);
    } else if (action === 'reject') {
      members = members.filter((m: any) => m.id !== id);
    }

    await fs.writeFile(DATA_FILE, JSON.stringify(members, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Admin action failed' }, { status: 500 });
  }
}
