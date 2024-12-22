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

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const {  name, cohort, course, dateJoined, lastLogin, status } = body;

  // Check for required fields
  if (!name || !cohort || !course || !dateJoined || !lastLogin || status === undefined) {
    return NextResponse.json(
      { error: 'All fields are required' },
      { status: 400 }
    );
  }

  // Fetch existing student to ensure it exists
  const { data: existingStudent, error: fetchError } = await supabase
    .from('students')
    .select('id')
    
    .single();

  if (fetchError || !existingStudent) {
    return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  }

  // Update the student
  const { data, error } = await supabase
    .from('students')
    .update({ name, cohort, course, dateJoined, lastLogin, status })
    

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
