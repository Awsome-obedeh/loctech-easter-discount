import dbConnect from '@/lib/db';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '@/models/Admin';

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    const user = await Admin.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Create the token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json(
      { message: "Login successful", user: { name: user.username } },
      { status: 200 }
    );

    // Set the HttpOnly Cookie
    response.cookies.set('token', token, {
      httpOnly: true,     // Prevents JS access (XSS protection)
      secure: process.env.NODE_ENV === 'production', // Only sends over HTTPS
      sameSite: 'strict', // Prevents CSRF attacks
      maxAge: 60 * 60 * 24, // 1 day in seconds
      path: '/',          // Available across the whole site
    });

    return response;
  } catch (error) {
    console.error("LOGIN ROUTE ERROR:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}