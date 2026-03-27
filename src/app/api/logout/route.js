import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Clear the cookie by setting maxAge to 0
  response.cookies.set('token', '', { 
    httpOnly: true, 
    maxAge: 0, 
    path: '/' 
  });

  return response;
}