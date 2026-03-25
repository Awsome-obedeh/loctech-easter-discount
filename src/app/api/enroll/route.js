import dbConnect from '@/lib/db';
import Users from '@/models/Users';
import { NextResponse } from 'next/server';


export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    

    // Create the record in MongoDB
    const user = await Users.create(data);

    return NextResponse.json({ 
      message: "Student enrolled successfully", 
      userId: user._id 
    }, { status: 201 });
    
  } catch (error) {
    // Handle duplicate emails or validation errors
    const errorMessage = error.code === 11000 
      ? "This email is already enrolled." 
      : error.message;

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}