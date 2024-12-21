import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// GET: Fetch all students
export async function GET() {
  const { data, error } = await supabase.from('students').select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

// POST: Add a new student
export async function POST(req: NextRequest) {
  const body = await req.json();

  const { name, cohort, course, dateJoined, lastLogin, status } = body;

  const { data, error } = await supabase
    .from('students')
    .insert([{ name, cohort, course, dateJoined, lastLogin, status }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

// PUT: Update a student
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, name, cohort, course, dateJoined, lastLogin, status } = body;

  if (!id) {
    return NextResponse.json(
      { error: 'Student ID is required for update' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('students')
    .update({ name, cohort, course, dateJoined, lastLogin, status })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

// DELETE: Remove a student
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Student ID is required for deletion' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.from('students').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
